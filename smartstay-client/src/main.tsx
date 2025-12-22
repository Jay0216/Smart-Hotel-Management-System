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
import StaffLogin from './pages/StaffLogin.tsx'
import StaffProtectedRoute from './StaffProtectedRoute.tsx'
import ReceptionistProtectedRoute from './ReceptionProtectedRoute.tsx'
import GuestProtectedRoute from './GuestProtectedRoute.tsx'
import AdminProtectedRoute from './AdminProtectedRoute.tsx'

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
    path: '/guestdashboard',
    element: (
    <GuestProtectedRoute>
      <GuestDashboard />
    </GuestProtectedRoute>
  ),
  },

  {
    path: "/admindashboard",
    element: (
    <AdminProtectedRoute>
      <AdminDashboard />
    </AdminProtectedRoute>
    )
  },

  {
    path: "/staffdashboard",
    element: (
      <StaffProtectedRoute>
        <StaffDashboard />
      </StaffProtectedRoute>
    )
  },

  {
    path: "/receptionistdashboard",
    element: (
    <ReceptionistProtectedRoute>
      <ReceptionistDashboard />
    </ReceptionistProtectedRoute>
  )
  },

  {
    path: "/stafflogin",
    element: <StaffLogin/>
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={routes} />
    </Provider>
  </StrictMode>,
)
