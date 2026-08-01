import React, { useContext, useRef } from 'react'
import Card from '../components/Card'
import image1 from "../assets/image1.png"
import image2 from "../assets/image2.jpg"
import image3 from "../assets/authBg.png"
import image4 from "../assets/image4.png"
import image5 from "../assets/image5.png"
import image6 from "../assets/image6.jpeg"
import image7 from "../assets/image7.jpeg"
import { LuImageUp } from "react-icons/lu";
import { userDataContext } from '../context/UserContext'
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom'

function Customize() {
  const { 
    serverUrl, 
    userData, 
    setUserData, 
    frontendImage, 
    setFrontendImage, 
    backendImage, 
    setBackendImage, 
    selectedImage, 
    setSelectedImage 
  } = useContext(userDataContext)
  
  const inputImage = useRef()
  const navigate = useNavigate()

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (file) {
      setBackendImage(file)
      setFrontendImage(URL.createObjectURL(file))
    }
  }

  return (
    <div className='w-full min-h-screen bg-gradient-to-b from-[#05051a] via-[#020235] to-[#00000d] flex flex-col items-center justify-between p-6 sm:p-10 relative overflow-y-auto'>
      
      {/* Top Bar Navigation & Header */}
      <div className='w-full max-w-[1000px] flex items-center justify-between mb-8 relative z-10'>
        <button 
          onClick={() => navigate("/")}
          className='flex items-center gap-2 text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-2xl backdrop-blur-md border border-white/10 transition-all duration-300 hover:scale-105 cursor-pointer'
        >
          <IoMdArrowRoundBack className='w-5 h-5' />
          <span className='hidden sm:inline text-sm font-medium'>Back</span>
        </button>

        <h1 className='text-white text-xl sm:text-3xl font-bold text-center tracking-tight'>
          Select Your <span className='text-blue-400 font-semibold'>Assistant Image</span>
        </h1>

        <div className='w-[70px] sm:w-[90px]'></div> {/* Spacer for center alignment */}
      </div>

      {/* Preset Images Grid + Upload Section */}
      <div className='w-full max-w-[1000px] flex justify-center items-center flex-wrap gap-4 sm:gap-6 py-4'>
        <Card image={image1} />
        <Card image={image2} />
        <Card image={image3} />
        <Card image={image4} />
        <Card image={image5} />
        <Card image={image6} />
        <Card image={image7} />

        {/* Custom Upload Card */}
        <div 
          className={`relative w-[110px] h-[180px] sm:w-[140px] sm:h-[230px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col items-center justify-center border-2 border-dashed ${
            selectedImage === "input" 
              ? "border-blue-400 bg-blue-500/20 shadow-xl shadow-blue-500/30 scale-105" 
              : "border-white/30 bg-white/5 hover:bg-white/10 hover:border-white/60 hover:scale-102"
          }`}
          onClick={() => {
            inputImage.current.click()
            setSelectedImage("input")
          }}
        >
          {!frontendImage ? (
            <div className='flex flex-col items-center gap-2 p-2 text-center'>
              <div className='p-3 rounded-full bg-white/10 text-white'>
                <LuImageUp className='w-6 h-6' />
              </div>
              <span className='text-xs text-gray-300 font-medium'>Upload Custom</span>
            </div>
          ) : (
            <img src={frontendImage} alt="Custom assistant preview" className='w-full h-full object-cover' />
          )}
        </div>

        <input type="file" accept='image/*' ref={inputImage} hidden onChange={handleImage} />
      </div>

      {/* Bottom Action Section */}
      <div className='h-[80px] flex items-center justify-center mt-6 z-10'>
        {selectedImage && (
          <button 
            className='h-[54px] px-10 text-black font-semibold bg-gradient-to-r from-white via-blue-100 to-blue-200 hover:from-blue-200 hover:to-white rounded-2xl text-lg shadow-xl shadow-blue-500/25 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer animate-fade-in' 
            onClick={() => navigate("/customize2")}
          >
            Next Step →
          </button>
        )}
      </div>
    </div>
  )
}

export default Customize


// import React, { useContext, useRef, useState } from 'react'
// import Card from '../components/Card'
// import image1 from "../assets/image1.png"
// import image2 from "../assets/image2.jpg"
// import image3 from "../assets/authBg.png"
// import image4 from "../assets/image4.png"
// import image5 from "../assets/image5.png"
// import image6 from "../assets/image6.jpeg"
// import image7 from "../assets/image7.jpeg"
// import { LuImageUp } from "react-icons/lu";
// import { userDataContext } from '../context/UserContext'
// import { IoMdArrowRoundBack } from "react-icons/io";
// import { useNavigate } from 'react-router-dom'



// function Customize  () {
//   const {  serverUrl,userData, setUserData, frontendImage, setFrontendImage, backendImage, setBackendImage, selectedImage, setSelectedImage} =useContext(userDataContext)
//   const inputImage= useRef() //take input img
//   const navigate =useNavigate()


//   const handleImage= (e)=>{
//     const file=e.target.files[0]
//     setBackendImage(file)
//     setFrontendImage(URL.createObjectURL(file))
//   }


//   return (
//     <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-[20px] relative'>

//       <IoMdArrowRoundBack className='absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer' onClick={()=>navigate("/")} />

//       <h1 className='text-white mb-[30px] text-[30px] text-center'>Select your <span className='text-blue-300'>Assistant Image</span></h1>
//     <div className='w-full max-w-[900px] flex justify-center items-center flex-wrap gap-[15px]'>
//      <Card image={image1}/>
//       <Card image={image2}/>
//      <Card image={image3}/>
//      <Card image={image4}/>
//      <Card image={image5}/>
//      <Card image={image6}/>
//      <Card image={image7}/>

//      <div className={`w-[80px] h-[160px] lg:w-[150px] lg:h-[250px] bg-[#030326] border-2 border-[#1a1a6ab3] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white flex items-center justify-center ${selectedImage=="input"?"border-4 border-white shadow-2xl shadow-blue-950":null}` }
//      onClick={()=>{
//       inputImage.current.click()
//       setSelectedImage("input")
//       }}>
      
//       {!frontendImage && <LuImageUp className='text-white w-[25px] h-[25px]' />}
//       {frontendImage && <img src={frontendImage} className='h-full object-cover'/>}

//     </div>
//     <input type="file" accept='image/*' ref={inputImage} hidden onChange={handleImage} />
//      </div>
     

//    {selectedImage &&  <button className='cursor-pointer min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full text-[19px] mt-[30px]' onClick={()=>navigate("/customize2")}>Next</button>}
//     </div>
//   )
// }

// export default Customize
