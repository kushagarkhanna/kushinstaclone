import React,{useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import M from 'materialize-css'

const Createpost=()=>{
    const history =useHistory()
    const [title,setTitle]=useState("")
    const [body,setBody]=useState("")
    const [image,setImage]=useState("")
    const [url,setUrl]=useState("")

    useEffect(()=>{
        if(url){
        fetch("/createpost",{
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                title,
                body,
                pic:url
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
            if(data.error){
                M.toast({html:data.error,classes:"blue"})
            }else{
                M.toast({html:"successfully created post",classes:"blue"})
                history.push('/')
            }
        }).catch(err=>{
            console.log(err)
        })
    }
    },[url])

    const postdetails=()=>{
        const data=new FormData()
        data.append("file",image)
        data.append("upload_preset","insta_clone")
        data.append("cloud_name","kushagar")
        fetch("https://api.cloudinary.com/v1_1/kushagar/image/upload",{
            method:"post",
            body:data
        })
        .then(res=>res.json())
        .then(data=>{
            setUrl(data.url)
        })
        .catch(err=>{
            console.log(err)
        })

        
    }

    return(
        <div className="card input-field" style={{
            margin:"30px auto",
            padding:"20px",
            textAlign:"center",
            width:"550px"
            }}>
            <input type="text" placeholder="title"
            value={title} onChange={(e)=>setTitle(e.target.value)}
             />
            <input type="text" placeholder="body" 
                 value={body} onChange={(e)=>setBody(e.target.value)}
            />
            <div className="file-field input-field">
            <div className="btn">
                <span>Upload photo</span>
                <input type="file" onChange={(e)=>setImage(e.target.files[0])} />
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text"/>
            </div>
            
            </div>
            <button className="btn waves-effect waves-light color blue" onClick={()=>postdetails()}>Add photo
                </button>
        </div>
    )
}
export default Createpost