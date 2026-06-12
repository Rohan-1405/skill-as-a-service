// ============================================================
// SkillAsAService — App.js (Merged)
// Authors: Praveen Gorla (Register, routes, guards)
//          Lohith (Auth system, components, design tokens)
// ============================================================

import React, { Suspense, lazy } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/main.css';

// ---- Page Loading Fallback using design-system tokens ----
function PageLoader() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-bg)',
      flexDirection: 'column',
      gap: '16px',
      fontFamily: 'var(--font-family)',
    }}>
      <div style={{
        width: 44, height: 44,
        border: '3px solid var(--color-primary-light)',
        borderTopColor: 'var(--color-primary)',
        borderRadius: '50%',
        animation: 'pageloader-spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes pageloader-spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', margin: 0 }}>
        Loading SkillAsAService...
      </p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
          <AppRoutes />
        </Suspense>

        <ToastContainer
          position="top-right"
          autoClose={3500}
          hideProgressBar={false}
          theme="dark"
          toastStyle={{
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text)',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-family)',
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
