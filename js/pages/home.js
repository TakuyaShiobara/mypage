import { renderHeader } from "../components/header.js";
import { renderFooter } from "../components/footer.js";
import { workCard } from "../components/work-card.js";
import { getProfile } from "../data/profile.js";
import { getPublishedWorks } from "../data/works.js";
import { icon } from "../utils/icons.js";
import { clear, qs, qsa, el } from "../utils/dom.js";

renderHeader("home");
renderFooter();

qsa(".feature-icon[data-icon]").forEach((node) => {
  node.innerHTML = icon(node.dataset.icon);
});

async function loadHero() {
  try {
    const profile = await getProfile();
    qs("#hero-title").textContent = profile.title;
    qs("#hero-tagline").innerHTML = "";
    profile.tagline.split("\n").forEach((line, index) => {
      if (index > 0) qs("#hero-tagline").append(el("br"));
      qs("#hero-tagline").append(document.createTextNode(line));
    });
    qs("#hero-description").textContent = profile.description;
  } catch (err) {
    console.error("Failed to load profile", err);
  }
}

async function loadLatestWorks() {
  const mount = qs("#latest-works");
  try {
    const works = await getPublishedWorks(8);
    clear(mount);
    if (works.length === 0) {
      mount.append(el("p", { class: "empty-state" }, "まだ作品がありません。"));
      return;
    }
    works.forEach((work) => mount.append(workCard(work)));
  } catch (err) {
    console.error("Failed to load works", err);
    clear(mount);
    mount.append(el("p", { class: "empty-state" }, "作品の読み込みに失敗しました。時間をおいて再度お試しください。"));
  }
}

loadHero();
loadLatestWorks();
