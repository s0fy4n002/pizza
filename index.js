const express = require('express')
const app  = express()
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const path = require('path')
const init = require('./routes/web')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBSession = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const db = require('./app/db')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./app//models/user')
const bcrypt = require('bcrypt')
const initPassport = require('./app/config/passport')
const guest = require('./app/http/milddleware/guest')
const Emitter = require('events')
const eventEmitter = new Emitter()
require('dotenv').config()


const port = process.env.PORT || 3000
    

app.use(flash());
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(expressLayout)
app.use(express.static('public'))
app.set('views', path.join(__dirname, '/resources/views'))
app.set('eventEmitter', eventEmitter)
app.set('view engine', 'ejs')
//connect to database and connect to session
db(mongoose, MongoDBSession, session, app)

initPassport(passport, LocalStrategy, User, bcrypt)
app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.session.user = req.user
    res.locals.message = req.flash();
    next()
})

init(app)

const server = app.listen(port, console.log(`server running on http://localhost:${port}`))

const io = require('socket.io')(server)
io.on('connection', (socket)=>{
    socket.on('join', (orderId) => {
        socket.join(orderId)        
    })
})

eventEmitter.on("orderUpdated", (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})
eventEmitter.on("orderPlaced", (data)=>{
    io.to(`adminRoom`).emit('orderPlaced', data)
})