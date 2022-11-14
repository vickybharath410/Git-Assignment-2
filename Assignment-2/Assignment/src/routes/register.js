const router = require('express').Router()
const User = require('../models/user')
const {body,validationResult} = require("express-validator")
const bcrypt = require('bcrypt')

router.post("/",body('email').isEmail(),async(req,res)=>{
    try {
        const error = validationResult(req)
        if(!error.isEmpty()){
            return res.status(400).json({
                status:"Failed",
                message:error.array()
            })
        }
        const {name,email,password} = req.body;

        const user = await User.findOne({email})
        if(user){
            return res.status(403).json({
                status:"Failed",
                message:"This Email is already Existed try to login.."
            })
        }
        bcrypt.hash(password,5,async function(err,hash){
            if(err){
                return res.status(400).json({
                    status:"password failed",message:err.message})
            }
            const user = await User.create({
                name,
                password:hash,
                email
            })
            res.json({
                status:"Success",
                message:"Registration successsfully completed",
                user
            })
        })
       
        
    } catch (error) {
        res.status(505).json({
            status:"Failed",
            message:error.message
        })
    }
})

module.exports = router