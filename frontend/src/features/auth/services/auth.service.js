import axios from 'axios'

const api = axios.create({
    baseURL : "http://localhost:3000/api/auth",
    withCredentials : true
})

export async function login(email, password){
    const response = await api.post("/login",{
        email,password
    })
    return response.data
}
export async function register(username, email, password){
    const response = await api.post("/register",{
        username, email, password
    })
    return response.data
}
export async function getMe(){
    const response = await api.get("/getMe")
    return response.data
}

export async function logout() {
    const response = await api.post("/logout")
    return response.data
}

export async function forgotPassword(email){
    const response = await api.post("/forgot-password", { email })
    return response.data
}

export async function resetPassword(token, newPassword, confirmPassword){
    const response = await api.post(`/reset-password/${token}`, { newPassword, confirmPassword })
    return response.data
}

export async function updateProfile(username) {
   const response = await api.patch("/update-username", {
    username
   })
   return response.data
}