import type { AuthedUser } from "$lib/types/AuthedUser";
import axios from "axios";
import type { LayoutLoad } from "./$types";
import { env } from "$env/dynamic/public";
import { appendURL } from "$lib/utils/url";

export const load: LayoutLoad = async () => {
  let userData: AuthedUser = {
    hasAttempted: false,
    authenticated: false,
    username: "Guest",
    userId: -1,
    roles: null,
  };

  try {
    let response = await axios
      .get(appendURL("api/auth"), {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === 302 || response.status === 200) {
          if (response.data !== null) {
            return response;
          }
        } else {
          return null;
        }
      })
      .catch((error) => {
        return null;
      });
    if (!response) return userData;
    let data = await response.data.json();
    userData = {
      hasAttempted: true,
      authenticated: true,
      username: data.username,
      userId: data.userId,
      roles: data.roles,
    };
  } catch (error) {
    userData = {
      hasAttempted: true,
      authenticated: false,
      username: "Guest",
      userId: -1,
      roles: null,
    };
  }

  return userData;
};
