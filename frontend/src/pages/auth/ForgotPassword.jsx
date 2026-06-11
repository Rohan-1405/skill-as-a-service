import React from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#1A1D2E', padding: '20px'
    }}>
      <div style={{
        background: '#232740', border: '1px solid #353A5C',
        borderRadius: '20px', padding: '48px', maxWidth: '440px',
        width: '100%', textAlign: 'center'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔐</div>
        <h2 style={{ color: '#fff', fontFamily: 'Poppins,sans-serif', marginBottom: '8px' }}>Forgot Password</h2>
        <p style={{ color: '#A0AABF', marginBottom: '32px' }}>Full implementation on Day 2</p>
        <Link to="/login" style={{ color: '#4FA3FF', fontWeight: '600', textDecoration: 'none' }}>
          ← Back to Login
        </Link>
      </div>
    </div>
  );
}