import React, { useContext, useState } from 'react'
import bg from "../assets/authBg.png"
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { userDataContext } from '../context/UserContext';
import axios from "axios"



function SignUp () {
  const [showPassword, setShowPassword] = useState(false)
  const navigate= useNavigate()
  const {serverUrl, userData, setUserData}= useContext(userDataContext)
  const [name, setName]=useState("")
  const [email, setEmail]= useState("")
    const [loading, setLoading]= useState(false)
  const [password, setPassword]= useState("")
  const [err, setErr] =useState("")


  const handleSignUp= async (e)=>{
    e.preventDefault() //after submit form page won't refresh
    setErr("")
      setLoading(true)
    try{
      let result= await axios.post(`${serverUrl}/api/auth/signup`,{    //connect with backend & store data       
        name,email,password
      },{withCredentials:true}) //store data 
      setUserData(result.data)
      setLoading(false)
      navigate("/customize")
    }catch(err){
      console.log(err)
      setUserData(null)
      setLoading(false)
      setErr(err.response.data.message)
    }
  }


  return (
    <div
     className='w-full h-[100vh] bg-cover flex justify-center items-center' 
     style={{backgroundImage:`url(${bg})`}}>
      {/* form for registration */}
      <form className='w-[90%] h-[600px] max-w-[500px] bg-[#00000062] backdrop-blur shadow-lg shadow-black flex flex-col items-center justify-center gap[20px] px-[20px]' onSubmit={handleSignUp}>

      <h1 className='text-white text-[30px] font-semibold mb-[30px]'>Register to <span className='text-blue-300'>Virtual Assistant</span></h1>

      <input type="text" placeholder='Enter your Name' className='w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px] mb-[10px]'required onChange={(e)=> setName(e.target.value)} value={name}/>

       <input type="email" placeholder='Enter email' className='w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px] mb-[10px]'required onChange={(e)=> setEmail(e.target.value)} value={email} />

      <div className='w-full h-[60px] border-2 border-white bg-transparent text-white rounded-full text-[18px] relative'>
        <input 
          type={showPassword? "text": "password"} 
          placeholder='Password' 
          className='w-full h-full rounded-full outline-none bg-transparent px-[20px] py-[10px] placeholder-gray-300' 
          required onChange={(e)=> setPassword(e.target.value)} value={password}
        />

        {!showPassword &&  <IoEye className='absolute top-1/2 right-[20px]  w-[25px] -translate-y-1/2 text-white cursor-pointer' onClick={()=>setShowPassword(true)}/>}
       {showPassword && <IoMdEyeOff className='absolute top-1/2 right-[20px]  w-[25px] -translate-y-1/2 text-white cursor-pointer' onClick={()=>setShowPassword(false)}/>}
      </div>
      {err.length>0 && <p className='text-red-500 text-2xl'>
      *{err}
      </p>}

      <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full text-[19px] mt-[30px]' disabled={loading}>{loading?"loading...":"Sign Up"}</button>

      <p className='mt-[20px] text-[white] text-[18px] cursor-pointer' onClick={()=>navigate("/signin")}>Already have an account ? <span className='text-blue-400'>Login</span></p>
      </form>
    </div>
  )
}

export default SignUp
