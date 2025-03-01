import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Menu from './pages/_shared/Menu.tsx'
import Empresas from './pages/Empresas.tsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import './main.css';
import NotasFiscais from './pages/NotasFiscais.tsx'
import Carrinhos from './pages/Carrinhos.tsx'
import CarrinhoNotas from './pages/CarrinhoNotas.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Menu />
      <Routes>
        <Route path="/" element={<Empresas />} />
        <Route path="/notafiscal" element={<NotasFiscais />} />
        <Route path="/carrinho" element={<Carrinhos />} />
        <Route path="/carrinho/notasfiscais" element={<CarrinhoNotas />} />
      </Routes>
    </Router>
  </StrictMode>,
)