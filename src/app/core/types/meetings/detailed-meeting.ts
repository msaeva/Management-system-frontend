import {Team} from "@core/types/team";

export interface DetailedMeeting {
  id: number;
  title: string;
  status: string;
  start: number;
  end: number;
  teams: Team[];
}
