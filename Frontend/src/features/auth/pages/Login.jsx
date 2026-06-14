import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, Navigate, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import AuthLayout from '../../../components/auth/AuthLayout'
import AuthAlert from '../../../components/auth/AuthAlert'

const Login = () => {
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')

    const user = useSelector(state=> state.auth.user)
    const loading = useSelector(state=> state.auth.loading)
    const error = useSelector(state=> state.auth.error)

    const {handleLogin} = useAuth()

    const navigate = useNavigate();

    const submitForm = async (event) => {
        event.preventDefault()

        const payload = {
            email,
            password,
        }

        const success = await handleLogin(payload);
        
        if(success){
            navigate('/')
        }
    }

    if(!loading && user){
        return <Navigate to="/" replace />
    }

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Sign in to continue your conversations with Aetherity AI."
            footer={
                <p className="text-center text-sm text-app-secondary">
                    Don&apos;t have an account?{' '}
                    <Link to="/register" className="auth-link">
                        Register
                    </Link>
                </p>
            }
        >
            <div className="auth-mobile-heading lg:hidden">
                <h2 className="text-xl font-semibold tracking-tight text-app">Sign in</h2>
                <p className="mt-1.5 text-sm text-app-secondary">Enter your credentials to continue.</p>
            </div>

            <AuthAlert message={error} />

            <form onSubmit={submitForm} className="auth-form space-y-5">
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
                        placeholder="Enter your password"
                        required
                        autoComplete="current-password"
                        className="input-field"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary cursor-pointer btn-auth w-full"
                >
                    {loading ? (
                        <>
                            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            Signing in…
                        </>
                    ) : (
                        'Sign in'
                    )}
                </button>
            </form>
        </AuthLayout>
    )
}

export default Login
