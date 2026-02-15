import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { CartProvider } from './contexts/CartContext.tsx'
import { EquipmentFilterProvider } from './contexts/EquipmentFilterContext.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CartProvider>
      <EquipmentFilterProvider>
        <App />
      </EquipmentFilterProvider>
    </CartProvider>
  </React.StrictMode>,
)
