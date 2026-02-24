import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./context/UserContext";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AddCertification from "./pages/AddCertification";
import Profile from "./pages/Profile";
import PublicProfile from "./pages/PublicProfile";
import Directory from "./pages/Directory";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import Feed from "./pages/Feed";
import VerifyCertificate from "./pages/VerifyCertificate";

function App() {
  const { currentUser } = useContext(UserContext);

  return (
    <>
      <Navbar />

      <div className="pt-20">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-certification"
            element={
              <ProtectedRoute>
                <AddCertification />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route path="/profile/:userId" element={<PublicProfile />} />

          <Route
            path="/directory"
            element={
              <ProtectedRoute>
                <Directory />
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ✅ ADMIN ROUTE */}
          <Route
            path="/admin"
            element={
              currentUser?.role === "admin"
                ? <AdminDashboard />
                : <Navigate to="/dashboard" />
            }
          />

          <Route path="/feed" element={<Feed />} />
          <Route path="/verify/:certificateId" element={<VerifyCertificate />} />
        </Routes>
      </div>
    </>
  );
}

export default App;