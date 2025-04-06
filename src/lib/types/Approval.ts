import type { SemVer } from "semver";
import type { Categories } from "./Categories";
import type { ContentHash, Mod } from "./Mods";
import type { Platform } from "./Platform";
import type { Status } from "./Status";
import type { SupportedGames } from "./SupportedGames";

export interface ModVersionDBObject {
  readonly id: number;
  modId: number;
  authorId: number;
  modVersion: SemVer; // fuck you ig
  supportedGameVersionIds: number[];
  status: Status;
  dependencies: number[]; // array of modVersion ids
  platform: Platform;
  zipHash: string;
  contentHashes: ContentHash[];
  downloadCount: number;
  lastApprovedById: number | null;
  lastUpdatedById: number;
  fileSize: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date | null;
}

export interface ModDBObject {
  readonly id: number;
  name: string;
  summary: string;
  description: string;
  gameName: string;
  category: Categories;
  authorIds: number[];
  status: Status;
  iconFileName: string;
  gitUrl: string;
  lastApprovedById: number | null;
  lastUpdatedById: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date;
}

export type ModVersionApproval = Omit<
  ModVersionDBObject,
  | `modId`
  | `id`
  | `createdAt`
  | `updatedAt`
  | `deletedAt`
  | `authorId`
  | `status`
  | `contentHashes`
  | `zipHash`
  | `lastApprovedById`
  | `lastUpdatedById`
  | `downloadCount`
  | `fileSize`
>;
export type ModApproval = Omit<
  ModDBObject,
  | `id`
  | `createdAt`
  | `updatedAt`
  | `deletedAt`
  | `iconFileName`
  | `status`
  | `lastApprovedById`
  | `lastUpdatedById`
>;

export interface EditQueueDBObject {
  readonly id: number;
  submitterId: number;
  objectId: number;
  objectTableName: `modVersions` | `mods`;
  object: ModVersionApproval | ModApproval;

  approverId: number | null;
  approved: boolean | null; // just use null as a 3rd bit 5head
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date | null;
}

export interface VersionApproval {
  mod: Mod;
  version: ModVersionDBObject;
}

export interface EditApproval {
  mod: Mod;
  original: ModVersionDBObject | ModDBObject;
  edit: EditQueueDBObject;
}

export interface ApprovalQueues {
  mods: Mod[] | undefined;
  modVersions: VersionApproval[] | undefined;
  edits: EditApproval[] | undefined;
}

export type DisplayModalFunction = (
  header: string,
  body: { header: string; body: string }[],
) => void;

export enum ApprovalAction {
  Accept = `accept`, // Verify/accept the mod/modVersion/edit, set its status to verified
  Deny = `deny`, // Reject the mod/modVersion, set its status to unverified, but do not remove it
  Remove = `remove`, // Remove the mod/modVersion from the database, set its status to removed
  Restore = `restore`, // Restore the mod/modVersion if it was previously removed
}