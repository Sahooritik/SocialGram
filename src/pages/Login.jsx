import React, { useState } from "react";
import { assets } from "../assets/assets";
import { Star } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const { login, signup, isConnecting } = useAuth();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email || !password) return;
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        const ok = await signup({
          email,
          password,
          full_name: fullName,
          username,
        });
        if (ok) await login(email, password);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <img
        src={assets.bgImage}
        alt=""
        className="absolute top-0 left-0 -z-1 w-full h-full object-cover"
      />

      <div className="flex-1 flex flex-col items-start justify-between p-6 md:p-10 lg:pl-40">
        <img src={assets.logo} alt="" className="h-30 object-contain" />
        <div>
          <div className="flex items-center gap-3 mb-4 max-md:mt-10">
            <img src={assets.group_users} alt="" className="h-8 md:h-10" />
            <div>
              <div className="flex">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className="size-4 md:size-4.5 text-transparent fill-amber-500"
                    />
                  ))}
              </div>
              <p>Learning Project</p>
            </div>
          </div>
          <h1 className="text-3xl md:text-6xl md:pb-2 font-bold bg-gradient-to-r from-indigo-950 to-indigo-800 text-transparent bg-clip-text">
            Connect With Friend's And Love One ❤
          </h1>
          <p className="text-x1 md:text-3xl text-indigo-900 max-w-72 md:max-w-md">
            connect around the globe
          </p>
        </div>
        <span className="md:h-10"></span>
      </div>
      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="bg-white p-6 rounded-xl shadow w-full max-w-sm">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2 rounded ${mode === "login" ? "bg-indigo-600 text-white" : "bg-gray-100"}`}
            >
              Login
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-2 rounded ${mode === "signup" ? "bg-indigo-600 text-white" : "bg-gray-100"}`}
            >
              Signup
            </button>
          </div>
          {mode === "signup" && (
            <>
              <input
                type="text"
                placeholder="Full name"
                className="w-full border rounded p-2 mb-2"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Username"
                className="w-full border rounded p-2 mb-2"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </>
          )}
          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded p-2 mb-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded p-2 mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            disabled={loading}
            onClick={submit}
            className="w-full py-2 rounded bg-gradient-to-r from-indigo-500 to-purple-600 text-white active:scale-95"
          >
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Login"
                : "Create Account"}
          </button>
          <h1 style={{color:"red"}}>{isConnecting}</h1>
        </div>
      </div>
    </div>
  );
};

export default Login;
