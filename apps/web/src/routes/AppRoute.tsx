import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage onNavigateToHome={() => { }} />} />
      <Route path="/signup" element={<SignupPage onNavigateToHome={() => { }} />} />
    </Routes>
  );
}