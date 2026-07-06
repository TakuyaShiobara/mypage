import { requireAdmin } from "./auth-guard.js";
import { renderAdminShell } from "../components/admin-shell.js";
import {
  getSkillCategories,
  createSkillCategory,
  updateSkillCategory,
  deleteSkillCategory,
  reorderSkillCategories,
  nextSkillOrder,
} from "../data/skills.js";
import { tagInput } from "./tag-input.js";
import { el, clear } from "../utils/dom.js";

let categories = [];
let main;

requireAdmin(async (user) => {
  main = renderAdminShell("skills", user);
  await load();
});

async function load() {
  clear(main);
  main.append(
    el("div", { class: "admin-header" }, [
      el("h1", {}, "スキル編集"),
      el("button", { type: "button", class: "btn btn-primary", id: "add-category-btn" }, "+ カテゴリ追加"),
    ]),
  );

  const list = el("div", { id: "category-list" });
  main.append(list);

  try {
    categories = await getSkillCategories();
    renderList(list);
  } catch (err) {
    console.error("Failed to load skills", err);
    list.append(el("p", { class: "empty-state" }, "読み込みに失敗しました。"));
  }

  document.querySelector("#add-category-btn").addEventListener("click", async (e) => {
    e.target.disabled = true;
    try {
      const id = await createSkillCategory({ category: "新しいカテゴリ", order: nextSkillOrder(categories), items: [] });
      categories.push({ id, category: "新しいカテゴリ", order: nextSkillOrder(categories), items: [] });
      renderList(list);
    } catch (err) {
      console.error("Failed to add category", err);
      alert("カテゴリの追加に失敗しました。");
    } finally {
      e.target.disabled = false;
    }
  });
}

function renderList(list) {
  clear(list);
  if (categories.length === 0) {
    list.append(el("p", { class: "empty-state" }, "まだカテゴリがありません。「カテゴリ追加」から作成してください。"));
    return;
  }
  categories.forEach((cat, index) => list.append(buildCard(cat, index, list)));
}

function buildCard(cat, index, list) {
  const nameInput = el("input", { type: "text", value: cat.category, placeholder: "カテゴリ名(例: Frontend)" });
  const itemsField = el("div");
  const items = tagInput(itemsField, cat.items || []);

  const upBtn = el("button", {
    type: "button",
    class: "btn-icon",
    "aria-label": "上へ移動",
    disabled: index === 0 ? "" : undefined,
    onClick: () => moveCategory(index, -1, list),
  }, "↑");
  const downBtn = el("button", {
    type: "button",
    class: "btn-icon",
    "aria-label": "下へ移動",
    disabled: index === categories.length - 1 ? "" : undefined,
    onClick: () => moveCategory(index, 1, list),
  }, "↓");

  const saveBtn = el("button", {
    type: "button",
    class: "btn btn-primary btn-sm",
    onClick: async () => {
      saveBtn.disabled = true;
      try {
        await updateSkillCategory(cat.id, { category: nameInput.value.trim(), items: items.getItems() });
        cat.category = nameInput.value.trim();
        cat.items = items.getItems();
      } catch (err) {
        console.error("Failed to save category", err);
        alert("保存に失敗しました。");
      } finally {
        saveBtn.disabled = false;
      }
    },
  }, "保存");

  const deleteBtn = el("button", {
    type: "button",
    class: "btn btn-danger btn-sm",
    onClick: async () => {
      if (!confirm(`「${cat.category}」を削除しますか?`)) return;
      try {
        await deleteSkillCategory(cat.id);
        categories = categories.filter((c) => c.id !== cat.id);
        renderList(list);
      } catch (err) {
        console.error("Failed to delete category", err);
        alert("削除に失敗しました。");
      }
    },
  }, "削除");

  return el("div", { class: "skill-editor-category" }, [
    el("div", { class: "skill-editor-category-head" }, [upBtn, downBtn, nameInput]),
    itemsField,
    el("div", { class: "row-actions" }, [saveBtn, deleteBtn]),
  ]);
}

async function moveCategory(index, direction, list) {
  const targetIndex = index + direction;
  if (targetIndex < 0 || targetIndex >= categories.length) return;

  const reordered = [...categories];
  [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
  categories = reordered;
  renderList(list);

  try {
    await reorderSkillCategories(categories.map((c) => c.id));
  } catch (err) {
    console.error("Failed to persist order", err);
    alert("並び順の保存に失敗しました。");
  }
}
