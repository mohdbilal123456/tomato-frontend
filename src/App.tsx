import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import { Toaster } from 'react-hot-toast'
import { PublicRoute } from './components/publicRoute'
import ProtectedRoute from './components/protectedRoute'
import SelectRole from './pages/SelectRole'

function App() {
  return (

    <>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path='/login' element={<Login />} />
        </Route>

        <Route element={<ProtectedRoute/>}>
          <Route path='/' element={<Home />} />
          <Route path='/select-role' element={<SelectRole/>} />
        </Route>
      </Routes>
      <Toaster />
    </>
  )
}

export default App
