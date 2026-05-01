import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.status === 200) {
        // ✅ login success → save token & username, then go to dashboard
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username || username);
        navigate("/");
      } else {
        alert(data.error || "Login failed");
      }

    } catch (err) {
      console.log(err);
      if (err.message && err.message.includes("Failed to fetch")) {
        alert("Django Offline: The backend server is not running on port 8000!");
      } else {
        alert("Server Error: " + err.message);
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-slate-950">
      <div className="bg-slate-900 p-8 rounded-xl w-80">
        <h2 className="text-white text-xl mb-4 text-center">Login</h2>

        <input
          className="w-full p-2 mb-3 rounded bg-slate-800 text-white"
          placeholder="Username"
          onChange={e => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-2 mb-3 rounded bg-slate-800 text-white"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-emerald-500 p-2 rounded mb-4"
        >
          Login
        </button>

        <p className="text-slate-400 text-sm text-center">
          Don't have an account?{" "}
          <span 
            className="text-emerald-500 hover:text-emerald-400 cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;