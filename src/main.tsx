import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthProvider.tsx';
import { BrowserRouter } from 'react-router-dom';
import { GOOGLE_CLIENT_ID } from './config/env.ts';


createRoot(document.getElementById('root')!).render(
  <>
    <BrowserRouter>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </>
)
