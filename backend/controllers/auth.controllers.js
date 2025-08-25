import genToken from "../config/token.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

export const signUp= async (req, res) =>{
  try{
    const {name, email, password} = req.body
    const existEmail= await User.findOne({email})
    if(existEmail){
      return res.status(400).json({message:"email already exists!"})
    }
    if(password.length<6){
        return res.status(400).json({message:"password len must be 6 char!"})
    }
    const hashedPassword= await bcrypt.hash(password, 10)
    const user= await User.create({
      name, password:hashedPassword, email
    })

    const token= await genToken(user._id) //generate token for that user to store in cookie about that user
    res.cookie("token",token,{
      httpOnly:true,
      maxAge:7*24*60*60*1000, //logged in for 7 days
      sameSite:"strict",
      secure:false
    })
    return res.status(201).json(user) // return the new user
  } 
  catch(err){
    return res.status(500).json({message:`sign up err ${err}`}) 

  }
}

export const Login= async (req, res) =>{
  try{
    const {email, password} = req.body
    const user= await User.findOne({email})
    if(!user){
      return res.status(400).json({message:"email doesn't exists!"})
    }
    const isMatch= await bcrypt.compare(password, user.password) //match i/p password and stored pass, both are same or not
    if(!isMatch){
        return res.status(400).json({message:"wrong password!"})
    }
    const token= await genToken(user._id) //generate token for that user to store in cookie about that user
    res.cookie("token",token,{
      httpOnly:true,
      maxAge:7*24*60*60*1000, //logged in for 7 days
      sameSite:"strict",
      secure:false
    })
    return res.status(201).json(user) // return the user
  }
  catch(err){
    return res.status(500).json({message:`login err ${err}`}) 

  }
}

export const logOut= async (req, res)=>{
  try{
    res.clearCookie("token")// from cookie we've stored token of that user so when we remove that token from cookie then we'll be succesfully logout
      return res.status(200).json({message:"log out successfully"})
  }
  catch(err){
    return res.status(500).json({message:`log out err ${err}`}) 

  }
}