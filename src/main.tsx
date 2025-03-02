import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes, createBrowserRouter, RouterProvider } from 'react-router-dom'
import Menu from './pages/_shared/Menu.tsx'
import Empresas from './pages/Empresas.tsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import './main.css';
import NotasFiscais from './pages/NotasFiscais.tsx'
import Carrinhos from './pages/Carrinhos.tsx'
import CarrinhoNotas from './pages/CarrinhoNotas.tsx'
import App from './App.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Empresas />,
      },
      {
        path: '/notafiscal',
        element: <NotasFiscais />,
      },
      {
        path: '/carrinho',
        element: <Carrinhos />,        
      },
      {
        path: '/carrinho/notasfiscais',
        element: <CarrinhoNotas />,
      }
    ]
  },
  
])
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)