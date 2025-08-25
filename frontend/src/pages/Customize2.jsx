import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import axios from 'axios'
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';


function Customize2  () {
  const {userData, backendImage, selectedImage,serverUrl, setUserData}= useContext(userDataContext)
  const [assistantName, setAssistantName]=useState(userData?.assistantName || "")
  const [loading, setLoading]= useState(false)
const navigate= useNavigate()


  const handleUpdateAssistant= async()=>{
    setLoading(true)
    try {
      let formData= new FormData()
      formData.append("assistantName", assistantName)
      if(backendImage){
        formData.append("assistantImage", backendImage)
      }
      else{
        formData.append("imageUrl", selectedImage)
      }
      const result= await axios.post(`${serverUrl}/api/user/update`,formData,{withCredentials:true})
      console.log(result.data)
      setUserData(result.data)
      setLoading(false)
      navigate("/")
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }
  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-[20px] relative'>

      <IoMdArrowRoundBack className='absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer' onClick={()=>
        navigate("/customize")
      } />

      <h1 className='text-white mb-[30px] text-[30px] text-center'>Enter Your <span className='text-blue-300'>Assistant Name</span></h1>

        <input type="text" placeholder='eg:  zayn' className='w-full h-[60px] max-w-[600px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px] mb-[10px]'required onChange={(e)=>setAssistantName(e.target.value)} value={assistantName}/>

      {assistantName &&  <button className='cursor-pointer min-w-[300px] h-[60px] text-black font-semibold bg-white rounded-full text-[19px] mt-[30px]'
      disabled={loading}
      onClick={()=>
        handleUpdateAssistant()
      }
      >{!loading?"Create Assistant" : "Loading.."}</button>}
       

    </div>
  )
}

export default Customize2
