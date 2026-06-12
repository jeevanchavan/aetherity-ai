import React from 'react'

const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mt-0.5 shrink-0">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" x2="12" y1="8" y2="12" />
    <line x1="12" x2="12.01" y1="16" y2="16" />
  </svg>
)

const AuthAlert = ({ message }) => {
  if (!message) return null

  return (
    <div
      role="alert"
      aria-live="polite"
      className="auth-alert animate-fade-in mb-4 flex items-start gap-2.5 rounded-xl px-3.5 py-2.5 text-sm"
    >
      <AlertIcon />
      <span className="leading-snug">{message}</span>
    </div>
  )
}

export default AuthAlert
