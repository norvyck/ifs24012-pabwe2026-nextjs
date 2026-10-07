export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface UserProfile {
  id: string | number;
  name: string;
  email: string;
  photo?: string | null;
  created_at?: string;
  createdAt?: string;
  email_verified_at?: string | null;
}

export interface PostAuthor {
  id?: string | number;
  name?: string;
  photo?: string | null;
}

export interface PostComment {
  id: string | number;
  comment?: string;
  description?: string;
  body?: string;
  author?: PostAuthor;
  created_at?: string;
  createdAt?: string;
}

export interface Post {
  id: string | number;
  user_id?: string | number;
  description?: string;
  body?: string;
  cover?: string | null;
  author?: PostAuthor;
  likes?: (string | number)[];
  comments?: PostComment[];
  isLiked?: boolean;
  created_at?: string;
  createdAt?: string;
}

export interface ApiResult<T> {
  status?: "success" | "fail" | "error";
  message: string;
  data?: T;
}
