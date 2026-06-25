import { useDispatch } from "react-redux"
import { register, login, getMe } from "../services/auth.service"
import { setError, setLoading, setUser } from "../authSlice"

export const useAuth = () =>{
    const dispatch = useDispatch()

    const handleRegister = async(username, email, password)=>{
        dispatch(setLoading(true))
        try{
            const response = await register(username, email, password)
            return response
        }catch(err){
            dispatch(setError(err.response?.data?.message || err.message))
        }finally{
            dispatch(setLoading(false))
        }
    }
    const handleLogin = async (email, password)=>{
        dispatch(setLoading(true))
        try{
            const response = await login(email, password)
            dispatch(setUser(response.user))
        }catch(err){
            dispatch(setError(err.response?.data?.message || err.message))
        }finally{
            dispatch(setLoading(false))
        }
    }
    const handleGetMe = async ()=>{
        dispatch(setLoading(true))
        try{
            const response = await getMe()
            dispatch(setUser(response.user))
        }catch(err){
            dispatch(setError(err.response?.data?.message || err.message))
        }finally{
            dispatch(setLoading(false))
        }
    }
    return {
        handleGetMe,
        handleLogin,
        handleRegister
}
}