import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  BookOpen,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  Zap,
  TrendingUp,
  Globe,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

const AuthPage = () => {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loadingAction, setLoadingAction] = useState(false);

  const { loginWithEmail, signupWithEmail, loginWithGoogle, loginAsGuest } = useAuth();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoadingAction(true);

    try {
      if (mode === 'signup') {
        await signupWithEmail({ name, email, password });
      } else {
        await loginWithEmail({ email, password });
      }
    } catch (err) {
      console.error('Email Auth Error:', err);
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleGoogleClick = async () => {
    setError('');
    setLoadingAction(true);

    try {
      await loginWithGoogle();
    } catch (err) {
      console.error('Google Sign-In Error:', err);
      setError(err.message || 'Google sign-in was cancelled or encountered an error.');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleGuestClick = () => {
    loginAsGuest();
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem 1rem',
        background: 'radial-gradient(circle at 15% 20%, rgba(99, 102, 241, 0.12), transparent 40%), radial-gradient(circle at 85% 80%, rgba(139, 92, 246, 0.12), transparent 40%), var(--bg-primary)',
        fontFamily: "'Calibri', 'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1020px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'center',
        }}
      >
        {/* Left Side: Brand Highlights & Features */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', padding: '0.5rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(99, 102, 241, 0.35)',
                }}
              >
                <BookOpen size={24} color="#ffffff" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.65rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#ffffff' }}>
                  Khatabook
                </span>
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    background: 'rgba(99, 102, 241, 0.18)',
                    color: '#a5b4fc',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '999px',
                    border: '1px solid rgba(99, 102, 241, 0.35)',
                  }}
                >
                  PWA 2.0
                </span>
              </div>
            </div>

            <h1
              style={{
                fontSize: '2.25rem',
                fontWeight: 900,
                lineHeight: 1.2,
                color: '#ffffff',
                marginBottom: '0.75rem',
              }}
            >
              Take Complete Control of Your Daily Finances.
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Track daily income & expenses, visualize deep monthly cash flows, and sync data seamlessly offline and online.
            </p>
          </div>

          {/* Feature List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'rgba(16, 185, 129, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-income)',
                  flexShrink: 0,
                }}
              >
                <Globe size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  Multi-Currency Ledger
                </h4>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '0.15rem 0 0 0' }}>
                  Default Indian Rupee (₹ INR) with on-the-fly conversion to USD, EUR, GBP, and AED.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'rgba(99, 102, 241, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-accent)',
                  flexShrink: 0,
                }}
              >
                <Zap size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  100% Offline PWA & Sync
                </h4>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '0.15rem 0 0 0' }}>
                  Record transactions without internet; automatically synchronizes in chunks when back online.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'rgba(245, 158, 11, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-warning)',
                  flexShrink: 0,
                }}
              >
                <ShieldCheck size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  Bcrypt Password Security & Google OAuth
                </h4>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '0.15rem 0 0 0' }}>
                  Hashed with Bcrypt (salt rounds 10) or instant 1-click Google authentication.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Authentication Form Card */}
        <div
          className="glass-card animate-scale-in"
          style={{
            padding: '2rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 20px 45px rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(20px)',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
          }}
        >
          {/* Form Header & Segmented Tab Switcher */}
          <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0 0 0.35rem 0', color: '#ffffff' }}>
              {mode === 'login' ? 'Sign In to Your Ledger' : 'Create Free Account'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              {mode === 'login'
                ? 'Enter your credentials to access your financial records'
                : 'Get started in seconds with Google or email'}
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.35rem',
                backgroundColor: 'var(--bg-surface)',
                padding: '0.35rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                marginTop: '1.25rem',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
                style={{
                  padding: '0.55rem',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  backgroundColor: mode === 'login' ? 'var(--color-accent)' : 'transparent',
                  color: mode === 'login' ? '#ffffff' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease',
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError('');
                }}
                style={{
                  padding: '0.55rem',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  backgroundColor: mode === 'signup' ? 'var(--color-accent)' : 'transparent',
                  color: mode === 'signup' ? '#ffffff' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease',
                }}
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--color-expense-subtle)',
                border: '1px solid rgba(244, 63, 94, 0.35)',
                color: 'var(--color-expense)',
                fontSize: '0.825rem',
                fontWeight: 600,
                marginBottom: '1.25rem',
              }}
            >
              {error}
            </div>
          )}

          {/* Option 1: Continue with Google Button */}
          <button
            type="button"
            onClick={handleGoogleClick}
            disabled={loadingAction}
            className="btn"
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              backgroundColor: '#ffffff',
              color: '#1f2937',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              fontWeight: 700,
              fontSize: '0.925rem',
              borderRadius: 'var(--radius-sm)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.18)',
              border: 'none',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <GoogleIcon />
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.25rem 0' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: 600,
              }}
            >
              or continue with email
            </span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
          </div>

          {/* Option 2: Email & Password Form */}
          <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {mode === 'signup' && (
              <div>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    marginBottom: '0.35rem',
                  }}
                >
                  <User size={14} />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Krish Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>
            )}

            <div>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  marginBottom: '0.35rem',
                }}
              >
                <Mail size={14} />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.35rem',
                }}
              >
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                  }}
                >
                  <Lock size={14} />
                  <span>Password</span>
                </label>
                {mode === 'signup' && (
                  <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>
                    🔒 Bcrypt Encrypted
                  </span>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder={mode === 'signup' ? 'Create a secure password (min 6 chars)' : '••••••••'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  style={{ paddingRight: '2.5rem', width: '100%', boxSizing: 'border-box' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loadingAction}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.85rem',
                fontWeight: 700,
                fontSize: '0.95rem',
                marginTop: '0.5rem',
              }}
            >
              {loadingAction
                ? 'Processing...'
                : mode === 'signup'
                ? 'Create Free Account'
                : 'Sign In to Khatabook'}
            </button>
          </form>

          {/* Bottom Switcher */}
          <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            {mode === 'login' ? (
              <span>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setError('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-accent)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Sign Up
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-accent)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Sign In
                </button>
              </span>
            )}
          </div>

          {/* Guest / Demo Option */}
          <div
            style={{
              marginTop: '1.25rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-subtle)',
              textAlign: 'center',
            }}
          >
            <button
              type="button"
              onClick={handleGuestClick}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'color 0.2s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = '#ffffff')}
              onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              <span>Explore demo dashboard as guest</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
