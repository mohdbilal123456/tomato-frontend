import { createContext } from "react";
import type { AppContextType } from "../types";

export const AuthContext = createContext<AppContextType | null>(null);