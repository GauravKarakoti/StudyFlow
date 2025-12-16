import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from "./hooks/useAuth.tsx"
import ErrorBoundary from "./components/ErrorBoundary.tsx"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ErrorBoundary>
        <AuthProvider>
            <App />
        </AuthProvider>
      </ErrorBoundary>
    </GoogleOAuthProvider>
  </React.StrictMode>,
)