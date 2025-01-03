import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import axios from "axios";
import { appendURL } from "$lib/utils/url";

export const load: PageServerLoad = async ({ params }) => {
  let info = await axios
    .get(appendURL(`api/user/${params.id}`), {
      withCredentials: false,
    })
    .then((response) => {
      if (response.status === 302 || response.status === 200) {
        if (response?.data !== null) {
          return response?.data;
        }
      } else {
        error(404, "User not found");
      }
    })
    .catch((error) => {});

  if (!info) {
    error(404, "User not found");
  }

  return {
    info: info,
  };
};
