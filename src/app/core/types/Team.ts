import {User} from "@core/types/users/User";

export interface Team {
  id: number;
  name: string;
  users: User[];
}
