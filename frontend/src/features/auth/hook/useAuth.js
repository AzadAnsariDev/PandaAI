import { useDispatch } from "react-redux"
import { register, login, getMe, logout, forgotPassword, resetPassword, updateProfile } from "../services/auth.service"
import { setError, setLoading, setUser } from "../authSlice"
import { setChat, setCurrentChatId } from "../../chat/chatSlice"

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
            return response
        }catch(err){
            dispatch(setError(err.response?.data?.message || err.message))
            return {
                success: false,
                message: err.response?.data?.message || err.message,
            }
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
    const handleLogout = async()=>{
        dispatch(setLoading(true))
        try{
            const response =await logout()
            dispatch(setUser(null))
            dispatch(setCurrentChatId(null))
            dispatch(setChat({}))

            return response
        }catch(err){
            dispatch(setError(err.response?.data?.message || err.message))
        }finally{
            dispatch(setLoading(false))
        }
    }

    const handleForgotPassword = async (email) => {
        dispatch(setLoading(true))
        try {
            const response = await forgotPassword(email)
            return response
        }catch(err){
            dispatch(setError(err.response?.data?.message || err.message))
            return {
                success: false,
                message: err.response?.data?.message || err.message,
            }
        }finally{
            dispatch(setLoading(false))
        }
    }

    const handleResetPassword = async (token, newPassword, confirmPassword) => {
        dispatch(setLoading(true))
        try {
            const response = await resetPassword(token, newPassword, confirmPassword)
            return response
        }catch(err){
            dispatch(setError(err.response?.data?.message || err.message))
            return {
                success: false,
                message: err.response?.data?.message || err.message,
            }
        }finally{
            dispatch(setLoading(false))
        }
    }

    const handleUpdateProfile = async(username)=>{
        const response = await updateProfile(username)
        return response
    }

    return {
        handleGetMe,
        handleLogin,
        handleRegister,
        handleLogout,
        handleForgotPassword,
        handleResetPassword,
        handleUpdateProfile
    }
}