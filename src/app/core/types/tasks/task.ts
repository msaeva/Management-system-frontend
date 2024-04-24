export interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  abbreviation: string;
  userFullName: string;
  completionTime: number;
  estimationTime: number;
  userId: number
}
