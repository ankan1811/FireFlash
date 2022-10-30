import React,{useState,useContext,} from 'react'
import {Link,useHistory} from 'react-router-dom'
import {UserContext} from '../../App'
import M from 'materialize-css'
const SignIn  = ()=>{ //state,dispatch was passed in userContext provider in app.js
    const {state,dispatch} = useContext(UserContext)//“useContext” hook is used to create common data that can be accessed 
    //throughout the component hierarchy without passing the props down manually to each level.
    
    //useContext hook allows passing data to children elements without using redux.
    // useContext is a named export in react so we can importin functional components
    const history = useHistory()//The useHistory hook gives you access to the history instance that you may use to navigate

    const [password,setPasword] = useState("")//useState is a hook that allows us to have state variables in functional components
    const [email,setEmail] = useState("")
    const PostData = ()=>{
        //if not a valid email by email regex
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "invalid email",classes:"#c62828 red darken-3"})//toast message
            return
        }
        fetch("/signin",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({//converts Javascript object to a json string
                password,
                email
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
           if(data.error){
               //we display red toast message
              M.toast({html: data.error,classes:"#c62828 red darken-3"})
           }
           else{
               localStorage.setItem("jwt",data.token)//saving token in local storage and we can only store a string in local storage.
               localStorage.setItem("user",JSON.stringify(data.user))
               //dispatch() is the method used to dispatch actions and trigger state changes to the store. 
               dispatch({type:"USER",payload:data.user})//action creator and payload(userReducer.js)
               //Payload is what is keyed ( the key value pairs ) in your actions
               // and passed around between reducers in your redux application.
               M.toast({html:"signedin success",classes:"#43a047 green darken-1"})
               history.push('/') //on successful signin user will navigate to home screen i.e. / route
           }
        }).catch(err=>{
            console.log(err)
        })
    }
   return (
      <div className="mycard">
          <div className="card auth-card input-field">
            <h2>Instagram</h2>
            <input
            type="text"
            placeholder="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            />
            <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e)=>setPasword(e.target.value)}
            />
            <button className="btn waves-effect waves-light #f50057 pink accent-3"
            onClick={()=>PostData()}
            >
                Login
            </button>
            <h5>
                <Link to="/signup">Dont have an account ?</Link>
            </h5>
            <h6>
                <Link to="/reset">Forgot password ?</Link>
            </h6>
    
        </div>
      </div>
   )
}


export default SignIn
