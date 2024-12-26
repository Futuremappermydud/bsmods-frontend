import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import axios from "axios";

export const load: PageLoad = async ({ params }) => {
  let info = await axios
    .get(`${import.meta.env.VITE_API_BASE_URL}/api/user/${params.id}`, {
      withCredentials: false,
    })
    .then((response) => {
      if (response.status === 302 || response.status === 200) {
        if (response.data !== null) {
          return response.data;
        }
      } else {
      }
    })
    .catch((error) => {
      error(404, "Not found");
    });

  return {
    info: info,
  };
};
