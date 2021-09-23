const passport = require('passport')
const homeController = require('../app/http/controllers/homeController')
const authController = require('../app/http/controllers/authController')
const cartController = require('../app/http/controllers/customers/cartController')
const orderController = require('../app/http/controllers/customers/orderController')
const orderAdminController = require('../app/http/controllers/admin/orderController')
const statusController = require('../app/http/controllers/admin/statusController')
const guest = require('../app/http/milddleware/guest')
const admin = require('../app/http/milddleware/admin')

const init = (app) =>{
    
    app.get('/', homeController().index)
    app.get('/login', guest, authController().login)
    app.get('/register', guest, authController().register)
    app.get('/cart', cartController().index)
    app.get('/customers/orders', orderController().index)
    app.get('/customer/orders/:id', orderController().show)
    app.get('/admin/orders', admin, orderAdminController().index)

    app.post('/update-cart', cartController().update)
    app.post('/register', authController().postRegister)
    app.post('/login', authController().postLogin)
    app.post('/logout', authController().logout)
    app.post('/orders', orderController().store)
    app.post('/admin/order/status', admin, statusController().update)

    
    
}

module.exports = init