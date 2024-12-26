import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async () => {
  let userData = {
    hasAttempted: false,
    authenticated: false,
    username: "Guest",
    userId: -1,
    roles: null,
  };

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/auth`,
      {
        credentials: "include",
      },
    );
    if (!response.ok) throw new Error("Not authenticated");
    let data = await response.json();
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
