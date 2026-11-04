import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'
import { Capacitor, SystemBars, SystemBarsStyle } from '@capacitor/core'

if (Capacitor.isNativePlatform()) {
  // White header -> dark status bar icons
  SystemBars.setStyle({ style: SystemBarsStyle.Light }).catch(() => {})
}

createRoot(document.getElementById('root')).render(
  <App />
)
