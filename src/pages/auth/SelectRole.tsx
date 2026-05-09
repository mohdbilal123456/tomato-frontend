import { useState } from 'react'

import { useNavigate } from 'react-router-dom'
import { authAPI } from '../../services/authApi'
import { useAuth } from '../../hooks/useAuth'

type Role = "customer" | "rider" | "seller" | null

function SelectRole() {

  const [role, setRole] = useState<Role>(null)
  const { setUser, setIsAuth } = useAuth()
  const navigate = useNavigate()

  const roles: Role[] = ["customer", "rider", "seller"]

  const addRole = async()=>{
    try {
      if (!role) return;
      const data = await authAPI.addRole(role)       
      setUser(data.user)
      setIsAuth(true)
      navigate("/")
    } catch (error) {
      console.log("Error",error)
    }
  }

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="w-full max-w-sm space-y-6">
          <h1 className="text-center text-2xl font-bold">Choose your role</h1>

          <div className="space-y-4">
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`
                    w-full rounded-xl cursor-pointer border px-4 py-3 text-sm font-medium capitalize transition ${role === r
                    ? "border-[#E23744] bg-[#E23744] text-white"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }
                    `}
              >
                Continue as {r}
              </button>
            ))}
          </div>
          <button
            disabled={!role}
            onClick={addRole}
            className={`w-full cursor-pointer rounded-xl px-4 py-3 text-sm font-semibold transition ${role
                ? "border-[#E23744] bg-[#E23744] text-white hover:bg[#d32f3a]"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
          >
            Next
          </button>
        </div>
      </div>
    </>
  )
}

export default SelectRole
