import { Player } from "../player/player.types";

export type Consent = {
  consent_id: number;
  consent_signed: 0 | 1;
  guardian_contact_info: string;
  guardian_name: string;
  player: Player;
  player_id: string;
  signed_date: string;
};
