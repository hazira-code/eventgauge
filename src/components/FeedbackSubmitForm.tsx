import React, { useState, useEffect } from "react";
import { Send, AlertCircle, CheckCircle2, Star, Sparkles } from "lucide-react";
import { EventItem, FeedbackItem } from "../types.js";

interface FeedbackSubmitFormProps {
  events: EventItem[];
  preselectedEventId?: string;
  onSuccess: (newFeedback: FeedbackItem) => void;
  setTab: (tab: string) => void;
}

export default function FeedbackSubmitForm({
  events,
  preselectedEventId = "",
  onSuccess,
  setTab,
}: FeedbackSubmitFormProps) {
  // Form values
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [eventId, setEventId] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [categories, setCategories] = useState<string[]>([]);

  // UI state managers
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successResponse, setSuccessResponse] = useState<string | null>(null);

  // Available feedback evaluation metrics
  const evaluationCategories = ["Content", "Speakers", "Venue", "Organization"];

  // Populate dynamic preselected state
  useEffect(() => {
    if (preselectedEventId) {
      setEventId(preselectedEventId);
    } else if (events.length > 0 && !eventId) {
      setEventId(events[0].id);
    }
  }, [preselectedEventId, events]);

  const toggleCategory = (cat: string) => {
    if (categories.includes(cat)) {
      setCategories(categories.filter((c) => c !== cat));
    } else {
      setCategories([...categories, cat]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setSuccessResponse(null);

    // Frontend Field Validations
    if (!name.trim()) {
      setValidationError("Full Name field cannot be left blank.");
      return;
    }
    if (!email.trim()) {
      setValidationError("Corporate Email address field cannot be left blank.");
      return;
    }
    if (!email.includes("@")) {
      setValidationError("Please input a valid format corporate email account.");
      return;
    }
    if (!eventId) {
      setValidationError("Please select one of our conducted corporate events.");
      return;
    }
    if (rating < 1 || rating > 5) {
      setValidationError("Rating must be a positive integer between 1 and 5.");
      return;
    }
    if (!comment.trim()) {
      setValidationError("Kindly leave a brief constructive comment regarding your experience.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          eventId,
          rating,
          comment,
          categories,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "An unexpected system fault surfaced during submission.");
      }

      // Success workflow
      setSuccessResponse(result.message);
      onSuccess(result.data);

      // Clean inputs
      setName("");
      setEmail("");
      setComment("");
      setCategories([]);
      setRating(5);
    } catch (err: any) {
      setValidationError(err.message || "Failed to deliver parameters to API Server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="feedback-form-view" className="max-w-2xl mx-auto space-y-8">
      {/* View Header */}
      <div>
        <h2 className="font-display font-bold text-3xl text-slate-800 tracking-tight">
          Submit Event Feedback
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Provide your vital perspective. Complete the certified review card below and your response
          will automatically synchronize with the central database server.
        </p>
      </div>

      {/* Main Form Board */}
      <div className="bg-white rounded-2xl border border-slate-150 shadow-xs overflow-hidden">
        {/* State Banners */}
        {successResponse && (
          <div id="submit-success-banner" className="bg-emerald-50 border-b border-emerald-100 p-6 flex items-start gap-4 animate-fade-in">
            <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-emerald-800 text-sm">Submission Completed Successfully!</h4>
              <p className="text-xs text-emerald-700 leading-normal">
                {successResponse} Your review is actively registered under the digital records database library.
              </p>
              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => setTab("reviews")}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-md cursor-pointer transition-colors"
                >
                  View feedback directory
                  <span>&rarr;</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {validationError && (
          <div id="submit-error-banner" className="bg-rose-50 border-b border-rose-100 p-5 flex items-start gap-3.5">
            <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-rose-800 text-sm">Review Card Invalidated</h4>
              <p className="text-xs text-rose-700 font-light mt-0.5">{validationError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Section 1: Demographics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label htmlFor="input-name" className="text-xs font-semibold text-slate-700 block uppercase tracking-wider font-mono">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="input-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Avery Chen"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500/15 focus:border-sky-500 transition-all font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="input-email" className="text-xs font-semibold text-slate-700 block uppercase tracking-wider font-mono">
                Corporate Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                id="input-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500/15 focus:border-sky-500 transition-all font-sans"
              />
            </div>
          </div>

          {/* Section 2: Choose Event */}
          <div className="space-y-1.5">
            <label htmlFor="input-event" className="text-xs font-semibold text-slate-700 block uppercase tracking-wider font-mono">
              Attended Workshop <span className="text-rose-500">*</span>
            </label>
            <select
              id="input-event"
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500/15 focus:border-sky-500 transition-all font-sans"
            >
              <option value="">-- Choose target Event --</option>
              {events.map((e) => (
                <option key={e.id} value={e.id}>
                  [{e.category}] {e.title}
                </option>
              ))}
            </select>
          </div>

          <div className="border-t border-dashed border-slate-100 my-6" />

          {/* Section 3: Performance Scale */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 block uppercase tracking-wider font-mono">
              Overall Rating Scale <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5 bg-slate-50 border border-slate-100 p-2.5 rounded-lg">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isActive = (hoverRating !== null ? hoverRating : rating) >= star;
                  return (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className={`h-9 w-9 flex items-center justify-center rounded-md cursor-pointer transition-all ${
                        isActive ? "text-amber-500 scale-105" : "text-slate-300 hover:text-slate-400"
                      }`}
                    >
                      <Star className={`h-6 w-6 ${isActive ? "fill-amber-400" : ""}`} />
                    </button>
                  );
                })}
              </div>
              <span className="text-xs font-mono font-bold text-slate-500 px-3 py-1 bg-slate-100 rounded-md">
                {rating === 5 && "Outstanding (5/5)"}
                {rating === 4 && "Great Experiencing (4/5)"}
                {rating === 3 && "Satisfactory (3/5)"}
                {rating === 2 && "Needs Enhancements (2/5)"}
                {rating === 1 && "Poor Quality (1/5)"}
              </span>
            </div>
          </div>

          {/* Section 4: Multi choice evaluations */}
          <div className="space-y-2.5">
            <span className="text-xs font-semibold text-slate-700 block uppercase tracking-wider font-mono">
              Areas of Outstanding Delivery <span className="text-slate-400 font-light font-sans">(Select all that apply)</span>
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {evaluationCategories.map((cat) => {
                const isChecked = categories.includes(cat);
                return (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`px-3 py-2.5 rounded-lg border text-xs font-semibold text-center transition-all cursor-pointer ${
                      isChecked
                        ? "bg-sky-50 border-sky-300 text-sky-800 font-bold"
                        : "bg-slate-50 border-slate-150 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 5: Written Comment */}
          <div className="space-y-1.5">
            <label htmlFor="input-comment" className="text-xs font-semibold text-slate-700 block uppercase tracking-wider font-mono">
              Constructive Review Comments <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="input-comment"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What specifically did you appreciate about the materials? Share recommendations for physical set-ups or curriculum designs..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500/15 focus:border-sky-500 transition-all font-sans resize-y leading-relaxed"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-3">
            <button
              type="submit"
              id="btn-submit-feedback"
              disabled={isSubmitting}
              className={`w-full inline-flex items-center justify-center gap-2 text-sm font-semibold text-white px-5 py-3 rounded-lg cursor-pointer transition-all ${
                isSubmitting ? "bg-slate-400 cursor-not-allowed" : "bg-sky-600 hover:bg-sky-500 shadow-md hover:shadow-lg"
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Synchronizing records...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit Feedback Card
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
