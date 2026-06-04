import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

interface HeaderProps {
    accessToken: string | null;
    onSignInClick: () => void;
}

export default function Header({ accessToken, onSignInClick }: HeaderProps) {
    const navigate = useNavigate();

    return (
        <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                    <svg className="w-5 h-5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                        <path d="M12 11v6" />
                        <path d="M9 14h6" />
                    </svg>
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-100">JobPortal</span>
            </div>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
                <Button onClick={() => navigate('/jobs')} variant="link">Find Jobs</Button>
            </nav>

            <div className="flex items-center gap-4">
                {accessToken ?
                    <Button
                        onClick={onSignInClick}
                        variant="primary"
                    >
                        Logout
                    </Button>
                    :
                    <Button
                        onClick={onSignInClick}
                        variant="ghost"
                    >
                        Sign In
                    </Button>
                }
            </div>
        </header>
    );
}