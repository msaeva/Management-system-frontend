export interface SingleTask {
  id: number;
  userId: number | null;
  title: string;
  description: string;
  status: string;
  abbreviation: string;
}
