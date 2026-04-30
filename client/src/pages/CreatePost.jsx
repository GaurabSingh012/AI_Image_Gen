import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormField, Loader } from '../components';
import { useAuth } from '../context/AuthContext';

const CreatePost = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); 
  
  const [form, setForm] = useState({ name: '', prompt: '', photo: '' });
  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) navigate('/auth');
    else setForm((prev) => ({ ...prev, name: user.username })); 
  }, [user, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = form.photo;
    link.download = `VisionAI_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateImage = async () => {
    if (form.prompt) {
      try {
        setGeneratingImg(true);
        // FIXED: Corrected closing backtick
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/ai`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: form.prompt }),
        });
        const data = await response.json();
        if (data.photo) setForm({ ...form, photo: `data:image/png;base64,${data.photo}` });
      } catch (err) {
        alert(err);
      } finally {
        setGeneratingImg(false);
      }
    } else {
      alert('Please provide a prompt');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.prompt && form.photo) {
      setLoading(true);
      try {
        // FIXED: Corrected closing backtick
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/post`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', 
          body: JSON.stringify(form),
        });
        await response.json();
        navigate('/'); 
      } catch (err) {
        alert(err);
      } finally {
        setLoading(false);
      }
    }
  };

  if (!user) return null; 

  return (
    <section className="w-full">
      <div className="mb-10">
        <h1 className="font-extrabold text-slate-900 text-4xl tracking-tight">Studio Workspace</h1>
        <p className="mt-2 text-slate-500 text-base max-w-2xl">
          Describe your vision. Our AI will synthesize it into a high-fidelity image.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-5 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <FormField labelName="Creator Name" type="text" name="name" placeholder="Name" value={form.name} handleChange={handleChange} />
            <FormField labelName="Image Prompt" type="text" name="prompt" placeholder="A bright, sunlit modern architectural home..." value={form.prompt} handleChange={handleChange} />
            
            <button type="button" onClick={generateImage} disabled={generatingImg || !form.prompt} className={`mt-4 w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 shadow-md ${generatingImg ? 'bg-indigo-300 text-white cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200 text-white'}`}>
              {generatingImg ? 'Synthesizing Image...' : '✨ Generate Artwork'}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="relative bg-slate-100 border border-slate-200 rounded-2xl overflow-hidden w-full aspect-square flex justify-center items-center shadow-inner">
            {form.photo ? (
              <img src={form.photo} alt={form.prompt} className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center text-slate-400">
                <span className="font-medium">Canvas Awaiting Input</span>
              </div>
            )}
            {generatingImg && <div className="absolute inset-0 z-10 flex flex-col justify-center items-center bg-white/80 backdrop-blur-sm"><Loader /></div>}
          </div>

          {form.photo && (
            <div className="flex gap-4 w-full animate-fade-in">
              <button onClick={handleDownload} className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium py-3 rounded-xl transition-colors shadow-sm text-sm">↓ Download HD</button>
              <button onClick={handleSubmit} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 rounded-xl transition-colors shadow-md text-sm">{loading ? 'Publishing...' : '🌎 Share to Feed'}</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CreatePost;