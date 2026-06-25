import {body, validationResult} from 'express-validator'

export function validation(req, res, next){
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({
            message : "Validation Erros Occur",
            error : errors.array()
        })
    }
    next()
}

export const registerValidation = [
    body('email').isEmail().withMessage("Please use proper email format"),
    body('username').isLength({ min: 2, max: 30 }).withMessage("Username must be between 2 and 30 characters"),
    body('username').not().isEmpty().withMessage("Username is required"),
    body('password').isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    validation
]