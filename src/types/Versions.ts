export interface Version {
  id: number;
  gameName: string;
  version: string;
  defaultVersion: boolean;
  createdAt: string; // ISO 8601 format date string
  updatedAt: string; // ISO 8601 format date string
}

export interface Versions {
  versions: Version[];
}
