import React ,{useEffect,createContext,useReducer,useContext} from 'react';
import Navbar from './components/navbar'
import Home from './components/screens/home'
import Profile from './components/screens/profile'
import Userprofile from './components/screens/userprofile'
import Signin from './components/screens/signin'
import Signup from './components/screens/signup'
import Createpost from './components/screens/createpost'
import Subscribeduserpost from './components/screens/subscribeduserpost'
import './App.css'
import {BrowserRouter as Router, Route, Switch, useHistory} from 'react-router-dom'
import {reducer,initialState} from './reducers/userreducer'

export const Usercontext= createContext()

const Routing=()=>{
  const history=useHistory()
  const {state,dispatch}=useContext(Usercontext)
  useEffect(()=>{
      const user = JSON.parse(localStorage.getItem("user"))
      if(user){
        dispatch({type:"USER",payload:user})
      }else{
        history.push('/signin')
      }
  },[])
  return(
  <Switch>
      
      <Route exact path='/'><Home /></Route>
      <Route path='/signin'><Signin /></Route>
      <Route path='/signup'><Signup /></Route>
      <Route exact path='/profile'><Profile /></Route>
      <Route path='/profile/:userid'><Userprofile /></Route>
      <Route path='/createpost'><Createpost /></Route>
      <Route path='/myfollowingpost'><Subscribeduserpost /></Route>
    
  </Switch>
  )
}

const App=()=>{
  const [state,dispatch]=useReducer(reducer,initialState)
  return(
    <Usercontext.Provider value={{state,dispatch}}>
    <Router>
    <Navbar />
    <Routing />
    </Router>
    </Usercontext.Provider>
  )
}

export default App;
