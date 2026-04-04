// ============================================================
// pages/ElderDashboard.js - Elder's Main Dashboard
// Shows: Health status, SOS button, task requests, quick actions
// ============================================================

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaHeartbeat, FaExclamationTriangle, FaTasks, FaComments,
  FaPills, FaRunning, FaUsers, FaMapMarkerAlt, FaSignOutAlt,
  FaBell, FaShareAlt, FaCopy, FaUser
} from "react-icons/fa";

// ============================================================
// ElderDashboard Component
// ============================================================
const ElderDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("home"); // Current active section
  const [showPairingCode, setShowPairingCode] = useState(false); // Toggle pairing code display

  // ---- Copy pairing code to clipboard ----
  const copyPairingCode = () => {
    const code = user?.elderData?.pairingCode || "------";
    navigator.clipboard.writeText(code);
    toast.success("Pairing code copied to clipboard!");
  };

  // ---- Handle SOS trigger ----
  const handleSOS = () => {
    const confirmed = window.confirm(
      "🚨 SEND SOS ALERT?\n\nThis will immediately notify your emergency contacts and nearby volunteers.\n\nAre you sure you need help?"
    );
    if (confirmed) {
      // TODO: Emit SOS via Socket.io
      toast.error("🚨 SOS SENT! Help is on the way!", { duration: 6000 });
    }
  };

  // ---- Sidebar navigation items ----
  const navItems = [
    { id: "home", label: "Home", icon: <FaHeartbeat size={22} /> },
    { id: "health", label: "Health & Vitals", icon: <FaHeartbeat size={22} /> },
    { id: "tasks", label: "Request Help", icon: <FaTasks size={22} /> },
    { id: "messages", label: "Messages", icon: <FaComments size={22} /> },
    { id: "medication", label: "Medication", icon: <FaPills size={22} /> },
    { id: "wellness", label: "Wellness", icon: <FaRunning size={22} /> },
    { id: "social", label: "Social Circle", icon: <FaUsers size={22} /> },
    { id: "travel", label: "Travel Escort", icon: <FaMapMarkerAlt size={22} /> },
    { id: "profile", label: "My Profile", icon: <FaUser size={22} /> },
  ];

  return (
    <div className="min-h-screen bg-neutral-100 flex">

      {/* ============================================================
          SIDEBAR NAVIGATION
          ============================================================ */}
      <aside className="w-72 bg-primary text-white flex flex-col shadow-senior-lg flex-shrink-0">
        {/* Logo & User Info */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center text-2xl font-bold flex-shrink-0">
              {user?.fullName?.charAt(0) || "E"}
            </div>
            <div>
              <p className="font-bold text-lg leading-tight">{user?.fullName}</p>
              <p className="text-neutral-300 text-sm">Senior ID: {user?.elderData?.seniorId || "N/A"}</p>
            </div>
          </div>
          {/* Share Access Button */}
          <button
            onClick={() => setShowPairingCode(!showPairingCode)}
            className="flex items-center gap-2 w-full bg-white/10 hover:bg-white/20 rounded-senior px-4 py-3 font-semibold transition-all"
          >
            <FaShareAlt /> Share Access with Caregiver
          </button>
          {/* Pairing Code Display */}
          {showPairingCode && (
            <div className="mt-3 bg-white/10 rounded-senior p-4 text-center">
              <p className="text-neutral-300 text-sm mb-1">Your Pairing Code</p>
              <p className="text-3xl font-bold tracking-widest text-accent">
                {user?.elderData?.pairingCode || "------"}
              </p>
              <button onClick={copyPairingCode} className="flex items-center gap-2 mx-auto mt-2 text-sm text-neutral-300 hover:text-white">
                <FaCopy /> Copy Code
              </button>
              <p className="text-xs text-neutral-400 mt-1">Share this with your caregiver</p>
            </div>
          )}
        </div>

        {/* Navigation Items */}
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

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => { logout(); navigate("/login"); }}
            className="sidebar-item w-full text-red-300 hover:bg-red-500 hover:text-white"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* ============================================================
          MAIN CONTENT AREA
          ============================================================ */}
      <main className="flex-1 p-6 overflow-y-auto">

        {/* ---- Top Bar ---- */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-primary">
              Good day, {user?.fullName?.split(" ")[0]}! 👋
            </h1>
            <p className="text-neutral-500">Here's your health overview for today</p>
          </div>
          <button className="relative p-3 bg-white rounded-full shadow-senior hover:shadow-senior-lg transition-all">
            <FaBell size={22} className="text-primary" />
            <span className="absolute top-1 right-1 w-3 h-3 bg-accent rounded-full" />
          </button>
        </div>

        {/* ============================================================
            SOS EMERGENCY BUTTON - Always visible and prominent
            ============================================================ */}
        <div className="card bg-red-50 border-2 border-red-200 mb-6 text-center">
          <p className="text-neutral-600 font-semibold mb-4 text-senior-base">
            🚨 Emergency? Press the button below immediately!
          </p>
          <button
            onClick={handleSOS}
            className="sos-pulse inline-flex items-center justify-center gap-3 bg-accent text-white font-bold text-2xl px-12 py-6 rounded-full shadow-senior-lg hover:bg-accent-dark transition-all"
          >
            <FaExclamationTriangle size={32} />
            SOS - SEND HELP NOW
          </button>
          <p className="text-neutral-400 text-sm mt-3">
            Alerts your emergency contacts and nearby volunteers instantly
          </p>
        </div>

        {/* ============================================================
            QUICK STATS CARDS
            ============================================================ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Heart Rate */}
          <div className="card text-center">
            <FaHeartbeat size={32} className="text-red-500 mx-auto mb-2" />
            <p className="text-neutral-500 text-sm font-medium">Heart Rate</p>
            <p className="text-3xl font-bold text-primary">-- bpm</p>
            <p className="text-xs text-neutral-400 mt-1">Connect IoT device</p>
          </div>
          {/* Blood Oxygen */}
          <div className="card text-center">
            <span className="text-3xl block mb-2">🩸</span>
            <p className="text-neutral-500 text-sm font-medium">Blood Oxygen</p>
            <p className="text-3xl font-bold text-primary">-- %</p>
            <p className="text-xs text-neutral-400 mt-1">Connect IoT device</p>
          </div>
          {/* Today's Tasks */}
          <div className="card text-center">
            <FaTasks size={32} className="text-blue-500 mx-auto mb-2" />
            <p className="text-neutral-500 text-sm font-medium">Pending Tasks</p>
            <p className="text-3xl font-bold text-primary">0</p>
            <p className="text-xs text-neutral-400 mt-1">No pending requests</p>
          </div>
          {/* Medication */}
          <div className="card text-center">
            <FaPills size={32} className="text-green-500 mx-auto mb-2" />
            <p className="text-neutral-500 text-sm font-medium">Medications Today</p>
            <p className="text-3xl font-bold text-primary">0</p>
            <p className="text-xs text-neutral-400 mt-1">No reminders set</p>
          </div>
        </div>

        {/* ============================================================
            QUICK ACTION BUTTONS
            ============================================================ */}
        <div className="card mb-6">
          <h2 className="text-xl font-bold text-primary mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Request Help", icon: "🙋", color: "bg-blue-50 hover:bg-blue-100 border-blue-200", section: "tasks" },
              { label: "Send Message", icon: "💬", color: "bg-green-50 hover:bg-green-100 border-green-200", section: "messages" },
              { label: "Medication", icon: "💊", color: "bg-yellow-50 hover:bg-yellow-100 border-yellow-200", section: "medication" },
              { label: "Exercise", icon: "🏃", color: "bg-purple-50 hover:bg-purple-100 border-purple-200", section: "wellness" },
              { label: "Social", icon: "👥", color: "bg-pink-50 hover:bg-pink-100 border-pink-200", section: "social" },
              { label: "Travel Help", icon: "🚗", color: "bg-orange-50 hover:bg-orange-100 border-orange-200", section: "travel" },
            ].map((action) => (
              <button
                key={action.label}
                onClick={() => setActiveSection(action.section)}
                className={`flex flex-col items-center gap-2 p-5 rounded-senior border-2 font-bold text-neutral-700 transition-all ${action.color}`}
              >
                <span className="text-4xl">{action.icon}</span>
                <span className="text-senior-base">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ============================================================
            MODULE PLACEHOLDER (shown when section is selected)
            ============================================================ */}
        {activeSection !== "home" && (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">🚧</div>
            <h3 className="text-xl font-bold text-primary mb-2">
              {navItems.find((n) => n.id === activeSection)?.label} Module
            </h3>
            <p className="text-neutral-500 text-senior-base">
              This module is under development and will be available soon.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ElderDashboard;
