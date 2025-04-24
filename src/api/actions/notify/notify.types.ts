import { Coach } from "../coach/coach.types";
import { Player } from "../player/player.types";
import { Team } from "../team/team.types";

export interface Notify {
  content: string;
  created_at: string;
  is_read: boolean;
  is_team_notification: boolean;
  notification_id: number;
  player: null | Player;
  sender: Coach;
  team: Team;
  title: string;
  updated_at: string;
}

export interface SendNotificationArgs {
  content: string;
  is_team_notification: boolean;
  player_id?: number;
  sender_id: number;
  team_id?: number;
  title: string;
}
