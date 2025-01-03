import type { UserRolesObject } from "./UserRoles";

export interface AuthedUser {
  hasAttempted: boolean;
  authenticated: boolean;
  username: string;
  userId: number;
  roles: UserRolesObject;
}
