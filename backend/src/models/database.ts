export type TaskStatus = "Pending" | "Completed" | "Overdue";

export interface Major {
  id: number;
  name: string;
}

export interface User {
  id?: number;
  username: string;
  password: string;
  grade?: number;
  gradeLetter?: string;
  majorId?: number | null;
}

export interface SchoolSubject {
  id: number;
  name: string;
  code: string;
}

export interface Task {
  id: number;
  subjectId: number;
  title: string;
  description: string | null;
  deliverDate: string;
}

export interface UserInscription {
  id: number;
  userId: number;
  subjectId: number;
}

export interface UserTask {
  id: number;
  userId: number;
  taskId: number;
  status: TaskStatus;
}

export interface UserTaskWithDetails {
  id: number;
  userId: number;
  taskId: number;
  status: TaskStatus;
  title: string;
  description: string | null;
  deliverDate: string;
  subjectId: number;
  subjectName: string;
  subjectCode: string;
}

