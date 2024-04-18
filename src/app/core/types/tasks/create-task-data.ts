export interface CreateTaskData {
  title: string;
  description: string;
  projectId: number;
  userId: number | null;
}
