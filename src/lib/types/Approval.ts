import type { Mod } from "./Mods";

export interface VersionApproval {}

export interface NewApproval {
  mods: Mod[];
  modVersions: VersionApproval[];
}
