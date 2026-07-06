import { requireAdmin } from "./auth-guard.js";
import { renderAdminShell } from "../components/admin-shell.js";
import { getAllWorks, deleteWork, setWorkPublished, reorderWorks } from "../data/works.js";
import { clear, el } from "../utils/dom.js";
import { icon } from "../utils/icons.js";

let works = [];
let dragId = null;

requireAdmin(async (user) => {
  const main = renderAdminShell("works", user);
  await load(main);
});

async function load(main) {
  clear(main);
  main.append(
    el("div", { class: "admin-header" }, [
      el("h1", {}, "作品管理"),
      el("a", { href: "/admin/work-edit.html", class: "btn btn-primary" }, "+ 新規追加"),
    ]),
  );

  const tableWrap = el("div", { class: "admin-table-wrap" });
  main.append(tableWrap);

  try {
    works = await getAllWorks();
    renderTable(tableWrap);
  } catch (err) {
    console.error("Failed to load works", err);
    main.append(el("p", { class: "empty-state" }, "作品の読み込みに失敗しました。"));
  }
}

function renderTable(container) {
  clear(container);

  if (works.length === 0) {
    container.append(el("p", { class: "empty-state" }, "まだ作品がありません。「新規追加」から登録してください。"));
    return;
  }

  const table = el("table", { class: "admin-table" });
  const thead = el("thead", {}, [
    el("tr", {}, [
      el("th", {}, ""),
      el("th", {}, "サムネイル"),
      el("th", {}, "タイトル"),
      el("th", {}, "カテゴリ"),
      el("th", {}, "公開設定"),
      el("th", {}, "操作"),
    ]),
  ]);

  const tbody = el("tbody");
  works.forEach((work) => tbody.append(buildRow(work)));

  table.append(thead, tbody);
  container.append(table);
}

function buildRow(work) {
  const row = el("tr", {
    draggable: "true",
    "data-id": work.id,
    onDragstart: () => {
      dragId = work.id;
      row.classList.add("is-dragging");
    },
    onDragend: () => {
      row.classList.remove("is-dragging");
    },
    onDragover: (e) => {
      e.preventDefault();
      row.classList.add("drop-target");
    },
    onDragleave: () => row.classList.remove("drop-target"),
    onDrop: async (e) => {
      e.preventDefault();
      row.classList.remove("drop-target");
      if (!dragId || dragId === work.id) return;
      await handleReorder(dragId, work.id);
    },
  });

  row.append(
    el("td", { html: icon("drag") }),
    el("td", {}, [el("img", { class: "thumb-preview", src: work.thumbnailUrl || "/assets/images/work-placeholder.svg", alt: "" })]),
    el("td", {}, work.title || "(無題)"),
    el("td", {}, work.category),
    el("td", {}, [
      el("button", {
        type: "button",
        class: `pill-toggle ${work.published ? "is-published" : "is-draft"}`,
        onClick: async (e) => {
          const btn = e.currentTarget;
          btn.disabled = true;
          try {
            await setWorkPublished(work.id, !work.published);
            work.published = !work.published;
            btn.className = `pill-toggle ${work.published ? "is-published" : "is-draft"}`;
            btn.textContent = work.published ? "公開中" : "非公開";
          } catch (err) {
            console.error("Failed to toggle publish state", err);
            alert("更新に失敗しました。");
          } finally {
            btn.disabled = false;
          }
        },
      }, work.published ? "公開中" : "非公開"),
    ]),
    el("td", {}, [
      el("div", { class: "row-actions" }, [
        el("a", { href: `/admin/work-edit.html?id=${work.id}`, class: "btn btn-secondary btn-sm" }, "編集"),
        el("button", {
          type: "button",
          class: "btn btn-danger btn-sm",
          onClick: () => handleDelete(work),
        }, "削除"),
      ]),
    ]),
  );

  return row;
}

async function handleReorder(sourceId, targetId) {
  const sourceIndex = works.findIndex((w) => w.id === sourceId);
  const targetIndex = works.findIndex((w) => w.id === targetId);
  if (sourceIndex === -1 || targetIndex === -1) return;

  const reordered = [...works];
  const [moved] = reordered.splice(sourceIndex, 1);
  reordered.splice(targetIndex, 0, moved);
  works = reordered;

  const tableWrap = document.querySelector(".admin-table-wrap");
  renderTable(tableWrap);

  try {
    await reorderWorks(works.map((w) => w.id));
  } catch (err) {
    console.error("Failed to persist new order", err);
    alert("並び順の保存に失敗しました。");
  }
}

async function handleDelete(work) {
  if (!confirm(`「${work.title || "無題"}」を削除しますか?この操作は取り消せません。`)) return;
  try {
    await deleteWork(work.id);
    works = works.filter((w) => w.id !== work.id);
    renderTable(document.querySelector(".admin-table-wrap"));
  } catch (err) {
    console.error("Failed to delete work", err);
    alert("削除に失敗しました。");
  }
}
