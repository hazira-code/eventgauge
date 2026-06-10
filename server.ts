import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { JSONDatabase, sampleEvents } from "./src/db.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize DB
  JSONDatabase.init();

  // JSON request body parser
  app.use(express.json());

  // Task 2: Create a route that displays a welcome message from the backend
  app.get("/api", (req, res) => {
    res.json({
      status: "ok",
      message: "Welcome to the Event Feedback Hub API!",
      version: "1.0.0",
      corporate: "Event Feedback Solutions",
      timestamp: new Date().toISOString(),
    });
  });

  // Get list of sample events (Task 3 / Level 1)
  app.get("/api/events", (req, res) => {
    res.json(sampleEvents);
  });

  // Task 4: Retrieve and display all feedback or submit new feedback
  app.get("/api/feedback", (req, res) => {
    try {
      const records = JSONDatabase.getFeedbacks();
      // Sort newest feedback first
      const sortedRecords = [...records].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      res.json(sortedRecords);
    } catch (e) {
      res.status(500).json({ error: "Failed to retrieve feedback records" });
    }
  });

  // Task 3: Create a route to receive feedback form data & Task 1: Connect feedback form to backend API
  app.post("/api/feedback", (req, res) => {
    const { name, email, eventId, rating, comment, categories } = req.body;

    // Task 4 (Level 4): Implement basic validation
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Name is required" });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ error: "Email is required" });
    }
    if (!email.includes("@")) {
      return res.status(400).json({ error: "A valid email address is required" });
    }
    if (!eventId) {
      return res.status(400).json({ error: "Please select a valid event" });
    }
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be a number between 1 and 5" });
    }
    if (!comment || !comment.trim()) {
      return res.status(400).json({ error: "Comments are required" });
    }

    // Resolve event title from id
    const matchedEvent = sampleEvents.find((e) => e.id === eventId);
    if (!matchedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    const payload = {
      name: name.trim(),
      email: email.trim(),
      eventId,
      eventTitle: matchedEvent.title,
      rating: Number(rating),
      comment: comment.trim(),
      categories: Array.isArray(categories) ? categories : [],
    };

    try {
      const savedRecord = JSONDatabase.saveFeedback(payload);
      res.status(201).json({
        success: true,
        message: "Thank you! Your feedback has been safely submitted.",
        data: savedRecord,
      });
    } catch (e) {
      res.status(500).json({ error: "Failed to store feedback in the database" });
    }
  });

  // Task 5 (Level 3): Implement a delete button to remove individual feedback entries from the list.
  app.delete("/api/feedback/:id", (req, res) => {
    const { id } = req.params;
    try {
      const success = JSONDatabase.deleteFeedback(id);
      if (success) {
        res.json({ success: true, message: "Feedback entry deleted successfully." });
      } else {
        res.status(404).json({ error: "Feedback entry not found" });
      }
    } catch (e) {
      res.status(500).json({ error: "Failed to delete feedback entry" });
    }
  });

  // Serve static assets or use Vite dev server middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Event Feedback Hub] Full-Stack Server running on Port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Critical server boot error:", err);
});
