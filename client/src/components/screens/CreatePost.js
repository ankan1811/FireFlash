import React,{useState,useEffect} from 'react'
import M from 'materialize-css'
import {useHistory} from 'react-router-dom'
const CretePost = ()=>{
    const history = useHistory()
    const [title,setTitle] = useState("")
    const [body,setBody] = useState("")
    const [image,setImage] = useState("")
    const [url,setUrl] = useState("")
    useEffect(()=>{ //This will only run when url changes i.e. we update our state of url using setUrl.
        //Uploading on cloudinary will take time. So when that is done and state of url is updated then make a post request to createPost route.
        
        // Useeffect will also happen when component mounts .so to prevent any error always add a if condition.
       if(url){
        fetch("/createpost",{ // this createpost route is in the backend
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")//token
            },
            body:JSON.stringify({//details of the post 
                //converts Javascript object to a json string
                title,
                body,
                pic:url
            })
        }).then(res=>res.json())
        .then(data=>{
    
           if(data.error){
              M.toast({html: data.error,classes:"#c62828 red darken-3"})
           }
           else{
               M.toast({html:"Created post Successfully",classes:"#43a047 green darken-1"})
               history.push('/')
           }
        }).catch(err=>{
            console.log(err)
        })
    }
    },[url])
                //Everything about posts image
   const postDetails = ()=>{ //This is copied fromn mozilla docs
       const data = new FormData()//Uploading image in CLOUDINARY
       data.append("file",image)
       data.append("upload_preset","new-insta")// the name in cloudinary Change it
       data.append("cloud_name","ankan1811")//
       fetch("https://api.cloudinary.com/v1_1/cnq/image/upload",{// base url in cloudinary.change it
           method:"post",
           body:data
       })
       .then(res=>res.json())
       .then(data=>{
          setUrl(data.url)//url of image in cloudinary that is present in console
       })
       .catch(err=>{
           console.log(err)
       })

    
   }
 

   return(
       <div className="card input-filed"
       style={{
           margin:"30px auto",
           maxWidth:"500px",
           padding:"20px",
           textAlign:"center"
       }}
       >
           <input 
           type="text"
            placeholder="title"
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
            />
           <input
            type="text"
             placeholder="body"
             value={body}
            onChange={(e)=>setBody(e.target.value)}
             />
           <div className="file-field input-field">
            <div className="btn #f50057 pink accent-3">
                <span>Upload Image</span>
                <input type="file" onChange={(e)=>setImage(e.target.files[0])} />
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
            </div>
            </div>
            <button className="btn waves-effect waves-light #f50057 pink accent-3"
            onClick={()=>postDetails()}
            
            >
                Submit post
            </button>

       </div>
   )
}


export default CretePost
