import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader, Card } from '../components';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (!user) navigate('/auth');
  }, [user, navigate]);

  useEffect(() => {
    const fetchMyPosts = async () => {
      setLoading(true);
      try {
        // FIXED: Corrected closing backtick
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/post`);
        if (response.ok) {
          const result = await response.json();
          // Filters the gallery to show only items created by the current user
          const userOnlyPosts = result.data.reverse().filter(post => post.creator === user?._id);
          setMyPosts(userOnlyPosts);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchMyPosts();
  }, [user]);

  const handleDeletePost = async (id) => {
    if (window.confirm("Are you sure you want to delete your artwork?")) {
      try {
        // FIXED: Replaced localhost with VITE_BACKEND_URL and corrected backticks
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/post/${id}`, { 
          method: 'DELETE',
          credentials: 'include' 
        });
        setMyPosts(myPosts.filter(post => post._id !== id));
      } catch (error) {
        console.error('Failed to delete', error);
      }
    }
  };

  if (!user) return null;

  return (
    <section className="w-full relative animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 mb-12 flex flex-col md:flex-row items-center md:items-start gap-8 max-w-4xl mx-auto">
        
        <div className="w-24 h-24 rounded-full bg-indigo-100 text-indigo-600 flex justify-center items-center font-black text-4xl shadow-inner shrink-0">
          {user.username[0].toUpperCase()}
        </div>

        <div className="flex-1 text-center md:text-left">
          <h1 className="font-extrabold text-slate-900 text-3xl tracking-tight mb-1">{user.username}</h1>
          <p className="text-slate-500 text-sm font-medium mb-6">{user.email}</p>
          
          <div className="flex justify-center md:justify-start gap-6">
            <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 text-center">
              <p className="text-2xl font-bold text-indigo-600 leading-none">{myPosts.length}</p>
              <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">Generations</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="font-bold text-slate-800 text-2xl tracking-tight border-b border-slate-200 pb-4">My Private Studio</h2>
      </div>

      <div>
        {loading ? (
          <div className="flex justify-center py-20"><Loader /></div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-2 lg:columns-3 xl:columns-3 gap-6 space-y-6">
            {myPosts.length > 0 ? (
              myPosts.map((post) => (
                <Card 
                  key={post._id} 
                  {...post} 
                  onImageClick={setSelectedImage} 
                  onDelete={handleDeletePost}
                  isMine={true} 
                />
              ))
            ) : (
              <div className="col-span-full text-center py-10 animate-fade-in">
                <p className="text-slate-500 font-medium text-lg">You haven't generated any artwork yet.</p>
                <button onClick={() => navigate('/create-post')} className="mt-4 text-indigo-600 font-semibold hover:text-indigo-800">
                  Create your first piece →
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {selectedImage && (
        <div className="fixed inset-0 z-[100] flex justify-center items-center bg-slate-900/60 backdrop-blur-sm p-4" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-5xl w-full flex flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage.photo} alt={selectedImage.prompt} className="w-full max-h-[75vh] object-contain rounded-xl shadow-2xl" />
            <div className="bg-white p-5 rounded-xl w-full max-w-4xl shadow-xl flex justify-between items-center gap-4">
              <div>
                <p className="text-slate-800 font-medium">{selectedImage.prompt}</p>
                <p className="text-indigo-600 font-medium mt-1 text-sm">By {selectedImage.name}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Profile;