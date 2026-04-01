import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { useAuth } from "../context/AuthContext.jsx";

const RecentMessages = () => {
  const [messages, setMessages] = useState([]);
  const { token } = useAuth();

  const featchRecentMessages = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/messages/recent`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    if (data.success) setMessages(data.messages);
  };

  useEffect(() => {
    featchRecentMessages();
  }, [token]);

  return (
    <div className="bg-white max-w-xs mt-4 p-4 min-h-20 rounded-md shadow text-xs text-slate-800">
      <h3 className="font-semibold text-slate-800 mb-4">Recent Message</h3>
      <div className="flex flex-col max-h-56 overflow-y-scroll no-scrollbar">
        {messages.map((message, index) => (
          <Link
            to={`/messages/${message.from_user_id._id}`}
            key={index}
            className="flex items-start gap-2 py-2 hover:bg-slate-100"
          >
            <img
              src={message.from_user_id.profile_picture}
              alt=""
              className="w-8 h-8 rounded-full"
            />
            <div className="w-full">
              <div className="flex justify-between">
                <p className="font-medium">{message.from_user_id.full_name}</p>
                <p className="text-slate-500 text-[10px]">
                  {moment(message.createdAt).fromNow()}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-slate-500">
                  {message.text ? message.text : "image/video"}
                </p>
                {!message.seen && (
                  <p className="bg-indigo-500 text-white w-4 h-4 flex items-center justify-center rounded-full text-[10px]">
                    1
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentMessages;
