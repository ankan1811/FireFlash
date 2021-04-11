//Don,t think npx create-react-app client
//npm install react-router-dom
import React,{useEffect,createContext,useReducer,useContext} from 'react';
import NavBar from './components/Navbar'
import "./App.css"
import {BrowserRouter,Route,Switch,useHistory} from 'react-router-dom'
import Home from './components/screens/Home'
import Signin from './components/screens/SignIn'
import Profile from './components/screens/Profile'
import Signup from './components/screens/Signup'
import CreatePost from './components/screens/CreatePost'
import {reducer,initialState} from './reducers/userReducer'
import UserProfile from './components/screens/UserProfile'
import SubscribedUserPosts from './components/screens/SubscribesUserPosts'
import Reset from './components/screens/Reset'
import NewPassword from './components/screens/Newpassword'
export const UserContext = createContext()


const Routing = ()=>{
  const history = useHistory()
  const {state,dispatch} = useContext(UserContext)//if user has closed application but still logged in state is getting changed 
  useEffect(()=>{                                 //which should not occur as he should be able to access the protected resource
                                                    // the next time he opens it without logging in again.
    const user = JSON.parse(localStorage.getItem("user"))//parse string back to object
    if(user){
      dispatch({type:"USER",payload:user})//if  user is present i.e. logged in redirect to home screen
    }else{
      if(!history.location.pathname.startsWith('/reset'))//if user is not present redirect to login screen
           history.push('/signin')
    }
  },[])
  return(
    <Switch>
      <Route exact path="/" > //If the path is / we will show the Home component present in Home.js.
      <Home />
      </Route>
      <Route path="/signin">
        <Signin />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route path="/create">
        <CreatePost/>
      </Route>
      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route path="/myfollowingpost">
        <SubscribedUserPosts />
      </Route>
      <Route exact path="/reset">
        <Reset/>
      </Route>
      <Route path="/reset/:token">
        <NewPassword />
      </Route>
      
    </Switch>
  )
}
//We want to access the history to check if the user has the token or not. Now we cannot access history inside app
// but we can do that inside individual routes because ap0p is not wrapped with the browserRouter.
// App is outside the browserRouter.So do it using Routing.

function App() { //Now we have access to the application state everywhere including app.js
  const [state,dispatch] = useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
      <NavBar />
      <Routing />
      
    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
