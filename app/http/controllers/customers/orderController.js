const Order = require('../../../models/order')
const moment = require('moment')

function orderController(){
    return{
        async index(req, res){
            if(!req.user){return res.redirect('/login')}

            const order = await Order.find({customerId: req.user._id}, null, {sort: {'createdAt': '-1'}} )        
            res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
            res.render('customer/order', {layout: "layouts/main-layout",title: "Order", order, moment})
        },

        async store(req, res){
            if(!req.user){return res.redirect('/login')}
            
            const {phone, address} = req.body
            if(!phone || !address){
                req.flash('error', 'no telp dan alamat harus di isi')
                return res.redirect('/cart')
            }
            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone,
                address
            })
            
            try {
                const simpan = await order.save()
                if(simpan){
                   
                    Order.populate(simpan, {path: 'customerId'}, (err, placedOrder) => {
                        req.flash('success', 'Order berhasil di tambahkan')
                        delete req.session.cart
                        //emit
                        const eventEmitter = req.app.get('eventEmitter')
                        eventEmitter.emit('orderPlaced', placedOrder)

                        return res.redirect('/customers/orders')
                    })
                    
                }else{
                    req.flash('error', 'Internal Error ! Order Gagal')
                    return res.redirect('/cart')
                }
                
            } catch (error) {
                req.flash('error', 'Internal Error ! Order Gagal')
                return res.redirect('/cart')
            }

        },
        
        async show(req, res){
            
            const order = await Order.findById(req.params.id)
            
            if(req.user._id.toString() === order.customerId.toString()){
                res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
                return res.render('customer/singleOrder', {layout: "layouts/main-layout",title: "Single Order", order})
            }
            return res.redirect('/')
        }
        
    }
}

module.exports = orderController