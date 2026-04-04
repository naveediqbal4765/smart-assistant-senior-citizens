// ============================================================
// pages/CaregiverDashboard.js - Caregiver's Main Dashboard
// Shows: Elder's live health data, location, alerts, task management
// ============================================================

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  FaHeartbeat, FaMapMarkerAlt, FaBell, FaTasks, FaComments,
  FaSignOutAlt, FaUser, FaToggleOn, FaToggleOff, FaExclamationTriangle
} from "react-icons/fa";

const CaregiverDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("home");
  const [isAvailable, setIsAvailable] = useState(user?.caregiverData?.isAvailable || true);

  const navItems = [
    { id: "home", label: "Overview", icon: <FaHeartbeat size={22} /> },
    { id: "health", label: "Elder's Health", icon: <FaHeartbeat size={22} /> },
    { id: "location", label: "Live Location", icon: <FaMapMarkerAlt size={22} /> },
    { id: "alerts", label: "SOS Alerts", icon: <FaExclamationTriangle size={22} /> },
    { id: "tasks", label: "Task Management", icon: <FaTasks size={22} /> },
    { id: "messages", label: "Messages", icon: <FaComments size={22} /> },
    { id: "profile", label: "My Profile", icon: <FaUser size={22} /> },
  ];

  const linkedElder = user?.caregiverData?.isPaired
    ? { name: "Linked Elder", email: user?.caregiverData?.linkedElderEmail }
    : null;

  return (
    <div className="min-h-screen bg-neutral-100 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-primary text-white flex flex-col shadow-senior-lg flex-shrink-0">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-pink-500 flex items-center justify-center text-2xl font-bold">
              {user?.fullName?.charAt(0) || "C"}
            </div>
            <div>
              <p className="font-bold text-lg">{user?.fullName}</p>
              <p className="text-neutral-300 text-sm">Caregiver</p>
            </div>
          </div>
          {/* Availability Toggle */}
          <button
            onClick={() => setIsAvailable(!isAvailable)}
            className={`flex items-center gap-3 w-full rounded-senior px-4 py-3 font-semibold transition-all
              ${isAvailable ? "bg-success/20 text-green-300" : "bg-white/10 text-neutral-300"}`}
          >
            {isAvailable ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
            {isAvailable ? "Available to Monitor" : "Currently Unavailable"}
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
            <h1 className="text-2xl font-bold text-primary">Caregiver Dashboard</h1>
            <p className="text-neutral-500">Monitoring: {linkedElder?.email || "No elder linked yet"}</p>
          </div>
          <button className="relative p-3 bg-white rounded-full shadow-senior">
            <FaBell size={22} className="text-primary" />
          </button>
        </div>

        {/* Pairing Status */}
        {!user?.caregiverData?.isPaired && (
          <div className="card bg-yellow-50 border-2 border-yellow-200 mb-6">
            <div className="flex items-center gap-4">
              <span className="text-4xl">🔗</span>
              <div>
                <h3 className="text-lg font-bold text-neutral-800">Not Linked to an Elder</h3>
                <p className="text-neutral-600">Ask the elder for their email and 6-digit pairing code to link accounts.</p>
              </div>
            </div>
          </div>
        )}

        {/* Health Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Heart Rate", value: "-- bpm", icon: "❤️", color: "text-red-500" },
            { label: "Blood Oxygen", value: "-- %", icon: "🩸", color: "text-blue-500" },
            { label: "Last Location", value: "Unknown", icon: "📍", color: "text-green-500" },
            { label: "SOS Alerts", value: "0", icon: "🚨", color: "text-orange-500" },
          ].map((stat) => (
            <div key={stat.label} className="card text-center">
              <span className="text-3xl block mb-2">{stat.icon}</span>
              <p className="text-neutral-500 text-sm font-medium">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-neutral-400 mt-1">
                {user?.caregiverData?.isPaired ? "Waiting for data..." : "Link elder first"}
              </p>
            </div>
          ))}
        </div>

        {/* Recent Alerts */}
        <div className="card mb-6">
          <h2 className="text-xl font-bold text-primary mb-4">Recent Alerts</h2>
          <div className="text-center py-8 text-neutral-400">
            <FaBell size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-senior-base">No alerts yet. You'll be notified here when the elder needs help.</p>
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

export default CaregiverDashboard;
