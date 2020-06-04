import React,{useContext,useRef,useEffect,useState} from 'react'
import { Link, useHistory } from 'react-router-dom'
import {Usercontext} from '../App'
import M from 'materialize-css'

const Navbar=()=>{
  const searchModel= useRef(null)
  const [search,setSearch]=useState("")
  const [userdetails,setUserdetails]=useState([])
  const history=useHistory()
    const {state,dispatch}=useContext(Usercontext)
    useEffect(()=>{
      M.Modal.init(searchModel.current)
    },[])
    const renderlist =()=>{
      if(state){
        return [
        <li><i data-target="modal1" className="large material-icons modal-trigger" style={{color:"black"}}>search</i></li>,
        <li><Link to="/profile">Profile</Link></li>,
        <li><Link to="/createpost">Create post</Link></li>,
        <li><Link to="/myfollowingpost">My following post</Link></li>,
        <li><button className="btn waves-effect waves-light color blue" 
        onClick={()=>{
        localStorage.clear()
        dispatch({type:"CLEAR"})
        history.push('/signin')
        }}
        >Logout
        </button>
        </li>
        ]
      }else{
        return [
        <li><Link to="/signin">Signin</Link></li>,
        <li><Link to="/signup">Signup</Link></li>
        ]
      }
    }

    const fetchusers=(query1)=>{
      setSearch(query1)
      fetch('/searchuser',{
        method:"post",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({query1:query1})
      }).then(res=>res.json())
      .then(result=>{
        //console.log(result)
        setUserdetails(result.result)
      })
    }

    return (
        <nav>
    <div className="nav-wrapper white">
      <Link to={state?'/':'/signin'} className="brand-logo left">Instagram</Link>
      <ul id="nav-mobile" className="right">
       {renderlist()}
        
      </ul>
    </div>
      <div id="modal1" class="modal" ref={searchModel} style={{color:"black"}}>
      <div className="modal-content">
      <input type="text" placeholder="search users"
                     value={search} onChange={(e)=>
                    fetchusers(e.target.value)
                }
                />
                <ul class="collection">
                {
                  userdetails.map(item=>{
                    return (
                      <Link to={item._id==state._id?'/profile':'/profile/'+item._id} onClick={()=>{
                        M.Modal.getInstance(searchModel.current).close()
                        setSearch('')
                      }} >  <li class="collection-item">{item.email}</li></Link>
                    )
                  })
                }
                

              </ul>
      </div>
      <div className="modal-footer">
        <button href="#!" className="modal-close waves-effect waves-green btn-flat">Agree</button>
      </div>
     </div>
  </nav>
    )
}
export default Navbar