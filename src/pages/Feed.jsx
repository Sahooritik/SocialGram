import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import Loading from "../components/Loading";
import StoryBar from "../components/StoryBar";
import PostCard from "../components/PostCard";
import RecentMessages from "../components/RecentMessages";
import { useAuth } from "../context/AuthContext.jsx";

const Feed = () => {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const fetchFeeds = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/feed`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) throw new Error('Failed to fetch feeds');
      
      const data = await res.json();
      if (data.success) {
        setFeeds(data.posts);
      } else {
        throw new Error(data.message || 'Failed to load feeds');
      }
    } catch (error) {
      console.error('Error fetching feeds:', error);
      setFeeds([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeds();
  }, [token]);

  return !loading ? (
    <div className="h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start justify-center xl:gap-8">
      {/*this is for story and post-list*/}
      <div>
        {/* Story Here */}
        <StoryBar />
        <div className="p-4 space-y-6">
          {feeds.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>
      {/* this is for right side Bar */}
      <div className="max-xl:hidden sticky top-0">
        <div className="max-w-xs bg-white text-xs p-4 rounded-md inline-flex flex-col gap-2 shadow">
          {/* Sponsored */}
          <h3 className="text-slate-800 font-semibold">Sponsored</h3>
          <img
            src={assets.sponsored_img}
            alt=""
            className="w-75 h-50 rounded-md"
          />
          <p className="text-slate-600">Email marketing</p>
          <p className="text-slate-500">
            Boost your business with our email marketing services.
          </p>
        </div>
        {/* Recent Messages */}
        <RecentMessages />
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Feed;
