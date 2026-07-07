import { el, qs } from "../utils/dom.js";
import { icon } from "../utils/icons.js";
import { logout } from "../admin/auth-guard.js";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", href: "/admin/dashboard.html" },
  { key: "works", label: "作品管理", href: "/admin/works.html" },
  { key: "profile", label: "プロフィール", href: "/admin/profile.html" },
  { key: "skills", label: "スキル", href: "/admin/skills.html" },
  { key: "socials", label: "SNS", href: "/admin/socials.html" },
];

/**
 * Renders the admin sidebar shell into #admin-shell and returns the
 * element where the page should render its own content (#admin-main-content).
 */
export function renderAdminShell(activeKey, user) {
  const mount = qs("#admin-shell");

  const nav = el("nav", { class: "admin-nav" });
  NAV_ITEMS.forEach((item) => {
    nav.append(
      el("a", { href: item.href, "aria-current": item.key === activeKey ? "page" : undefined }, item.label),
    );
  });

  const navToggle = el("button", {
    class: "admin-nav-toggle",
    type: "button",
    "aria-expanded": "false",
    "aria-label": "メニューを開く",
    html: icon("menu"),
    onClick: () => {
      const isOpen = sidebar.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.innerHTML = icon(isOpen ? "close" : "menu");
    },
  });

  const sidebar = el("aside", { class: "admin-sidebar" }, [
    el("a", { href: "/admin/dashboard.html", class: "admin-logo" }, "管理画面"),
    navToggle,
    nav,
    el("div", { class: "admin-user" }, [
      user.photoURL ? el("img", { src: user.photoURL, alt: "" }) : null,
      el("span", { class: "admin-user-email" }, user.email),
      el("button", {
        class: "btn-icon",
        type: "button",
        "aria-label": "ログアウト",
        onClick: () => logout(),
      }, "⏻"),
    ]),
  ]);

  const main = el("main", { class: "admin-main", id: "admin-main-content" });

  mount.append(sidebar, main);
  return main;
}
