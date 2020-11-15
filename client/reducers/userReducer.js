export const initialState = null

export const reducer = (state,action)=>{//Basically reducers are there to manage state in an application.
    if(action.type=="USER"){//if user clicks on login
        return action.payload
    }
    if(action.type=="CLEAR"){//if user clicks on logout
        return null
    }
    if(action.type=="UPDATE"){
        return {
            ...state,//spread the previous state and update following and followers
            followers:action.payload.followers,
            following:action.payload.following
        }
    }
    if(action.type=="UPDATEPIC"){
        return {
            ...state,
            pic:action.payload
        }
    }
    return state
} 