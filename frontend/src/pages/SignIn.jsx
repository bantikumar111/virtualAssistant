import React, { useContext, useState } from 'react'
import bg from "../assets/authBg.png"
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";
import { MdEmail, MdLock } from "react-icons/md";
import { CgSpinner } from "react-icons/cg";
import { useNavigate } from 'react-router-dom';
import { userDataContext } from '../context/UserContext';
import axios from "axios"

function SignIn () {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { serverUrl, setUserData } = useContext(userDataContext)
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState("")
  const [err, setErr] = useState("")

  const handleSignIn = async (e) => {
    e.preventDefault()
    setErr("")
    setLoading(true)
    try {
      let result = await axios.post(`${serverUrl}/api/auth/signin`, {
        email, password
      }, { withCredentials: true })
      setUserData(result.data)
      setLoading(false)
      navigate("/")
    } catch (err) {
      console.log(err)
      setUserData(null)
      setLoading(false)
      setErr(err.response?.data?.message || "Something went wrong. Please try again.")
    }
  }

  return (
    <div
      className='w-full min-h-screen bg-cover bg-center flex justify-center items-center p-4 relative overflow-hidden'
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Subtle overlay layer for depth */}
      <div className='absolute inset-0 bg-black/40 backdrop-blur-sm'></div>

      {/* Glassmorphism Card */}
      <form 
        className='relative z-10 w-full max-w-[460px] bg-black/40 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/80 rounded-3xl flex flex-col items-center justify-center p-8 sm:p-10 transition-all' 
        onSubmit={handleSignIn}
      >
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-white text-2xl sm:text-3xl font-bold tracking-tight'>
            Welcome Back 👋
          </h1>
          <p className='text-gray-300 text-sm mt-2'>
            Log in to your <span className='text-blue-400 font-semibold'>Virtual Assistant</span>
          </p>
        </div>

        {/* Input Container */}
        <div className='w-full flex flex-col gap-4'>
          {/* Email Field */}
          <div className='relative w-full'>
            <MdEmail className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl' />
            <input 
              type="email" 
              placeholder='Email Address' 
              className='w-full h-[54px] bg-white/10 text-white placeholder-gray-400 pl-12 pr-4 rounded-2xl border border-white/20 outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-200 text-base'
              required 
              onChange={(e) => setEmail(e.target.value)} 
              value={email} 
            />
          </div>

          {/* Password Field */}
          <div className='relative w-full'>
            <MdLock className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl' />
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder='Password' 
              className='w-full h-[54px] bg-white/10 text-white placeholder-gray-400 pl-12 pr-12 rounded-2xl border border-white/20 outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-200 text-base' 
              required 
              onChange={(e) => setPassword(e.target.value)} 
              value={password}
            />
            {/* Toggle Password Icon */}
            <button
              type="button"
              className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white transition-colors cursor-pointer'
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <IoMdEyeOff className='w-5 h-5' /> : <IoEye className='w-5 h-5' />}
            </button>
          </div>
        </div>

        {/* Error Message Display */}
        {err && (
          <div className='w-full bg-red-500/20 border border-red-500/50 text-red-300 text-sm py-2 px-4 rounded-xl mt-4 text-center animate-shake'>
            {err}
          </div>
        )}

        {/* Submit Button */}
        <button 
          type="submit"
          className='w-full h-[54px] text-black font-semibold bg-gradient-to-r from-white via-blue-100 to-blue-200 hover:from-blue-200 hover:to-white rounded-2xl text-lg mt-8 shadow-lg shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex justify-center items-center cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed' 
          disabled={loading}
        >
          {loading ? (
            <CgSpinner className='w-6 h-6 animate-spin text-black' />
          ) : (
            "Log In"
          )}
        </button>

        {/* Signup Redirect */}
        <p className='mt-6 text-gray-300 text-sm text-center'>
          Don't have an account?{' '}
          <span 
            className='text-blue-400 font-semibold hover:underline cursor-pointer ml-1' 
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>  
  )
}

export default SignIn
// import React, { useContext, useState } from 'react'
// import bg from "../assets/authBg.png"
// import { IoEye } from "react-icons/io5";
// import { IoMdEyeOff } from "react-icons/io";
// import { useNavigate } from 'react-router-dom';
// import { userDataContext } from '../context/UserContext';
// import axios from "axios"



// function SignIn () {
//   const [showPassword, setShowPassword] = useState(false)
//   const navigate= useNavigate()
//   const {serverUrl, userData, setUserData}= useContext(userDataContext)
//   const [email, setEmail]= useState("")
//   const [loading, setLoading]= useState(false)
//   const [password, setPassword]= useState("")
//   const [err, setErr] =useState("")


//   const handleSignIn= async (e)=>{
//     e.preventDefault() //after submit form page won't refresh
//     setErr("")
//     setLoading(true)
//     try{
//       let result= await axios.post(`${serverUrl}/api/auth/signin`,{
//         email,password
//       },{withCredentials:true})
//       setUserData(result.data)
//       setLoading(false)
//       navigate("/")
//     }catch(err){
//       console.log(err)
//       setUserData(null)
//        setLoading(false)
//       setErr(err.response.data.message)
//     }
//   }
//   return (
//     <div
//      className='w-full h-[100vh] bg-cover flex justify-center items-center' 
//      style={{backgroundImage:`url(${bg})`}}>
//       {/* form for registration */}
//       <form className='w-[90%] h-[600px] max-w-[500px] bg-[#00000062] backdrop-blur shadow-lg shadow-black flex flex-col items-center justify-center gap[20px] px-[20px]' onSubmit={handleSignIn}>

//       <h1 className='text-white text-[30px] font-semibold mb-[30px]'>Login to <span className='text-blue-300'>Virtual Assistant</span></h1>


//        <input type="email" placeholder='Enter email' className='w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px] mb-[10px]'required onChange={(e)=> setEmail(e.target.value)} value={email} />

//       <div className='w-full h-[60px] border-2 border-white bg-transparent text-white rounded-full text-[18px] relative'>
//         <input 
//           type={showPassword? "text": "password"} 
//           placeholder='Password' 
//           className='w-full h-full rounded-full outline-none bg-transparent px-[20px] py-[10px] placeholder-gray-300' 
//           required onChange={(e)=> setPassword(e.target.value)} value={password}
//         />

//         {!showPassword &&  <IoEye className='absolute top-1/2 right-[20px]  w-[25px] -translate-y-1/2 text-white cursor-pointer' onClick={()=>setShowPassword(true)}/>}
//        {showPassword && <IoMdEyeOff className='absolute top-1/2 right-[20px]  w-[25px] -translate-y-1/2 text-white cursor-pointer' onClick={()=>setShowPassword(false)}/>}
//       </div>
//       {err.length>0 && <p className='text-red-500 text-2xl'>
//       *{err}
//       </p>}

//       <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full text-[19px] mt-[30px]' disabled={loading}>{loading? "loading..":"LogIn"}</button>

//       <p className='mt-[20px] text-[white] text-[18px] cursor-pointer' onClick={()=>navigate("/signup")}>Want to create a new account ? <span className='text-blue-400'>Sign Up</span></p>
//       </form>
//     </div>  
//   )
// }

// export default SignIn
