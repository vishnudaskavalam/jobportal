import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../componets/layout/header';
import axiosInstance from '../api/privateApi';

import type { RootState } from '../store/store';
import { logout } from '../store/authSlice';
import Footer from '../componets/layout/footer';
import JobCard, { type Job } from '../componets/JobCard';
import SearchBar from '../componets/SearchBar';
import Dropdown from '../componets/Dropdown';
import Pagination, { type MetaData } from '../componets/Pagination';
import Button from '../componets/Button';



export default function JobsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [meta, setMeta] = useState<MetaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  // Filters & Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('');
  const [location, setLocation] = useState('');
  const [posted, setPosted] = useState('');

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
      const response = await axiosInstance.get('/jobs/list', {
        params: {
          page,
          limit,
          ...(search && { search }),
          ...(category && { category }),
          ...(location && { location }),
          ...(posted && { posted }),
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

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [page, search, category, location, posted]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    setPage(1); // Reset to first page
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
    setPage(1); // Reset to first page
  };

  const handlePostedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPosted(e.target.value);
    setPage(1); // Reset to first page
  };

  const handleSignInClick = () => {
    if (accessToken) {
      dispatch(logout());
      navigate('/login');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-emerald-950/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-slate-900/40 blur-[120px] pointer-events-none" />

      {/* Navigation Header */}
      <Header accessToken={accessToken} onSignInClick={handleSignInClick} />

      <main className="flex-grow flex flex-col gap-10 px-6 max-w-6xl mx-auto w-full py-12 z-10">
        
        {/* Page Header & Filters */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white mb-2">Find Your Dream Job</h1>
            <p className="text-slate-400 font-medium">Browse thousands of open positions matching your skills.</p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-900/60 backdrop-blur-xl border border-white/5 p-4 rounded-2xl w-full">
            <SearchBar
              value={search}
              onChange={handleSearch}
              placeholder="Search titles, companies..."
              className="w-full md:w-1/3"
            />

            <SearchBar
              value={location}
              onChange={handleLocationChange}
              placeholder="Location (e.g. Remote, NY)"
              className="w-full md:w-1/4"
              icon={
                <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
            />

            <div className="w-full md:w-auto flex flex-1 flex-col sm:flex-row gap-4">
              <Dropdown
                value={category}
                onChange={handleCategoryChange}
                options={categories.map((c) => ({ value: c.id, label: c.name }))}
                placeholder="All Categories"
                className="w-full h-12"
              />

              <Dropdown
                value={posted}
                onChange={handlePostedChange}
                options={[
                  { value: '24h', label: 'Past 24 hours' },
                  { value: '1w', label: 'Past week' },
                  { value: '1m', label: 'Past month' },
                ]}
                placeholder="Any Time"
                className="w-full h-12"
              />
            </div>
          </div>
        </div>

        {/* Job Grid */}
        <div className="flex-grow">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-400">
              <svg className="w-10 h-10 animate-spin text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle className="opacity-25" cx="12" cy="12" r="10" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="font-medium">Searching for jobs...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-400 bg-slate-900/30 rounded-2xl border border-dashed border-white/10">
              <svg className="w-12 h-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="font-medium">No jobs found matching your criteria.</p>
              <Button 
                onClick={() => { setSearch(''); setCategory(''); setLocation(''); setPosted(''); setPage(1); }}
                variant="link"
                className="mt-2 text-sm text-emerald-400 font-semibold hover:text-emerald-300"
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && (
          <Pagination meta={meta} onPageChange={setPage} />
        )}

      </main>
      <Footer></Footer>
    </div>
  );
}
