import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google'; // [!code ++]
import { AuthProvider } from "./hooks/useAuth.tsx"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}> {/* [!code ++] */}
        <AuthProvider>
            <App />
        </AuthProvider>
    </GoogleOAuthProvider> {/* [!code ++] */}
  </React.StrictMode>,
)