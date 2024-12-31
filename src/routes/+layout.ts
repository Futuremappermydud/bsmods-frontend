import type { AuthedUser } from "$lib/types/AuthedUser";
import axios from "axios";
import type { LayoutLoad } from "./$types";

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
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/auth`, {
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
        console.error("An error occurred, contact a developer!");
        console.error(error);
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
