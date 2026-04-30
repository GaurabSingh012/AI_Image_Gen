import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FormField } from '../components';

const ResetPassword = () => {
  const [step, setStep] = useState(1); // 1: Request OTP, 2: Reset Password
  const [form, setForm] = useState({ email: '', otp: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    
    // Clear error messages as the user types
    if (e.target.name === 'email') setEmailError('');
    if (e.target.name === 'newPassword') setPasswordError('');
  };

  // Step 1: Request the OTP from the server
  const handleSendOtp = async (e) => {
    e.preventDefault();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email || !emailRegex.test(form.email)) {
      setEmailError('Enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Verification code sent to your email!');
        setStep(2); // Move to the OTP entry step
      } else {
        alert(data.message || 'Failed to send OTP.');
      }
    } catch (error) {
      alert('An error occurred. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Submit the OTP and the new password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    // Password Complexity Check (Must match Auth.jsx rules)
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!form.newPassword || !passwordRegex.test(form.newPassword)) {
      setPasswordError('Password must be at least 8 characters, include one uppercase letter, and one number.');
      return;
    }

    if (!form.otp) {
      alert('Please enter the 6-digit code.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          otp: form.otp,
          newPassword: form.newPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Password updated successfully! Redirecting to login...');
        navigate('/auth');
      } else {
        alert(data.message || 'Reset failed. Check your OTP.');
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
            {step === 1 ? 'Recover Account' : 'New Password'}
          </h1>
          <p className="mt-2 text-slate-500 text-sm">
            {step === 1 
              ? "Enter your email address to receive a 6-digit security code." 
              : "Verify the code from your inbox and choose a secure password."}
          </p>
        </div>

        {step === 1 ? (
          /* Step 1 Form: Email Request */
          <form onSubmit={handleSendOtp} className="flex flex-col gap-4" noValidate>
            <div>
              <FormField 
                labelName="Email Address" 
                type="email" 
                name="email" 
                placeholder="gaurab@example.com" 
                value={form.email} 
                handleChange={handleChange} 
              />
              {emailError && (
                <p className="text-red-500 text-xs mt-1 ml-1">{emailError}</p>
              )}
            </div>
            
            <button 
              type="submit" 
              disabled={loading} 
              className={`mt-4 w-full text-white font-semibold py-3.5 rounded-xl transition-all duration-300 shadow-md ${loading ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              {loading ? 'Sending Code...' : 'Send Recovery Code'}
            </button>
          </form>
        ) : (
          /* Step 2 Form: OTP and Password Reset */
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4" noValidate>
            <FormField 
              labelName="6-Digit Recovery Code" 
              type="text" 
              name="otp" 
              placeholder="123456" 
              value={form.otp} 
              handleChange={handleChange} 
            />
            
            <div>
              <FormField 
                labelName="New Password" 
                type="password" 
                name="newPassword" 
                placeholder="••••••••" 
                value={form.newPassword} 
                handleChange={handleChange} 
              />
              {passwordError && (
                <p className="text-red-500 text-xs mt-1 ml-1 leading-snug">{passwordError}</p>
              )}
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className={`mt-4 w-full text-white font-semibold py-3.5 rounded-xl transition-all duration-300 shadow-md ${loading ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              {loading ? 'Updating...' : 'Set New Password'}
            </button>
          </form>
        )}

        <div className="mt-8 text-center border-t border-slate-50 pt-6">
          <Link to="/auth" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;