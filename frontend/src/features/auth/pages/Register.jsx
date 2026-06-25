import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { setError, setLoading } from '../authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../services/auth.service';
import { useAuth } from '../hook/useAuth';
import { useEffect } from 'react';

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


  const onSubmit = async (data) => {
    dispatch(setLoading(true))
    try{
      const response = await handleRegister(data.username, data.email, data.password)
      return response
    }catch(err){
      dispatch(setError(err.response?.data?.message || err.message))
      console.log(err)
    }finally{
      dispatch(setLoading(false))
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent mb-2">
            Get Started
          </h1>
          <p className="text-gray-400 text-sm">Create your account to begin</p>
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

          {/* Username Field */}
          <div className="mb-6">
            <label htmlFor="username" className="block text-sm font-semibold text-gray-300 mb-2">
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
              className={`w-full px-4 py-3 bg-gray-800 border-2 rounded-lg outline-none transition-all duration-300 placeholder-gray-500 text-white ${
                errors.username
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-700 focus:border-yellow-400'
              }`}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-400">{errors.username.message}</p>
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
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
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
            <p className="mt-2 text-xs text-gray-500">
              Must be at least 6 characters long
            </p>
          </div>

          {/* Terms & Conditions */}
          <div className="flex items-start mb-8">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 w-4 h-4 accent-yellow-400 cursor-pointer"
            />
            <label htmlFor="terms" className="ml-2 text-xs text-gray-400">
              I agree to the{' '}
              <Link to="#" className="text-yellow-400 hover:text-yellow-300">
                Terms & Conditions
              </Link>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-yellow-400/50"
          >Sign up
          </button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-700"></div>
            <span className="px-3 text-gray-500 text-sm">OR</span>
            <div className="flex-1 border-t border-gray-700"></div>
          </div>

          {/* Login Link */}
          <p className="text-center text-gray-400 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-yellow-400 font-semibold hover:text-yellow-300 transition-colors">
              Sign in
            </Link>
          </p>
        </form>

        {/* Social Signup (Optional) */}
        <div className="mt-6 flex gap-4">
          <button className="flex-1 py-2 px-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors text-white text-sm font-medium">
            Google
          </button>
          <button className="flex-1 py-2 px-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors text-white text-sm font-medium">
            GitHub
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register
