import { useState } from 'react'
// import LoginPage from './pages/LoginPage'
import Header from '../componets/layout/header'
import { useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { RootState } from '../store/store';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accessToken = useSelector(
    (state:RootState) => state.auth.accessToken,
  );

  let onSignInClick = () => {
    navigate('/login');
  };

  if (accessToken) {
    onSignInClick = () => {
      dispatch(logout());
      navigate('/login');
    }

  }


  const featuredJobs = [
    { id: 1, title: 'Senior Software Engineer', company: 'TechNova Solutions', location: 'San Francisco, CA (Hybrid)', salary: '$140k - $185k', type: 'Full-time', logoColor: 'bg-indigo-500/10 text-indigo-400' },
    { id: 2, title: 'Lead Product Designer', company: 'PixelFlow Studios', location: 'Remote (US/Canada)', salary: '$120k - $155k', type: 'Full-time', logoColor: 'bg-rose-500/10 text-rose-400' },
    { id: 3, title: 'Data Scientist', company: 'Apex Analytics', location: 'New York, NY', salary: '$130k - $160k', type: 'Contract', logoColor: 'bg-amber-500/10 text-amber-400' },
    { id: 4, title: 'DevOps Engineer', company: 'CloudScale Corp', location: 'Austin, TX (On-site)', salary: '$115k - $145k', type: 'Full-time', logoColor: 'bg-emerald-500/10 text-emerald-400' },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-emerald-950/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-slate-900/40 blur-[120px] pointer-events-none" />

      {/* Navigation Header */}
      <Header accessToken={accessToken} onSignInClick={onSignInClick} />
      {/* Hero Section */}
      <main className="flex-grow flex flex-col gap-16 px-6 max-w-6xl mx-auto w-full py-16 sm:py-24 z-10">
        <section className="text-center flex flex-col items-center gap-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full uppercase tracking-wider mb-2">
            ✨ Simplifying the job hunt
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-b from-slate-100 to-slate-400">
            Find the perfect tech job you deserve.
          </h1>
          <p className="text-base sm:text-lg text-slate-400 font-medium leading-relaxed">
            Discover thousands of full-time, remote, and hybrid job opportunities with the world's most innovative tech companies.
          </p>

          {/* Job Search Box */}
          <div className="w-full max-w-2xl bg-slate-900/60 backdrop-blur-md border border-white/5 p-2 rounded-2xl shadow-xl flex flex-col sm:flex-row gap-2 mt-4">
            <div className="flex-grow relative flex items-center">
              <svg className="absolute left-4 w-5 h-5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Job title, keywords, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-12 pl-12 pr-4 bg-transparent text-[15px] font-medium text-slate-100 placeholder:text-slate-600 outline-none"
              />
            </div>
            <button
              type="button"
              // onClick={ }
              className="h-12 bg-emerald-500 text-white font-bold px-8 rounded-xl hover:bg-emerald-600 hover:shadow-lg transition-all flex items-center justify-center cursor-pointer"
            >
              Search Jobs
            </button>
          </div>
        </section>

        {/* Featured Jobs */}
        <section id="jobs" className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="text-2xl font-bold tracking-tight text-slate-100">Featured Job Openings</h2>
            <button
              type="button"
              // onClick={}
              className="text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
            >
              View all jobs →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-slate-900/40 border border-white/5 p-6 rounded-2xl hover:border-emerald-500/20 hover:bg-slate-900/60 hover:shadow-xl transition-all duration-300 flex items-start gap-4 group cursor-pointer"
                // onClick={}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${job.logoColor} font-bold text-lg`}>
                  {job.company.charAt(0)}
                </div>
                <div className="flex-grow flex flex-col gap-1.5">
                  <span className="text-[13px] font-bold text-emerald-400 tracking-wide uppercase">{job.type}</span>
                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">{job.title}</h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-slate-400">
                    <span>{job.company}</span>
                    <span className="text-slate-700">•</span>
                    <span>{job.location}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-300 mt-1">{job.salary}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-white/5 px-6 py-8 text-center text-sm font-medium text-slate-500">
        <p>© {new Date().getFullYear()} JobPortal. All rights reserved.</p>
      </footer>
    </div>
  )
}
