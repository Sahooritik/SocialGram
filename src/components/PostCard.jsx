import { BadgeCheck, Heart, MessageCircle, Share2 } from 'lucide-react'
import moment from 'moment'
import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'

const PostCard = ({post}) => {
  let navigate = useNavigate();
  const postWithHashTag = post.content.replace(/(#\w+)/g,'<span class="text-indigo-600 font-medium">$1</span>')
  const [likes,setLikes] = useState(post.likes_count || []);
  const { user, token } = useAuth();

  const handelLike = async () =>{
    if (!token || !user?._id) return;
    try{
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${post._id}/like`,{
        method:'POST',
        headers:{ Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if(data.success){
        setLikes(data.likes);
      }
    }catch(e){}
  }

  return (
    <div className='bg-white p-4 rounded-xl shadow p-4 space-y-4 w-full max-w-2xl'>
        {/* User Info */}
      <div onClick={()=>navigate(`/profile/${post?.user?._id}`)} className="inline-flex items-center gap-3 cursor-pointer">
        <img src={post?.user?.profile_picture || '/default-avatar.png'} alt="" className='w-10 h-10 rounded-full shadow'/>
        <div className="">
            <div className="flex items-center space-x-1">
                <span className="">{post?.user?.full_name || 'Unknown'}</span>
                <BadgeCheck className='w-4 h-4 text-blue-500'/>
            </div>
            <div className='text-gray-500 text-sm'>{post?.user?.username || 'unknown'} . {moment(post?.createdAt).fromNow()}</div>
        </div>
      </div>
      {/* Content */}
      {post?.content && <div className='text-gray-800 text-sm whitespace-pre-line' dangerouslySetInnerHTML={{__html: postWithHashTag}}/>} {/* React's replacement for the traditional innerHTML property */}

      {/* Images */}
      <div className="grid grid-cols-2 gap-2">
        {post?.image_urls && (
          <img src={post.image_urls} alt="" className={`w-full h-48 rounded-lg object-cover ${post.image_urls.length === 1 ? 'col-span-2 h-auto' : ''}`}/>
        )}
      </div>
      
      {/* Action */}
      <div className="flex items-center gap-4 text-gray-600 text-sm pt-2 border-t border-gray-300">
        <div className="flex items-center gap-1">
          <Heart className={`w-5 h-5 cursor-pointer ${likes.includes(user?._id) && 'text-red-500 fill-red-500'}`} onClick={handelLike}/>
          <span>{likes.length}</span>
        </div>

        <div className="flex items-center gap-1">
          <MessageCircle className='w-4 h-4'/>
          <span>{12}</span>
        </div>

        <div className="flex items-center gap-1">
          <Share2 className='w-4 h-4'/>
          <span>{7}</span>
        </div>

      </div>
    </div>
  )
}

export default PostCard
