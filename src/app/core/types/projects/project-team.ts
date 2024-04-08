import {Team} from "@core/types/team";

export interface ProjectTeam {
  id: number;
  title: string;
  teams: Team[];
}
