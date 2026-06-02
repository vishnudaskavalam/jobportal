import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom';
import { publicApi } from '../../api/publicApi';
import Button from '../../componets/Button';

export default function SignupPage() {
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
    <>
      <div className="text-center flex flex-col items-center -mt-4">
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

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={status === 'loading'}
          className="h-11 mt-2 hover:-translate-y-0.5 active:translate-y-0.5"
        >
          {status === 'loading' ? 'Creating Account...' : 'Sign Up'}
        </Button>
      </form>

      {/* Footer */}
      <div className="text-center text-sm text-slate-400 mt-1 font-medium">
        Already have an account?
        <Button variant="link" onClick={() => navigate('/login')} className="text-emerald-400 hover:text-emerald-300 font-bold ml-1.5 hover:underline">Sign in</Button>
      </div>
    </>
  )
}
