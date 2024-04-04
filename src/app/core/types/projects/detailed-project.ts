import {Team} from "@core/types/team";
import {User} from "@core/types/users/user";

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
