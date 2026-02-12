import { LucideIcon } from "lucide-react";

// --- Navigation & Marketing ---
export interface NavLink {
  name: string;
  path: string;
  icon?: LucideIcon;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  image?: string;
}

export interface StatItem {
  label: string;
  value: string;
}

export interface TeamMember {
  name: string;
  role: string;
  avatar: string;
}

// --- App Data (Firestore Schema) ---

export interface User {
  id: string; // uid
  username: string;
  displayName: string;
  email: string;
  avatar: string;
  banner?: string;
  bio?: string;
  powerLevel: number;
  xp: number;
  followers: number;
  following: number;
}

export interface Post {
  id: string;
  authorId: string;
  author: User; // Hydrated on client
  content: string;
  createdAt: any; // Timestamp or string
  likesCount: number;
  repliesCount: number;
  repostsCount: number;
  animeTag?: {
    id: string;
    title: string;
  };
  image?: string;
}

export interface Anime {
  id: string; // AniList ID
  title: string;
  coverImage: string;
  bannerImage?: string;
  episodes?: number;
  score?: number;
  status?: string;
  genres?: string[];
}

export interface LibraryEntry {
  animeId: string;
  status: 'WATCHING' | 'COMPLETED' | 'PLANNING' | 'DROPPED' | 'PAUSED';
  progress: number;
  score: number;
  updatedAt: any;
  totalEpisodes?: number;
  notes?: string;
  // Hydrated fields from AniList
  anime?: Anime;
}

export interface Notification {
  id: string;
  type: 'like' | 'reply' | 'follow' | 'mention';
  fromUserId: string;
  fromUser?: User; // Hydrated
  content?: string;
  createdAt: any;
  read: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  sentAt: any;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participants?: User[]; // Hydrated
  lastMessage: string;
  updatedAt: any;
  unreadCount?: number;
}

export interface TrendingTag {
  tag: string;
  posts: string;
}