import React,{useState,useContext} from 'react'
import {Link,useHistory} from 'react-router-dom'
import {Usercontext} from '../../App'
import M from 'materialize-css'

const Signin=()=>{
    const {state,dispatch}=useContext(Usercontext)
    const history =useHistory()
    const [password, setPassword]=useState("")
    const [email, setEmail]=useState("")

    const postdata=()=>{
        fetch("/signin",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password,
                email
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
            if(data.err){
                M.toast({html:data.err,classes:"blue"})
            }else{
                localStorage.setItem("jwt",data.token)
                localStorage.setItem("user",JSON.stringify( data.user))
                dispatch({type:"USER",payload:data.user})
                M.toast({html:"successfully loggedin",classes:"blue"})
                history.push('/')
            }
        }).catch((err)=>{
            console.log(err)
        })
    }
    return(
        <div className="mycard">
            <div className="card auth-card">
                <h2>Instagram</h2>
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
                <button className="btn waves-effect waves-light color blue" onClick={()=>postdata()}>Login
                </button>
                <h5>
                <Link to='/signup' className="btn waves-effect waves-light color blue">Don't have an account</Link>
                </h5>
            </div>
        </div>
    )
}
export default Signin