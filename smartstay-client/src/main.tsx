import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import GuestAccountCreation from './pages/GuestAccountCreation.tsx'
import GuestLogin from './pages/GuestLogin.tsx'
import GuestAuthSystem from './pages/GuestAuthSystem.tsx'


const routes = createBrowserRouter([


  {

    path: "/",
    element: <App />
  },

  {
    path: "/guestauth",
    element: <GuestAuthSystem/>
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={routes}/>
  </StrictMode>,
)
