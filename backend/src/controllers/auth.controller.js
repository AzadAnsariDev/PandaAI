import userModel from "../models/user.model.js"
import { sendEmail, sendVerificationEmail } from "../services/email.service.js"
import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs"
import redis from "../config/cache.js"
import { success } from "zod"


export async function register(req, res){
    const {email, username, password} = req.body

    const isUserAlreadyExists = await userModel.findOne({
        $or: [{email}, {username}]
    })

    if(isUserAlreadyExists){
        return res.status(400).json({
            message: "User With This Email Or Username Already Exists",
            success: false,
            err : "User already exists"
        })
    }

    const user = await userModel.create({
        email,
        username,
        password
    })

    await sendVerificationEmail(user)

    return res.status(201).json({
        message: "User created successfully",
        success: true,
        user :{
            id: user._id,
            email: user.email,
            username: user.username,
            verified : user.verified
        }
    })

}

export async function verifyEmail(req, res){
    const {token} = req.params
    if(!token){
        return res.status(401).json({
            message : "unAuthorized",
            success : false,
            err : "No token found"
        })
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const email = decoded.email

        const user = await userModel.findOne({email})

        if(!user){
            return res.status(401).json({
                message : "Unauthorized",
                success : true,
                err : "No User found"
            })
        }

        if(user.verified){
            const html = `
                <h1>Email Already Verified </h1>
                <p>Your email has already been verified. You can now log in to your account.</p>
                <p>Thank you for using our services!</p>
            `
            return res.send(html)
        }

        user.verified = true
        await user.save()

        const html = `
            <h1>Email Verified Successfully</h1>
            <p>Thank you for verifying your email. Your account is now active.</p>
            <p>You can now log in to your account and start using our services.</p>
        `

        res.cookie("token", token)
        return res.redirect("http://localhost:5173/emailVerified")

    }catch(err){
        console.log(err)
        return res.status(401).json({
            message : "Unauthorized",
            success : false,
            err : "Invalid Token"
        })
    }
}

export async function resendEmail(req,res){
    const {username} = req.body

    const user = await userModel.findOne({username})

    await sendVerificationEmail(user)

    res.status(200).json({
        message : "Email resend successfully",
        success : true
    })
}

export async function login(req,res){
    const {email, username, password} = req.body

    const user = await userModel.findOne({
        $or : [{email}, {username}]
    }).select("+password")

    if(!user){
        return res.status(401).json({
            message : "Invalid email or password",
            success : false,
            err : "User does not exists"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid){
        return res.status(401).json({
            message : "Invalid email or password",
            success : false,
            err : "Incorrect Password"
        })
    }

    const token = jwt.sign(
        {
            id : user._id,
            username : user.username
        },process.env.JWT_SECRET,
        {expiresIn : "7d"}
    )

    res.cookie("token", token)

    res.status(201).json({
        message : "User loggedIn successfully",
        success : true,
        user : {
            id : user._id,
            email : user.email,
            username : user.username
        }
    })
}

export async function getMe(req, res){
    const userId = req.user.id

    const user = await userModel.findById(userId)

    if(!user){
        return res.status(401).json({
            message : "Invalid Username or password",
            success: false,
            err : "User not found"
        })
    }

    res.status(200).json({
        message : "User fetched successfully",
        user
    })
}

export async function logout(req, res) {
    const token = req.cookies.token

    if(!token){
        return res.status(400).json({
            message : "No Token Found, please register first"
        })
    }

    res.clearCookie("token")

    await redis.set(token, "blacklisted")

    res.status(201).json({
        message : "Logout Successfully"
    })

}

export async function forgotPassword(req, res) {
    const { email } = req.body

    if(!email){
        return res.status(400).json({
            message: "Email is required",
            success: false
        })
    }

    const user = await userModel.findOne({ email })

    if(!user){
        return res.status(200).json({
            message: "If email exists, a reset link has been sent",
            success: true
        })
    }

    const token = jwt.sign({
        email: user.email
    }, process.env.JWT_SECRET, { expiresIn: "1h" })

    user.resetPasswordToken = token
    user.resetPasswordExpiry = Date.now() + 60 * 60 * 1000

    await user.save()

    const resetLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${token}`

    await sendEmail({
        to: user.email,
        subject: "Reset Password for Lumis",
        html: `
            <h2>Password Reset</h2>
            <p>Click the link below to reset your password:</p>
            <a href="${resetLink}">Reset Password for Lumis</a>
            <p>This link expires in 1 hour.</p>
        `
    })

    res.status(200).json({
        message: "If email exists, a reset link has been sent",
        success: true
    })
}

export async function resetPassword(req, res){
    const { newPassword, confirmPassword } = req.body
    const { token } = req.params

    if(!token){
        return res.status(400).json({
            message: "Reset token is missing",
            success: false
        })
    }

    if(!newPassword || !confirmPassword){
        return res.status(400).json({
            message: "Both password fields are required",
            success: false
        })
    }

    if(newPassword.length < 6){
        return res.status(400).json({
            message: "Password must be at least 6 characters long",
            success: false
        })
    }

    if(newPassword !== confirmPassword){
        return res.status(400).json({
            message: "Passwords do not match",
            success: false
        })
    }

    const user = await userModel.findOne({
        resetPasswordToken: token,
        resetPasswordExpiry: { $gt: Date.now() }
    })

    if(!user){
        return res.status(401).json({
            message: "Invalid or expired reset link",
            success: false
        })
    }

    user.password = newPassword
    user.resetPasswordExpiry = undefined
    user.resetPasswordToken = undefined
    await user.save()

    res.status(200).json({
        message: "Password reset successfully",
        success: true
    })
}

export async function updateUserName(req, res) {
    const { username } = req.body;

    const user = await userModel.findById(req.user.id);

    if (!user) {
        return res.status(401).json({
            message: "Unauthorized Access",
            success: false,
        });
    }

    user.username = username;
    await user.save();


    res.status(200).json({
        message: "Username updated successfully",
        success: true,
        user,
    });
}