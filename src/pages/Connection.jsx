import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";

// import {
//   dummyConnectionsData as connection,
//   dummyFollowersData as followers,
//   dummyFollowingData as following,
//   dummyPendingConnectionsData as pendingConnections,
// } from "../assets/assets";
import {
  MessageSquare,
  UserCheck,
  UserPlus,
  UserRoundPen,
  Users,
} from "lucide-react";

const Connection = () => {
  const [currentTab, setCurrentTab] = useState("Followers");
  const navigate = useNavigate();
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [pendingConnections, setPendingConnections] = useState([]);
  const [connection, setConnections] = useState([]);
  const { user, token } = useAuth();

  const userId = user?.id;

  const dataArray = [
    { label: "Followers", value: followers, icon: Users },
    { label: "Following", value: following, icon: UserCheck },
    { label: "Pending", value: pendingConnections, icon: UserRoundPen },
    { label: "Connection", value: connection, icon: UserPlus },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token || !user?._id) return;
        const headers = { Authorization: `Bearer ${token}` };

        const [f1, f2, p, c] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/users/${user._id}/followers`, {
            headers,
          }),
          fetch(`${import.meta.env.VITE_API_URL}/api/users/${user._id}/following`, {
            headers,
          }),
          fetch(`${import.meta.env.VITE_API_URL}/api/connections/pending`, {
            headers,
          }),
          fetch(`${import.meta.env.VITE_API_URL}/api/connections/${user._id}`, {
            headers,
          }),
        ]);

        const d1 = await f1.json();
        const d2 = await f2.json();
        const d3 = await p.json();
        const d4 = await c.json();

        setFollowers(d1.followers || []);
        setFollowing(d2.following || []);
        setPendingConnections(d3.pendingRequests || []);
        setConnections(d4.connections || []);
      } catch (error) {
        console.error('Error fetching connection data:', error);
      }
    };
    fetchData();
  }, [token, user?._id]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Connection</h1>
          <p className="text-slate-600">
            See your connections And Discover New Ones
          </p>
        </div>
        {/* counts */}
        <div className="mb-8 flex flex-wrap gap-6">
          {dataArray.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center gap-1 border h-20 w-40 border-gray-200 bg-white shadow rounded-md"
            >
              <b>{item.value.length}</b>
              <p className="text-slate-600">{item.label}</p>
            </div>
          ))}
        </div>
        {/* Tabs */}
        <div className="inline-flex flex-wrap items-center border-gray-200 rounded-md p-1 bg-white shadow-sm">
          {dataArray.map((tab) => (
            <button
              onClick={() => setCurrentTab(tab.label)}
              key={tab.label}
              className={`cursor-pointer flex items-center px-3 py-1 text-sm rounded-md transition-color ${
                currentTab === tab.label
                  ? "bg-white font-medium text-black"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="ml-1">{tab.label}</span>
              {tab.count !== undefined && (
                <span className="ml-2 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
        {/* Connections */}

        <div className="flex flex-wrap gap-6 mt-6">
          {dataArray
            .find((item) => item.label === currentTab)
            .value.map((user) => (
              <div
                key={user._id}
                className="w-full max-w-88 flex gap-5 p-6 bg-white shadow rounded-md"
              >
                <img
                  src={user.profile_picture}
                  alt=""
                  className="w-12 h-12 rounded-full shadow-md mx-auto"
                />
                <div className="flex-1">
                  <p className="font-medium text-slate-700">{user.full_name}</p>
                  <p className="text-slate-500">@{user.username}</p>
                  <p className="text-sm text-gray-600">
                    {user.bio.slice(0, 30)}...
                  </p>
                  <div className="flex max-sm:flex-col gap-2 mt-4">
                    {
                      <button
                        onClick={() => navigate(`/profile/${user._id}`)}
                        className="w-full p-2 text-sm rounded bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95
                      transition text white cursor-pointer"
                      >
                        View Profile
                      </button>
                    }
                    {currentTab === "Following" && (
                      <button className="w-full p-2 text-sm rounded bg-slate-200 hover:bg-slate-300 text-black active:scale-95 transition cursor-pointer">
                        Unfollow
                      </button>
                    )}
                    {currentTab === "Pending" && (
                      <button className="w-full p-2 text-sm rounded bg-slate-200 hover:bg-slate-300 text-black active:scale-95 transition cursor-pointer">
                        Accept
                      </button>
                    )}
                    {currentTab === "Connection" && (
                      <button
                        onClick={() => navigate(`/Messages/${user._id}`)}
                        className="w-full p-2 text-sm rounded bg-slate-200 hover:bg-slate-300 text-slate-800 active:scale-95 transition cursor-pointer
                        flex items-center justify-center gap-1"
                      >
                        <MessageSquare className="w-4 h-4" /> Message
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Connection;
