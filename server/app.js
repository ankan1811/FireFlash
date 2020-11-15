//npm init npm install express npm install mongoose npm install nodemon -g npm install bcryptjs
//npm install jsonwebtoken
//npm install nodemailer nodemailer-sendgrid-transport
const express = require('express')
const app = express() //invoke express
const mongoose  = require('mongoose')//
const PORT = process.env.PORT || 5000
const {MONGOURI} = require('./config/keys')//Mongo uri is used to create mongo instance

//Middleware is a code which modifies the incoming request before it reaches to actual routehandler.It is always passed inside app.use()
//Then it will apply for all the routes.If we want middleware to be executed only for a particular route then we can use:
//   app.get('/about',middleware,(req,res)=>{

//})
mongoose.connect(MONGOURI,{
    //To connect MongoDB with the web application
    useNewUrlParser:true,//to parse MongoDB connection Strings
    useUnifiedTopology: true//To avoid deprecation warning "Current server discovery and monitoring engine is deprecated"
//To use new server discovery and monitoring enginewe pass this

})
mongoose.connection.on('connected',()=>{
    //if successfully connectd to mongoose 
    console.log("conneted to mongo yeahh")
})
mongoose.connection.on('error',(err)=>{
    console.log("err connecting",err)
})

require('./models/user')
require('./models/post')

app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))


if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{//request and response 
        //here user is making a get request in * rout
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))//This is the response
    })
}

app.listen(PORT,()=>{//listening on port
    //when server starts listening on a port this callback function will get fired 
    console.log("server is running on",PORT)
})

