import React, { useState } from "react";
import { Trash2, Star, Calendar, Filter, User, Mail, Sparkles, MessageSquare, AlertTriangle } from "lucide-react";
import { FeedbackItem, EventItem } from "../types.js";

interface FeedbackReviewsListProps {
  feedbacks: FeedbackItem[];
  events: EventItem[];
  onDeleteFeedback: (id: string) => Promise<boolean>;
}

export default function FeedbackReviewsList({
  feedbacks,
  events,
  onDeleteFeedback,
}: FeedbackReviewsListProps) {
  const [selectedEventId, setSelectedEventId] = useState<string>("All");
  const [selectedRating, setSelectedRating] = useState<string>("All");
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  // Filter feedback
  const filteredFeedbacks = feedbacks.filter((item) => {
    const matchesEvent = selectedEventId === "All" || item.eventId === selectedEventId;
    const matchesRating = selectedRating === "All" || item.rating.toString() === selectedRating;
    return matchesEvent && matchesRating;
  });

  // Calculate review stats for selected view
  const totalReviews = filteredFeedbacks.length;
  const avgRating =
    totalReviews > 0
      ? (filteredFeedbacks.reduce((sum, f) => sum + f.rating, 0) / totalReviews).toFixed(1)
      : "0";

  // Build count statistics for visual ratings breakdowns
  const ratingDistribution = [0, 0, 0, 0, 0]; // Index 0 is 1 star, 4 is 5 star
  filteredFeedbacks.forEach((f) => {
    if (f.rating >= 1 && f.rating <= 5) {
      ratingDistribution[f.rating - 1]++;
    }
  });

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you absolutely sure you want to permanently delete this event feedback submission card? This cannot be undone.")) {
      setIsDeletingId(id);
      try {
        await onDeleteFeedback(id);
      } catch (err) {
        console.error("Failed to delete feedback entry:", err);
      } finally {
        setIsDeletingId(null);
      }
    }
  };

  return (
    <div id="feedback-reviews-view" className="space-y-8 animate-fade-in">
      {/* List Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-3xl text-slate-800 tracking-tight">
            Submitted Feedback Reviews
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Displaying permanent backend records retrieved directly from the file database.
            Administrators can filter comments or delete outdated entries securely.
          </p>
        </div>

        <div className="text-xs text-slate-500 font-mono bg-sky-50 border border-sky-100 rounded-lg px-4 py-2.5">
          <span className="font-bold text-sky-700">Durable Persisted Storage:</span> {feedbacks.length} Global Records
        </div>
      </div>

      {/* Stats Summary & Rating Visualizer Block */}
      {feedbacks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-white p-6 rounded-2xl border border-slate-150 shadow-xs">
          {/* Box 1: Highlights */}
          <div className="md:col-span-1 flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-6 text-center md:text-left">
            <p className="text-xs font-mono text-slate-400 uppercase tracking-widest leading-none">
              Scope Average
            </p>
            <h4 className="text-5xl font-extrabold font-display text-slate-800 mt-2 leading-none flex items-baseline justify-center md:justify-start gap-1">
              {avgRating} <span className="text-sm font-semibold text-slate-400">/ 5.0</span>
            </h4>
            <div className="flex gap-1 justify-center md:justify-start mt-2 text-amber-400">
              {(() => {
                const num = Math.round(Number(avgRating));
                return Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4.5 w-4.5 ${i < num ? "fill-amber-400 text-amber-500" : "text-slate-200"}`}
                  />
                ));
              })()}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Based on {totalReviews} sorted reviews in current filtered selection scope.
            </p>
          </div>

          {/* Box 2 & 3 Combined: Distribution bar-charts (Pure HTML + Tailwind) */}
          <div className="md:col-span-3 flex flex-col justify-center space-y-2 pt-2 md:pt-0">
            <p className="text-xs font-semibold text-slate-600 block font-sans">
              Score Breakdown Metrics
            </p>
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = ratingDistribution[stars - 1];
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              return (
                <div key={stars} className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                  <span className="w-12 text-right flex items-center justify-end gap-1 font-bold">
                    {stars} <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                  </span>
                  
                  {/* Progress track */}
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sky-500 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <span className="w-10 text-slate-400 text-left font-semibold">
                    {count} ({percentage.toFixed(0)}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filters Hub Dashboard */}
      <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Dynamic Event selection */}
        <div className="space-y-1">
          <label htmlFor="filter-event" className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider font-mono">
            Filter by Attended Event
          </label>
          <div className="relative">
            <select
              id="filter-event"
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-sky-500/10 focus:border-sky-500 transition-all cursor-pointer font-sans"
            >
              <option value="All">All Registered Workshops ({events.length})</option>
              {events.map((e) => (
                <option key={e.id} value={e.id}>
                  [{e.category}] {e.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dynamic Rating selection */}
        <div className="space-y-1">
          <label htmlFor="filter-rating" className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider font-mono">
            Filter by Performance Rating
          </label>
          <select
            id="filter-rating"
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-sky-500/10 focus:border-sky-500 transition-all cursor-pointer font-sans"
          >
            <option value="All">All Star Score Scales</option>
            <option value="5">Outstanding (5 Stars)</option>
            <option value="4">Great (4 Stars)</option>
            <option value="3">Satisfactory (3 Stars)</option>
            <option value="2">Requires Improvement (2 Stars)</option>
            <option value="1">Critical / Poor (1 Star)</option>
          </select>
        </div>
      </div>

      {/* Main feedback loop reviews rendering */}
      {filteredFeedbacks.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-150 shadow-xs p-6">
          <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-display font-semibold text-slate-700">No matching feedback records found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Try adjusting your workspace drop-down filters above, check another event tab, or be the first to submit feedback card!
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredFeedbacks.map((f) => (
            <div
              key={f.id}
              id={`review-item-${f.id}`}
              className="bg-white rounded-xl border border-slate-150 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row justify-between"
            >
              {/* Item main body */}
              <div className="p-6 flex-1 space-y-4">
                {/* Header info */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-50 pb-3">
                  <div className="space-y-1">
                    <span className="font-display font-bold text-sm text-sky-800 px-2.5 py-1 bg-sky-50 rounded-md border border-sky-100">
                      {f.eventTitle}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block mt-1">
                      Event ID: <span className="font-semibold text-slate-500">{f.eventId}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1.5 rounded-md border border-amber-100 max-w-fit">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < f.rating ? "fill-amber-400 text-amber-500" : "text-slate-200"
                        }`}
                      />
                    ))}
                    <span className="text-xs font-bold text-amber-700 font-mono ml-1">{f.rating}.0</span>
                  </div>
                </div>

                {/* Main comments block */}
                <p className="text-slate-700 text-sm italic font-light font-sans leading-relaxed whitespace-pre-wrap">
                  "{f.comment}"
                </p>

                {/* Tags highlights categories checkboxes */}
                {f.categories && f.categories.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider mr-1">
                      Honored Strengths:
                    </span>
                    {f.categories.map((c) => (
                      <span
                        key={c}
                        className="text-[10px] font-bold text-sky-600 bg-sky-500/10 border border-sky-500/10 px-2 py-0.5 rounded-full"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Author & Actions Sidebar Panel */}
              <div className="border-t md:border-t-0 md:border-l border-slate-100 bg-slate-50/70 p-5 shrink-0 md:w-60 flex flex-col justify-between gap-4">
                {/* User author cards info */}
                <div className="space-y-3">
                  <div className="flex items-start gap-2.5">
                    <div className="h-8.5 w-8.5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm shrink-0 border border-slate-300">
                      <User className="h-4.5 w-4.5 text-slate-500" />
                    </div>
                    <div className="text-xs truncate max-w-[170px]">
                      <p className="font-bold text-slate-800 leading-tight truncate">{f.name}</p>
                      <p className="text-slate-400 font-light truncate mt-0.5 flex items-center gap-1">
                        <Mail className="h-3 w-3 shrink-0" /> {f.email}
                      </p>
                    </div>
                  </div>

                  <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 pt-1.5 border-t border-slate-100">
                    <Calendar className="h-3 w-3 shrink-0" />
                    <span>Submitted: {new Date(f.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}</span>
                  </div>
                </div>

                {/* Delete command button (Database bound) */}
                <button
                  id={`btn-delete-${f.id}`}
                  onClick={() => handleDelete(f.id)}
                  disabled={isDeletingId === f.id}
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 hover:border-rose-300 rounded-lg text-xs font-bold py-2 outline-hidden cursor-pointer transition-all shadow-xs"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {isDeletingId === f.id ? "Wiping record..." : "Delete Review Card"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
