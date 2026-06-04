import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Header from './header';
import Footer from './footer';
import { logout, type RootState } from '@store';

export default function UserLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  let onSignInClick = () => {
    navigate('/login');
  };

  if (accessToken) {
    onSignInClick = () => {
      dispatch(logout());
      navigate('/login');
    };
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-950/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-slate-900/40 blur-[120px] pointer-events-none" />

      {/* Navigation Header */}
      <Header accessToken={accessToken} onSignInClick={onSignInClick} />

      {/* Main Content */}
      <Outlet />

      {/* Footer */}
      <Footer />
    </div>
  );
}
