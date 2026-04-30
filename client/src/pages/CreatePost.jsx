import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormField, Loader } from '../components';

const CreatePost = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', prompt: '', photo: '' });
  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);

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
        const response = await fetch('http://localhost:8080/api/v1/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: form.prompt }),
        });
        const data = await response.json();
        if (data.photo) {
          setForm({ ...form, photo: `data:image/png;base64,${data.photo}` });
        } else {
          alert('Error generating image');
        }
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
        const response = await fetch('http://localhost:8080/api/v1/post', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        await response.json();
        navigate('/'); 
      } catch (err) {
        alert(err);
      } finally {
        setLoading(false);
      }
    } else {
      alert('Generate an image first!');
    }
  };

  return (
    <section className="w-full">
      <div className="mb-10">
        <h1 className="font-extrabold text-white text-4xl tracking-tight">Studio Workspace</h1>
        <p className="mt-2 text-zinc-400 text-base max-w-2xl">
          Describe your vision in detail. Our AI will synthesize it into a high-fidelity image in seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-5 bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
            <FormField labelName="Creator Name" type="text" name="name" placeholder="Gaurab K." value={form.name} handleChange={handleChange} />
            <FormField labelName="Image Prompt" type="text" name="prompt" placeholder="A neon-lit cyberpunk city at midnight, highly detailed, 8k..." value={form.prompt} handleChange={handleChange} />
            
            <button 
              type="button" 
              onClick={generateImage} 
              disabled={generatingImg || !form.prompt}
              className={`mt-4 w-full py-3.5 rounded-lg font-semibold text-sm transition-all duration-300 ${generatingImg ? 'bg-indigo-600/50 text-white/70 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
            >
              {generatingImg ? 'Synthesizing Image...' : '✨ Generate Artwork'}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden w-full aspect-square flex justify-center items-center shadow-lg">
            {form.photo ? (
              <img src={form.photo} alt={form.prompt} className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center text-zinc-600">
                <svg className="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <span className="font-medium">Canvas Awaiting Input</span>
              </div>
            )}

            {generatingImg && (
              <div className="absolute inset-0 z-10 flex flex-col justify-center items-center bg-black/80 backdrop-blur-sm">
                <Loader />
                <span className="mt-4 text-indigo-400 font-medium animate-pulse text-sm">Rendering via FLUX.1...</span>
              </div>
            )}
          </div>

          {form.photo && (
            <div className="flex gap-4 w-full animate-fade-in">
              <button 
                type="button" 
                onClick={handleDownload} 
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-medium py-3 rounded-lg transition-colors flex justify-center items-center gap-2 text-sm"
              >
                <span className="font-bold">↓</span> Download HD
              </button>
              
              <button 
                type="button" 
                onClick={handleSubmit} 
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-lg transition-colors text-sm"
              >
                {loading ? 'Publishing...' : '🌎 Share to Feed'}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CreatePost;