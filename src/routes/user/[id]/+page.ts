import type { PageLoad } from "./$types";
import axios from "axios";
import { appendURL } from "$lib/utils/url";

export const load: PageLoad = async ({ params }) => {
  let info = await axios
    .get(appendURL(`/api/user/${params.id}`), {
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
