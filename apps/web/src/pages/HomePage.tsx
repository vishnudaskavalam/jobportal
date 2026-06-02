import { useEffect, useState } from 'react'
// import LoginPage from './pages/LoginPage'
import Header from '../componets/layout/header'
import { useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import axiosInstance from '../api/privateApi';
import JobCard, { type Job } from '../componets/JobCard';
import Footer from '../componets/layout/footer';

export default function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

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

  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/jobs/list`, {params : {isFeatured : true}});
      setFeaturedJobs(response.data.data);
      console.log(response.data.data);
    } catch (error: any) {
      console.error('Failed to fetch jobs:', error);

    }finally {
      setLoading(false);
    }
  };
useEffect(() => {
    fetchJobs();
}, []);
  

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

          
        </section>

        {/* Featured Jobs */}
        <section id="jobs" className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="text-2xl font-bold tracking-tight text-slate-100">Featured Job Openings</h2>
            <button
              type="button"
              onClick={()=>{navigate('/jobs')}}
              className="text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
            >
              View all jobs →
            </button>
          </div>


            {loading ? (
              
                <div  className="px-6 py-12 text-center text-slate-400 justify-">
                  <div className="flex flex-col items-center gap-3">
                    <svg className="w-8 h-8 animate-spin text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle className="opacity-25" cx="12" cy="12" r="10" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Loading jobs...
                  </div>
                
              </div>
            ) : featuredJobs.length === 0 ? (
              <div  className="px-6 py-12 text-center text-slate-400">
                <div className="flex flex-col items-center gap-3">
                  No jobs found matching your criteria.
                </div>
              </div>
        
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {featuredJobs.map((job) => (
                    <JobCard key={job.id} job={job as Job} />
                  ))}
                </div>
            )
              }
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
