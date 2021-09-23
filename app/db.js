const db = (mongoose, MongoDBSession, session, app) => {
    
    const dbString = process.env.DBSTRING
    const dbOptions = {useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex:true}
    const connection = mongoose.connect(dbString, dbOptions)
    connection.then(res=>{
        console.log("terkoneksi ke db")
    }).catch(err=>{
        console.log("gagal terkoneksi ke db")
    })

    const store = new MongoDBSession({
        uri: dbString,
        collection: "session"
    })

    app.use(session({
        secret: process.env.DBSTRING,
        resave: true,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24
        },
        store: store
    }))
    
}
module.exports = db