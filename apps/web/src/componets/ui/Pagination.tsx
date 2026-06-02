import Button from './Button';
export interface MetaData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface PaginationProps {
  meta: MetaData | null;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
}

export default function Pagination({ meta, onPageChange, showInfo = false }: PaginationProps) {
  if (!meta || meta.totalPages <= 1) return null;

  return (
    <div className={`mt-auto pt-4 flex items-center ${showInfo ? 'justify-between border-t border-white/5 px-6 py-4 bg-slate-950/30' : 'justify-center'} gap-2 w-full`}>

      {showInfo && (
        <p className="text-sm text-slate-400 font-medium hidden sm:block">
          Showing <span className="text-slate-200 font-bold">{Math.min((meta.page - 1) * meta.limit + 1, meta.total)}</span> to <span className="text-slate-200 font-bold">{Math.min(meta.page * meta.limit, meta.total)}</span> of <span className="text-slate-200 font-bold">{meta.total}</span> jobs
        </p>
      )}

      <div className="flex items-center gap-2">
        <Button
          onClick={() => onPageChange(Math.max(1, meta.page - 1))}
          disabled={!meta.hasPreviousPage}
          variant="secondary"
          size="icon"
          className="hover:text-emerald-400 hover:border-emerald-500/30"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Button>

        {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((pageNum) => (
          <Button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            variant={pageNum === meta.page ? "primary" : "secondary"}
            size="icon"
            className={pageNum === meta.page ? "shadow-[0_4px_15px_rgba(16,185,129,0.25)]" : ""}
          >
            {pageNum}
          </Button>
        ))}

        <Button
          onClick={() => onPageChange(Math.min(meta.totalPages, meta.page + 1))}
          disabled={!meta.hasNextPage}
          variant="secondary"
          size="icon"
          className="hover:text-emerald-400 hover:border-emerald-500/30"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
