import {Team} from "@core/types/Team";

export interface Project {
  createdDate: string;
  description: string;
  id: number;
  pms: any[];
  status: string;
  teams: Team[];
  title: string;
}
