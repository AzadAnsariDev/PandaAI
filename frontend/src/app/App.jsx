import React from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAuth } from '../features/auth/hook/useAuth'

const App = () => {
  useEffect(()=>{
    console.log("Calling getMe API");
    handleGetMe()
  },[])

  const user = useSelector((state)=> state.auth.user)
  const {handleGetMe} = useAuth()
  return (
    <div className='text-yellow-500'>
      Welcome to Panda Ai by -- {user?.username}
    </div>
  )
}

export default App