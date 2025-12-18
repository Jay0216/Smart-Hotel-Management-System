import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import GuestAccountCreation from './pages/GuestAccountCreation.tsx'
import GuestLogin from './pages/GuestLogin.tsx'
import GuestAuthSystem from './pages/GuestAuthSystem.tsx'
import AdminAuthSystem from './pages/AdminAuth.tsx'
import GuestDashboard from './pages/GuestDashboard.tsx'
import AdminDashboard from './pages/AdminDashboard.tsx'
import StaffDashboard from './pages/StaffDashboard.tsx'
import ReceptionistDashboard from './pages/ReceptionistDashboard.tsx'

import { Provider } from 'react-redux';
// @ts-ignore
import { store } from './redux/store.js'

const routes = createBrowserRouter([


  {

    path: "/",
    element: <App />
  },

  {
    path: "/guestauth",
    element: <GuestAuthSystem/>
  },

  {
    path: "/adminauth",
    element: <AdminAuthSystem/>
  },

  {
    path: "/guestdashboard",
    element: <GuestDashboard/>
  },

  {
    path: "/admindashboard",
    element: <AdminDashboard/>
  },

  {
    path: "/staffdashboard",
    element: <StaffDashboard/>
  },

  {
    path: "/receptionistdashboard",
    element: <ReceptionistDashboard/>
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={routes} />
    </Provider>
  </StrictMode>,
)
