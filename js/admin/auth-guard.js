import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { auth } from "../firebase-init.js";
import { adminEmail } from "../config.js";

export function isAdminUser(user) {
  return Boolean(user) && user.email === adminEmail;
}

/**
 * Gates an admin page behind Google auth + the single allowed admin email.
 * Redirects unauthenticated/unauthorized visitors to the login page.
 * @param {(user: import("firebase/auth").User) => void} onAuthorized
 */
export function requireAdmin(onAuthorized) {
  onAuthStateChanged(auth, (user) => {
    if (isAdminUser(user)) {
      onAuthorized(user);
      return;
    }
    if (user && !isAdminUser(user)) {
      signOut(auth).finally(() => {
        location.href = "/admin/index.html?error=forbidden";
      });
      return;
    }
    location.href = "/admin/index.html";
  });
}

export async function logout() {
  await signOut(auth);
  location.href = "/admin/index.html";
}
