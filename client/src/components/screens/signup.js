import React, { useState, useEffect } from 'react'
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css'

const Signup=()=>{
    const history =useHistory()
    const [name, setName]=useState("")
    const [password, setPassword]=useState("")
    const [email, setEmail]=useState("")
    const [image, setImage]=useState("")
    const [url, setUrl]=useState("")

    useEffect(()=>{
        if(url){
            uploadfields()
        }
    },[url])

    const uploadpic=()=>{
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

    const uploadfields=()=>{
        fetch("/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                password,
                email,
                pic:url
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html:data.error,classes:"blue"})
            }else{
                M.toast({html:data.message,classes:"blue"})
                history.push('/signin')
            }
        }).catch(err=>{
            console.log(err)
        })
    }
    const postdata=()=>{
        if(image){
            uploadpic()
        }else{
            uploadfields()
        }
    }
    
    return(
        <div className="mycard">
            <div className="card auth-card">
                <h2>Instagram</h2>
                <input type="text" placeholder="name" 
                value={name} onChange={(e)=>{
                    setName(e.target.value)
                }} />
                <input type="text" placeholder="email"
                    value={email} onChange={(e)=>{
                    setEmail(e.target.value)
                }}
                />
                <input type="password" placeholder="password"
                    value={password} onChange={(e)=>{
                    setPassword(e.target.value)
                }}
                />
                 <div className="file-field input-field">
                <div className="btn">
                    <span>Upload profile pic</span>
                    <input type="file" onChange={(e)=>setImage(e.target.files[0])} />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text"/>
                </div>
                
                </div>
                <button className="btn waves-effect waves-light color blue" onClick={()=>postdata()}>Signup
                </button>
                <h5>
                <Link to='/signin' className="btn waves-effect waves-light color blue">Already have an account</Link>
                </h5>
            </div>
        </div>
    )
}
export default Signup