import React from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#09090b] text-zinc-100 font-inter selection:bg-indigo-500/30">
        <header className="w-full flex justify-between items-center bg-[#09090b]/80 backdrop-blur-md border-b border-zinc-800 sm:px-10 px-4 py-4 sticky top-0 z-50">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex justify-center items-center">
              <span className="font-bold text-white text-xl leading-none">V</span>
            </div>
            <span className="font-black text-2xl tracking-tight text-white">
              Vision<span className="text-indigo-500">AI</span>
            </span>
          </Link>

          <Link to="/create-post" className="font-medium text-sm bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white px-5 py-2 rounded-lg transition-all duration-300">
            + New Generation
          </Link>
        </header>

        <main className="sm:p-10 px-4 py-8 w-full max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-post" element={<CreatePost />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;