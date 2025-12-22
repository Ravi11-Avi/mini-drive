import express from "express";
import bcrypt from "bcryptjs";
import jwl  from "jsonwebtoken";
import User from "../models/user.js";
import { error } from "console";

const router  =  express.Router();


// Sign up API
router.post("/signup", async (req,res)=>{
    try{
        const {name, email, password} =  req.body;

        const existing =  await User.findOne({email});
        if(existing) return res.status(400).json({msg : "Email Already Exists"});


        const haspassword   = await bcrypt.hash(password, 10);

        const user =  await User.create({
            name,
            email,
            password :haspassword,
        });


        res.status(201).json({
            msg: "User created successfully",
            user: { id: user._id, name: user.name, email: user.email },

        })

    }

    catch (err){
        res.status(500).json({msg : "Server Error", error :  err.message})
    }
})





// Login API
router.post("/login", async(req,res)=>{

    try{
        const {email, password} =  req.body;

        const user =  await User.findOne({email});
        if (!user) return res.status(401).json({msg : "Invalid Email or password"}) ;

        if(!user.password){return res.status(400).json({msg:"This account uses Google/GitHub login"})}

        const isMatch = await  bcrypt.compare(password,user.password);
        if (!isMatch) return res.status(400).json({msg : "Invalid Email or password"}) ;


        const token  =  jwl.sign(
            {id : user._id},
            process.env.JWT_SECRET,
            {expiresIn : "7d"}
        )
        res.json({
            msg:"Login SuccessFul",
            token,
            user :{id : user._id, name : user.name, email : user.email},

        });
    }
    catch (err){
        res.status(500).json({msg: "Server Error", error : err.message});
    }
})

export default router;
