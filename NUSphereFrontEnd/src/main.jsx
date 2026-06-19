import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Product } from './UserSpecifics/Product.jsx'
import { Outline } from './Defaults/Outline.jsx'
import { NavigationBar } from './Defaults/Navigation.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NavigationBar />
  </StrictMode>,
)
