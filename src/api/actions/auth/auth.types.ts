export enum Role {
  ADMIN = "admin",
  COACH = "coach",
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

export interface User {
  email: string;
  id: string;
  name: string;
  role: Role;
}
