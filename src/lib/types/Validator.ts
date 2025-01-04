import { z } from "zod";
import { valid } from "semver";
import { Status } from "./Status";
import { Categories } from "./Categories";
import { SupportedGames } from "./SupportedGames";
import { UserRoles } from "./UserRoles";
import { PostType } from "./PostType";
import { Platform } from "./Platform";

//generic types that I use a lot
const ZodDBID = z.number({ coerce: true }).int().positive();
const ZodBool = z.boolean({ coerce: true });
const ZodStatus = z.nativeEnum(Status);
const ZodPlatform = z.nativeEnum(Platform);
const ZodCategory = z.nativeEnum(Categories);
const ZodGameName = z.nativeEnum(SupportedGames);
const ZodPostType = z.nativeEnum(PostType);
const ZodUserRoles = z.nativeEnum(UserRoles);

// from ./Database.ts
const ZodMod = z.object({
  id: ZodDBID,
  name: z.string().min(3).max(64),
  summary: z.string().min(3).max(100),
  description: z.string().min(3).max(4096),
  category: ZodCategory,
  gitUrl: z.string().min(5).max(256).url(),
  gameName: ZodGameName, //z.string().min(3).max(256),
  authorIds: z.array(ZodDBID),
});

// from ./Database.ts
const ZodModVersion = z.object({
  id: ZodDBID,
  modId: ZodDBID,
  supportedGameVersionIds: z.array(ZodDBID),
  modVersion: z.string().refine(valid, { message: `Invalid SemVer` }),
  dependencies: z.array(ZodDBID),
  platform: ZodPlatform,
  status: ZodStatus,
});

// for things marked as optional, zod will set them to undefined if they are not present, otherwise it will validate it.
export class Validator {
  public static readonly z = z;
  public static readonly zDBID = ZodDBID;
  public static readonly zBool = ZodBool;
  public static readonly zString = z.string();
  public static readonly zStatus = ZodStatus;
  public static readonly zPlatform = ZodPlatform;
  public static readonly zCategory = ZodCategory;
  public static readonly zGameName = ZodGameName;
  public static readonly zPostType = ZodPostType;
  public static readonly zUserRoles = ZodUserRoles;
  public static readonly zUrl = z
    .string()
    .url()
    .refine((url) => {
      try {
        let urlObj = new URL(url);
        return true;
      } catch (e) {
        return false;
      }
    });
  public static readonly zCreateMod = ZodMod.pick({
    name: true,
    summary: true,
    description: true,
    category: true,
    gitUrl: true,
    gameName: true,
  })
    .required()
    .strict();

  public static readonly zUploadModVersion = ZodModVersion.pick({
    supportedGameVersionIds: true,
    modVersion: true,
    dependencies: true,
    platform: true,
  })
    .required()
    .strict();

  public static readonly zUpdateMod = ZodMod.pick({
    name: true,
    summary: true,
    description: true,
    category: true,
    gitUrl: true,
    gameName: true,
    authorIds: true,
  }).optional();

  public static readonly zUpdateModVersion = ZodModVersion.pick({
    supportedGameVersionIds: true,
    modVersion: true,
    dependencies: true,
    platform: true,
  }).optional();

  public static readonly zOAuth2Callback = z
    .object({
      code: z.string(),
      state: z.string(),
    })
    .required();

  public static readonly zGetMods = z.object({
    gameName: ZodGameName.default(SupportedGames.BeatSaber),
    gameVersion: z.string().optional(),
    status: ZodStatus.default(Status.Verified),
    platform: ZodPlatform.default(Platform.UniversalPC),
  });

  public static readonly zCreateMOTD = z.object({
    gameName: ZodGameName.default(SupportedGames.BeatSaber),
    platforms: z.array(ZodPlatform).default([Platform.UniversalPC]),
    gameVersionIds: z.array(this.zDBID).default([]),
    postType: z.nativeEnum(PostType).default(PostType.Community),
    message: z.string().min(3).max(64),
    startTime: z.coerce.date().default(new Date()),
    endTime: z.coerce
      .date()
      .default(new Date(new Date().getTime() + 1000 * 60 * 60 * 24)),
  });

  public static readonly zGetMOTD = z.object({
    gameName: ZodGameName.default(SupportedGames.BeatSaber),
    gameVersion: z.string().optional(),
    platform: ZodPlatform.optional(),
    getExpired: z.boolean({ coerce: true }).default(false),
  });

  public static readonly zCreateGameVersion = z
    .object({
      gameName: ZodGameName,
      version: z.string(),
    })
    .required();
}

type TableNames = `mods` | `modVersions` | `users` | `gameVersions`;
