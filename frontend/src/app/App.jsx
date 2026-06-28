import React from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAuth } from '../features/auth/hook/useAuth'
import Dashboard from '../features/chat/pages/Dashboard'

const App = () => {
  useEffect(()=>{
    console.log("Calling getMe API");
    handleGetMe()
  },[])

  const user = useSelector((state)=> state.auth.user)
  const {handleGetMe} = useAuth()
  return (
    <Dashboard />
  )
}

export default App