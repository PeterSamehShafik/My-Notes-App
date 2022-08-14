import React,{useEffect,useState} from 'react'
import {Routes, Route, useNavigate, Navigate} from 'react-router-dom'
import Navbar from './Components/Navbar/Navbar'
import Login from './Components/Login/Login'
import Register from './Components/Register/Register'
import ParticlesBG from './Components/ParticlesBG/ParticlesBG'
import Notes from './Components/Notes/Notes';
import jwtDecode from "jwt-decode";

export default function App() {


  function RouteGuard({children}){
    if(currentUser){
      return children
    }
    else{
      return <Navigate to='/login' />
    }
  }
  function SignedGuard({children}){
    if(currentUser){
      return <Navigate to='/notes' />
    }
    else{
      return children
    }
  }


  const [currentUser, setCurrentUser] = useState(null)
  const navigate = useNavigate()
  
  function handleLogout(){
    localStorage.removeItem('userToken')
    setCurrentUser(null)
    navigate('/login')
  }

  function decodeToken(){
    let userData = jwtDecode( localStorage.getItem('userToken') )
    setCurrentUser(userData)
  }

  useEffect(() => {
    if(localStorage.getItem('userToken')){
      decodeToken()
    }
  }, [])
  
  return (
    <>
      {currentUser?'':<ParticlesBG />}
      <Navbar  currentUser={currentUser} handleLogout={handleLogout} />

      <div className="container mx-auto my-4 py-1">
	      <Routes>

	        <Route path='' element={<RouteGuard><Navigate to='notes' /></RouteGuard>}/> 
	        <Route path='login' element={<SignedGuard><Login  decodeToken={decodeToken} /></SignedGuard>} />
	        <Route path='register' element={<SignedGuard><Register /></SignedGuard>} />
          <Route path='notes' element={<RouteGuard><Notes  currentUser={currentUser} /> </RouteGuard>} />
          <Route path='*' element={<><div className='d-flex w-100 vh-100 align-items-center justify-content-center '>
                                        <h2 className='text-danger display-1'> 404 Not Found</h2>
                                      </div></>} />

	      </Routes>

      </div>
      

    </>
  )
}