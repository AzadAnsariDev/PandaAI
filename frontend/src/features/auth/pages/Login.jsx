import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import { setError, setLoading } from '../authSlice';
import { useAuth } from '../hook/useAuth';

export default function Login() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {handleLogin} = useAuth()


  const onSubmit = async (data) => {
    dispatch(setLoading(true))
    try{
        const response = await handleLogin(data.email, data.password)
        console.log(response)
        navigate('/')
    }catch(err){
        dispatch(setError(setError(err.response?.data?.message || err.message)))
        console.log(err)
    }finally{
        dispatch(setLoading(false))
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 sm:px-6 lg:px-8 py-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-400 text-sm">Sign in to your account</p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 shadow-2xl">
          
          {/* Email Field */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
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
              className={`w-full px-4 py-3 bg-gray-800 border-2 rounded-lg outline-none transition-all duration-300 placeholder-gray-500 text-white ${
                errors.email
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-700 focus:border-yellow-400'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              {...register('password', {
                required: 'Password is required',
                // minLength: {
                //   value: 6,
                //   message: 'Password must be at least 6 characters'
                // }
              })}
              className={`w-full px-4 py-3 bg-gray-800 border-2 rounded-lg outline-none transition-all duration-300 placeholder-gray-500 text-white ${
                errors.password
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-700 focus:border-yellow-400'
              }`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="text-right mb-8">
            <Link to="#" className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors">
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-yellow-400/50"
          >Sign in
          </button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-700"></div>
            <span className="px-3 text-gray-500 text-sm">OR</span>
            <div className="flex-1 border-t border-gray-700"></div>
          </div>

          {/* Register Link */}
          <p className="text-center text-gray-400 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-yellow-400 font-semibold hover:text-yellow-300 transition-colors">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
