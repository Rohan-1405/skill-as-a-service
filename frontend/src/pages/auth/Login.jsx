import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import LoginForm from '../../components/auth/LoginForm';
import SocialLoginButtons from '../../components/auth/SocialLoginButtons';
import logo from '../../assets/logos/logo.png';

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = (data) => {
    // Stub: navigates to dashboard directly (no backend yet)
    // TODO Day 4+: replace with real authService.login(data.email, data.password)
    navigate('/dashboard');
  };

  const handleSocialLogin = (provider) => {
    console.log('Social login:', provider);
    // TODO: wire when Rohan confirms OAuth2 URLs
  };

  return (
    <AuthLayout>
      <div className="auth-logo">
        <img src={logo} alt="SkillAsAService" className="auth-logo-img" />
      </div>

      <div className="auth-heading">
        <h1>Welcome back</h1>
        <p>Sign in to continue your learning journey</p>
      </div>

      <LoginForm onSubmit={handleSubmit} />

      <div className="auth-divider">
        <div className="auth-divider-line" />
        <span>or continue with</span>
        <div className="auth-divider-line" />
      </div>

      <SocialLoginButtons onSocialLogin={handleSocialLogin} />

      <div className="auth-signup-row">
        Don't have an account?
        <Link to="/register">Sign up free</Link>
      </div>
    </AuthLayout>
  );
};

export default Login;
