import React from 'react';
import { MdDownload, MdOutlineDeleteOutline } from 'react-icons/md';

const Card = ({ _id, name, prompt, photo, onImageClick, onDelete, isMine }) => {
  
  const handleDownload = () => {
    // Generate a secure, unique filename for the download
    const filename = `VisionAI_${_id}_${Date.now()}.png`;
    
    // Create an invisible hyperlink to trigger the native download
    const link = document.createElement('a');
    link.href = photo;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    // Cleanup immediately after download starts
    document.body.removeChild(link);
  };

  return (
    <div className="rounded-3xl group relative shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100 bg-white">
      {/* 1. Main Generated Image (now with smooth zoom effect on hover) */}
      <img
        src={photo}
        alt={prompt}
        onClick={() => onImageClick({ photo, prompt, name })}
        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
      />

      {/* 2. Security Badge: Visually confirms backend verification on client side */}
      {isMine && (
        <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-emerald-500 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-md shadow-emerald-200 z-10">
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          Verified: Owned by me
        </div>
      )}

      {/* 3. Fully Redesigned Action & Details Overlay */}
      <div className="group-hover:flex flex-col max-h-[94.5%] hidden absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-6 z-10 transition-all animate-fade-in-up">
        
        {/* Full Prompt Display (Truncated for clean UX) */}
        <p className="text-white text-sm font-medium mb-5 leading-relaxed tracking-wide drop-shadow-sm line-clamp-3">
          {prompt}
        </p>

        {/* Improved Flex Layout for Profile and Actions */}
        <div className="flex justify-between items-center gap-4">
          
          {/* A. User Profile Section */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex justify-center items-center font-bold text-sm shadow-md">
              {name[0].toUpperCase()}
            </div>
            {/* Added 'line-clamp-1' to the name to prevent it from long-wrapping and breaking the buttons */}
            <p className="text-white text-xs font-semibold tracking-wide drop-shadow-sm line-clamp-1">{name}</p>
          </div>

          {/* B. CORRECTED Actions Section (Now properly spaced inside) */}
          {/* We use a defined flex-gap of 'gap-3' to ensure these are always spaced and never compete for space */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Secure Delete Button (Only shows if verified isMine) */}
            {isMine && (
              <button 
                onClick={() => onDelete(_id)} 
                className="w-10 h-10 rounded-xl bg-red-600/90 text-white flex justify-center items-center hover:bg-red-500 transition-colors shadow-lg active:scale-95"
                title="Delete generated artwork"
              >
                <MdOutlineDeleteOutline size={22} />
              </button>
            )}

            {/* Public Download Button (Uses native browser download API) */}
            <button 
              onClick={handleDownload} 
              className="w-10 h-10 rounded-xl bg-slate-700/80 text-white flex justify-center items-center hover:bg-slate-600 transition-colors shadow-lg active:scale-95"
              title="Download high-resolution image"
            >
              <MdDownload size={22} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;