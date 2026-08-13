import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Mic,
  User,
  LogOut,
} from "lucide-react";

import logo from "../../public/images/logo.svg";
import { useAuth } from "../context/AuthContext";

function Header({
  toggleSidebar,
  search,
  setSearch,
}) {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="vc-header">

      {/* =========================
          LEFT: MENU + LOGO
      ========================= */}
      <div className="vc-headlogo flex flex-row items-center gap-3">

        <button
          type="button"
          className="vc-humburger"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className="vc-logo">
          <Link to="/">
            <img
              src={logo}
              alt="YouTube Clone"
            />
          </Link>
        </div>

      </div>

      {/* =========================
          CENTER: SEARCH
      ========================= */}
      <div className="vc-search flex items-center justify-between gap-2">

        <div className="vc-search-icon">

          <input
            type="text"
            placeholder="Search Here..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="Search-bar flex-1 px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="button"
            className="search-btn px-5 py-2 border border-l-0 border-gray-300 rounded-r-full bg-gray-100 transition"
            aria-label="Search"
          >
            <Search
              size={22}
              className="text-black"
            />
          </button>

        </div>

        <div className="vc-mic-icon">

          <button
            type="button"
            className="voice-btn p-2 rounded-full transition"
            aria-label="Voice search"
          >
            <Mic
              size={20}
              className="text-black"
            />
          </button>

        </div>

      </div>

      {/* =========================
          RIGHT: USER
      ========================= */}
      <div className="vc-profile flex gap-3 items-center">

        {!user ? (

          /* =========================
             BEFORE LOGIN
          ========================= */
          <button
            type="button"
            className="signin-button"
            onClick={() => navigate("/login")}
          >
            Sign In
          </button>

        ) : (

          /* =========================
             AFTER LOGIN
          ========================= */
          <div className="flex items-center gap-3">

            <div className="header-user flex items-center gap-2">

              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">

                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User
                    size={22}
                    className="text-gray-700"
                  />
                )}

              </div>

              <span className="font-medium">
                {user.username}
              </span>

            </div>

            <button
              type="button"
              className="signin-button flex items-center gap-2"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              Logout
            </button>

          </div>
        )}

      </div>

    </header>
  );
}

export default Header;