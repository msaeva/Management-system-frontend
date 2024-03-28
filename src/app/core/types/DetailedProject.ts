import {Team} from "@core/types/Team";
import {User} from "@core/types/users/User";

export interface DetailedProject {
  createdDate: string;
  description: string;
  abbreviation: string;
  id: number;
  pms: User[];
  status: string;
  teams: Team[];
  title: string;
}
