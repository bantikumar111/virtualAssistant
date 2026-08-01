import React, { useContext, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import aiImg from "../assets/ai.gif"
import userImg from "../assets/user.gif"
import { HiMenuAlt3 } from "react-icons/hi";
import { RxCross2 } from "react-icons/rx";
import { MdOutlineHistory, MdLogout, MdTune, MdMic, MdVolumeUp } from "react-icons/md";

function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext)
  const navigate = useNavigate()
  const [listening, setListening] = useState(false)
  const [userText, setUserText] = useState("") // user text to display on UI
  const [aiText, setAiText] = useState("") // AI text to display on UI
  const isSpeakingRef = useRef(false) // AI is speaking state
  const recognitionRef = useRef(null) // Stores speech recognition instance
  const [ham, setHam] = useState(false) // Sidebar state
  const isRecognizingRef = useRef(false) // Tracks if recognition is active
  const synth = window.speechSynthesis

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
      setUserData(null)
      navigate("/signin")
    } catch (error) {
      setUserData(null)
      console.log(error)
    }
  }

  const startRecognition = () => {
    if (!isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognitionRef.current?.start()
        console.log("Recognition requested to start")
      } catch (error) {
        if (error.name !== "InvalidStateError") {
          console.error("Start error:", error)
        }
      }
    }
  }

  // Convert text to speech
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'hi-IN'
    const voices = window.speechSynthesis.getVoices()
    const hindiVoice = voices.find(v => v.lang === 'hi-IN')
    if (hindiVoice) {
      utterance.voice = hindiVoice
    }

    isSpeakingRef.current = true
    utterance.onend = () => {
      setAiText("")
      isSpeakingRef.current = false
      setTimeout(() => {
        startRecognition()
      }, 2500)
    }
    synth.cancel()
    synth.speak(utterance)
  }

  const handleCommand = (data) => {
    const { type, userInput, response } = data
    speak(response)

    if (type === 'google-search') {
      const query = encodeURIComponent(userInput)
      window.open(`https://www.google.com/search?q=${query}`, '_blank')
    }
    if (type === 'calculator-open') {
      window.open(`https://www.google.com/search?q=calculator`, '_blank')
    }
    if (type === 'instagram-open') {
      window.open(`https://www.instagram.com/`, '_blank')
    }
    if (type === 'facebook-open') {
      window.open(`https://www.facebook.com/`, '_blank')
    }
    if (type === 'weather-show') {
      window.open(`https://www.google.com/search?q=weather`, '_blank')
    }
    if (type === 'youtube-search' || type === 'youtube-play') {
      const query = encodeURIComponent(userInput)
      window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank')
    }
  }

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.lang = 'en-US'
    recognition.interimResults = false

    recognitionRef.current = recognition
    let isMounted = true

    const startTimeout = setTimeout(() => {
      if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start()
          console.log("Recognition requested to start")
        } catch (error) {
          if (error.name !== "InvalidStateError") {
            console.error("Start error :", error)
          }
        }
      }
    }, 1000)

    recognition.onstart = () => {
      isRecognizingRef.current = true
      setListening(true)
    }

    recognition.onend = () => {
      isRecognizingRef.current = false
      setListening(false)

      if (isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted && !isSpeakingRef.current) {
            try {
              recognition.start()
              console.log("Recognition restarted")
            } catch (error) {
              if (error.name !== "InvalidStateError")
                console.error(error)
            }
          }
        }, 1000)
      }
    }

    recognition.onerror = (event) => {
      console.warn("Recognition error:", event.error)
      isRecognizingRef.current = false
      setListening(false)
      if (event.error !== "aborted" && !isSpeakingRef.current && isMounted) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start()
              console.log("Recognition restarted after error")
            } catch (error) {
              if (error.name !== "InvalidStateError")
                console.error(error)
            }
          }
        }, 1000)
      }
    }

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim()
      console.log("heard: " + transcript)

      if (userData?.assistantName && transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        setAiText("")
        setUserText(transcript)
        recognition.stop()
        isRecognizingRef.current = false
        setListening(false)
        const data = await getGeminiResponse(transcript)
        console.log(data)
        handleCommand(data)
        setAiText(data.response)
        setUserText("")
      }
    }

    if (userData?.name) {
      const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, what can I help you with?`)
      greeting.lang = 'hi-IN'
      window.speechSynthesis.speak(greeting)
    }

    return () => {
      isMounted = false
      clearTimeout(startTimeout)
      recognition.stop()
      setListening(false)
      isRecognizingRef.current = false
    }
  }, [])

  return (
    <div className='w-full h-screen bg-gradient-to-b from-[#03031e] via-[#01012b] to-[#00000a] flex flex-col justify-between items-center p-4 sm:p-6 relative overflow-hidden select-none'>

      {/* Top Navbar Header */}
      <div className='w-full max-w-[1200px] flex justify-between items-center z-10 pt-2 px-2'>
        <div className='flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-md py-1.5 px-4 rounded-full'>
          <span className='w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse'></span>
          <span className='text-xs sm:text-sm font-medium text-gray-300'>
            {userData?.assistantName ? `Assistant: ${userData.assistantName}` : "AI Assistant Active"}
          </span>
        </div>

        {/* Hamburger Menu Toggle */}
        <button 
          onClick={() => setHam(true)}
          className='p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 transition-all hover:scale-105 cursor-pointer'
        >
          <HiMenuAlt3 className='w-6 h-6' />
        </button>
      </div>

      {/* Glassmorphic Sidebar Drawer */}
      <div 
        className={`fixed top-0 right-0 w-[85%] max-w-[340px] h-full bg-black/60 backdrop-blur-xl border-l border-white/10 p-6 flex flex-col justify-between z-50 transition-transform duration-300 shadow-2xl ${
          ham ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div>
          <div className='flex items-center justify-between pb-6 border-b border-white/10 mb-6'>
            <h2 className='text-white font-semibold text-lg flex items-center gap-2'>
              Control Panel
            </h2>
            <button 
              onClick={() => setHam(false)}
              className='p-2 rounded-xl text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer'
            >
              <RxCross2 className="w-5 h-5" />
            </button>
          </div>

          <div className='flex flex-col gap-3'>
            <button 
              className='w-full h-12 flex items-center gap-3 px-4 text-white font-medium bg-white/10 hover:bg-white/15 rounded-2xl border border-white/10 transition-all cursor-pointer' 
              onClick={() => navigate("/customize")}
            >
              <MdTune className='w-5 h-5 text-blue-400' />
              Customize Assistant
            </button>

            <button 
              className="w-full h-12 flex items-center gap-3 px-4 text-red-400 font-medium bg-red-500/10 hover:bg-red-500/20 rounded-2xl border border-red-500/20 transition-all cursor-pointer" 
              onClick={handleLogOut}
            >
              <MdLogout className='w-5 h-5' />
              Log Out
            </button>
          </div>

          {/* History Section */}
          {/* History Section UI */}
<div className="text-white w-full mt-8">
  <h3 className="font-semibold text-sm text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
    <MdOutlineHistory className='w-4 h-4' /> Recent History
  </h3>
  <div className="flex flex-col gap-3 overflow-y-auto max-h-[380px] pr-1">
    {userData?.history && userData.history.length > 0 ? (
      // Array ko reverse karke render karein taaki latest search upar aaye
      [...userData.history].reverse().map((item, index) => (
        <div key={index} className="bg-white/5 p-3 rounded-2xl border border-white/10 flex flex-col gap-2 shadow-inner">
          
          {/* Question Display */}
          <p className="text-xs text-blue-300 font-semibold flex items-start gap-1.5">
            <span className="bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded text-[10px] shrink-0">Q</span>
            <span className="leading-snug">
              {typeof item === 'object' ? item.question : item}
            </span>
          </p>

          {/* Answer Display */}
          {typeof item === 'object' && item.answer && (
            <p className="text-xs text-gray-300 bg-black/40 p-2 rounded-xl flex items-start gap-1.5 border border-white/5">
              <span className="bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded text-[10px] shrink-0">A</span>
              <span className="leading-snug text-gray-300">{item.answer}</span>
            </p>
          )}

        </div>
      ))
    ) : (
      <span className="text-gray-500 text-sm p-2 text-center block">No query history stored</span>
    )}
  </div>
</div>
        </div>
      </div>

      {/* Main Center Content */}
      <div className='flex flex-col items-center justify-center my-auto gap-4 relative z-0'>
        
        {/* Call to action instruction text */}
        <p className='text-gray-400 text-xs sm:text-sm tracking-wide bg-white/5 px-4 py-1.5 rounded-full border border-white/5'>
          Say <span className='text-blue-400 font-semibold'>"{userData?.assistantName || "Assistant"}"</span> followed by your command
        </p>

        {/* Assistant Image & Status Section */}
        {userData?.assistantImage ? (
          <div className='flex flex-col items-center gap-4 mt-2'>
            {/* Main Avatar Container */}
            <div className={`relative w-[210px] h-[290px] sm:w-[240px] sm:h-[330px] rounded-3xl overflow-hidden border-2 transition-all duration-300 ${
              aiText ? "border-blue-400 shadow-2xl shadow-blue-500/40 scale-102" : "border-white/20 shadow-xl shadow-black/80"
            }`}>
              <img src={userData.assistantImage} alt="assistant" className='w-full h-full object-cover' />
            </div>

            {/* Speaking / Listening Interactive Visual Badge */}
            <div className={`w-[75px] h-[75px] sm:w-[90px] sm:h-[90px] rounded-full overflow-hidden border-2 border-white/70 bg-black/60 shadow-xl flex items-center justify-center relative transition-transform duration-300 ${
              listening ? "ring-4 ring-blue-500/40" : ""
            }`}>
              {!aiText && <img src={userImg} alt="listening status" className='w-full h-full object-cover' />}
              {aiText && <img src={aiImg} alt="speaking status" className='w-full h-full object-cover' />}
            </div>
          </div>
        ) : (
          /* Fallback visual state when no image selected */
          <div className='my-6 relative'>
            <div className='w-[140px] sm:w-[180px] rounded-full overflow-hidden border-2 border-white/20 shadow-2xl p-2 bg-black/40'>
              {!aiText && <img src={userImg} alt="user visual" className='w-full h-full object-cover' />}
              {aiText && <img src={aiImg} alt="ai visual" className='w-full h-full object-cover' />}
            </div>
          </div>
        )}

        {/* Subtitle / Transcription Display Container */}
        <div className='min-h-[60px] max-w-[600px] w-full flex items-center justify-center px-4'>
          {(userText || aiText) && (
            <div className='bg-black/40 backdrop-blur-md border border-white/10 px-5 py-3 rounded-2xl shadow-xl text-center animate-fade-in'>
              <p className='text-white text-sm sm:text-base font-medium break-words leading-relaxed flex items-center justify-center gap-2'>
                {userText && <MdMic className='text-blue-400 w-5 h-5 shrink-0 animate-pulse' />}
                {aiText && <MdVolumeUp className='text-emerald-400 w-5 h-5 shrink-0 animate-pulse' />}
                <span>{userText || aiText}</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Branding */}
      <div className='pb-2 text-center z-10'>
        <span className='text-xs text-gray-500 tracking-wider'>Powered by Gemini AI</span>
      </div>
    </div>
  )
}

export default Home
