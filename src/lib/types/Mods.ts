export interface ModAuthor {
  id: number;
  username: string;
  githubId: string | null;
  sponsorUrl: string;
  displayName: string;
  bio: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupportedGameVersion {
  id: number;
  gameName: string;
  version: string;
  defaultVersion: boolean;
}

export interface ContentHash {
  path: string;
  hash: string;
}

export interface ModDependency {
  id: number;
}

export interface ModVersion {
  id: number;
  modId: number;
  author: ModAuthor;
  modVersion: string;
  platform: string;
  zipHash: string;
  visibility: string;
  dependencies: number[];
  contentHashes: ContentHash[];
  supportedGameVersions: SupportedGameVersion[];
  createdAt: string;
  updatedAt: string;
}

export interface Mod {
  id: number;
  name: string;
  description: string;
  gameName: string;
  category: string;
  authors: ModAuthor[];
  status: string;
  iconFileName: string;
  gitUrl: string;
  lastApprovedById: number;
  lastUpdatedById: number;
  createdAt: string;
  updatedAt: string;
}

export interface ModData {
  mod: Mod;
  latest: ModVersion;
}

export interface Mods {
  mods: ModData[];
}