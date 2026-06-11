import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';

export default function EmailVerify() {
  const [params] = useSearchParams();
  const email = params.get('email') || 'your email';

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#1A1D2E', padding: '20px'
    }}>
      <div style={{
        background: '#232740', border: '1px solid #353A5C',
        borderRadius: '20px', padding: '48px', maxWidth: '460px',
        width: '100%', textAlign: 'center'
      }}>
        <div style={{
          width: '80px', height: '80px',
          background: 'linear-gradient(135deg,#1E7FE8,#1254B7)',
          borderRadius: '50%', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '2rem',
          margin: '0 auto 24px', boxShadow: '0 8px 24px rgba(30,127,232,0.4)'
        }}>✉️</div>
        <h2 style={{ color: '#fff', fontFamily: 'Poppins,sans-serif', marginBottom: '12px' }}>Verify Your Email</h2>
        <p style={{ color: '#A0AABF', marginBottom: '8px' }}>We sent a verification link to:</p>
        <p style={{ color: '#F5A623', fontWeight: '600', marginBottom: '28px' }}>{email}</p>
        <Link to="/login" style={{
          background: 'linear-gradient(135deg,#1E7FE8,#1254B7)',
          color: '#fff', padding: '12px 28px', borderRadius: '12px',
          fontWeight: '600', textDecoration: 'none', display: 'inline-block'
        }}>Go to Login</Link>
      </div>
    </div>
  );
}