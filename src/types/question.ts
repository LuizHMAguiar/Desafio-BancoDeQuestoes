export interface Question {
  id: string;
  authorId: string;
  authorName: string;
  category: string;
  tags: string[];
  statement: string;
  options: string[];
  correctOption: number; // 0-4
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'professor' | 'coordenador';
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Subject {
  id: string;
  name: string;
  createdAt: string;
}