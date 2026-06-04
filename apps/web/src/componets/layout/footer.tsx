export default function Footer() {
    return (
        <footer className="border-t border-slate-900 mt-auto bg-slate-950/30 backdrop-blur-md">
            <div className="w-full max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-1 h-6 rounded-full bg-emerald-500"></div>
                    <span className="font-semibold text-slate-300 tracking-tight">JobPortal</span>
                </div>
                <p className="text-xs text-slate-600">© 2024 JobPortal. All rights reserved.</p>
            </div>
        </footer>
    )
}