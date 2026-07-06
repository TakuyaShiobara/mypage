import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { auth, googleProvider } from "../firebase-init.js";
import { isAdminUser } from "./auth-guard.js";
import { clear, qs, el } from "../utils/dom.js";

const errorEl = qs("#login-error");
const loginBtn = qs("#google-login");

function showError(message) {
  clear(errorEl);
  errorEl.append(el("div", { class: "status-banner error" }, message));
}

if (new URLSearchParams(location.search).get("error") === "forbidden") {
  showError("このGoogleアカウントには管理画面への権限がありません。");
}

onAuthStateChanged(auth, (user) => {
  if (isAdminUser(user)) {
    location.href = "/admin/dashboard.html";
  }
});

loginBtn.addEventListener("click", async () => {
  loginBtn.disabled = true;
  try {
    const result = await signInWithPopup(auth, googleProvider);
    if (!isAdminUser(result.user)) {
      await signOut(auth);
      showError("このGoogleアカウントには管理画面への権限がありません。");
      return;
    }
    location.href = "/admin/dashboard.html";
  } catch (err) {
    console.error("Google sign-in failed", err);
    showError("ログインに失敗しました。時間をおいて再度お試しください。");
  } finally {
    loginBtn.disabled = false;
  }
});
