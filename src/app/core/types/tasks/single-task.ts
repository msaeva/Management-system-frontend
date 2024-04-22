export interface SingleTask {
  id: number;
  userId: number | null;
  title: string;
  description: string;
  status: string;
  abbreviation: string;
  userFullName: string;
  progress: number;
  estimationTime: number;
  completionTime: number;
}
