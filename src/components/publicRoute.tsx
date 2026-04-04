import { Navigate,Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";


export const PublicRoute =()=>{
  const {isAuth,loading} = useAuth()

  if(loading)return null

  return isAuth ? <Navigate to={"/"} replace />:<Outlet/>

}