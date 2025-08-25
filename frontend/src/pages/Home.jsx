import React from 'react'
import { useContext } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useState } from 'react'
import { useRef } from 'react'
import aiImg from "../assets/ai.gif"
import userImg from "../assets/user.gif"
import { HiMenuAlt3 } from "react-icons/hi";
import { RxCross2 } from "react-icons/rx";



function Home  (){
  const {userData, serverUrl, setUserData, getGeminiResponse} = useContext(userDataContext)
  const navigate= useNavigate()
  const [listening, setListening]=useState(false)
  const [userText, setUserText]= useState("") //user txt to display on ui
  const [aiText, setAiText]= useState("") //ai txt to display on ui
  const isSpeakingRef= useRef(false)
  const recognitionRef= useRef(null)
  const [ham, setHam]=useState(false)  //hamburger icon(menu)
  const isRecognizingRef= useRef(false)//
  const synth= window.speechSynthesis


  const handleLogOut= async()=>{
    try {
      const result= await axios.get(`${serverUrl}/api/auth/logout`, {withCredentials:true})
      setUserData(null) //erase cookies (user data)
      navigate("/signin")
    } catch (error) {
      setUserData(null) //erase cookies (user data)
      console.log(error)
    }
  }

  const startRecognition=()=>{
    if(!isSpeakingRef.current && !isRecognizingRef.current){
      try {
        recognitionRef.current?.start()
        console.log("Recognition requested to start")
      } catch (error) {
        if(!error.namedes !=="InvalidStateError"){
          console.error("Start error:", error)
        }
      }
    }
   
  };

    //convert text to speech
  const speak = (text) => {
    const utterence = new SpeechSynthesisUtterance(text)
    utterence.lang='hi-IN'
    const voices= window.speechSynthesis.getVoices()
  const hindiVoice= voices.find(v=> v.lang === 'hi-IN');
  if(hindiVoice){
    utterence.voice= hindiVoice;
  }


    isSpeakingRef.current=true //when user starts speaking
    utterence.onend=()=>{
      setAiText("")
      isSpeakingRef.current=false //when user stops speaking
      setTimeout(() => {
        startRecognition(); //delay se race condition avoid hoti hai
      }, 800);
    }
    synth.cancel(); //pahle se koi speech ho to band kro
    synth.speak(utterence)
  }

const handleCommand= (data)=>{
  const {type, userInput, response}= data
  speak(response);  //jo bhi res aayega speak kara do first

  if(type === 'google-search'){
    const query= encodeURIComponent(userInput);
    window.open(`https://www.google.com/search?q=${query}`,'_blank');  //_blank is for open in blank(new) window
  }
   if(type === 'calculator-open'){
    window.open(`https://www.google.com/search?q=calculator}`,'_blank');  
  }
   if(type === 'instagram-open'){
    window.open(`https://www.instagram.com/`,'_blank'); 
  }
   if(type === 'facebook-open'){
    window.open(`https://www.facebook.com/`,'_blank'); 
  }
 if(type === 'weather-show'){
    window.open(`https://www.google.com/search?q=weather`,'_blank'); 
  }
 if(type === 'youtube-search' || type === 'youtube-play'){
    const query= encodeURIComponent(userInput);
    window.open(`https://www.youtube.com/results?search_query=${query}`,'_blank'); 
  }


}
useEffect(()=>{
  const SpeechRecognition= window.SpeechRecognition || window.webkitSpeechRecognition

  //for convert voice into text
  const recognition= new SpeechRecognition()
  recognition.continuous=true,
  recognition.lang='en-US'
  recognition.interimResults=false

  recognitionRef.current=recognition

  //const isRecognizingRef= {current:false}//
  let isMounted = true; // 🔑 Added flag to avoid setState on unmounted component

  //start recongnition after 1 sec delay only if component still mounted
  const startTimeout= setTimeout(() =>{
    if(isMounted && !isSpeakingRef.current && !isRecognizingRef.current){
      try {
        recognition.start()
        console.log("Regcognition requested to start");
      } catch (error) {
        if(error.name !== "InvalidStateError"){
          console.error("Start error :",error)
        }
      }
    }
  },1000)


 
  recognition.onstart= ()=>{
    isRecognizingRef.current=true;
    setListening(true);
  };
  recognition.onend=()=>{
    isRecognizingRef.current=false;
    setListening(false);

    if(!isRecognizingRef.current && !isMounted){
      setTimeout(() => {
        if(isMounted){
          try {
            recognition.start();
            console.log("Recognition restarted")
          } catch (error) {
            if(error.name !== "InvalidStateError")
              console.error(error)
          }
        }
      }, 1000);
    }
  };

  recognition.onerror =(event)=>{
    console.warn("Recognition error:",event.error);
    isRecognizingRef.current=false;
    setListening(false);
    if(event.error !== "aborted" && !isSpeakingRef.current && !isMounted){
      setTimeout(() => {
        if(isMounted){
          try {
             recognition.start();
            console.log("Recognition restarted after error")
          } catch (error) {
             if(error.name !== "InvalidStateError")
              console.error(error)
          }
        }
      }, 1000);
    }
  };

  //listening the voice
  recognition.onresult= async (e)=>{
    const transcript= e.results[e.results.length-1][0].transcript.trim()
    console.log("heard: "+ transcript)

    //command me ai name mention hai to res do
    if(transcript.toLowerCase().includes(userData.assistantName.toLowerCase())){
      setAiText("")
      setUserText(transcript)
      recognition.stop() //whenever jarvis giving res then dont listen anymore voice
      isRecognizingRef.current=false;
      setListening(false)
      const data= await getGeminiResponse(transcript)
      console.log(data)
      handleCommand(data);
      setAiText(data.response)
      setUserText("")
    }
  };

//greeting msg
const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, what can I help you with?`);
greeting.lang = 'hi-IN';
window.speechSynthesis.speak(greeting)


  return()=>{
    isMounted=false;
    clearTimeout(startTimeout);
    recognition.stop()
    setListening(false)
    isRecognizingRef.current=false
  };
}, []);



//window.speechSynthesis.speak(new SpeechSynthesisUtterance("Hello world"))
  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#0a0a68] flex justify-center items-center flex-col gap-[20px] overflow-hidden' >

    <HiMenuAlt3  className='lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={()=>setHam(true)}/>

    <div className={`absolute lg:hidden top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start ${ham?"translate-x-0":"translate-x-full"} transition-transform`}>
    <RxCross2 className=' text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={()=>setHam(false)}/>

       <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full text-[19px]   cursor-pointer' onClick={handleLogOut}>Log Out</button>

        <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white  rounded-full text-[19px] px-[20px] cursor-pointer' onClick={()=>navigate("/customize")}>Customize your Assistant</button>

       <div className="text-white w-full mt-4">
      <h3 className="font-semibold mb-2">History</h3>
    <div className="flex flex-col gap-3 overflow-y-auto max-h-[700px]  p-3 rounded-lg">
    {userData.history && userData.history.length > 0 ? (
      userData.history.map((his, index) => (
        <span key={index} className="text-semibold text-white/90">{his}</span>
      ))
    ) : (
      <span className="text-gray-400 text-sm">No history yet</span>
    )}
  </div>
</div>

    </div>

       <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full text-[19px] mt-[30px] absolute hidden lg:block top-[20px] right-[20px] cursor-pointer' onClick={handleLogOut}>Log Out</button>
        <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white  rounded-full text-[19px] mt-[30px] absolute hidden lg:block top-[100px] right-[20px] px-[20px] cursor-pointer' onClick={()=>navigate("/customize")}>Customize your Assistant</button>
      
      
      <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg'>

      <img src={userData?.assistantImage} alt="" className='h-full object-cover'/>
      </div>
      <h1 className='text-white text-[18px] font-semibold'>I'm {userData?.assistantName}</h1>

      {!aiText  && <img src={userImg} alt="" className='w-[200px]'/>}
      {aiText && <img src={aiImg} alt=""  className='w-[200px]'/> }

      <h1 className='text-white text-[18px] font-semibold text-wrap'>{userText? userText: aiText?aiText:null}</h1>
    </div>
  )
}

export default Home
