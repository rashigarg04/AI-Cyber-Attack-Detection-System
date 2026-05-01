import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.status === 200) {
        alert("Registration successful! Please login.");
        navigate("/login");
      } else {
        alert(data.error || "Registration failed");
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
        <h2 className="text-emerald-500 font-bold text-xl mb-4 text-center">Create Account</h2>

        <input
          className="w-full p-2 mb-3 rounded bg-slate-800 text-white"
          placeholder="New Username"
          onChange={e => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-2 mb-3 rounded bg-slate-800 text-white"
          placeholder="New Password"
          onChange={e => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-slate-700 hover:bg-slate-600 text-white p-2 rounded mb-4 transition"
        >
          Sign Up
        </button>

        <p className="text-slate-400 text-sm text-center">
          Already have an account?{" "}
          <span 
            className="text-emerald-500 hover:text-emerald-400 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
