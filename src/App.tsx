import React, { useState, useEffect } from "react";
import { Sparkles, Terminal, RefreshCw, Server, AlertCircle } from "lucide-react";

import Header from "./components/Header.tsx";
import HomeView from "./components/HomeView.tsx";
import EventsView from "./components/EventsView.tsx";
import FeedbackSubmitForm from "./components/FeedbackSubmitForm.tsx";
import FeedbackReviewsList from "./components/FeedbackReviewsList.tsx";

import { EventItem, FeedbackItem } from "./types.ts";

export default function App() {
  // Navigation & context routing
  const [currentTab, setTab] = useState<string>("home");
  const [selectedEventId, setSelectedEventId] = useState<string>("");

  // Backend datasets
  const [events, setEvents] = useState<EventItem[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);

  // UI flow states
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [apiWelcome, setApiWelcome] = useState<any>(null);

  // Fetch critical server endpoints
  const fetchRuntimeData = async () => {
    setErrorStatus(null);
    try {
      // 1. Fetch backend welcome metadata status
      const apiWelcomeRes = await fetch("/api");
      if (apiWelcomeRes.ok) {
        const welcomeData = await apiWelcomeRes.json();
        setApiWelcome(welcomeData);
      }

      // 2. Fetch sample events list
      const eventsRes = await fetch("/api/events");
      if (!eventsRes.ok) throw new Error("Could not fetch the registered events database.");
      const eventsData = await eventsRes.json();
      setEvents(eventsData);

      // 3. Fetch all feedback records list
      const feedbacksRes = await fetch("/api/feedback");
      if (!feedbacksRes.ok) throw new Error("Could not retrieve the event comments library.");
      const feedbacksData = await feedbacksRes.json();
      setFeedbacks(feedbacksData);

    } catch (err: any) {
      console.error("Endpoint retrieval error:", err);
      setErrorStatus(err.message || "Failed to initialize standard API handshakes.");
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchRuntimeData();
  }, []);

  // Quick action from Event Card: "Leave Feedback"
  const handleSelectEventForFeedback = (eventId: string) => {
    setSelectedEventId(eventId);
    setTab("submit");
  };

  // Append new item locally
  const handleAddNewFeedback = (newFeedback: FeedbackItem) => {
    setFeedbacks((prev) => [newFeedback, ...prev]);
  };

  // Remote Delete & local state clean-up
  const handleDeleteFeedback = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/feedback/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.error || "System rejected standard deletion parameter.");
      }

      // Sync local UI states
      setFeedbacks((prev) => prev.filter((item) => item.id !== id));
      return true;
    } catch (err: any) {
      alert(err.message || "An exception blocked the deletion command.");
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-800 flex flex-col font-sans selection:bg-sky-500/10 selection:text-sky-700">
      {/* Primary Brand Navigation Navbar */}
      <Header currentTab={currentTab} setTab={setTab} />

      {/* Main Container Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Loading Spinner card details */}
        {initialLoading ? (
          <div className="flex flex-col items-center justify-center py-24 sm:py-32 space-y-4">
            <div className="h-12 w-12 border-4 border-sky-600/30 border-t-sky-600 rounded-full animate-spin" />
            <p className="text-slate-500 font-medium font-display tracking-tight text-base">
              Synchronizing with backend service...
            </p>
            <p className="text-xs text-slate-400 font-mono">
              Booting Express Engine &amp; SQLite/JSON persistent file tables
            </p>
          </div>
        ) : errorStatus ? (
          /* Error Fallback screen */
          <div className="max-w-xl mx-auto bg-white border border-rose-100 rounded-2xl shadow-sm p-8 text-center space-y-6">
            <div className="mx-auto h-14 w-14 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
              <AlertCircle className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <h3 className="font-display font-bold text-xl text-slate-800">Connection Interrupted</h3>
              <p className="text-sm text-slate-500 font-light leading-relaxed">
                We're offline! The web browser failed to assert a clean handshake sequence with
                the server runtime. Details: <code className="text-xs text-rose-600 font-mono bg-rose-50 px-1.5 py-0.5 rounded">{errorStatus}</code>
              </p>
            </div>
            <button
              onClick={fetchRuntimeData}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2.5 rounded-lg cursor-pointer transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reconnection attempt
            </button>
          </div>
        ) : (
          /* Dynamic Routing View Rendering */
          <div className="space-y-8 animate-fade-in">
            {/* Server Welcome Ribbon */}
            {apiWelcome && apiWelcome.message && (
              <div className="bg-slate-900 text-slate-100 px-4 py-2.5 rounded-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs font-mono shadow-xs">
                <span className="flex items-center gap-2 font-medium">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <Server className="h-3.5 w-3.5 text-sky-400" />
                  API STATUS LIVE: {apiWelcome.message}
                </span>
                <span className="text-slate-400 text-[10px] uppercase tracking-wider">
                  System: node.js CJS Engine | Host: {apiWelcome.corporate}
                </span>
              </div>
            )}

            {currentTab === "home" && (
              <HomeView
                setTab={setTab}
                feedbacks={feedbacks}
                events={events}
              />
            )}

            {currentTab === "events" && (
              <EventsView
                events={events}
                onSelectEventForFeedback={handleSelectEventForFeedback}
              />
            )}

            {currentTab === "submit" && (
              <FeedbackSubmitForm
                events={events}
                preselectedEventId={selectedEventId}
                onSuccess={handleAddNewFeedback}
                setTab={setTab}
              />
            )}

            {currentTab === "reviews" && (
              <FeedbackReviewsList
                feedbacks={feedbacks}
                events={events}
                onDeleteFeedback={handleDeleteFeedback}
              />
            )}
          </div>
        )}
      </main>

      {/* Corporate Professional Footer */}
      <footer className="bg-white border-t border-slate-100 py-10 shrink-0 text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="flex justify-center items-center gap-2.5 font-bold font-display text-slate-700">
            <span className="text-sky-600 font-mono tracking-wider text-[11px] uppercase bg-slate-50 border border-slate-200 px-2 py-1 rounded">
              Nexus Solutions
            </span>
            <span className="text-sm font-semibold text-slate-600">Event Feedback System</span>
          </div>
          <p className="text-xs text-slate-400 max-w-xl mx-auto font-light leading-normal">
            Designed and compiled under high educational standards. Preserving data integrity
            and constructive learner collaboration across global technical platforms.
          </p>
          <div className="text-[10px] font-mono text-slate-400 pt-1.5 border-t border-slate-50">
            &copy; {new Date().getFullYear()} Nexus Solutions. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
