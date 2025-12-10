export interface Question {
  id?: number;
  authorId: number;
  authorName: string;
  subject: string;
  tags: string[];
  statement: string;
  options: string[];
  correctOption: number; // 0-4
  createdAt: string;
}

export interface Subject {
  id: number;
  name: string;
  createdAt: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'professor' | 'coordenador';
}

export interface Tag {
  id: number;
  name: string;
}