import React from "react";
import { Vote, Calendar, MessageSquare, ClipboardList, Layers } from "lucide-react";

interface HeaderProps {
  currentTab: string;
  setTab: (tab: string) => void;
}

export default function Header({ currentTab, setTab }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Brand Accent */}
          <div 
            onClick={() => setTab("home")} 
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="bg-sky-600 text-white p-2 rounded-lg group-hover:bg-sky-700 transition-colors">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <span className="font-display font-bold text-lg tracking-tight text-slate-900 block leading-tight">
                Nexus
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-sky-600 block leading-none">
                Event Center
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex space-x-1">
            <button
              id="nav-home"
              onClick={() => setTab("home")}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === "home"
                  ? "bg-sky-50 text-sky-700 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Vote className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </button>

            <button
              id="nav-events"
              onClick={() => setTab("events")}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === "events"
                  ? "bg-sky-50 text-sky-700 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Events</span>
            </button>

            <button
              id="nav-submit"
              onClick={() => setTab("submit")}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === "submit"
                  ? "bg-sky-50 text-sky-700 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Submit Feedback</span>
            </button>

            <button
              id="nav-reviews"
              onClick={() => setTab("reviews")}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all relative ${
                currentTab === "reviews"
                  ? "bg-sky-50 text-sky-700 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline">Feedback Review</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
