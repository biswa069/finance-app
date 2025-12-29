import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

// --- STYLING IMPORTS ---
// 1. Load Bootstrap FIRST (Fixes the "Raw HTML" look)
import 'bootstrap/dist/css/bootstrap.min.css';
// 2. Load your custom skin SECOND (Overrides Bootstrap)
import './index.css'; 

// --- PROVIDERS ---
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'; // Using your JWT Context

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Wrap App in AuthProvider so login state works everywhere */}
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>,
)