import { Coach } from "../coach/coach.types";

export interface CreateTrainingDto {
  coach_id: number;
  player_ids: number[];
  training_date: string;
  training_details: string;
  training_location: string;
}

export interface Player {
  performance_data: string;
  player_id: number;
  position: string;
  skill_level: string;
  team_name: string;
}

export interface Training {
  coach: Coach;
  training_date: string;
  training_details: string;
  training_id: number;
  training_location: string;
  training_records: TrainingRecord[];
}

export interface TrainingRecord {
  performance: string;
  player: Player;
  record_id: number;
}
