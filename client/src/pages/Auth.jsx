import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FormField } from '../components';
import { useAuth } from '../context/AuthContext';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginContext } = useAuth();

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    
    if (e.target.name === 'email') setEmailError('');
    if (e.target.name === 'password') setPasswordError('');
  };

  const validateForm = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email || !emailRegex.test(form.email)) {
      setEmailError('Enter a valid email address.');
      isValid = false;
    }

    if (!isLogin) {
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!form.password || !passwordRegex.test(form.password)) {
        setPasswordError('Password must be at least 8 chars, 1 uppercase, and 1 number.');
        isValid = false;
      }
    } else if (!form.password) {
      setPasswordError('Password is required.');
      isValid = false;
    }

    if (!isLogin && !form.username) {
      alert('Username is required for registration.');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; 

    setLoading(true);

    const endpoint = isLogin ? '/api/v1/auth/login' : '/api/v1/auth/register';
    
    try {
      // FIXED: Used environment variable and backticks for the dynamic endpoint
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', 
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (data.success) {
        if (isLogin) {
          loginContext(data.data); 
          navigate('/'); 
        } else {
          alert('Registration successful! Please log in.');
          setIsLogin(true); 
          setForm({ username: '', email: '', password: '' }); 
        }
      } else {
        alert(data.message); 
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full flex justify-center items-center py-10">
      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xl max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="font-extrabold text-slate-900 text-3xl tracking-tight">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="mt-2 text-slate-500 text-sm">
            {isLogin ? 'Sign in to access your studio workspace.' : 'Join the community and start generating.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          {!isLogin && (
            <FormField labelName="Username" type="text" name="username" placeholder="Anjal" value={form.username} handleChange={handleChange} />
          )}

          <div>
            <FormField labelName="Email Address" type="email" name="email" placeholder="Anjal@example.com" value={form.email} handleChange={handleChange} />
            {emailError && (
              <p className="text-red-500 text-xs mt-1 ml-1 animate-fade-in">{emailError}</p>
            )}
          </div>
          
          <div>
            <FormField labelName="Password" type="password" name="password" placeholder="••••••••" value={form.password} handleChange={handleChange} />
            {passwordError && (
              <p className="text-red-500 text-xs mt-1 ml-1 animate-fade-in leading-snug">{passwordError}</p>
            )}

            {isLogin && (
              <div className="text-right mt-2">
                <Link to="/reset-password" class="text-xs font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                  Forgot password?
                </Link>
              </div>
            )}
          </div>

          <button type="submit" disabled={loading} className={`mt-4 w-full text-white font-semibold py-3.5 rounded-xl transition-all duration-300 shadow-md ${loading ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Register')}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button type="button" onClick={() => setIsLogin(!isLogin)} className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </section>
  );
};

export default Auth;