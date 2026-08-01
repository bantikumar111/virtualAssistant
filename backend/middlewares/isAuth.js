import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  try {
    // 1. Cookies ya Header (dono jagah se token check karo)
    let token = req.cookies?.token;

    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1]; // Bearer <token>
    }

    if (!token) {
      return res.status(401).json({ message: "token not found" });
    }

    // 2. Token Verify karo
    const verifyToken = await jwt.verify(token, process.env.JWT_SECRET);
    
    // JWT Payload se ID extract karo
    const extractedUserId = verifyToken.userId || verifyToken.id || verifyToken._id;

    // 3. DONO properties set kar do taaki kisi bhi controller mein error na aaye!
    req.userId = extractedUserId;
    req.user = { _id: extractedUserId };

    next();
  } catch (err) {
    console.log("isAuth Error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default isAuth;

// import jwt from "jsonwebtoken"
// //We use JSON Web Token (JWT) in web applications mainly for authentication and secure data exchange.
// const isAuth= async (req, res, next)=>{
//   try{
//     const token = req.cookies.token
//     if(!token){
//       return res.status(400).json({message:"token not found"})
//     }
//     const verifyToken= await jwt.verify(token, process.env.JWT_SECRET)
//     req.userId=verifyToken.userId
//     next()
//   }
//   catch(err){
//     console.log(err)
//     return res.status(500).json({message:"isAuth err"})
//   }
// }

// export default isAuth