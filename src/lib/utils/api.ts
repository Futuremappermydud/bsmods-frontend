import { convertCategories } from "$lib/types/Categories";
import type { IndividualModData } from "$lib/types/Mods";
import axios from "axios";
import { appendURL } from "./url";

export function sendSaveEdit(
  mod: IndividualModData | undefined,
  selectedGame: string,
  category: string,
  modName: string,
  summary: string,
  gitUrl: string,
  description: string,
  stopLoading: () => void,
) {
  let body: any = {};

  if (selectedGame !== mod?.info.gameName) {
    body.gameName = selectedGame;
  }

  if (category !== convertCategories(mod?.info.category ?? "")) {
    body.category = category;
  }

  if (modName !== mod?.info.name) {
    body.name = modName;
  }

  if (summary !== mod?.info.summary) {
    body.summary = summary;
  }

  if (gitUrl !== mod?.info.gitUrl) {
    body.gitUrl = gitUrl;
  }

  if (description !== mod?.info.description) {
    body.description = description;
  }

  console.log(body);

  axios
    .patch(appendURL(`api/mods/${mod?.info.id}`), body, {
      withCredentials: true,
    })
    .then((response) => {
      if (response.status === 302 || response.status === 200) {
        if (response.data !== null) {
          stopLoading();
          window.location.reload();
        }
      } else {
      }
    })
    .catch((error) => {
      console.error("An error occurred, contact a developer!");
      console.error(error);
    });
}

export function sendSubmit(
  mod: IndividualModData | undefined,
  stopLoading: () => void,
) {
  axios
    .post(appendURL(`api/mods/${mod?.info.id}/submit`), {
      withCredentials: true,
    })
    .then((response) => {
      if (response.status === 302 || response.status === 200) {
        if (response.data !== null) {
          stopLoading();
          window.location.reload();
        }
      } else {
      }
    })
    .catch((error) => {
      console.error("An error occurred, contact a developer!");
      console.error(error);
    });
}

export function sendRevoke(
  mod: IndividualModData | undefined,
  stopLoading: () => void,
) {
  axios
    .post(
      appendURL(`api/approval/mod/${mod?.info.id}/approve`),
      {
        status: "unverified",
      },
      {
        withCredentials: true,
      },
    )
    .then((response) => {
      if (response.status === 302 || response.status === 200) {
        if (response.data !== null) {
          stopLoading();
          window.location.reload();
        }
      } else {
      }
    })
    .catch((error) => {
      console.error("An error occurred, contact a developer!");
      console.error(error);
    });
}
