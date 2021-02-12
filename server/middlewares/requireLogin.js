const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const mongoose = require('mongoose')
const User = mongoose.model("User")
//Middleware is a code which modifies the incoming request before it reaches to actual routehandler.It is always passed inside app.use()
//Then it will apply for all the routes.If we want middleware to be executed only for a particular route then we can use:
//   app.get('/about',middleware,(req,res)=>{

//})
module.exports = (req,res,next)=>{//Middleware function export it so that other files can access it
    const {authorization} = req.headers//
    //authorization === Bearer ewefwegwrherhe
    //Format of token: Authorization : Bearer <token>
    //if authorization is not there
    if(!authorization){
        //unauthorized to access it
       return res.status(401).json({error:"you must be logged in"})
    }
    const token = authorization.replace("Bearer ","")//replace the bearer with empty string and you will get the token 
    jwt.verify(token,JWT_SECRET,(err,payload)=>{//Generate a token by Bearer string. Check if it is the same token that was created in jwt.
        //callback with error and payload
        if(err){
         return   res.status(401).json({error:"you must be logged in"})
        }

        const {_id} = payload//destructuring _id from payload >MongoDB by default provides _id
        User.findById(_id).then(userdata=>{
            req.user = userdata//req.user contains all user details which ww will give back to the user if he has the token
            //This operation may take a time so use next.
            next()//next() in middleware will stop this current middleware and proceed to the next middleware or execute next code further
        })
        
        
    })
}
