import { el, qs } from "../utils/dom.js";
import { icon } from "../utils/icons.js";
import { getSocials } from "../data/socials.js";

const NAV_ITEMS = [
  { key: "home", label: "Home", href: "/index.html" },
  { key: "about", label: "About", href: "/about.html" },
  { key: "works", label: "Works", href: "/works.html" },
  { key: "skills", label: "Skills", href: "/skills.html" },
  { key: "contact", label: "Contact", href: "/contact.html" },
];

const SOCIAL_ORDER = ["github", "note", "x", "linkedin", "youtube", "email"];

function socialHref(key, value) {
  if (!value) return null;
  if (key === "email") return `mailto:${value}`;
  return value;
}

function buildSocialLinks(socials) {
  return SOCIAL_ORDER.map((key) => {
    const href = socialHref(key, socials[key]);
    if (!href) return null;
    return el(
      "a",
      {
        href,
        class: "btn-icon",
        target: key === "email" ? undefined : "_blank",
        rel: key === "email" ? undefined : "noopener noreferrer",
        "aria-label": key,
        html: icon(key === "email" ? "mail" : key),
      },
    );
  }).filter(Boolean);
}

function buildNav(activeKey, containerClass) {
  const nav = el("nav", { class: containerClass, "aria-label": "メインナビゲーション" });
  NAV_ITEMS.forEach((item) => {
    nav.append(
      el("a", {
        href: item.href,
        "aria-current": item.key === activeKey ? "page" : undefined,
      }, item.label),
    );
  });
  return nav;
}

/**
 * Renders the site header into #site-header.
 * @param {string} activeKey one of NAV_ITEMS[].key
 */
export async function renderHeader(activeKey) {
  const mount = qs("#site-header");
  if (!mount) return;

  const header = el("header", { class: "site-header" });
  const container = el("div", { class: "container" });

  container.append(
    el("a", { href: "/index.html", class: "site-logo" }, "たきやのIT部屋"),
    buildNav(activeKey, "main-nav"),
    el("div", { class: "header-socials" }),
    el("button", {
      class: "nav-toggle",
      type: "button",
      "aria-expanded": "false",
      "aria-controls": "mobile-nav",
      "aria-label": "メニューを開く",
      html: icon("menu"),
      onClick: () => toggleMobileNav(header),
    }),
  );

  const mobileNav = el("div", { class: "mobile-nav", id: "mobile-nav" });
  mobileNav.append(buildNav(activeKey, "mobile-nav-links"));
  mobileNav.append(el("div", { class: "header-socials" }));

  header.append(container, mobileNav);
  mount.append(header);

  try {
    const socials = await getSocials();
    const links = buildSocialLinks(socials);
    header.querySelectorAll(".header-socials").forEach((slot) => {
      links.forEach((link) => slot.append(link.cloneNode(true)));
    });
  } catch (err) {
    console.error("Failed to load socials for header", err);
  }
}

function toggleMobileNav(header) {
  const isOpen = header.classList.toggle("is-open");
  const toggle = header.querySelector(".nav-toggle");
  toggle.setAttribute("aria-expanded", String(isOpen));
  toggle.innerHTML = icon(isOpen ? "close" : "menu");
}
