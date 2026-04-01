import  { useState } from 'react'
import { Image, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {

  const [content, setContent] = useState('');
  const [images, setImages] = useState("");

  const [loading, setLoading] = useState(false);
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const handelMediaUpload = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setImages(file);
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_PRESET;

    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    );

    const data = await res.json();

    if (!data.secure_url) throw new Error("Cloudinary upload failed");

    return {
      url: data.secure_url,
      type: file.type.startsWith("image") ? "image" : "video",
    };
  };



  const handelSubmit = async () => {
    if (!content.trim() && !images) {
      throw new Error('Please add content or images');
    }

      let uploadedMedia = null;

      if (images instanceof File) {
        uploadedMedia = await uploadToCloudinary(images);
      }
    
    setLoading(true);
    try {
      
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          image_urls: uploadedMedia ? uploadedMedia.url : "",
          post_type: uploadedMedia ? 'photo' : 'text',
        })
      });
      
      console.log('Post response status:', res.status);
      
      const data = await res.json();
      console.log('Post response:', data);
      
      if (!data.success) throw new Error(data.message);
      
      setContent('');
      setImages("");
      navigate('/');
      toast.success("Post Published!");

    } catch (error) {
      console.error('Error publishing post:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-white'>
      <div className="max-w-6xl mx-auto p-6">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Post</h1>
          <p className='text-gray-600'>Share your thoughts with the world</p>
        </div>
        {/* Form */}
        <div className='max-w-xl bg-white p-4 sm:p-8 sm:pb-3 rounded-xl shadow-md space-y-4'>
          {/* Heder */}
          <div className="flex items-center gap-3">
            <img src={user?.profile_picture || '/default-avatar.png'} alt="" className='w-12 h-12 rounded-full shadow'/>
            <div className="">
              <h2 className='font-semibold'>{user?.full_name || 'User'}</h2>
              <p className='text-sm text-gray-500'>@{user?.username || 'unknown'}</p>
            </div>
          </div>
          {/* Textarea */}
          <textarea className='w-full resize-none max-h-20 mt-4 text-sm outline-none placeholder:text-gray-400' placeholder="what's happening?..." onChange={(e)=>setContent(e.target.value)} value={content} />

            {/* Images */}
            {images && 
            <div className='flex flex-wrap gap-2 mt-2'>
              {
                
                  <div className='relative group'>
                    <img src={URL.createObjectURL(images)} alt="" className='h-12 rounded-md'/>
                    <div onClick={()=>setImages(null)} className='absolute hidden group-hover:flex justify-center items-center top-0 right-0 bottom-0 left-0
                    bg-black/40 rounded cursor-pointer'>
                      <X className='w-6 h-6 text-white'/>
                    </div>
                  </div>
              }
            </div>
            }
            {/* Bottom Bar */}
            <div className='flex items-center justify-between pt-3 border-t border-gray-300'>
              <label htmlFor="images" className='flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700
              transition cursor-pointer'>
                <Image className='size-6'/>
              </label>
              <input type="file" id='images' className='hidden' onChange={(e)=>setImages(e.target.files[0])} />
              <button disabled={loading} onClick={()=>toast.promise(
                handelSubmit(),
                {
                  loading:'Publishing Post...',
                  success:<p>Post Published!</p>,
                  error: <p>Failed to Publish Post</p>
                }
              )} className='text-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700
              active:scale-95 transition text-white font-medium px-8 py-2 rounded-md cursor-pointer'>Publish Post</button>
            </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePost
