export interface UpdateTaskData {
  title: string;
  description: string;
  status: string;
  projectId: number;
  userId: number | null;
  completionTime: number;
  estimationTime: number;
  progress: number;
}
