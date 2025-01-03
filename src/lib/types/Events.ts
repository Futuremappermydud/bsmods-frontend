export enum BannerType {
  Video = "video",
  Image = "image",
}

export interface LinkedMod {
  name: string;
  id?: number | undefined;
  available: boolean;
}

export interface Event {
  name: string;
  organizer: string;
  color: string;
  time: number;
  url: string;
  bannerType: BannerType;
  videoMp4?: string | undefined;
  videoWebm?: string | undefined;
  image?: string | undefined;
  linkedMods?: LinkedMod[] | undefined;
}

export interface EventList {
  events: Event[];
}
