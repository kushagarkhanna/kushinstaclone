import React,{useEffect,useState,useContext} from 'react'
import {Usercontext} from '../../App'
import {useParams} from 'react-router-dom'

const Userprofile=()=>{
    const {userid}= useParams()
    const [userprofile,setProfile]=useState(null)
    const {state,dispatch}=useContext(Usercontext)
    const [showprofile,setShowprofile]=useState(state?!state.following.includes(userid):true)
    useEffect(()=>{
      
        fetch(`/user/${userid}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            //console.log(result)
            setProfile(result)
        })
    },[])

    const followuser=()=>{
        fetch('/follow',{
            method:"put",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({followid:userid})
        }).then(res=>res.json())
        .then(data=>{
          //console.log(data)
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setProfile((prevState)=>{
                return {
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:[...prevState.user.followers,data._id]
                    }
                }
                
            })
            setShowprofile(false)
        })
        
    }

    const unfollowuser=()=>{
        fetch('/unfollow',{
            method:"put",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({unfollowid:userid})
        }).then(res=>res.json())
        .then(data=>{
            //console.log(data)
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("USER",JSON.stringify(data))
            setProfile((prevState)=>{
                const newFollower=prevState.user.followers.filter(item=>item!=data._id)
                return {
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:newFollower
                    }
                }
            })
            setShowprofile(true)
        })
    }

    return(
        <>
        {
            userprofile?
            <div style={{maxWidth:"550px",margin:"0px auto"}}>
            <div style={{
                justifyContent:"space-around",
                display:"flex",
                margin:"18px 0px",
                borderBottom:"1px solid grey"
            }}>
                <div>
                    <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
                    src={userprofile.user.pic}></img>
                </div>
                <div>
                    <h3>{userprofile.user.name}</h3>
                    <h4>{userprofile.user.email}</h4>
                    <div style={{display:"flex",justifyContent:"space-around"}}>
                    <h6>{userprofile.posts.length} posts</h6>
                    <h6>{userprofile.user.followers.length} followers</h6>
                    <h6>{userprofile.user.following.length} following</h6>
                    </div>
                    {
                        showprofile?
                        <button className="btn waves-effect waves-light color blue" onClick={()=>followuser()}>Follow
                    </button>
                    : <button className="btn waves-effect waves-light color blue" onClick={()=>unfollowuser()}>unFollow
                    </button>
                    }
                   
                </div>
            </div>
            <div className="gallery">
            {
                userprofile.posts.map(item=>{
                    return (
                <img className="item"
                src={item.photo}>
                </img>
                    )
                })
            }
                
            </div>
        </div>
            
            :"loading..."
        }
       
        </>
    )
}
export default Userprofile