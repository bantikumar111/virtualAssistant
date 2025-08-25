import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom"
import UserContext from './context/UserContext.jsx'

createRoot(document.getElementById('root')).render(
 <BrowserRouter>
 <UserContext>  
  {/* wrap up app for userContext, then anyone who need data they can acccess without prop drilling */}
    <App />
  </UserContext>
  </BrowserRouter>

)
