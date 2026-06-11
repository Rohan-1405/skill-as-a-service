import React from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
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
        <div style={{ fontFamily: 'Poppins,sans-serif', fontWeight: '700', fontSize: '1.6rem', color: '#fff', marginBottom: '8px' }}>
          Skill<span style={{ color: '#F5A623' }}>AsA</span>Service
        </div>
        <h2 style={{ color: '#fff', marginBottom: '8px', fontFamily: 'Poppins,sans-serif' }}>Welcome Back</h2>
        <p style={{ color: '#A0AABF', marginBottom: '32px' }}>Full Login page builds on Day 2</p>
        <Link to="/register" style={{
          background: 'linear-gradient(135deg,#1E7FE8,#1254B7)',
          color: '#fff', padding: '12px 28px', borderRadius: '12px',
          fontWeight: '600', textDecoration: 'none', display: 'inline-block'
        }}>← Back to Register</Link>
      </div>
    </div>
  );
}