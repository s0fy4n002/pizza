const menu = require('../../models/menu')
const mhs = require('../../models/mhs')
const homeController = () => {
    return {
        async index(req, res){
            
            const pizzas = await menu.find()  
            // req.session.destroy()
            // req.session = null        
            res.render('home', {layout: "layouts/main-layout",title: "Home", pizzas})
        }
    }
}

module.exports = homeController