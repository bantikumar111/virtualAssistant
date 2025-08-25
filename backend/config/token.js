import jwt from "jsonwebtoken"

/// 
const genToken= async (userId) =>{
  try{
    const token = await jwt.sign({userId},process.env.JWT_SECRET, {expiresIn:"10d"})  //that user will logged in for 7 days after 7 it will logOut
    return token
    
  }
  catch(err){
    console.log(err)
    throw err; 

  }
}
export default genToken