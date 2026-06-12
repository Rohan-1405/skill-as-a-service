import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import LoginForm from '../../components/auth/LoginForm';
import SocialLoginButtons from '../../components/auth/SocialLoginButtons';
import logo from '../../assets/logos/logo.png';

const Login = () => {
  const handleSubmit = (data) => {
    console.log('Login submitted:', data);
    // TODO: call authService.login(data.email, data.password)
  };

  const handleSocialLogin = (provider) => {
    console.log('Social login:', provider);
    // TODO: call authService.socialLogin(provider)
  };

  return (
    <AuthLayout>
      {/* Logo */}
      <div className="auth-logo">
        <img src={logo} alt="SkillAsAService" className="auth-logo-img" />
      </div>

      {/* Heading */}
      <div className="auth-heading">
        <h1>Welcome back</h1>
        <p>Sign in to continue your learning journey</p>
      </div>

      {/* Form */}
      <LoginForm onSubmit={handleSubmit} />

      {/* Divider */}
      <div className="auth-divider">
        <div className="auth-divider-line" />
        <span>or continue with</span>
        <div className="auth-divider-line" />
      </div>

      {/* Social login */}
      <SocialLoginButtons onSocialLogin={handleSocialLogin} />

      {/* Sign up link */}
      <div className="auth-signup-row">
        Don't have an account?
        <Link to="/register">Sign up free</Link>
      </div>
    </AuthLayout>
  );
};

export default Login;
