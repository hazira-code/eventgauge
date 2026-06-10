import React from "react";
import { MessageSquareCode, Users, Star, ArrowRight, Sparkles, Building2, ShieldCheck, CheckCircle2 } from "lucide-react";
import { FeedbackItem, EventItem } from "../types.js";

interface HomeViewProps {
  setTab: (tab: string) => void;
  feedbacks: FeedbackItem[];
  events: EventItem[];
}

export default function HomeView({ setTab, feedbacks, events }: HomeViewProps) {
  // Calculators for stats
  const totalReviews = feedbacks.length;
  const ratingSum = feedbacks.reduce((acc, current) => acc + current.rating, 0);
  const avgRating = totalReviews > 0 ? (ratingSum / totalReviews).toFixed(1) : "N/A";

  return (
    <div id="home-view" className="space-y-12">
      {/* Hero Spotlight Section */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 text-white p-8 sm:p-12 lg:p-16 shadow-lg border border-slate-800">
        <div className="absolute inset-0 bg-radial-[circle_at_top_right] from-sky-500/25 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-3xl relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-500/15 border border-sky-500/30 rounded-full text-xs font-semibold text-sky-400">
            <Sparkles className="h-3 w-3" />
            Empowering Event Analytics
          </div>

          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight">
            Enterprise <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-sky-200">
              Event Feedback Platform
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl font-light leading-relaxed">
            We host high-value professional workshops and technical events.
            Your authentic, direct feedback is the catalyst that enables us to continuously
            optimize our learning materials, improve key speakers, upgrade locations, and design superior experiences.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              id="hero-go-events"
              onClick={() => setTab("events")}
              className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white px-5 py-3 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              Explore Sample Events
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              id="hero-go-submit"
              onClick={() => setTab("submit")}
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 px-5 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer"
            >
              Submit Event Review
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Billboard Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600 shrink-0">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">Events Conducted</p>
            <h3 className="text-2xl font-bold font-display text-slate-800">{events.length} Live Workshops</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <Star className="h-6 w-6 fill-amber-400 text-amber-500" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">Average Attendee Rating</p>
            <h3 className="text-2xl font-bold font-display text-slate-800">{avgRating} / 5.0 Stars</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <MessageSquareCode className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">Total Feedback Submissions</p>
            <h3 className="text-2xl font-bold font-display text-slate-800">{totalReviews} Records</h3>
          </div>
        </div>
      </div>

      {/* Why Feedback Matters Section */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-xs p-6 sm:p-8">
        <div className="max-w-3xl space-y-4">
          <h2 className="font-display font-bold text-2xl text-slate-800">
            Connecting Tech Seekers with Professional Excellence
          </h2>
          <p className="text-slate-600 font-light leading-relaxed">
            We deliver first-class skill tracks in modern IT frameworks,
            Zero-Trust networks, and agile management. By gathering high-resolution audience comments,
            we establish:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sky-600 font-semibold text-sm">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Continuous Quality Control
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              We assess every presenter, content topic, and visual asset to maintain world-class professional standards.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sky-600 font-semibold text-sm">
              <Building2 className="h-4 w-4 shrink-0" />
              Venue & Experience Tuning
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Whether conducting online interactive broadcasts or in-person hackathons, physical spacing is engineered for optimal deep focus.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sky-600 font-semibold text-sm">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              Democratic Curriculum
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Future bootcamps are prioritized based directly on the demand and interests highlighted in student comment sheets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
