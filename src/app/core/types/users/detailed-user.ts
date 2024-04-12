import {DetailedProject} from "@core/types/projects/detailed-project";

export interface DetailedUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  username: string;
  projects: DetailedProject[];
}
