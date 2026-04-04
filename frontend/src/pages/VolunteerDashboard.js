// ============================================================
// pages/VolunteerDashboard.js - Volunteer's Main Dashboard
// Shows: Available tasks, points/badges, availability toggle, leaderboard
// ============================================================

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  FaTasks, FaTrophy, FaMapMarkerAlt, FaComments, FaSignOutAlt,
  FaUser, FaToggleOn, FaToggleOff, FaBell, FaStar
} from "react-icons/fa";

const VolunteerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("home");
  const [isLive, setIsLive] = useState(user?.volunteerData?.isLive || false);

  const navItems = [
    { id: "home", label: "Dashboard", icon: <FaTasks size={22} /> },
    { id: "tasks", label: "Available Tasks", icon: <FaTasks size={22} /> },
    { id: "my-tasks", label: "My Tasks", icon: <FaTasks size={22} /> },
    { id: "rewards", label: "Points & Badges", icon: <FaTrophy size={22} /> },
    { id: "leaderboard", label: "Leaderboard", icon: <FaStar size={22} /> },
    { id: "messages", label: "Messages", icon: <FaComments size={22} /> },
    { id: "location", label: "My Location", icon: <FaMapMarkerAlt size={22} /> },
    { id: "profile", label: "My Profile", icon: <FaUser size={22} /> },
  ];

  const handleToggleLive = () => {
    setIsLive(!isLive);
    // TODO: Emit socket event to update volunteer availability
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-primary text-white flex flex-col shadow-senior-lg flex-shrink-0">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center text-2xl font-bold">
              {user?.fullName?.charAt(0) || "V"}
            </div>
            <div>
              <p className="font-bold text-lg">{user?.fullName}</p>
              <p className="text-neutral-300 text-sm">Volunteer</p>
            </div>
          </div>
          {/* Points Display */}
          <div className="bg-white/10 rounded-senior px-4 py-3 mb-3 text-center">
            <p className="text-neutral-300 text-sm">Total Points</p>
            <p className="text-3xl font-bold text-accent">{user?.volunteerData?.totalPoints || 0}</p>
          </div>
          {/* Live Toggle */}
          <button
            onClick={handleToggleLive}
            className={`flex items-center gap-3 w-full rounded-senior px-4 py-3 font-semibold transition-all
              ${isLive ? "bg-success/20 text-green-300" : "bg-white/10 text-neutral-300"}`}
          >
            {isLive ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
            {isLive ? "🟢 Available for Tasks" : "⚫ Go Online"}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`sidebar-item w-full ${activeSection === item.id ? "sidebar-item-active" : ""}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={() => { logout(); navigate("/login"); }} className="sidebar-item w-full text-red-300 hover:bg-red-500 hover:text-white">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-primary">Volunteer Dashboard</h1>
            <p className="text-neutral-500">
              {isLive ? "🟢 You are online and available for tasks" : "⚫ Go online to receive task requests"}
            </p>
          </div>
          <button className="relative p-3 bg-white rounded-full shadow-senior">
            <FaBell size={22} className="text-primary" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Points", value: user?.volunteerData?.totalPoints || 0, icon: "⭐", color: "text-yellow-500" },
            { label: "Tasks Completed", value: 0, icon: "✅", color: "text-green-500" },
            { label: "Badges Earned", value: user?.volunteerData?.badges?.length || 0, icon: "🏅", color: "text-blue-500" },
            { label: "Service Radius", value: `${user?.volunteerData?.serviceRadius || 5} km`, icon: "📍", color: "text-purple-500" },
          ].map((stat) => (
            <div key={stat.label} className="card text-center">
              <span className="text-3xl block mb-2">{stat.icon}</span>
              <p className="text-neutral-500 text-sm font-medium">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Available Tasks */}
        <div className="card mb-6">
          <h2 className="text-xl font-bold text-primary mb-4">Available Tasks Near You</h2>
          {!isLive ? (
            <div className="text-center py-8">
              <FaToggleOff size={48} className="mx-auto mb-3 text-neutral-300" />
              <p className="text-neutral-500 text-senior-base">Go online to see available tasks in your area.</p>
              <button onClick={handleToggleLive} className="btn-primary mt-4 max-w-xs mx-auto">
                Go Online Now
              </button>
            </div>
          ) : (
            <div className="text-center py-8 text-neutral-400">
              <FaTasks size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-senior-base">No tasks available in your area right now. Check back soon!</p>
            </div>
          )}
        </div>

        {/* Skills & Schedule */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="card">
            <h3 className="text-lg font-bold text-primary mb-3">My Skills</h3>
            <div className="flex flex-wrap gap-2">
              {(user?.volunteerData?.skills || []).length > 0
                ? user.volunteerData.skills.map((skill) => (
                    <span key={skill} className="bg-primary text-white px-4 py-2 rounded-full font-semibold text-sm">
                      {skill}
                    </span>
                  ))
                : <p className="text-neutral-400">No skills added yet</p>
              }
            </div>
          </div>
          <div className="card">
            <h3 className="text-lg font-bold text-primary mb-3">My Schedule</h3>
            <div className="flex flex-wrap gap-2">
              {(user?.volunteerData?.availability?.days || []).map((day) => (
                <span key={day} className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold text-sm">
                  {day.slice(0, 3)}
                </span>
              ))}
              {(user?.volunteerData?.availability?.days || []).length === 0 && (
                <p className="text-neutral-400">No schedule set</p>
              )}
            </div>
          </div>
        </div>

        {/* Module Placeholder */}
        {activeSection !== "home" && (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">🚧</div>
            <h3 className="text-xl font-bold text-primary mb-2">
              {navItems.find((n) => n.id === activeSection)?.label} Module
            </h3>
            <p className="text-neutral-500 text-senior-base">This module is under development.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default VolunteerDashboard;
