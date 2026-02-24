import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

function Navbar() {
  const location = useLocation();
  const { currentUser, logout, certifications } = useContext(UserContext);

  // Calculate pending renewal requests for admin
  const pendingRequests = certifications.filter(
    (cert) => cert.renewalStatus === "pending"
  );

  const linkStyle = (path) =>
    `transition font-medium ${
      location.pathname === path
        ? "text-pink-500"
        : "text-gray-600 hover:text-pink-500"
    }`;

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-lg border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-400 bg-clip-text text-transparent"
        >
          CertiVault
        </Link>

        <div className="flex gap-6 text-sm items-center">

          {currentUser && (
  <Link to="/feed" className={linkStyle("/feed")}>
    Feed
  </Link>
)}

          {!currentUser && (
            <>
              <Link to="/login" className={linkStyle("/login")}>
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-xl font-medium"
              >
                Sign Up
              </Link>
            </>
          )}

          {currentUser && currentUser.role === "user" && (
            <>
              <Link to="/dashboard" className={linkStyle("/dashboard")}>
                Dashboard
              </Link>
              <Link to="/add-certification" className={linkStyle("/add-certification")}>
                Add
              </Link>
              <Link to="/directory" className={linkStyle("/directory")}>
                Directory
              </Link>
              <Link to="/profile" className={linkStyle("/profile")}>
                Profile
              </Link>
            </>
          )}

          {currentUser && currentUser.role === "admin" && (
            <>
              <Link to="/admin" className={linkStyle("/admin")}>
                Admin
                {pendingRequests.length > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {pendingRequests.length}
                  </span>
                )}
              </Link>
              <Link to="/directory" className={linkStyle("/directory")}>
                Directory
              </Link>
            </>
          )}

          {currentUser && (
            <button
              onClick={logout}
              className="text-red-500 hover:text-red-700 font-medium"
            >
              Logout
            </button>
          )}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;