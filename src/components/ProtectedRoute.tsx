import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Loader from './Loader'

function ProtectedRoute() {
  const { isAuth, loading, user } = useAuth()
  const location = useLocation()
  if (loading) {
    return <div><Loader/></div>
  }
  
  if (!isAuth) {
    return <Navigate to={"/login"} replace />
  }

  if (!user?.role && location.pathname !== "/select-role") {
    return <Navigate to={"/select-role"} replace />
  }
  if (isAuth && user?.role && location.pathname === "/select-role") {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}

export default ProtectedRoute
