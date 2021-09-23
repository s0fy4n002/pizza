

function initPassport(passport, LocalStrategy, User, bcrypt){
    const customFields = {
        usernameField: 'email',
        passwordField: 'password'
    }
    const verifyCallback = (username, password, done)=>{
       
        User.findOne({ email: username })
            .then(async (user) => {
                if(!user){
                    return done(null, false, {message: 'email tidak terdaftar'})
                }
                try {
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if(err || !isMatch){
                            
                            return done(null, false, {message: 'Password salah'})
                        }
                        return done(null, user)
                    })
                    
                } catch (error) {
                    return done(null, false, {message: "Password salah"})
                }
            })
            .catch(err => {
                done(null, false, {message: "email belm terdaftar"})
            })
    }
    const strategy = new LocalStrategy(customFields, verifyCallback)
    
    passport.use(strategy)
    
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    passport.deserializeUser((userId, done) => {
        User.findById(userId)
            .then(user => {
                done(null, user)
            })
            .catch(err => {
                done(err)
            })
    })
}
module.exports = initPassport