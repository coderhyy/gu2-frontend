import { Coach } from "../coach/coach.types";

export enum MemberType {
  ADMIN = "admin",
  CHAIRMAN = "chairman",
  COACH = "coach",
  EVENT_ASSISTANT = "event_assistant",
  MEMBER = "member",
  PLAYER = "player",
}

export interface RegisterArgs {
  email: string;
  membershipType?: string;
  name: string;
  password: string;
  phone?: string;
}

export interface UpdateProfileArgs {
  consent_form_url: string;
  email: string;
  name: string;
  phone: string;
}

export interface User {
  coach?: Coach;
  consent_form_url?: string;
  email: string;
  id: number;
  member_type: MemberType;
  name: string;
  phone?: string;
}
