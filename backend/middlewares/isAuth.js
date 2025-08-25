import jwt from "jsonwebtoken"
//We use JSON Web Token (JWT) in web applications mainly for authentication and secure data exchange.
const isAuth= async (req, res, next)=>{
  try{
    const token = req.cookies.token
    if(!token){
      return res.status(400).json({message:"token not found"})
    }
    const verifyToken= await jwt.verify(token, process.env.JWT_SECRET)
    req.userId=verifyToken.userId
    next()
  }
  catch(err){
    console.log(err)
    return res.status(500).json({message:"isAuth err"})
  }
}

export default isAuth