import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export function authUser(req, res, next){
    const token = req.cookies.token

    if(!token){
        return res.status(400).json({
            message : "Unauthorized Access",
            success: false,
            err : "No Token Found"
        })
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    }catch(err){
        return res.status(401).json({
            message : "Unauthorized Access",
            success : false,
            err : "Invalid Token"
        })
    }
}
