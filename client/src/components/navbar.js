import React,{useContext} from 'react'
import { Link, useHistory } from 'react-router-dom'
import {Usercontext} from '../App'

const Navbar=()=>{
  const history=useHistory()
    const {state,dispatch}=useContext(Usercontext)
    const renderlist =()=>{
      if(state){
        return [
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

    return (
        <nav>
    <div className="nav-wrapper white">
      <Link to={state?'/':'/signin'} className="brand-logo left">Instagram</Link>
      <ul id="nav-mobile" className="right">
       {renderlist()}
        
      </ul>
    </div>
  </nav>
    )
}
export default Navbar