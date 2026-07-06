import { renderHeader } from "../components/header.js";
import { renderFooter } from "../components/footer.js";
import { workCard } from "../components/work-card.js";
import { getPublishedWorks, CATEGORIES } from "../data/works.js";
import { clear, qs, el } from "../utils/dom.js";

renderHeader("works");
renderFooter();

const state = {
  works: [],
  category: "all",
  search: "",
};

function matchesFilter(work) {
  const categoryOk = state.category === "all" || work.category === state.category;
  if (!categoryOk) return false;

  const term = state.search.trim().toLowerCase();
  if (!term) return true;

  const haystack = [work.title, ...(work.tags || []), ...(work.techStack || [])]
    .join(" ")
    .toLowerCase();
  return haystack.includes(term);
}

function renderList() {
  const mount = qs("#works-list");
  clear(mount);
  const filtered = state.works.filter(matchesFilter);

  if (filtered.length === 0) {
    mount.append(el("p", { class: "empty-state" }, "条件に一致する作品がありません。"));
    return;
  }
  filtered.forEach((work) => mount.append(workCard(work)));
}

function renderFilters() {
  const mount = qs("#category-filters");
  clear(mount);

  const options = [{ value: "all", label: "すべて" }, ...CATEGORIES.map((c) => ({ value: c, label: c }))];
  options.forEach((opt) => {
    const btn = el(
      "button",
      {
        type: "button",
        class: `filter-pill${state.category === opt.value ? " is-active" : ""}`,
        onClick: () => {
          state.category = opt.value;
          renderFilters();
          renderList();
        },
      },
      opt.label,
    );
    mount.append(btn);
  });
}

async function load() {
  const mount = qs("#works-list");
  try {
    state.works = await getPublishedWorks();
    renderFilters();
    renderList();
  } catch (err) {
    console.error("Failed to load works", err);
    clear(mount);
    mount.append(el("p", { class: "empty-state" }, "作品の読み込みに失敗しました。時間をおいて再度お試しください。"));
  }
}

qs("#tag-search").addEventListener("input", (e) => {
  state.search = e.target.value;
  renderList();
});

load();
