import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Layout Components
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Page Components
import Dashboard from './pages/Dashboard';
import ThreatLogs from './pages/ThreatLogs';
import Settings from './pages/Settings';
import NetworkMap from './pages/NetworkMap';
import Firewall from './pages/Firewall';

function Layout() {
  return (
    <div className="flex bg-slate-950 min-h-screen font-sans text-slate-200">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 overflow-y-auto bg-slate-950 flex flex-col">
          <div className="flex-1">
            <Routes>

              {/* 🔒 Protected Routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />

              <Route path="/logs" element={
                <ProtectedRoute>
                  <ThreatLogs />
                </ProtectedRoute>
              } />

              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />

              <Route path="/network" element={
                <ProtectedRoute>
                  <NetworkMap />
                </ProtectedRoute>
              } />

              <Route path="/firewall" element={
                <ProtectedRoute>
                  <Firewall />
                </ProtectedRoute>
              } />

              {/* 404 */}
              <Route path="*" element={
                <div className="p-8 text-slate-500 font-mono">
                  404_COMMAND_NOT_FOUND
                </div>
              } />

            </Routes>
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}

function AppRoutes() {
  const location = useLocation();

  // 👉 If login page → no sidebar/navbar
  if (location.pathname === "/login" || location.pathname === "/register") {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    );
  }

  return <Layout />;
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
