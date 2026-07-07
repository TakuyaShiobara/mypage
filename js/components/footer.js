import { el, qs } from "../utils/dom.js";
import { icon } from "../utils/icons.js";
import { getSocials } from "../data/socials.js";

const SOCIAL_ORDER = ["github", "note", "x", "linkedin", "youtube", "email"];

function socialHref(key, value) {
  if (!value) return null;
  if (key === "email") return `mailto:${value}`;
  return value;
}

export async function renderFooter() {
  const mount = qs("#site-footer");
  if (!mount) return;

  const footer = el("footer", { class: "site-footer" });
  const container = el("div", { class: "container" });
  const socialsRow = el("div", { class: "footer-socials" });
  const year = new Date().getFullYear();

  container.append(
    socialsRow,
    el("p", { class: "footer-copyright" }, `© ${year} たきやのIT部屋`),
  );
  footer.append(container);
  mount.append(footer);

  try {
    const socials = await getSocials();
    SOCIAL_ORDER.forEach((key) => {
      const href = socialHref(key, socials[key]);
      if (!href) return;
      socialsRow.append(
        el("a", {
          href,
          class: "btn-icon",
          target: key === "email" ? undefined : "_blank",
          rel: key === "email" ? undefined : "noopener noreferrer",
          "aria-label": key,
          html: icon(key === "email" ? "mail" : key),
        }),
      );
    });
  } catch (err) {
    console.error("Failed to load socials for footer", err);
  }
}
