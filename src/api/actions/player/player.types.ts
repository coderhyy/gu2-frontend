import { Role } from "../auth/auth.types";

export interface Member {
  contact_info: string;
  date_of_birth: string;
  email: string;
  member_id: number;
  name: string;
  password: string;
  phone: string;
  registration_date: string;
  role: Role;
}

export interface Player {
  member: Member;
  performance_data: string;
  player_id: number;
  position: string;
  skill_level: string;
  team_name: string;
}

export type PlayerPaginationArgs = {
  page: number;
  size: number;
};
