
import Cookies from "js-cookie";

export const AUTH_CHANGED_EVENT = "teamflow-auth-changed";

export const getToken = () => {
  return Cookies.get("token") || null;
};

export const getUser = () => {
  try {
    const userCookie = Cookies.get("user");

    if (userCookie) {
      const parsed = JSON.parse(userCookie);
      return parsed?.user ?? parsed;
    }
  } catch (error) {
    console.error("Unable to parse user cookie:", error);
  }

  // Read public claims from JWT
  try {
    const token = getToken();
    if (!token) return null;

    const payload = token.split(".")[1];
    if (!payload) return null;

    const base64 = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const paddedBase64 = base64.padEnd(
      Math.ceil(base64.length / 4) * 4,
      "="
    );

    const decoded = decodeURIComponent(
      atob(paddedBase64)
        .split("")
        .map(
          (char) =>
            "%" +
            char.charCodeAt(0).toString(16).padStart(2, "0")
        )
        .join("")
    );

    const data = JSON.parse(decoded);

    return data.user || data.profile || data;
  } catch {
    return null;
  }
};

export const getFullName = (user) => {
  const first =
    user?.firstName ||
    user?.first_name ||
    user?.firstname ||
    "";

  const last =
    user?.lastName ||
    user?.last_name ||
    user?.lastname ||
    "";

  const combined = `${first} ${last}`.trim();

  return (
    combined ||
    user?.fullName ||
    user?.name ||
    user?.username ||
    user?.email ||
    "My Profile"
  );
};

export const getInitials = (user) => {
  const first =
    user?.firstName ||
    user?.first_name ||
    user?.firstname ||
    "";

  const last =
    user?.lastName ||
    user?.last_name ||
    user?.lastname ||
    "";

  if (first && last) {
    return (
      first.trim()[0] + last.trim()[0]
    ).toUpperCase();
  }

  const name =
    user?.fullName ||
    user?.name ||
    user?.username ||
    "";

  if (name.trim()) {
    const parts = name.trim().split(/\s+/);

    return parts.length > 1
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  }

  const emailName = user?.email?.split("@")[0] || "";

  if (emailName.toLowerCase().startsWith("manishparab")) {
    return "MP";
  }

  return emailName.slice(0, 2).toUpperCase() || "U";
};

// Login
export const setAuth = (token, user) => {
  if (!token) {
    throw new Error("Authentication token is missing");
  }

  Cookies.set("token", token, {
    expires: 1,
    sameSite: "Lax",
    path: "/",
  });

  if (user) {
    Cookies.set("user", JSON.stringify(user), {
      expires: 1,
      sameSite: "Lax",
      path: "/",
    });
  } else {
    Cookies.remove("user", { path: "/" });
  }

  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
};

// Logout
export const logoutUser = () => {
  Cookies.remove("token", { path: "/" });
  Cookies.remove("user", { path: "/" });

  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
};
