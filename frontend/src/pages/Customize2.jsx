import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import axios from 'axios'
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdOutlineSmartToy } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

function Customize2() {
  const { userData, backendImage, selectedImage, serverUrl, setUserData } = useContext(userDataContext)
  const [assistantName, setAssistantName] = useState(userData?.assistantName || "")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Safe Image Preview Handler (Prevents URL.createObjectURL crash)
  const getImagePreview = () => {
    if (backendImage && typeof backendImage !== 'string') {
      try {
        return URL.createObjectURL(backendImage);
      } catch (e) {
        return null;
      }
    }
    return selectedImage || null;
  };

  const imagePreview = getImagePreview();

  const handleUpdateAssistant = async () => {
    if (!assistantName.trim()) return;
    setLoading(true)
    try {
      let formData = new FormData()
      formData.append("assistantName", assistantName)
      if (backendImage) {
        formData.append("assistantImage", backendImage)
      } else {
        formData.append("imageUrl", selectedImage)
      }
      const result = await axios.post(`${serverUrl}/api/user/update`, formData, { withCredentials: true })
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
    <div className='w-full min-h-screen bg-gradient-to-b from-[#03031e] via-[#01012b] to-[#00000a] flex justify-center items-center flex-col p-4 sm:p-6 relative overflow-hidden select-none'>
      
      {/* Background Ambient Glow */}
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none'></div>

      {/* Back Button */}
      <button 
        onClick={() => navigate("/customize")}
        className='absolute top-6 left-6 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white backdrop-blur-md transition-all duration-200 hover:scale-105 cursor-pointer z-10 flex items-center gap-2 text-sm font-medium'
      >
        <IoMdArrowRoundBack className='w-5 h-5' />
        <span className='hidden sm:inline'>Back</span>
      </button>

      {/* Glassmorphic Card Container */}
      <div className='w-full max-w-[500px] bg-white/5 border border-white/10 backdrop-blur-xl p-6 sm:p-10 rounded-3xl shadow-2xl flex flex-col items-center z-10 relative'>
        
        {/* Selected Image Badge Preview */}
        {imagePreview && (
          <div className='relative mb-6'>
            <div className='w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-blue-400/50 shadow-xl shadow-blue-500/20'>
              <img src={imagePreview} alt="Selected Avatar" className='w-full h-full object-cover' />
            </div>
          </div>
        )}

        {/* Title */}
        <h1 className='text-white text-2xl sm:text-3xl font-bold text-center tracking-tight mb-2'>
          Name Your <span className='bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent'>Assistant</span>
        </h1>
        <p className='text-gray-400 text-xs sm:text-sm text-center mb-8 max-w-[360px]'>
          Give your AI companion a unique voice trigger identity.
        </p>

        {/* Styled Input Field */}
        <div className='w-full relative mb-6'>
          <div className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'>
            <MdOutlineSmartToy className='w-6 h-6' />
          </div>
          <input 
            type="text" 
            placeholder='e.g. Zayn, Jarvis, Friday' 
            className='w-full h-14 pl-12 pr-5 bg-white/5 border border-white/15 focus:border-blue-400/80 rounded-2xl text-white placeholder-gray-500 text-base outline-none transition-all duration-200 focus:ring-4 focus:ring-blue-500/20'
            required 
            onChange={(e) => setAssistantName(e.target.value)} 
            value={assistantName}
          />
        </div>

        {/* Action Button */}
        <button 
          className={`w-full h-14 font-semibold rounded-2xl text-base transition-all duration-300 shadow-lg flex items-center justify-center gap-2 ${
            assistantName.trim() && !loading
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-blue-500/25 hover:scale-[1.02] cursor-pointer'
              : 'bg-white/10 text-gray-500 border border-white/5 cursor-not-allowed'
          }`}
          disabled={!assistantName.trim() || loading}
          onClick={handleUpdateAssistant}
        >
          {loading ? (
            <div className='flex items-center gap-2'>
              <span className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin'></span>
              <span>Creating Assistant...</span>
            </div>
          ) : (
            <span>Create Assistant</span>
          )}
        </button>

      </div>

      {/* Footer */}
      <div className='absolute bottom-6 text-center z-10'>
        <span className='text-xs text-gray-500 tracking-wider'>Powered by Gemini AI</span>
      </div>

    </div>
  )
}

export default Customize2


// import React, { useContext, useState } from 'react'
// import { userDataContext } from '../context/UserContext'
// import axios from 'axios'
// import { IoMdArrowRoundBack } from "react-icons/io";
// import { useNavigate } from 'react-router-dom';


// function Customize2  () {
//   const {userData, backendImage, selectedImage,serverUrl, setUserData}= useContext(userDataContext)
//   const [assistantName, setAssistantName]=useState(userData?.assistantName || "")
//   const [loading, setLoading]= useState(false)
// const navigate= useNavigate()


//   const handleUpdateAssistant= async()=>{
//     setLoading(true)
//     try {
//       let formData= new FormData()
//       formData.append("assistantName", assistantName)
//       if(backendImage){
//         formData.append("assistantImage", backendImage)
//       }
//       else{
//         formData.append("imageUrl", selectedImage)
//       }
//       const result= await axios.post(`${serverUrl}/api/user/update`,formData,{withCredentials:true})
//       console.log(result.data)
//       setUserData(result.data)
//       setLoading(false)
//       navigate("/")
//     } catch (error) {
//       setLoading(false)
//       console.log(error)
//     }
//   }
//   return (
//     <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-[20px] relative'>

//       <IoMdArrowRoundBack className='absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer' onClick={()=>
//         navigate("/customize")
//       } />

//       <h1 className='text-white mb-[30px] text-[30px] text-center'>Enter Your <span className='text-blue-300'>Assistant Name</span></h1>

//         <input type="text" placeholder='eg:  zayn' className='w-full h-[60px] max-w-[600px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px] mb-[10px]'required onChange={(e)=>setAssistantName(e.target.value)} value={assistantName}/>

//       {assistantName &&  <button className='cursor-pointer min-w-[300px] h-[60px] text-black font-semibold bg-white rounded-full text-[19px] mt-[30px]'
//       disabled={loading}
//       onClick={()=>
//         handleUpdateAssistant()
//       }
//       >{!loading?"Create Assistant" : "Loading.."}</button>}
       

//     </div>
//   )
// }

// export default Customize2
