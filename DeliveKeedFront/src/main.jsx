import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Info from './pages/Info.jsx'
import Endereco from './pages/Endereco.jsx'
import Pagamento from './pages/Pagamento.jsx'
import Produtos from './pages/Produtos.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/info" element={<Info />} />
        <Route path="/endereco" element={<Endereco />} />
        <Route path="/pagamento" element={<Pagamento />} />
        <Route path="/produtos" element={<Produtos />} />
      </Routes>
    </Router>
  </StrictMode>,
)