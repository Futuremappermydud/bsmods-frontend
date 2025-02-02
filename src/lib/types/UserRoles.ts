import type { SupportedGames } from "./SupportedGames";

export enum UserRoles {
  AllPermissions = `allpermissions`,
  Admin = `admin`,
  Poster = `poster`,
  Approver = `approver`,
  Moderator = `moderator`,
  LargeFiles = `largefiles`,
  Banned = `banned`,
}

export interface UserRolesObject {
  sitewide: UserRoles[];
  perGame: {
    [gameName in SupportedGames]?: UserRoles[];
  };
}

export function checkUser(
  roles: UserRolesObject,
  checkingRole: UserRoles,
  game: string,
) {
  if (!roles) return false;
  let hasCheckingRole =
    roles.sitewide.includes(checkingRole) ||
    (roles.perGame[game as SupportedGames] || []).includes(checkingRole);
  let hasAllPermissions =
    roles.sitewide.includes(UserRoles.AllPermissions) ||
    (roles.perGame[game as SupportedGames] || []).includes(
      UserRoles.AllPermissions,
    );
  return hasCheckingRole || hasAllPermissions;
}

function getAllPerGameRoles(userRolesObject: UserRolesObject): UserRoles[] {
  return Object.values(userRolesObject.perGame).flat().filter(Boolean); // Filter out undefined or null values, just in case
}

export function checkUserAnyGame(
  roles: UserRolesObject,
  checkingRole: UserRoles,
) {
  if (!roles) return false;
  let hasCheckingRole =
    roles.sitewide.includes(checkingRole) ||
    (getAllPerGameRoles(roles) || []).includes(checkingRole);
  let hasAllPermissions =
    roles.sitewide.includes(UserRoles.AllPermissions) ||
    (getAllPerGameRoles(roles) || []).includes(UserRoles.AllPermissions);
  return hasCheckingRole || hasAllPermissions;
}
