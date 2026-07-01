export type Gender = 'M' | 'F';
export type AppScreen = 'AUTH' | 'LOBBY' | 'SEARCHING' | 'GAME' | 'PROFILE' | 'MATCHES';
export type GamePhase = 'waiting' | 'questions' | 'answers' | 'selections' | 'results' | 'completed';
export type RoundPhase = 'questions' | 'answers' | 'selections';

export interface User {
  id: number;
  email: string;
  username: string;
  avatar: string | null;
  age: number;
  gender: Gender;
  bio: string;
  is_adult: boolean;
  created_at: string;
  city?: string;
  interests?: string[];
  total_hearts?: number;
  games_played?: number;
}

export interface Participant {
  user: User;
  gender: Gender;
  joined_at: string;
}

export interface Room {
  room_id: string;
  id?: string;
  status: 'waiting' | 'in_progress' | 'completed';
  current_round: number;
  round_phase: RoundPhase;
  participants: Participant[];
  participant_count: number;
  created_at: string;
}

export interface GameAnswer {
  user_id: number;
  username: string;
  avatar: string | null;
  text: string;
  rating: number;
  reply_rating?: number;
  reply_comment?: string;
  question: string;
}

export interface GroupAnswer {
  target_user_id: number;
  target_username: string;
  question: string;
  user_id: number;
  username: string;
  avatar: string | null;
  text: string;
  rating: number;
  reply_rating?: number;
  reply_comment?: string;
}

export interface QuestionToAnswer {
  user_id: number;
  username: string;
  text: string;
}

export interface SelectionInfo {
  from_user_id: number;
  from_username: string;
  to_user_id: number;
  to_username: string;
  is_mutual: boolean;
}

export interface WSMessage {
  type: string;
  [key: string]: unknown;
}

export interface ChatMessage {
  user: string;
  text: string;
  timestamp?: string;
  is_read?: boolean;
}

export interface EventResponse {
  id: number;
  event_type: string;
  related_user: {
    id: number;
    username: string;
    avatar: string | null;
  } | null;
  match_id: number | null;
  achievement: {
    id: number;
    code: string;
    name: string;
    description: string;
  } | null;
  created_at: string;
}

export interface AchievementInfo {
  id: number;
  code: string;
  name: string;
  description: string;
}

export interface UserAchievementInfo {
  id: number;
  achievement: AchievementInfo;
  earned_at: string;
  progress_current: number;
  progress_target: number;
  is_earned: boolean;
}

export interface AchievementResponse {
  id: number;
  code: string;
  name: string;
  description: string;
  user_achievement: UserAchievementInfo | null;
}
