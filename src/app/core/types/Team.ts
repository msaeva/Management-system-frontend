import {User} from "@core/types/User";

export interface Team {
  id: number;
  name: string;
  users: User[];
}
