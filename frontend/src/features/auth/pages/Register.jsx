import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { setError, setLoading } from '../authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../services/auth.service';
import { useAuth } from '../hook/useAuth';
import { useEffect } from 'react';
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

function Register() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      username: '',
      password: ''
    }
  });

  const dispatch = useDispatch()
  const {handleRegister} = useAuth()
  const navigate = useNavigate
  const user = useSelector((state)=> state.auth.user)

  // UI-only state - theme toggle + feedback toast ({ message, type })
  const [isDark, setIsDark] = useState(true);
  const [toast, setToast] = useState(null);

  const onSubmit = async (data) => {
    dispatch(setLoading(true))
    try{
      const response = await handleRegister(data.username, data.email, data.password)
      if (response?.success) {
        setToast({
          type: "success",
          message: `Verification email sent to ${data.email}. Please check your inbox to verify your account.`,
        });
      } else {
        const message = response?.message || "Invalid credentials. Please try again"
        dispatch(setError(message))
        setToast({ type: "error", message }) // shows the actual reason, e.g. "User already exists"
      }
      return response
    }catch(err){
      const message = err.response?.data?.message || err.message
      dispatch(setError(message))
      setToast({ type: "error", message: message || "Invalid credentials. Please try again" }) // shows the popup
      console.log(err)
    }finally{
      dispatch(setLoading(false))
    }
  };

  return (
    <div
      style={isDark ? darkTheme : lightTheme}
      className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col"
    >
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      {/* Header */}
      <header className="h-16 flex items-center justify-between px-4 md:px-6 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center font-bold text-black">
            P
          </div>
          <span className="font-semibold text-[15px]">PandaAI</span>
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

      {/* Centered form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">
              Get Started
            </h1>
            <p className="text-[var(--text-secondary)] text-sm">Create your account to begin</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-6 md:p-8 shadow-2xl">

            {/* Email Field */}
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

            {/* Username Field */}
            <div className="mb-5">
              <label htmlFor="username" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="Choose a username"
                {...register('username', {
                  required: 'Username is required',
                  minLength: {
                    value: 3,
                    message: 'Username must be at least 3 characters'
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9_-]+$/,
                    message: 'Username can only contain letters, numbers, hyphens and underscores'
                  }
                })}
                className={`w-full px-4 py-3 bg-[var(--bg-primary)] border rounded-lg outline-none transition-colors text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] ${
                  errors.username ? 'border-red-500 focus:border-red-500' : 'border-[var(--border)] focus:border-[var(--accent)]'
                }`}
              />
              {errors.username && (
                <p className="mt-1.5 text-sm text-red-400">{errors.username.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                className={`w-full px-4 py-3 bg-[var(--bg-primary)] border rounded-lg outline-none transition-colors text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] ${
                  errors.password ? 'border-red-500 focus:border-red-500' : 'border-[var(--border)] focus:border-[var(--accent)]'
                }`}
              />
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-400">{errors.password.message}</p>
              )}
              <p className="mt-2 text-xs text-[var(--text-secondary)]">
                Must be at least 6 characters long
              </p>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start mb-7">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 w-4 h-4 accent-[var(--accent)] cursor-pointer"
              />
              <label htmlFor="terms" className="ml-2 text-xs text-[var(--text-secondary)]">
                I agree to the{' '}
                <Link to="#" className="text-[var(--accent)] hover:text-[var(--accent-hover)]">
                  Terms & Conditions
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-[var(--accent)] text-black font-semibold rounded-lg hover:bg-[var(--accent-hover)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating account...' : 'Sign up'}
            </button>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-[var(--border)]"></div>
              <span className="px-3 text-[var(--text-secondary)] text-sm">OR</span>
              <div className="flex-1 border-t border-[var(--border)]"></div>
            </div>

            {/* Login Link */}
            <p className="text-center text-[var(--text-secondary)] text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-[var(--accent)] font-semibold hover:text-[var(--accent-hover)] transition-colors">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register