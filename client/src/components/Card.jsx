import React from 'react';

const Card = ({ _id, name, prompt, photo, onImageClick }) => {
  const handleDownload = (e, id, url) => {
    e.stopPropagation(); 
    const link = document.createElement('a');
    link.href = url;
    link.download = `VisionAI_${id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      onClick={() => onImageClick({ name, prompt, photo })}
      className="rounded-xl group relative overflow-hidden border border-zinc-800 hover:border-indigo-500/50 transition-all duration-300 shadow-md cursor-zoom-in bg-zinc-900"
    >
      <img
        className="w-full h-auto object-cover rounded-xl"
        src={photo}
        alt={prompt}
        loading="lazy"
      />
      
      <div className="group-hover:opacity-100 opacity-0 absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent p-4 transition-all duration-300 flex flex-col justify-end">
        <p className="text-zinc-200 text-sm leading-snug mb-3 line-clamp-3">
          {prompt}
        </p>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex justify-center items-center bg-indigo-600 text-white text-xs font-bold shadow-sm">
              {name[0].toUpperCase()}
            </div>
            <p className="text-white text-xs font-medium truncate max-w-[120px]">{name}</p>
          </div>
          
          <button 
            type="button" 
            onClick={(e) => handleDownload(e, _id, photo)} 
            className="w-8 h-8 flex justify-center items-center bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-md transition-colors text-white"
            title="Download Image"
          >
            <span className="font-bold">↓</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;