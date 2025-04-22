import { Coach } from "../coach/coach.types";
import { Player } from "../player/player.types";

export interface Team {
  coaches: Coach[];
  created_at: string;
  description: string;
  founded_year: number;
  home_venue: string;
  logo_url: string;
  players: Player[];
  team_id: number;
  team_name: string;
  updated_at: string;
}
