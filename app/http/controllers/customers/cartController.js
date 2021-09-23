function cartController(){
    return {
        index(req, res){
            
            if(req.session.cart == null){
                return res.render('cart', {layout: "layouts/main-layout",title: "Cart", cartPizza: false})
            }
            const cartPizza = Object.values(req.session.cart.items)
            res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
            res.render('cart', {layout: "layouts/main-layout",title: "Cart", cartPizza})
        },
        update(req, res){
            let ss = req.session
            if(!ss.cart){
                ss.cart = {
                    items: {},
                    totalQty: 0,
                    totalPrice: 0
                }
            }

            if(!ss.cart.items[req.body._id]){
                ss.cart.items[req.body._id] = {
                    item: req.body,
                    qty: 1,
                    totalPrice: parseInt(req.body.price) 
                }
                ss.cart.totalQty += 1
                ss.cart.totalPrice += parseInt(req.body.price) 
            }else{
                ss.cart.items[req.body._id].qty++ 
                ss.cart.items[req.body._id].totalPrice =  ss.cart.items[req.body._id].qty * parseInt(req.body.price)
                ss.cart.totalQty ++
                ss.cart.totalPrice += parseInt(req.body.price) 
            }
            res.status(200).json({msg: ss.cart})
            
        }
    }
}
module.exports = cartController