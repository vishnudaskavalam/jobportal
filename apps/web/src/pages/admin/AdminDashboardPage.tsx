import { useGetUserCountQuery } from '../../store/endpoints/usersApi';
import { useGetJobCountQuery } from '../../store/endpoints/jobsApi';

export default function AdminDashboardPage() {
  const { data: totalUser = 0 } = useGetUserCountQuery();
  const { data: totalJob = 0 } = useGetJobCountQuery();

  return (
    <>
        <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-slate-950/50 backdrop-blur-md">
          <h2 className="text-lg font-semibold text-slate-100">Dashboard Overview</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-white/5">
              Admin Account
            </span>
          </div>
        </header>

        <div className="p-6 md:p-8 flex-1 overflow-y-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/5 p-6 rounded-2xl flex flex-col gap-2 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg className="w-16 h-16 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-slate-400">Total Users</span>
              <span className="text-3xl font-extrabold text-slate-100">{totalUser}</span>

            </div>

            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/5 p-6 rounded-2xl flex flex-col gap-2 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg className="w-16 h-16 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-slate-400">Active Jobs</span>
              <span className="text-3xl font-extrabold text-slate-100">{totalJob}</span>

            </div>


          </div>
        </div>
    </>
  );
}
