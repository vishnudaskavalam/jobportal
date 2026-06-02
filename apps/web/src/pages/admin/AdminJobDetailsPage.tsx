
import { useParams, useNavigate } from 'react-router-dom';
import { useGetJobByIdQuery } from '@store';
import { Button } from '@components';




export default function AdminJobDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: job, isLoading: loading, error: fetchError } = useGetJobByIdQuery(id as string, { skip: !id });
  const error = fetchError ? (fetchError as any)?.data?.message || 'Failed to load job details.' : '';

  if (loading) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-3">
            <svg className="w-8 h-8 animate-spin text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle className="opacity-25" cx="12" cy="12" r="10" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-slate-400 font-medium">Loading job details...</span>
          </div>
        </div>
    );
  }

  if (error || !job) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 min-h-screen">
          <svg className="w-16 h-16 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold text-slate-200">{error || 'Job not found'}</h2>
          <Button 
            onClick={() => navigate('/admin/jobs')}
            variant="secondary"
          >
            Back to Jobs
          </Button>
        </div>
    );
  }

  return (
    <>
        <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-slate-950/50 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => navigate('/admin/jobs')}
              variant="link"
              className="text-slate-400 hover:text-emerald-400"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Button>
            <h2 className="text-lg font-semibold text-slate-100">Job Details</h2>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => navigate(`/admin/jobs/${job.id}/edit`)}
              variant="secondary"
              leftIcon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              }
            >
              Edit Job
            </Button>
          </div>
        </header>

        <div className="p-6 md:p-8 flex flex-col gap-8 max-w-5xl mx-auto w-full">
          
          {/* Header Card */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 relative overflow-hidden">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div 
                className="w-20 h-20 shrink-0 rounded-2xl flex items-center justify-center font-extrabold text-3xl text-white shadow-lg"
                style={{ backgroundColor: job.logoColor || '#10B981' }}
              >
                {job.company.charAt(0)}
              </div>
              
              <div className="flex flex-col gap-2 flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                    {job.type.replace('_', ' ')}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${job.JobStatus === 'OPEN' ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400' : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'}`}>
                    {job.JobStatus}
                  </span>
                  {job.isFeatured && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                      ★ Featured
                    </span>
                  )}
                </div>
                
                <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                  {job.title}
                </h1>
                
                <p className="text-lg font-medium text-slate-300">
                  {job.company}
                </p>

                <div className="flex flex-wrap items-center gap-5 text-sm font-medium text-slate-400 mt-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {job.salary}
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content: Description */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-8">
                <h3 className="text-xl font-bold text-white border-b border-white/5 pb-4 mb-6">Job Description</h3>
                {job.description ? (
                  <div 
                    className="text-slate-300 font-medium leading-relaxed space-y-4 [&>ul]:list-disc [&>ul]:pl-4 [&>ul>li]:mb-2 [&>ol]:list-decimal [&>ol]:pl-4 [&>ol>li]:mb-2 [&>h1]:text-2xl [&>h1]:text-white [&>h1]:mt-6 [&>h1]:mb-4 [&>h2]:text-xl [&>h2]:text-white [&>h2]:mt-5 [&>h2]:mb-3 [&>h3]:text-lg [&>h3]:text-white [&>h3]:mt-4 [&>h3]:mb-2 [&>p]:mb-4 [&>strong]:text-slate-100"
                    dangerouslySetInnerHTML={{ __html: job.description }} 
                  />
                ) : (
                  <p className="text-slate-500 italic">No detailed description provided for this job.</p>
                )}
              </div>
            </div>

            {/* Sidebar: Applications & Quick Stats */}
            <div className="flex flex-col gap-6">
              <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Quick Stats</h3>
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-slate-950/50 border border-white/5">
                    <span className="text-sm font-medium text-slate-400">Total Applications</span>
                    <span className="text-lg font-bold text-emerald-400">{job.applications?.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-slate-950/50 border border-white/5">
                    <span className="text-sm font-medium text-slate-400">Category</span>
                    <span className="text-sm font-bold text-slate-200">{job.category?.name || 'Uncategorized'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 border-b border-white/5 pb-3">Recent Applications</h3>
                {job.applications && job.applications.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {job.applications.slice(0, 5).map((app, index) => (
                      <div key={index} className="flex flex-col p-3 rounded-xl bg-slate-950/50 border border-white/5 group hover:border-emerald-500/20 transition-colors">
                        <div className="flex justify-between items-start mb-1 gap-2">
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-bold text-slate-200 line-clamp-1" title={app.user?.name || 'Unknown User'}>
                              {app.user?.name || 'Unknown User'}
                            </span>
                            <span className="text-xs text-slate-400 line-clamp-1" title={app.user?.email || app.userId}>
                              {app.user?.email || `ID: ${app.userId ? app.userId.substring(0, 8) : 'Unknown'}...`}
                            </span>
                          </div>
                          <span className={`shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded ${app.status === 'APPLIED' ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-800 text-slate-400'}`}>
                            {app.status}
                          </span>
                        </div>
                        <span className="text-xs font-medium text-slate-500">
                          {new Date(app.appliedAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                    {job.applications.length > 5 && (
                      <Button variant="link" className="mt-2 text-sm text-emerald-400 font-semibold hover:text-emerald-300">
                        View all {job.applications.length} applications →
                      </Button>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 font-medium text-center py-6">No applications yet.</p>
                )}
              </div>
            </div>
          </div>

        </div>
    </>
  );
}
