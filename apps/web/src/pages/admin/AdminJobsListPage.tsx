import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/privateApi';
import SearchBar from '../../componets/SearchBar';
import Dropdown from '../../componets/Dropdown';
import Pagination, { type MetaData } from '../../componets/Pagination';
import Button from '../../componets/Button';


interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  category: { id: string; name: string };
  isFeatured: boolean;
  createdAt: string;
}





export default function AdminJobsListPage() {
  const navigate = useNavigate();


  const [jobs, setJobs] = useState<Job[]>([]);
  const [meta, setMeta] = useState<MetaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  
  // Filters & Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('');

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/jobs', {
        params: {
          page,
          limit,
          ...(search && { search }),
          ...(category && { category }),
        }
      });
      setJobs(response.data.data);
      setMeta(response.data.meta);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await axiosInstance.delete(`/jobs/${id}`);
        fetchJobs();
      } catch (error) {
        console.error('Error deleting job:', error);
        alert('Failed to delete job');
      }
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [page, search, category]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // reset to first page on search
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    setPage(1);
  };

  return (
    <>
        <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-slate-950/50 backdrop-blur-md">
          <h2 className="text-lg font-semibold text-slate-100">Jobs Management</h2>
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => navigate('/admin/jobs/new')}
              variant="primary"
              leftIcon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              }>
              Post Job
            </Button>
          </div>
        </header>

        <div className="p-6 md:p-8 flex-1 flex flex-col gap-6 overflow-y-auto">
          
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900/60 backdrop-blur-xl border border-white/5 p-4 rounded-2xl">
            <SearchBar
              value={search}
              onChange={handleSearch}
              placeholder="Search jobs, companies, locations..."
              className="w-full sm:w-96"
            />

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Dropdown
                value={category}
                onChange={handleCategoryChange}
                options={categories.map((c) => ({ value: c.id, label: c.name }))}
                placeholder="All Categories"
                className="w-full sm:w-auto h-11"
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden flex-1 flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-slate-950/50 text-xs uppercase tracking-wider text-slate-400 font-semibold">
                    <th className="px-6 py-4">Job Title</th>
                    <th className="px-6 py-4">Company</th>
                    <th className="px-6 py-4 hidden md:table-cell">Location</th>
                    <th className="px-6 py-4 hidden sm:table-cell">Type</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm font-medium">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center gap-3">
                          <svg className="w-8 h-8 animate-spin text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle className="opacity-25" cx="12" cy="12" r="10" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Loading jobs...
                        </div>
                      </td>
                    </tr>
                  ) : jobs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                        No jobs found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    jobs.map((job) => (
                      <tr key={job.id} className="hover:bg-slate-800/30 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-slate-200 font-bold">{job.title}</span>
                            <span className="text-xs text-slate-500 mt-0.5">{job.category?.name || 'Uncategorized'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-300">{job.company}</td>
                        <td className="px-6 py-4 text-slate-400 hidden md:table-cell">{job.location}</td>
                        <td className="px-6 py-4 hidden sm:table-cell">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-800 border border-white/5 text-xs text-slate-300">
                            {job.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {job.isFeatured ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                              Featured
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              Active
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              onClick={() => navigate(`/admin/jobs/${job.id}`)}
                              title="View Details"
                              variant="secondary"
                              size="icon"
                              className="hover:text-blue-400 hover:border-blue-500/30">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </Button>
                            <Button 
                              onClick={() => navigate(`/admin/jobs/${job.id}/edit`)}
                              variant="secondary"
                              size="icon"
                              className="hover:text-emerald-400 hover:border-emerald-500/30">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </Button>
                            <Button 
                              onClick={() => handleDelete(job.id)}
                              variant="secondary"
                              size="icon"
                              className="hover:text-rose-400 hover:border-rose-500/30">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {!loading && (
              <Pagination meta={meta} onPageChange={setPage} showInfo={true} />
            )}
          </div>
        </div>
    </>
  );
}
