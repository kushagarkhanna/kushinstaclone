import React,{useEffect,useState,useContext} from 'react'
import {Usercontext} from '../../App'

const Profile=()=>{
    const [mypic,setMypic]=useState([])
    const [image, setImage]=useState("")
   //const [url, setUrl]=useState("")
    const {state,dispatch}=useContext(Usercontext)
    
    useEffect(()=>{
        fetch('/mypost',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            setMypic(result.posts)
        })
    },[])

    useEffect(()=>{
        if(image){
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
            //setUrl(data.url)
            fetch('/updatepic',{
                method:"put",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    pic:data.url
                })
            }).then(res=>res.json())
            .then(result=>{
                console.log(result)
                localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
                dispatch({type:"UPDATEPIC",payload:result.pic})
            })
        })
        .catch(err=>{
            console.log(err)
        })
    }
    },[image])

    const updatePhoto=(file)=>{
        setImage(file)
        
    }

    return(
        <div style={{maxWidth:"550px",margin:"0px auto"}}>
        <div style={{
                margin:"18px 0px",
                borderBottom:"1px solid grey"
            }} >
            <div style={{
                justifyContent:"space-around",
                display:"flex"
            }}>
                <div>
                    <img 
                    style={{width:"160px",height:"160px",
                    borderRadius:"80px"}}
                    src={state?state.pic:"loading"}></img>
                </div>
                <div>
                    <h3>{state?state.name:"loading"}</h3>
                    <h5>{state?state.email:"loading"}</h5>
                    <div style={{display:"flex",justifyContent:"space-around"}}>
                    <h6>{mypic.length} posts</h6>
                    <h6>{state?state.followers.length:"0"} followers</h6>
                    <h6>{state?state.following.length:"0"} following</h6>
                    </div>
                </div>
            </div>
            <div className="file-field input-field">
                <div className="btn">
                    <span>Update profile pic</span>
                    <input type="file" onChange={(e)=>updatePhoto(e.target.files[0])} />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text"/>
                </div>
                </div>
            </div>
            <div className="gallery">
            {
                mypic.map(item=>{
                    return (
                <img className="item"
                src={item.photo}>
                </img>
                    )
                })
            }
                
            </div>
        </div>
    )
}
export default Profile