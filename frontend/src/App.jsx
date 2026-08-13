import React, { useState } from "react";
import "./style.css";

import Header from "./Components/Header.jsx";
import Sidebar from "./Components/Sidebar.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import VideoPlayer from "./pages/VideoPlayer.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Channel from "./pages/Channel.jsx";
import CreateChannel from "./pages/CreateChannel.jsx";

import { Routes, Route, useLocation } from "react-router-dom";

function App() {
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register";

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [search, setSearch] = useState("");

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="vc-mainapp">

      <div className="vc-main">

        {/* HEADER */}
        {!isAuthPage && (
          <Header
            toggleSidebar={toggleSidebar}
            search={search}
            setSearch={setSearch}
          />
        )}

        <div className="vc-mainlayout d-flex">

          {/* SIDEBAR */}
          {!isAuthPage && (
            <Sidebar
              isOpen={isSidebarOpen}
            />
          )}

          {/* ROUTES */}
          <Routes>

            {/* =========================
                HOME
            ========================= */}

            <Route
              path="/"
              element={
                <Home
                  isSidebarOpen={isSidebarOpen}
                  search={search}
                />
              }
            />

            {/* =========================
                AUTH
            ========================= */}

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/register"
              element={<Register />}
            />

            {/* =========================
                CHANNEL
            ========================= */}

            <Route
              path="/channel"
              element={
                <ProtectedRoute>
                  <Channel
                    isSidebarOpen={isSidebarOpen}
                  />
                </ProtectedRoute>
              }
            />

            {/* =========================
                CREATE CHANNEL
            ========================= */}

            <Route
              path="/create-channel"
              element={
                <ProtectedRoute>
                  <CreateChannel
                    isSidebarOpen={isSidebarOpen}
                  />
                </ProtectedRoute>
              }
            />

            {/* =========================
                VIDEO PLAYER
            ========================= */}

            <Route
              path="/watch/:videoId"
              element={
                <VideoPlayer
                  isSidebarOpen={isSidebarOpen}
                />
              }
            />

          </Routes>

        </div>
      </div>
    </div>
  );
}

export default App;