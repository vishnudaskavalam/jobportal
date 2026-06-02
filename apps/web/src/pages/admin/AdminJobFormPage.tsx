import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosInstance from '../../api/privateApi';
import Button from '../../componets/Button';

import type { RootState } from '../../store/store';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

// We must manually duplicate JobType enum since it's defined in api/src/jobs/entities/job.entity.ts
// In a real monorepo, we'd move JobType to @jobportal/types to share it.
export const JobType = {
  FULL_TIME: 'FULL_TIME',
  PART_TIME: 'PART_TIME',
  CONTRACT: 'CONTRACT',
  INTERNSHIP: 'INTERNSHIP',
} as const;
export type JobType = typeof JobType[keyof typeof JobType];

export default function AdminJobFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
    }
  }, [accessToken, navigate]);

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    type: JobType.FULL_TIME,
    categoryId: '',
    logoColor: '#10B981',
    isFeatured: false,
    description: '',
  });

  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCategories();
    if (isEditMode) {
      fetchJobDetails();
    }
  }, [isEditMode, id]);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/categories');
      setCategories(response.data);
      if (!isEditMode && response.data.length > 0) {
        setFormData(prev => ({ ...prev, categoryId: response.data[0].id }));
      }
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  };

  const fetchJobDetails = async () => {
    setStatus('loading');
    try {
      const response = await axiosInstance.get(`/jobs/${id}`);
      const job = response.data;
      setFormData({
        title: job.title || '',
        company: job.company || '',
        location: job.location || '',
        salary: job.salary || '',
        type: job.type || JobType.FULL_TIME,
        categoryId: job.category?.id || '',
        logoColor: job.logoColor || '#10B981',
        isFeatured: job.isFeatured || false,
        description: job.description || '',
      });
      setStatus('idle');
    } catch (error: any) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Failed to load job details.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, description: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      if (isEditMode) {
        await axiosInstance.patch(`/jobs/${id}`, formData);
        setMessage('Job updated successfully!');
      } else {
        await axiosInstance.post('/jobs', formData);
        setMessage('Job created successfully!');
      }
      setStatus('success');
      
      setTimeout(() => {
        navigate('/admin/jobs');
      }, 1500);
    } catch (error: any) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'An error occurred while saving the job.');
    }
  };

  return (
    <>
        <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-slate-950/50 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => navigate('/admin/jobs')}
              variant="secondary"
              size="icon"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            <h2 className="text-lg font-semibold text-slate-100">
              {isEditMode ? 'Edit Job' : 'Create New Job'}
            </h2>
          </div>
        </header>

        <div className="p-6 md:p-8 flex-1 overflow-y-auto flex justify-center">
          <div className="w-full max-w-3xl">
            {status === 'error' && (
              <div className="mb-6 flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl text-sm leading-relaxed">
                <svg className="w-5 h-5 shrink-0 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{message}</span>
              </div>
            )}

            {status === 'success' && (
              <div className="mb-6 flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-xl text-sm leading-relaxed">
                <svg className="w-5 h-5 shrink-0 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span>{message} Redirecting...</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-slate-900/60 backdrop-blur-xl border border-white/5 p-6 sm:p-8 rounded-2xl flex flex-col gap-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-slate-300 tracking-wide" htmlFor="title">Job Title</label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    disabled={status === 'loading'}
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Senior Frontend Developer"
                    className="w-full h-11 px-4 bg-slate-950 border border-white/5 rounded-xl text-sm font-medium text-slate-100 placeholder:text-slate-600 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                  />
                </div>

                {/* Company */}
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-slate-300 tracking-wide" htmlFor="company">Company Name</label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    required
                    disabled={status === 'loading'}
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="e.g. TechCorp Inc."
                    className="w-full h-11 px-4 bg-slate-950 border border-white/5 rounded-xl text-sm font-medium text-slate-100 placeholder:text-slate-600 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                  />
                </div>

                {/* Location */}
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-slate-300 tracking-wide" htmlFor="location">Location</label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    required
                    disabled={status === 'loading'}
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. New York, NY (Remote)"
                    className="w-full h-11 px-4 bg-slate-950 border border-white/5 rounded-xl text-sm font-medium text-slate-100 placeholder:text-slate-600 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                  />
                </div>

                {/* Salary */}
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-slate-300 tracking-wide" htmlFor="salary">Salary Range</label>
                  <input
                    id="salary"
                    name="salary"
                    type="text"
                    required
                    disabled={status === 'loading'}
                    value={formData.salary}
                    onChange={handleChange}
                    placeholder="e.g. $120k - $150k"
                    className="w-full h-11 px-4 bg-slate-950 border border-white/5 rounded-xl text-sm font-medium text-slate-100 placeholder:text-slate-600 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                  />
                </div>

                {/* Job Type */}
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-slate-300 tracking-wide" htmlFor="type">Job Type</label>
                  <select
                    id="type"
                    name="type"
                    required
                    disabled={status === 'loading'}
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full h-11 px-4 bg-slate-950 border border-white/5 rounded-xl text-sm font-medium text-slate-100 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all cursor-pointer"
                  >
                    {Object.values(JobType).map((type) => (
                      <option key={type} value={type}>{type.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>

                {/* Job Category */}
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-slate-300 tracking-wide" htmlFor="category">Category</label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    required
                    disabled={status === 'loading' || categories.length === 0}
                    value={formData.categoryId}
                    onChange={handleChange}
                    className="w-full h-11 px-4 bg-slate-950 border border-white/5 rounded-xl text-sm font-medium text-slate-100 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all cursor-pointer"
                  >
                    <option value="" disabled>Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Logo Color */}
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-slate-300 tracking-wide" htmlFor="logoColor">Logo Brand Color</label>
                  <div className="flex items-center gap-3 w-full h-11 px-4 bg-slate-950 border border-white/5 rounded-xl focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/10 transition-all">
                    <input
                      id="logoColor"
                      name="logoColor"
                      type="color"
                      disabled={status === 'loading'}
                      value={formData.logoColor}
                      onChange={handleChange}
                      className="w-6 h-6 rounded cursor-pointer border-none bg-transparent"
                    />
                    <input 
                      type="text" 
                      name="logoColor" 
                      value={formData.logoColor} 
                      onChange={handleChange}
                      className="flex-1 bg-transparent border-none text-sm font-medium text-slate-100 outline-none"
                    />
                  </div>
                </div>

                {/* Featured Toggle */}
                <div className="flex items-center gap-4 h-full pt-4 md:pt-6">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      className="sr-only peer"
                      checked={formData.isFeatured}
                      onChange={handleChange}
                      disabled={status === 'loading'}
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 transition-colors duration-300"></div>
                    <span className="ml-3 text-sm font-semibold text-slate-300">Featured Job</span>
                  </label>
                </div>

              </div>

              {/* Job Description (Full Width) */}
              <div className="flex flex-col gap-2 mt-2">
                <label className="text-[13px] font-semibold text-slate-300 tracking-wide">Job Description</label>
                <div className="bg-slate-950 border border-white/5 rounded-xl overflow-hidden [&_.ql-toolbar]:bg-slate-900 [&_.ql-toolbar]:border-white/5 [&_.ql-container]:border-none [&_.ql-editor]:min-h-[200px] [&_.ql-editor]:text-slate-100 [&_.ql-editor]:text-sm [&_.ql-stroke]:stroke-slate-300 [&_.ql-fill]:fill-slate-300 [&_.ql-picker]:text-slate-300 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/10 transition-all">
                  <ReactQuill 
                    theme="snow" 
                    value={formData.description} 
                    onChange={handleDescriptionChange}
                    readOnly={status === 'loading'}
                    placeholder="Write a detailed job description..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4 border-t border-white/5 mt-2">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={status === 'loading'}
                  className="px-8 h-12 hover:-translate-y-0.5 active:translate-y-0.5"
                >
                  {status === 'loading' ? 'Saving...' : (isEditMode ? 'Update Job' : 'Create Job')}
                </Button>
              </div>

            </form>
          </div>
        </div>
    </>
  );
}
