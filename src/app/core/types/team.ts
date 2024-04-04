import {User} from "@core/types/users/user";

export interface Team {
  id: number;
  name: string;
  users: User[];
}
