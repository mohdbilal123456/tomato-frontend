import { Routes, Route, Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import { PublicRoute } from './components/publicRoute'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './hooks/useAuth'

import Login from './pages/auth/Login'
import Home from './pages/customer/Home'
import SelectRole from './pages/auth/SelectRole'
import Account from './pages/account/Account'
import Loader from './components/common/Loader'
import Restaurant from './pages/restaurant/Restaurant'
import RestaurantDetails from './pages/restaurant/RestaurantDetails'
import Navbar from './components/common/Navbar'
import Cart from './pages/restaurant/Cart'

function PrivateLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

function App() {
  const { user, loading } = useAuth()

  if (loading) return <Loader />

  return (
    <>
      <Toaster position="top-center" />

      {user && user.role === 'seller' ? (
        <Restaurant />
      ) : (
        <Routes>

          {/* Public Routes */}
          <Route element={<PublicRoute />}>
            <Route path='/login' element={<Login />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>

            {/* Navbar only in private routes */}
            <Route element={<PrivateLayout />}>
              <Route path='/' element={<Home />} />
              <Route path='/select-role' element={<SelectRole />} />
              <Route path='/account' element={<Account />} />
              <Route path='/restaurant/:id' element={<RestaurantDetails />} />
              <Route path='/cart' element={<Cart/>} />
            </Route>

          </Route>

        </Routes>
      )}
    </>
  )
}

export default App