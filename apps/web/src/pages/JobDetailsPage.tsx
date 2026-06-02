import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Header from '../componets/layout/header';
import axiosInstance from '../api/privateApi';

import type { RootState } from '../store/store';
import { logout } from '../store/authSlice';
import Footer from '../componets/layout/footer';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  category: { id: string; name: string };
  logoColor: string;
  isFeatured: boolean;
  createdAt: string;
  applications?: any[];
  description?: string;
}

export default function JobDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applyStatus, setApplyStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/jobs/${id}`);
      setJob(response.data);
    } catch (error) {
      console.error('Failed to fetch job details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!accessToken) {
      navigate('/login');
      return;
    }

    setApplyStatus('loading');
    setMessage('');
    
    try {
      await axiosInstance.post(`/jobs/${id}/apply`,);
      setApplyStatus('success');
      setMessage('Successfully applied for this position!');
    } catch (error: any) {
      setApplyStatus('error');
      setMessage(error.response?.data?.message || 'Failed to apply. You may have already applied.');
    }
  };

  const handleSignInClick = () => {
    if (accessToken) {
      dispatch(logout());
      navigate('/login');
    } else {
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-emerald-500">
          <svg className="w-12 h-12 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle className="opacity-25" cx="12" cy="12" r="10" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-slate-400 font-medium">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-6">
        <svg className="w-16 h-16 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h2 className="text-2xl font-bold text-slate-100">Job Not Found</h2>
        <button 
          onClick={() => navigate('/jobs')}
          className="px-6 py-2.5 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-colors"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-emerald-950/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-slate-900/40 blur-[120px] pointer-events-none" />

      {/* Navigation Header */}
      <Header accessToken={accessToken} onSignInClick={handleSignInClick} />

      <main className="flex-grow max-w-4xl mx-auto w-full px-6 py-12 md:py-20 z-10 flex flex-col gap-10">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-emerald-400 w-fit transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to listings
        </button>

        {/* Job Header Card */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 md:p-12 relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <svg className="w-48 h-48" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start justify-between">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div 
                className="w-20 h-20 shrink-0 rounded-2xl flex items-center justify-center font-extrabold text-3xl text-white shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
                style={{ backgroundColor: job.logoColor || '#10B981' }}
              >
                {job.company.charAt(0)}
              </div>
              
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <span className="inline-flex items-center px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    {job.type.replace('_', ' ')}
                  </span>
                  {job.isFeatured && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-400 uppercase tracking-wider">
                      ★ Featured
                    </span>
                  )}
                </div>
                
                <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  {job.title}
                </h1>
                
                <p className="text-lg font-medium text-slate-300">
                  {job.company}
                </p>

                <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-400 mt-2">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {job.salary}
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Posted on {new Date(job.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end w-full md:w-auto shrink-0 mt-4 md:mt-0">
              <button 
                onClick={handleApply}
                disabled={applyStatus === 'loading' || applyStatus === 'success'}
                className="w-full md:w-auto px-8 h-12 bg-emerald-500 text-white rounded-xl font-bold text-sm tracking-wide hover:bg-emerald-600 hover:shadow-[0_4px_25px_rgba(16,185,129,0.25)] hover:-translate-y-0.5 active:translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:transform-none disabled:shadow-none flex items-center justify-center gap-2"
              >
                {applyStatus === 'loading' && (
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle className="opacity-25" cx="12" cy="12" r="10" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {applyStatus === 'success' ? '✓ Applied' : 'Apply Now'}
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        {message && (
          <div className={`p-4 rounded-xl border flex items-center gap-3 font-medium text-sm ${
            applyStatus === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
              : 'bg-red-500/10 border-red-500/20 text-red-300'
          }`}>
            <span className="shrink-0">
              {applyStatus === 'success' ? '🎉' : '⚠️'}
            </span>
            {message}
          </div>
        )}

        {/* Job Description */}
        <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-8 md:p-12 flex flex-col gap-8">
          <section className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-white border-b border-white/5 pb-3">About The Role</h3>
            {job.description ? (
              <div 
                className="text-slate-400 font-medium leading-relaxed space-y-4 [&>ul]:list-disc [&>ul]:pl-4 [&>ul>li]:mb-2 [&>ol]:list-decimal [&>ol]:pl-4 [&>ol>li]:mb-2 [&>h1]:text-2xl [&>h1]:text-white [&>h1]:mt-6 [&>h1]:mb-4 [&>h2]:text-xl [&>h2]:text-white [&>h2]:mt-5 [&>h2]:mb-3 [&>h3]:text-lg [&>h3]:text-white [&>h3]:mt-4 [&>h3]:mb-2 [&>p]:mb-4 [&>strong]:text-slate-200"
                dangerouslySetInnerHTML={{ __html: job.description }} 
              />
            ) : (
              <div className="text-slate-400 font-medium leading-relaxed space-y-4">
                <p>
                  We are looking for a highly skilled professional to join our fast-growing team at {job.company}. 
                  As a {job.title}, you will be responsible for leading key initiatives, collaborating with cross-functional teams, 
                  and driving the success of our core projects.
                </p>
                <p>
                  This is a fantastic opportunity to work in a dynamic environment, utilizing cutting-edge technologies 
                  and contributing to products that impact millions of users. If you are passionate about excellence and innovation, 
                  we want to hear from you.
                </p>
              </div>
            )}
          </section>
        </div>

      </main>
      <Footer></Footer>
    </div>
  );
}
