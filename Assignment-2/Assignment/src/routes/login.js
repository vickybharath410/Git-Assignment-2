const router = require('express').Router()
const User = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const {body,validationResult} = require("express-validator")

router.post("/",body('email').isEmail(),async(req,res)=>{
    try {
        
        const error = validationResult(req)
        if(!error.isEmpty()){
            res.status(400).json({
                status :"Failed",
                message:error.array()

            })
    
        }

        // console.log("validation complited")

        const {email,password} = req.body;
        const user = await User.findOne({email})
        
        // console.log("yes",user.email)

        bcrypt.compare(password, user.password, function(err, result) {
            if(err){
                res.status(400).json({
                    status:"Failed",
                    message:err.message
                })
            }
            
            if(result){
                console.log("password verified")
                const token = jwt.sign({ exp:  Math.floor(Date.now() / 1000) + (60 * 60), data: user._id }, "secret")
                res.status(200).json({
                            status:"Success",
                            message:"Your successfully logged in",
                            token:token
                        })
            }else{
                res.status(401).json({
                    status:"Failed",
                    message:"invalid Credintial!!"
                })
            }
           
            
        });
        
    } catch (error) {
        res.status(404).json({
            status:"Failed",
            message:"User not Exist You should register First"
        })
    }
})

module.exports = router