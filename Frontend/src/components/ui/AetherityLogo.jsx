import React from 'react'

const AetherityLogo = ({ size = 'md', showWordmark = true, className = '' }) => {
  const sizes = {
    sm: { icon: 'h-8 w-8', text: 'text-sm' },
    md: { icon: 'h-9 w-9', text: 'text-base' },
    lg: { icon: 'h-14 w-14', text: 'text-2xl' },
  }

  const { icon, text } = sizes[size] || sizes.md

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src="/aetherity-logo.svg"
        alt="Aetherity"
        className={`${icon} shrink-0 rounded-xl shadow-app-sm`}
      />
      {showWordmark && (
        <span className={`${text} font-semibold tracking-tight text-app`}>Aetherity</span>
      )}
    </div>
  )
}

export default AetherityLogo
