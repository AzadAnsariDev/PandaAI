import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate, useParams } from 'react-router';
import { setError, setLoading } from '../authSlice.js';
import { useAuth } from '../hook/useAuth';
import Toast from '../components/Toast';

// Theme tokens - keep these in sync with your Dashboard theme variables
const darkTheme = {
  '--bg-primary': '#14161a',
  '--bg-secondary': '#1b1e22',
  '--bg-hover': '#252a30',
  '--border': '#2a2f36',
  '--text-primary': '#ece9e4',
  '--text-secondary': '#8b8f96',
  '--accent': '#22BFA8',
  '--accent-hover': '#1ba892',
};

const lightTheme = {
  '--bg-primary': '#ffffff',
  '--bg-secondary': '#f6f6f4',
  '--bg-hover': '#ececea',
  '--border': '#e3e3e0',
  '--text-primary': '#1b1c1c',
  '--text-secondary': '#6b6c68',
  '--accent': '#1F9E89',
  '--accent-hover': '#188677',
};

export default function Login() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const {
    register: registerForgot,
    handleSubmit: handleForgotSubmit,
    formState: { errors: forgotErrors, isSubmitting: isForgotSubmitting },
    reset: resetForgotForm,
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      email: ''
    }
  });

  const {
    register: registerReset,
    handleSubmit: handleResetSubmit,
    watch,
    formState: { errors: resetErrors, isSubmitting: isResetSubmitting },
    reset: resetResetForm,
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      newPassword: '',
      confirmPassword: ''
    }
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { token: tokenParam } = useParams();
  const { handleLogin, handleForgotPassword, handleResetPassword } = useAuth();

  const [isDark, setIsDark] = useState(true);
  const [toastMsg, setToastMsg] = useState(null);
  const [toastType, setToastType] = useState('error');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const activeResetToken = tokenParam || new URLSearchParams(location.search).get('token');
  const newPasswordValue = watch('newPassword');

  useEffect(() => {
    if (activeResetToken) {
      setShowResetModal(true);
    }
  }, [activeResetToken]);

  const onSubmit = async (data) => {
    dispatch(setLoading(true));

    try {
      const response = await handleLogin(data.email, data.password);
      if (!response?.success) {
        dispatch(setError("Invalid Credentials"));
        setToastType('error');
        setToastMsg("Invalid credentials. Please try again.");
        return;
      }
      navigate('/');
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      dispatch(setError(message));
      setToastType('error');
      setToastMsg(message || "Something went wrong. Please try again.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const onForgotSubmit = async (data) => {
    try {
      const response = await handleForgotPassword(data.email);
      if (!response?.success) {
        setToastType('error');
        setToastMsg(response?.message || 'Unable to send reset link. Please try again.');
        return;
      }
      setToastType('success');
      setToastMsg(response?.message || 'If your email exists, a reset link has been sent.');
      setShowForgotModal(false);
      resetForgotForm();
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setToastType('error');
      setToastMsg(message || 'Unable to send reset link. Please try again.');
    }
  };

  const onResetSubmit = async (data) => {
    if (!activeResetToken) {
      setToastType('error');
      setToastMsg('Missing reset token. Please open the link from your email again.');
      return;
    }

    try {
      const response = await handleResetPassword(activeResetToken, data.newPassword, data.confirmPassword);
      if (!response?.success) {
        setToastType('error');
        setToastMsg(response?.message || 'Unable to update your password.');
        return;
      }
      setToastType('success');
      setToastMsg(response?.message || 'Password updated successfully. You can sign in now.');
      setShowResetModal(false);
      resetResetForm();
      navigate('/login', { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setToastType('error');
      setToastMsg(message || 'Unable to update your password.');
    }
  };

  return (
    <div
      style={isDark ? darkTheme : lightTheme}
      className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col"
    >
      <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg(null)} />

      <header className="h-16 flex items-center justify-between px-4 md:px-6 shrink-0">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 100 100" className="w-14 h-14 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sigTeal" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#00C896" />
      <stop offset="100%" stopColor="#002d22" />
    </linearGradient>
  </defs>
  
  {/* <!-- Quad-Symmetrical Matrix Blades -->
  <!-- Top Blade --> */}
  <path d="M50,15 L62,35 L50,42 L38,35 Z" fill="url(#sigTeal)" />
  
  {/* <!-- Right Blade --> */}
  <path d="M85,50 L65,62 L58,50 L65,38 Z" fill="url(#sigTeal)" opacity="0.9" />
  
  {/* <!-- Bottom Blade --> */}
  <path d="M50,85 L38,65 L50,58 L62,65 Z" fill="#00C896" />
  
  {/* <!-- Left Blade --> */}
  <path d="M15,50 L35,38 L42,50 L35,62 Z" fill="url(#sigTeal)" opacity="0.7" />

  {/* <!-- Ultra Sharp Core Alignment Rings --> */}
  <circle cx="50" cy="50" r="16" stroke="#00C896" strokeWidth="1.5" strokeDasharray="4 8" opacity="0.5" />
  
  {/* Contrast Ring preventing drop on dark or light canvas */}
  <circle cx="50" cy="50" r="5" fill="#111827" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
  {/* Pure Premium Neon Light Source */}
  <circle cx="50" cy="50" r="3.5" fill="#00ffc4" />
          </svg>
          <span className="text-2xl font-black tracking-wider bg-gradient-to-r from-[#475569] via-[#00C896] to-[#004a37]  dark:from-[#bab7b7] dark:via-[#00C896] dark:to-[#004a37]  bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(0,200,150,0.2)]">
            LUMIS
          </span>
        </div>
        <button
          onClick={() => setIsDark((v) => !v)}
          className="p-2 rounded-full hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.36 6.36l-.7-.7M6.34 6.34l-.7-.7m12.02 0l-.7.7M6.34 17.66l-.7.7M12 7a5 5 0 100 10 5 5 0 000-10z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">
              Welcome Back
            </h1>
            <p className="text-[var(--text-secondary)] text-sm">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-6 md:p-8 shadow-2xl">
            <div className="mb-5">
              <label htmlFor="email" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Please enter a valid email'
                  }
                })}
                className={`w-full px-4 py-3 bg-[var(--bg-primary)] border rounded-lg outline-none transition-colors text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] ${
                  errors.email ? 'border-red-500 focus:border-red-500' : 'border-[var(--border)] focus:border-[var(--accent)]'
                }`}
              />
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-[var(--text-secondary)]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                {...register('password', {
                  required: 'Password is required',
                })}
                className={`w-full px-4 py-3 bg-[var(--bg-primary)] border rounded-lg outline-none transition-colors text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] ${
                  errors.password ? 'border-red-500 focus:border-red-500' : 'border-[var(--border)] focus:border-[var(--accent)]'
                }`}
              />
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-[var(--accent)] text-black font-semibold rounded-lg hover:bg-[var(--accent-hover)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>

            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-[var(--border)]"></div>
              <span className="px-3 text-[var(--text-secondary)] text-sm">OR</span>
              <div className="flex-1 border-t border-[var(--border)]"></div>
            </div>

            <p className="text-center text-[var(--text-secondary)] text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-[var(--accent)] font-semibold hover:text-[var(--accent-hover)] transition-colors">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>

      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">Reset your password</h2>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  Enter your email and we will send a secure reset link.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="rounded-full p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleForgotSubmit(onForgotSubmit)} className="mt-6 space-y-4">
              <div>
                <label htmlFor="forgot-email" className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">
                  Email Address
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  placeholder="you@example.com"
                  {...registerForgot('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Please enter a valid email'
                    }
                  })}
                  className={`w-full px-4 py-3 bg-[var(--bg-primary)] border rounded-lg outline-none transition-colors text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] ${
                    forgotErrors.email ? 'border-red-500 focus:border-red-500' : 'border-[var(--border)] focus:border-[var(--accent)]'
                  }`}
                />
                {forgotErrors.email && (
                  <p className="mt-1.5 text-sm text-red-400">{forgotErrors.email.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isForgotSubmitting}
                className="w-full rounded-lg bg-[var(--accent)] px-4 py-3 font-semibold text-black transition-all hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isForgotSubmitting ? 'Sending...' : 'Send reset link'}
              </button>
            </form>
          </div>
        </div>
      )}

      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">Set a new password</h2>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  Choose a strong password for your account.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowResetModal(false);
                  navigate('/login', { replace: true });
                }}
                className="rounded-full p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleResetSubmit(onResetSubmit)} className="mt-6 space-y-4">
              <div>
                <label htmlFor="new-password" className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">
                  New password
                </label>
                <input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                  {...registerReset('newPassword', {
                    required: 'New password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  className={`w-full px-4 py-3 bg-[var(--bg-primary)] border rounded-lg outline-none transition-colors text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] ${
                    resetErrors.newPassword ? 'border-red-500 focus:border-red-500' : 'border-[var(--border)] focus:border-[var(--accent)]'
                  }`}
                />
                {resetErrors.newPassword && (
                  <p className="mt-1.5 text-sm text-red-400">{resetErrors.newPassword.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirm-password" className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">
                  Confirm password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  {...registerReset('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) => value === newPasswordValue || 'Passwords do not match'
                  })}
                  className={`w-full px-4 py-3 bg-[var(--bg-primary)] border rounded-lg outline-none transition-colors text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] ${
                    resetErrors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-[var(--border)] focus:border-[var(--accent)]'
                  }`}
                />
                {resetErrors.confirmPassword && (
                  <p className="mt-1.5 text-sm text-red-400">{resetErrors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isResetSubmitting}
                className="w-full rounded-lg bg-[var(--accent)] px-4 py-3 font-semibold text-black transition-all hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isResetSubmitting ? 'Updating...' : 'Update password'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}