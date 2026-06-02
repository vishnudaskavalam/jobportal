import { useNavigate } from 'react-router-dom';
import Button from './Button';

export interface JobApplication {
  userId: string;
  status: string;
  appliedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  category: { id: string; name: string };
  logoColor: string;
  isFeatured?: boolean;
  createdAt: string;
  description?: string;
  JobStatus?: string;
  applications?: JobApplication[];
}

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/jobs/${job.id}`)}
      className="bg-slate-900/40 border border-white/5 p-6 rounded-2xl hover:border-emerald-500/30 hover:bg-slate-900/60 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(16,185,129,0.1)] transition-all duration-300 flex flex-col gap-4 group cursor-pointer"
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg text-white shadow-md"
          style={{ backgroundColor: job.logoColor || '#10B981' }}
        >
          {job.company.charAt(0)}
        </div>
        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-800 border border-white/5 text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
          {job.type.replace('_', ' ')}
        </span>
      </div>

      <div className="flex flex-col gap-1.5 mt-2">
        <h3 className="text-xl font-bold text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-1">{job.title}</h3>
        <p className="text-sm font-semibold text-slate-400">{job.company}</p>
      </div>

      <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mt-2">
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {job.location}
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
        <span className="text-sm font-extrabold text-slate-200">{job.salary}</span>
        <Button variant="link" className="text-xs font-bold group-hover:text-emerald-400">
          View Details →
        </Button>
      </div>
    </div>
  );
}
