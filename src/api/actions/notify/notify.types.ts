export interface Notify {
  content: string;
  created_at: string;
  is_read: boolean;
  is_team_notification: boolean;
  notification_id: number;
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
