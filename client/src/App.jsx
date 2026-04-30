import React from 'react';
import { BrowserRouter, Link, Route, Routes, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import Auth from './pages/Auth';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile'; 
import { AuthProvider, useAuth } from './context/AuthContext';

const Header = () => {
  const { user, logoutContext } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // FIXED: Corrected closing backtick here
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/logout`, { 
        method: 'POST', 
        credentials: 'include' 
      });
      logoutContext(); 
      navigate('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div className="w-full flex justify-center pt-6 px-4 sticky top-0 z-50">
      <header className="w-full max-w-7xl flex justify-between items-center bg-white/80 backdrop-blur-lg border border-slate-200/80 shadow-sm rounded-2xl px-6 py-4">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex justify-center items-center group-hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200">
            <span className="font-bold text-white text-xl leading-none">V</span>
          </div>
          <span className="font-black text-2xl tracking-tight text-slate-900">
            Vision<span className="text-indigo-600">AI</span>
          </span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-6">
          {user ? (
            <>
              <Link to="/profile" className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 py-1.5 px-3 rounded-full hover:bg-indigo-50 hover:border-indigo-200 transition-all cursor-pointer shadow-sm">
                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex justify-center items-center font-bold text-xs">
                  {user.username[0].toUpperCase()}
                </div>
                <span className="text-sm font-medium text-slate-700">{user.username}</span>
              </Link>
              
              <Link to="/create-post" className="font-semibold text-sm bg-indigo-600 text-white hover:bg-indigo-700 px-5 py-2.5 rounded-full transition-all duration-300 shadow-sm">
                + Create
              </Link>
              
              <button onClick={handleLogout} className="font-semibold text-sm text-slate-500 hover:bg-red-50 hover:text-red-600 px-3 py-2 rounded-lg transition-colors">
                Logout
              </button>
            </>
          ) : (
            <Link to="/auth" className="font-semibold text-sm bg-indigo-600 text-white hover:bg-indigo-700 px-6 py-2.5 rounded-full transition-all duration-300 shadow-sm shadow-indigo-200">
              Sign In
            </Link>
          )}
        </div>
      </header>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/50 text-slate-800 font-inter selection:bg-indigo-100">
          <Header />
          <main className="sm:p-10 px-4 py-8 w-full max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} /> 
              <Route path="/profile" element={<Profile />} /> 
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;