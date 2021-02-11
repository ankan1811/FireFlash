const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const mongoose = require('mongoose')
const User = mongoose.model("User")
//Middleware is a code which modifies the incoming request before it reaches to actual routehandler.It is always passed inside app.use()
//Then it will apply for all the routes.If we want middleware to be executed only for a particular route then we can use:
//   app.get('/about',middleware,(req,res)=>{

//})
module.exports = (req,res,next)=>{//Middleware function 
    const {authorization} = req.headers//export it so that other files can access it
    //authorization === Bearer ewefwegwrherhe
    //if authorization is not there(Bearer (token))
    if(!authorization){
        //unauthorized to access it
       return res.status(401).json({error:"you must be logged in"})
    }
    const token = authorization.replace("Bearer ","")
    jwt.verify(token,JWT_SECRET,(err,payload)=>{
        //callback with error and payload
        if(err){
         return   res.status(401).json({error:"you must be logged in"})
        }

        const {_id} = payload//destructuring _id from payload >MongoDB by default provides _id
        User.findById(_id).then(userdata=>{
            req.user = userdata//req.user contains all user details
            next()//next() in middleware will stop this current middleware and proceed to the next middleware or execute next code further
        })
        
        
    })
}
