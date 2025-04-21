import { Member } from "../player/player.types";

export interface Coach {
  coach_id: number;
  contact_info: string;
  member: Member;
  team_name: string;
}
