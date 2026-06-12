import React from 'react'
import ThemeToggle from '../ui/ThemeToggle'
import AetherityLogo from '../ui/AetherityLogo'

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const FEATURES = [
  'Intelligent conversations powered by advanced AI',
  'Your chat history, always within reach',
  'Secure, fast, and built for productivity',
]

const AuthLayout = ({ title, subtitle, children, footer }) => {
  return (
    <section className="auth-page min-h-screen bg-app text-app">
      <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
        <ThemeToggle className="rounded-xl border border-app bg-surface/80 shadow-app-sm backdrop-blur-md" />
      </div>

      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col lg:flex-row">
        <div className="auth-left-panel relative flex flex-1 flex-col justify-center overflow-hidden px-6 py-10 sm:py-12 lg:px-12 lg:py-16">
          <div className="auth-grid-pattern pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-accent/[0.08] blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-accent/[0.05] blur-3xl" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.03] blur-3xl" />

          <div className="relative max-w-md animate-fade-in">
            <div className="mb-8">
              <AetherityLogo size="md" />
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-app sm:text-4xl sm:leading-tight">
              {title}
            </h1>
            <p className="mt-4 max-w-sm text-base leading-relaxed text-app-secondary">
              {subtitle}
            </p>

            <div className="mt-12 hidden space-y-3.5 lg:block">
              {FEATURES.map((feature, index) => (
                <div
                  key={feature}
                  className="auth-feature-item flex items-start gap-3"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-light text-accent ring-1 ring-accent/15">
                    <CheckIcon />
                  </div>
                  <p className="text-sm leading-relaxed text-app-secondary">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-12 lg:py-16">
          <div className="auth-card w-full max-w-md animate-fade-in p-7 sm:p-8">
            {children}
            {footer && (
              <div className="auth-card-footer mt-7 border-t border-app pt-6">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default AuthLayout
