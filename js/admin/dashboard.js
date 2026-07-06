import { requireAdmin } from "./auth-guard.js";
import { renderAdminShell } from "../components/admin-shell.js";
import { getAllWorks, CATEGORIES } from "../data/works.js";
import { clear, el } from "../utils/dom.js";

requireAdmin(async (user) => {
  const main = renderAdminShell("dashboard", user);
  await load(main);
});

async function load(main) {
  clear(main);
  main.append(el("div", { class: "admin-header" }, [el("h1", {}, "Dashboard")]));

  try {
    const works = await getAllWorks();
    const published = works.filter((w) => w.published).length;
    const draft = works.length - published;

    const statGrid = el("div", { class: "stat-grid" }, [
      statCard(works.length, "総作品数"),
      statCard(published, "公開中"),
      statCard(draft, "非公開"),
    ]);
    main.append(statGrid);

    const categoryGrid = el(
      "div",
      { class: "stat-grid" },
      CATEGORIES.map((cat) => statCard(works.filter((w) => w.category === cat).length, cat)),
    );
    main.append(el("h2", { style: "font-size:1.05rem;font-weight:700;margin-bottom:16px;" }, "カテゴリ別件数"));
    main.append(categoryGrid);
  } catch (err) {
    console.error("Failed to load dashboard stats", err);
    main.append(el("p", { class: "empty-state" }, "データの読み込みに失敗しました。"));
  }
}

function statCard(value, label) {
  return el("div", { class: "card stat-card" }, [
    el("div", { class: "stat-value" }, String(value)),
    el("div", { class: "stat-label" }, label),
  ]);
}
