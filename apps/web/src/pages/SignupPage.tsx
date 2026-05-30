import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom';
import { publicApi } from '../api/publicApi';

interface SignupProps {
  onNavigateToHome: () => void;
}

export default function SignupPage({ onNavigateToHome }: SignupProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Notification states
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!email || !password || !firstName || !lastName || !phone) {
      setStatus('error')
      setMessage('Please fill in all fields.')
      return
    }

    setStatus('loading')
    setMessage('')

    try {
      const response = await publicApi.post('/auth/signup', {
        firstName,
        lastName,
        phone,
        email,
        password
      });

      if (response.status === 201 || response.status === 200) {
        setStatus('success')
        setMessage('Account created successfully! Redirecting to login...')
        setTimeout(() => {
          navigate('/login')
        }, 1500)
      } else {
        setStatus('error')
        setMessage(response.data.message || 'Signup failed. Please try again.')
      }
    } catch (err: any) {
      setStatus('error')
      setMessage(err.response?.data?.message || 'Failed to connect to authentication server.')
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden select-none">
      {/* Background Glow effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-950/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-950/15 blur-[120px] pointer-events-none" />

      {/* Floating Card */}
      <div className="w-full max-w-[480px] bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 sm:p-10 shadow-2xl flex flex-col gap-6 z-10 animate-fade-in-up">
        {/* Header */}
        <div className="text-center flex flex-col items-center">
          <button
            type="button"
            onClick={onNavigateToHome}
            className="group flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-4 shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:bg-emerald-500 hover:text-white transition-all duration-300"
          >
            <svg className="w-6 h-6 stroke-current stroke-2 fill-none group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              <path d="M12 11v6" />
              <path d="M9 14h6" />
            </svg>
          </button>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 mb-1.5">Create Account</h1>
          <p className="text-sm text-slate-400 font-medium">Join JobPortal to find your dream job</p>
        </div>

        {status === 'error' && (
          <div className="flex items-center gap-3 p-3.5 bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl text-sm leading-relaxed animate-shake">
            <svg className="w-5 h-5 shrink-0 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{message}</span>
          </div>
        )}

        {status === 'success' && (
          <div className="flex items-center gap-3 p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-xl text-sm leading-relaxed animate-shake">
            <svg className="w-5 h-5 shrink-0 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>{message}</span>
          </div>
        )}

        {/* Form */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-slate-300 tracking-wide" htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                type="text"
                required
                disabled={status === 'loading'}
                className="w-full h-11 px-4 bg-slate-950 border border-white/5 rounded-xl text-[14px] font-medium text-slate-100 placeholder:text-slate-600 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all duration-300"
                placeholder="First"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-slate-300 tracking-wide" htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                type="text"
                required
                disabled={status === 'loading'}
                className="w-full h-11 px-4 bg-slate-950 border border-white/5 rounded-xl text-[14px] font-medium text-slate-100 placeholder:text-slate-600 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all duration-300"
                placeholder="Last"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-slate-300 tracking-wide" htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              required
              disabled={status === 'loading'}
              className="w-full h-11 px-4 bg-slate-950 border border-white/5 rounded-xl text-[14px] font-medium text-slate-100 placeholder:text-slate-600 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all duration-300"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-slate-300 tracking-wide" htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              required
              disabled={status === 'loading'}
              className="w-full h-11 px-4 bg-slate-950 border border-white/5 rounded-xl text-[14px] font-medium text-slate-100 placeholder:text-slate-600 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all duration-300"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-slate-300 tracking-wide" htmlFor="password">Password</label>
            <div className="relative flex items-center">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                disabled={status === 'loading'}
                className="w-full h-11 pl-4 pr-12 bg-slate-950 border border-white/5 rounded-xl text-[14px] font-medium text-slate-100 placeholder:text-slate-600 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all duration-300"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-4 text-slate-500 hover:text-slate-200 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full h-11 mt-2 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 hover:shadow-[0_4px_25px_rgba(16,185,129,0.25)] hover:-translate-y-0.5 active:translate-y-0.5 disabled:bg-emerald-500/50 disabled:translate-y-0 disabled:shadow-none flex items-center justify-center gap-2 cursor-pointer transition-all duration-300"
          >
            {status === 'loading' ? (
              <>
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle className="opacity-25" cx="12" cy="12" r="10" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Creating Account...</span>
              </>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-sm text-slate-400 mt-1 font-medium">
          Already have an account?
          <button onClick={() => navigate('/login')} className="text-emerald-400 hover:text-emerald-300 font-bold ml-1.5 hover:underline transition-all cursor-pointer">Sign in</button>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  )
}
