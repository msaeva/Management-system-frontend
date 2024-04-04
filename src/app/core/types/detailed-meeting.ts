import {SimpleUser} from "@core/types/users/simple-user";

export interface DetailedMeeting {
  id: number;
  title: string;
  status: string;
  start: number;
  end: number;
  users: SimpleUser[];
}
