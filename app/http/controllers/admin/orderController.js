const Order = require('../../../models/order')
const moment = require('moment')

function orderController(){
    return{
        async index(req, res){
            Order.find({status: {$ne: "completed"}}, null, {sort: {'createdAt':'-1'}})
                .populate('customerId', '-password').exec((err, orders) => {
                    if(req.xhr){
                        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
                        return res.json(orders)
                        
                    }else{
                        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
                        return res.render('admin/orders', {layout: "layouts/main-layout",title: "admin order", orders, moment})
                    }

                })

            
        }
    }
}

module.exports = orderController