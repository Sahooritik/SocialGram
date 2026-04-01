import React, { useState, useEffect } from 'react'
import { MapPin, MessageCircle, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const UserCard = ({user}) => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(false);

    // Check if already following
    useEffect(() => {
        const checkFollowing = async () => {
            try {
                if (!token) return;
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success && data.user?.following) {
                    setIsFollowing(data.user.following.some(f => f?._id === user?._id || f === user?._id));
                }
            } catch (error) {
                console.error('Error checking follow status:', error);
            }
        };
        if (token) checkFollowing();
    }, [token, user?._id]);

    const handelFollow = async () => {
        if (loading || !token || !user?._id) return;
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/connections/follow/${user._id}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setIsFollowing(true);
            }
        } catch (error) {
            console.error('Error following user:', error);
        } finally {
            setLoading(false);
        }
    };

    const handelMessage = () => {
        if (user?._id) {
            navigate(`/messages/${user._id}`);
        }
    };

  return (
    <div key={user?._id} className='p-4 pt-6 flex flex-col justify-between w-72 shadow border border-gray-200 rounded-md'>
        <div className="text-center">
            <img src={user?.profile_picture || '/default-avatar.png'} alt="" className='rounded-full w-16 shadow-md mx-auto'/>
            <p className='mt-4 font-semibold'>{user?.full_name || 'User'}</p>
            {user?.username && <p className='text-gray-500 font-light'>@{user.username}</p>}
            {user?.bio && <p className='text-gray-600 mt-2 text-center text-sm px-4'>{user.bio}</p>}
        </div>
      
      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-600">
        {user?.location && (
            <div className="flex items-center gap-1 border border-gray-300 rounded-full px-3 py-1">
                <MapPin className='w-4 h-4'/> {user.location}
            </div>
        )}
        <div className="flex items-center gap-1 border border-gray-300 rounded-full px-3 py-1">
            <span>{user?.followers?.length || 0}</span> Followers
        </div>
      </div>

      <div className="flex mt-4 gap-2">
        {/* Follow Button */}
        <button 
            onClick={handelFollow} 
            disabled={isFollowing || loading} 
            className={`w-full py-2 rounded-md flex justify-center items-center gap-2 cursor-pointer
                ${isFollowing 
                    ? 'bg-gray-200 text-gray-600' 
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700'
                }`}
        >
            <UserPlus className='w-4 h-4'/> {isFollowing ? 'Following' : 'Follow'}
        </button>
        {/* Message Button */}
        {isFollowing && (
            <button 
                onClick={handelMessage} 
                className='flex items-center justify-center w-16 border text-slate-500 group rounded-md cursor-pointer active:scale-95'
            >
                <MessageCircle className='w-5 h-5 group-hover:scale-105 transition'/>
            </button>
        )}
      </div>
    </div>
  )
}

export default UserCard
