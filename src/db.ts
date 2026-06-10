import fs from "fs";
import path from "path";
import { EventItem, FeedbackItem } from "./types.js";

const DATABASE_DIR = path.join(process.cwd(), "data");
const DATABASE_FILE = path.join(DATABASE_DIR, "db.json");

// Static events dataset
export const sampleEvents: EventItem[] = [
  {
    id: "evt-1",
    title: "Tech Innovators Summit 2026",
    category: "AI & Innovation",
    date: "2026-06-15",
    location: "Stockholm Central Tech Hub",
    description: "Discover the latest advances in Generative Artificial Intelligence, Autonomous Systems, and Cloud Architectures with global industry executives.",
    speaker: "Dr. Helena Vance, Chief Scientist",
    attendeesLimit: 250,
  },
  {
    id: "evt-2",
    title: "EcoCode hackathon 2026",
    category: "Software Engineering",
    date: "2026-07-02",
    location: "Gothenburg Innovation Lab",
    description: "Join our expert engineering team for a 36-hour sprint building ecological software that minimizes carbon footprint, maximizes memory safety, and scales elegantly.",
    speaker: "Marcus Lindqvist, Tech Lead",
    attendeesLimit: 120,
  },
  {
    id: "evt-3",
    title: "Agile Leadership Masterclass",
    category: "Management & Culture",
    date: "2026-08-12",
    location: "Malmö Creative Space",
    description: "Learn high-impact directorship principles, effective cross-functional communication, rapid prototyping workflows, and modern agile deployment models.",
    speaker: "Sophia Stern, Director of Product",
    attendeesLimit: 80,
  },
  {
    id: "evt-4",
    title: "Zero-Trust Cybersecurity Forum",
    category: "Security",
    date: "2026-09-20",
    location: "Online (Virtual Broadcast)",
    description: "A deep-dive technical workshop on securing cloud infrastructure networks, identity spoofing prevention, dynamic authorization setups, and defensive coding.",
    speaker: "Erik Thorvald, VP of Security",
    attendeesLimit: 500,
  },
];

const defaultFeedbacks: FeedbackItem[] = [
  {
    id: "fb-1",
    name: "Avery Chen",
    email: "avery.chen@example.com",
    eventId: "evt-1",
    eventTitle: "Tech Innovators Summit 2026",
    rating: 5,
    comment: "The keynote on enterprise AI pipelines was phenomenal. Incredibly polished slide decks and actionable advice for developers!",
    categories: ["Speakers", "Content"],
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 24 hours ago
  },
  {
    id: "fb-2",
    name: "Linus Wallin",
    email: "linus.wallin@example.com",
    eventId: "evt-2",
    eventTitle: "EcoCode hackathon 2026",
    rating: 4,
    comment: "Excellent mentoring team and fully automated local test pipelines. The venue was a bit cold during the late-night sessions, but the food and community spirit were magnificent.",
    categories: ["Venue", "Organization"],
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(), // 4 hours ago
  },
];

export class JSONDatabase {
  static init() {
    if (!fs.existsSync(DATABASE_DIR)) {
      fs.mkdirSync(DATABASE_DIR, { recursive: true });
    }

    if (!fs.existsSync(DATABASE_FILE)) {
      fs.writeFileSync(
        DATABASE_FILE,
        JSON.stringify({ feedbacks: defaultFeedbacks }, null, 2)
      );
    }
  }

  static getFeedbacks(): FeedbackItem[] {
    this.init();
    try {
      const data = fs.readFileSync(DATABASE_FILE, "utf-8");
      const parsed = JSON.parse(data);
      return parsed.feedbacks || [];
    } catch (e) {
      console.error("Error reading database file", e);
      return [];
    }
  }

  static saveFeedback(feedback: Omit<FeedbackItem, "id" | "createdAt">): FeedbackItem {
    this.init();
    const feedbacks = this.getFeedbacks();
    const newFeedback: FeedbackItem = {
      ...feedback,
      id: `fb-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    feedbacks.push(newFeedback);
    
    fs.writeFileSync(
      DATABASE_FILE,
      JSON.stringify({ feedbacks }, null, 2)
    );
    return newFeedback;
  }

  static deleteFeedback(id: string): boolean {
    this.init();
    const feedbacks = this.getFeedbacks();
    const index = feedbacks.findIndex((item) => item.id === id);
    if (index !== -1) {
      feedbacks.splice(index, 1);
      fs.writeFileSync(
        DATABASE_FILE,
        JSON.stringify({ feedbacks }, null, 2)
      );
      return true;
    }
    return false;
  }
}
