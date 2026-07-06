import { renderHeader } from "../components/header.js";
import { renderFooter } from "../components/footer.js";
import { getSkillCategories } from "../data/skills.js";
import { clear, qs, el } from "../utils/dom.js";

renderHeader("skills");
renderFooter();

async function load() {
  const mount = qs("#skills-list");
  try {
    const categories = await getSkillCategories();
    clear(mount);

    if (categories.length === 0) {
      mount.append(el("p", { class: "empty-state" }, "まだスキル情報がありません。"));
      return;
    }

    categories.forEach((cat) => {
      const tagList = el("div", { class: "tag-list" });
      (cat.items || []).forEach((item) => tagList.append(el("span", { class: "tag" }, item)));

      mount.append(
        el("div", { class: "skill-category" }, [
          el("h2", {}, cat.category),
          tagList,
        ]),
      );
    });
  } catch (err) {
    console.error("Failed to load skills", err);
    clear(mount);
    mount.append(el("p", { class: "empty-state" }, "読み込みに失敗しました。時間をおいて再度お試しください。"));
  }
}

load();
