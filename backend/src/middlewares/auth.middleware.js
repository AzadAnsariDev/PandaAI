import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import redis from '../config/cache.js'
dotenv.config()

export async function authUser(req, res, next){
    const token = req.cookies.token

    if(!token){
        return res.status(401).json({
            message : "Unauthorized Access",
            success: false,
            err : "No Token Found"
        })
    }
    const isTokenBlacklisted = await redis.get(token)

    if(isTokenBlacklisted){
        return res.status(401).json({
            message : "Invalid Credentials",
            success : false,
            err : "Token BlackListed"
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
