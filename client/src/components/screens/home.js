import React,{useState,useEffect,useContext} from 'react'
import { Usercontext } from '../../App';
import {Link} from 'react-router-dom'

const Home=()=>{
    const [data,setData]=useState([])
    const {state,dispatch}=useContext(Usercontext)
    useEffect(()=>{
        fetch('/allpost',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            setData(result.posts)
        })
    },[])

    const likepost=(id)=>{
        fetch('/like',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({postedid:id})
        }).then(res=>res.json())
        .then(result=>{
            const newData= data.map(item=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }

    const unlikepost=(id)=>{
        fetch('/unlike',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({postedid:id})
        }).then(res=>res.json())
        .then(result=>{
            const newData= data.map(item=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }

    const makecomment=(text,postedid)=>{
        fetch('/comment',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postedid,
                text
            })
        }).then(res=>res.json())
        .then(result=>{
            console.log(data)
            console.log(result)
            const newData= data.map(item=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }

    // const deletecomment=(postedid,commentid)=>{
    //     fetch('/deletecomment',{
    //         method:"delete",
    //         headers:{
    //             "Content-Type":"application/json",
    //             "Authorization":"Bearer "+localStorage.getItem("jwt")
    //         },
    //         body:JSON.stringify({
    //             postedid,
    //             commentid
    //         })
    //     }).then(res=>res.json())
    //         .then(result=>{
    //             console.log(result)
    //             const newData=data.filter((item)=>{
    //                 return item.comments._id !==result.comments._id
    //             })
    //             setData(newData)
            
    //     })
    // }

    const deletepost=(postedid)=>{
        fetch(`/deletepost/${postedid}`,{
            method:"delete",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
        }).then(res=>res.json())
        .then(result=>{
            const newData=data.filter(item=>{
                return item._id !==result._id
            })
            setData(newData)
        })
    }

    return(
        <div className="home">
        {
            data.map(item=>{
                return(
                    <div className="card home-card">
                <h4 style={{padding:"5px"}}><Link to={item.postedby._id!=state._id?'/profile/'+item.postedby._id:'/profile'}>{item.postedby.name}</Link>
                {item.postedby._id==state._id && <i class="material-icons"
                style={{float:"right"}}
                onClick={()=>deletepost(item._id)}
                >delete</i>}
                {item.postedby._id==state._id && <i class="material-icons"
                style={{float:"right",padding:"0px 10px 0px 0px"}}
                >create</i>}
                </h4>
                <div className="card-image">
                    <img src={item.photo} />
                </div>
                <div className="card-content">
                    <i className="material-icons" style={{color:"red"}}>favorite</i>
                    {
                        item.likes.includes(state._id)
                        ?<i class="material-icons" 
                        onClick={()=>unlikepost(item._id)}>thumb_down</i>
                        :<i class="material-icons" 
                    onClick={()=>likepost(item._id)}>thumb_up</i>
                    }
                    
                    <h6>{item.likes.length} likes</h6>
                    <h5>{item.title}</h5>
                    <p>{item.body}</p>
                    {
                        item.comments.map(record=>{
                            return(
                                <h6><span style={{fontWeight:"500"}}>{record.postedby.name}</span>{record.text}
                                {/* {item.postedby._id==state._id && <i class="material-icons"
                                style={{float:"right",padding:"0px 10px 0px 0px"}}
                                onClick={()=>deletecomment(item._id,record._id)}
                                >delete</i>} */}
                                </h6>
                            )
                        })
                
                    }
                    
                    <form onSubmit={(e)=>{
                    e.preventDefault()
                    makecomment(e.target[0].value,item._id)
                    }
                    }>
                    <input type="text" placeholder="add a comment" />
                    
                    </form>
                </div>
            </div>
                )
            })
        }
            
        </div>
    )
}
export default Home