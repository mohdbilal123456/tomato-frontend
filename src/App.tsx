import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { PublicRoute } from './components/publicRoute'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './hooks/useAuth'
import Restaurant from './pages/Restaurant/Restaurant'
import Login from './pages/auth/Login'
import Home from './pages/customer/Home'
import SelectRole from './pages/auth/SelectRole'
import Account from './pages/account/Account'
import Loader from './components/common/Loader'

  
function App() {

  const { user,loading } = useAuth()
if (loading) return <Loader />
  return (
    <>
      <Toaster position="top-center" />

      {user && user.role === 'seller' ? (
        <Restaurant />
      ) : (
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path='/login' element={<Login />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path='/' element={<Home />} />
            <Route path='/select-role' element={<SelectRole />} />
            <Route path='/account' element={<Account />} />
          </Route>
        </Routes>
      )}
    </>
  )
}

export default App
