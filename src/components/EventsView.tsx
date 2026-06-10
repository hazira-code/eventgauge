import React, { useState } from "react";
import { Search, MapPin, Calendar, Users, Award, MessageSquare, Filter } from "lucide-react";
import { EventItem } from "../types.js";

interface EventsViewProps {
  events: EventItem[];
  onSelectEventForFeedback: (eventId: string) => void;
}

export default function EventsView({ events, onSelectEventForFeedback }: EventsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Get distinct categories
  const categories = ["All", ...Array.from(new Set(events.map((e) => e.category)))];

  // Filter events
  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || e.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div id="events-view" className="space-y-8">
      {/* Intro & Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-3xl text-slate-800 tracking-tight">
            Corporate Events Registry
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mt-1">
            Browse our list of professional educational milestones, specialized programming bootcamps,
            and leadership panels.
          </p>
        </div>

        <div className="text-xs text-slate-500 font-mono bg-sky-50 border border-sky-100 rounded-lg px-4 py-2.5">
          <span className="font-bold text-sky-700">Database Live Feed:</span> {filteredEvents.length} Active Events Listed
        </div>
      </div>

      {/* Modern Search and Filters bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex flex-col sm:flex-row gap-4 justify-between items-center">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4.5 w-4.5" />
          <input
            type="text"
            id="event-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events, speakers, or topics..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-sans"
          />
        </div>

        {/* Category Filters Pill Box */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-start sm:justify-end">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1 shrink-0 mr-1">
            <Filter className="h-3.5 w-3.5" /> Filter by:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                selectedCategory === cat
                  ? "bg-sky-600 text-white shadow-sm"
                  : "bg-slate-50 text-slate-600 border border-slate-100 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of sample events */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-xs">
          <Award className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-display font-medium text-base">No events match your criteria</p>
          <p className="text-xs text-slate-400 mt-1">Try resetting your category filter or search keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl border border-slate-150 overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              {/* Event Card Header */}
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start gap-2">
                  <span className="inline-block px-2.5 py-1 bg-sky-50 text-sky-700 text-xs font-semibold rounded-md border border-sky-100">
                    {event.category}
                  </span>
                  <span className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-widest">
                    ID: {event.id}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-display font-semibold text-xl text-slate-800 leading-tight">
                    {event.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                    Presenter: <span className="text-slate-600 font-medium">{event.speaker}</span>
                  </p>
                </div>

                <p className="text-slate-600 text-sm font-light leading-relaxed">
                  {event.description}
                </p>
              </div>

              {/* Event Metas & Footer Action */}
              <div className="border-t border-slate-100 bg-slate-50/50 p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto">
                <div className="space-y-1.5 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>Formatted Date: {new Date(event.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>

                <button
                  id={`btn-feedback-${event.id}`}
                  onClick={() => onSelectEventForFeedback(event.id)}
                  className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2 px-4 rounded-lg cursor-pointer transition-all shadow-xs shrink-0"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  Leave Feedback
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
