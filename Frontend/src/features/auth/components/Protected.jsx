import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'


const Protected = ({ children }) => {
    const user = useSelector(state => state.auth.user)
    const loading = useSelector(state => state.auth.loading)

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-app">
                <div className="flex flex-col items-center gap-4 animate-fade-in">
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl shadow-app-md">
                        <img src="/aetherity-logo.svg" alt="Aetherity" className="h-full w-full object-cover" />
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="typing-dot h-2 w-2 rounded-full bg-accent" />
                        <span className="typing-dot h-2 w-2 rounded-full bg-accent" />
                        <span className="typing-dot h-2 w-2 rounded-full bg-accent" />
                    </div>
                    <p className="text-sm text-app-muted">Loading your workspace…</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }


    return children
}

export default Protected
