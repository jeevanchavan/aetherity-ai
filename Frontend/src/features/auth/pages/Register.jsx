import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import AuthLayout from '../../../components/auth/AuthLayout'
import { useSelector } from 'react-redux'
import { useAuth } from '../hooks/useAuth'

const Register = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const user = useSelector(state => state.auth.user);
  const loading = useSelector(state=> state.auth.loading)
  const error = useSelector(state=> state.auth.error)

  const {handleRegister} = useAuth();

  const navigate = useNavigate()

  const submitForm = async (event) => {
    event.preventDefault()

    const payload = {
      username,
      email,
      password,
    }
    const success = await handleRegister(payload)

    if(success){
      navigate('/check-email',{
        state:{
          email: success.email
        }
      })
    }
  }

  if(!loading && user){
    return <Navigate to="/" replace />
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join Aetherity and start having intelligent conversations today."
      footer={
        <p className="text-center text-sm text-app-secondary">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">
            Sign in
          </Link>
        </p>
      }
    >
      <div className="auth-mobile-heading lg:hidden">
        <h2 className="text-xl font-semibold tracking-tight text-app">Register</h2>
        <p className="mt-1.5 text-sm text-app-secondary">Fill in your details to get started.</p>
      </div>

      <form onSubmit={submitForm} className="auth-form space-y-5">
        <div>
          <label htmlFor="username" className="mb-2 block text-sm font-medium text-app">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Choose a username"
            required
            autoComplete="username"
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-app">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-app">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Create a password"
            required
            autoComplete="new-password"
            className="input-field"
          />
        </div>

        <button type="submit" className="btn-primary cursor-pointer btn-auth w-full">
          Create account
        </button>
      </form>
    </AuthLayout>
  )
}

export default Register
