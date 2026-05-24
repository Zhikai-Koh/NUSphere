import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { CartButton } from './Cart.jsx'
import { Product } from './Product.jsx'
import { Outline } from './Outline.jsx'
import { NavigationBar } from './Navigation.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Outline />
    <NavigationBar />
  </StrictMode>,
)
