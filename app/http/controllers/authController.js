const User = require('../../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport')

const authController = () => {
    const _getRedirectUrl = (req) => {
        return (req.user.role) === 'admin'? '/admin/orders' : '/customers/orders'
    }
    return {
        login(req, res){
            res.render('login', {layout: "layouts/main-layout", title: "Login"})
        },
        register(req, res){
            res.render('register', {layout: "layouts/main-layout", title: "Register", username: false, email:false, password: false})
        },
        async postRegister(req, res){
            const{username, email, password} = req.body
            if(!username){
                req.flash('error', 'Username tidak boleh kosong!')
                req.flash('email', email)
                req.flash('password', password)
                return res.redirect('/register')
            }
            if(!email){
                req.flash('error', 'Email tidak boleh kosong!')
                req.flash('username', username)
                req.flash('password', password)
                return res.redirect('/register')
            }
            if(!password){
                req.flash('error', 'Password tidak boleh kosong!')
                req.flash('email', email)
                req.flash('username', username)
                return res.redirect('/register')
            }

            User.exists({email}, (err, result) => {
                if(result){        
                    req.flash('error', 'Email sudah ada!')
                    req.flash('username', username)
                    req.flash('password', password)
                    return res.redirect('/register')
                } 
            })
            const hashpassword = await bcrypt.hash(password, 7)
            const user = new User({
                username,
                email,
                password: hashpassword
            })
            user.save()
                .then(result => {
                    res.redirect('/login')
                })
                .catch(err => {
                    req.locals.msg = "Internal Error Gagal membuat user baru"
                    req.locals.username = username
                    req.locals.email = email
                    req.locals.password = password
                    return res.redirect('/register')
                })
        },
        async postLogin(req, res, next){
            const{email, password} = req.body
            
            if(!email){
                req.flash('error', 'Email tidak boleh kosong!')
                req.flash('password', password)
                return res.redirect('/login')
            }
            if(!password){
                req.flash('error', 'Password tidak boleh kosong!')
                req.flash('email', email)
                return res.redirect('/login')
            }
            passport.authenticate('local', async (err, user, info) => {

                if(err){
                    req.flash('error', info.message)
                    return next(err)
                }
                if(!user){
                    req.flash('error', info.message)
                    return res.redirect('/login')
                }
                req.logIn(user, (err) => {
                    if(err){
                        req.flash('error', info.message)
                        return next(err)
                    }
                    return res.redirect(_getRedirectUrl(req)) 
                    
                })
            })(req, res, next)
        },
        async logout(req, res){
            req.logout()
            res.redirect('/login')
        }
    }
}

module.exports = authController