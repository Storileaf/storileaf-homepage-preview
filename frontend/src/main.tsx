import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import './styles/tokens.css'
import './styles/components.css'

const host = document.getElementById('root')
if (!host) throw new Error('StoriLeaf component mount is missing')
createRoot(host).render(<StrictMode><App /></StrictMode>)
