import type { ReactNode } from "react";

export interface User {
  _id:string,
  name: string,
  email: string,
  image?: string,
  role: string
}

export interface LocationData{
  latitude:number,
  longitude:number,
  formattedAddress:string
}

export interface AppContextType {
  user: User | null;
  loading: boolean;
  isAuth: boolean;

  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;

  loginWithGoogle: (code: string) => Promise<void>;

  location: LocationData | null;
  loadingLocation: boolean; // ✅ fix
  setLoadingLocation: React.Dispatch<React.SetStateAction<boolean>>;

  city: string;
}
export type Role = "customer" | "rider" | "seller";


export type Props = {
  children: ReactNode;
};