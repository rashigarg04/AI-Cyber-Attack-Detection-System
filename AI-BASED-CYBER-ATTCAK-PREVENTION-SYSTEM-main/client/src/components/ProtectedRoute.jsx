import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [auth, setAuth] = useState(null); // null = loading

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAuth(false);
      return;
    }

    fetch("http://127.0.0.1:8000/api/check/", {
      headers: {
        "Authorization": `Token ${token}`
      }
    })
      .then(res => {
        if (res.status === 401) {
          setAuth(false);
          return;
        }
        return res.json();
      })
      .then(data => {
        if (data && data.authenticated) {
          setAuth(true);
        }
      })
      .catch(err => {
        console.log(err);
        setAuth(false);
      });
  }, []);

  if (auth === null) return <div>Loading...</div>;

  if (!auth) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;