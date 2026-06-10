export interface EventItem {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  description: string;
  speaker: string;
  attendeesLimit: number;
}

export interface FeedbackItem {
  id: string;
  name: string;
  email: string;
  eventId: string;
  eventTitle: string;
  rating: number; // 1 to 5
  comment: string;
  categories: string[]; // ['Venue', 'Speakers', 'Content', 'Organization']
  createdAt: string;
}
