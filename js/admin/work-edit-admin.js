import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";
import { requireAdmin } from "./auth-guard.js";
import { renderAdminShell } from "../components/admin-shell.js";
import { storage } from "../firebase-init.js";
import {
  CATEGORIES,
  defaultWork,
  getWorkById,
  createWork,
  updateWork,
  getAllWorks,
  nextOrder,
} from "../data/works.js";
import { tagInput } from "./tag-input.js";
import { el, clear } from "../utils/dom.js";
import { validate } from "../utils/validators.js";

const params = new URLSearchParams(location.search);
const workId = params.get("id");

let thumbnailFile = null;
let currentThumbnailUrl = "";
let techStackInput;
let tagsInput;

requireAdmin(async (user) => {
  const main = renderAdminShell("works", user);
  await load(main);
});

async function load(main) {
  clear(main);
  const isEdit = Boolean(workId);
  document.title = `${isEdit ? "作品を編集" : "作品を追加"} | 管理画面`;

  main.append(el("div", { class: "admin-header" }, [el("h1", {}, isEdit ? "作品を編集" : "新規作品を追加")]));

  let work = { ...defaultWork };
  if (isEdit) {
    try {
      const found = await getWorkById(workId);
      if (!found) {
        main.append(el("p", { class: "empty-state" }, "作品が見つかりませんでした。"));
        return;
      }
      work = found;
    } catch (err) {
      console.error("Failed to load work", err);
      main.append(el("p", { class: "empty-state" }, "読み込みに失敗しました。"));
      return;
    }
  } else {
    try {
      const all = await getAllWorks();
      work.order = nextOrder(all);
    } catch {
      work.order = 0;
    }
  }

  currentThumbnailUrl = work.thumbnailUrl || "";
  renderForm(main, work, isEdit);
}

function renderForm(main, work, isEdit) {
  const form = el("form", { class: "admin-form", id: "work-form" });

  const titleInput = el("input", { type: "text", id: "f-title", value: work.title, required: true });
  const categorySelect = el(
    "select",
    { id: "f-category" },
    CATEGORIES.map((c) => el("option", { value: c, selected: c === work.category ? "" : undefined }, c)),
  );
  const summaryInput = el("textarea", { id: "f-summary", rows: 2 }, work.summary);
  const descriptionInput = el("textarea", { id: "f-description", rows: 4 }, work.description);
  const backgroundInput = el("textarea", { id: "f-background", rows: 4 }, work.background);
  const effortInput = el("textarea", { id: "f-effort", rows: 4 }, work.effort);
  const githubInput = el("input", { type: "url", id: "f-github", value: work.github, placeholder: "https://github.com/..." });
  const liveUrlInput = el("input", { type: "url", id: "f-liveurl", value: work.liveUrl, placeholder: "https://..." });
  const docUrlInput = el("input", { type: "url", id: "f-docurl", value: work.docUrl, placeholder: "https://..." });
  const orderInput = el("input", { type: "number", id: "f-order", value: work.order });
  const publishedCheckbox = el("input", { type: "checkbox", id: "f-published", checked: work.published ? "" : undefined });

  const techStackField = el("div", { id: "tech-stack-field" });
  const tagsField = el("div", { id: "tags-field" });

  const thumbPreview = el("img", {
    class: "preview",
    src: work.thumbnailUrl || "/assets/images/work-placeholder.svg",
    alt: "",
    id: "thumb-preview",
  });
  const thumbFileInput = el("input", { type: "file", accept: "image/*", id: "f-thumbnail" });

  form.append(
    field("タイトル", titleInput, true),
    field("カテゴリ", categorySelect),
    field("概要(1〜2行)", summaryInput),
    field("詳細説明", descriptionInput),
    field("作成背景", backgroundInput),
    field("工夫した点", effortInput),
    fieldRaw("使用技術", techStackField),
    fieldRaw("タグ", tagsField),
    field("GitHub URL", githubInput),
    field("公開URL", liveUrlInput),
    field("資料URL", docUrlInput),
    fieldRaw("サムネイル画像", el("div", { class: "image-uploader" }, [thumbPreview, thumbFileInput])),
    el("div", { class: "form-grid-2" }, [
      field("表示順", orderInput),
      el("div", { class: "field checkbox-field", style: "margin-top:28px;" }, [
        publishedCheckbox,
        el("label", { for: "f-published" }, "公開する"),
      ]),
    ]),
    el("div", { id: "form-status" }),
    el("div", { class: "form-actions" }, [
      el("button", { type: "submit", class: "btn btn-primary", id: "save-btn" }, isEdit ? "更新する" : "作成する"),
    ]),
  );

  main.append(form);

  techStackInput = tagInput(techStackField, work.techStack || []);
  tagsInput = tagInput(tagsField, work.tags || []);

  thumbFileInput.addEventListener("change", () => {
    const file = thumbFileInput.files[0];
    if (!file) return;
    thumbnailFile = file;
    thumbPreview.src = URL.createObjectURL(file);
  });

  form.addEventListener("submit", (e) => handleSubmit(e, work.id));
}

function field(label, inputEl, required = false) {
  return el("div", { class: "field" }, [
    el("label", { for: inputEl.id }, `${label}${required ? " *" : ""}`),
    inputEl,
    el("p", { class: "error" }),
  ]);
}

function fieldRaw(label, node) {
  return el("div", { class: "field" }, [el("label", {}, label), node]);
}

async function handleSubmit(event, existingId) {
  event.preventDefault();
  const saveBtn = document.querySelector("#save-btn");
  const statusEl = document.querySelector("#form-status");
  clear(statusEl);

  const values = {
    title: document.querySelector("#f-title").value.trim(),
    category: document.querySelector("#f-category").value,
    summary: document.querySelector("#f-summary").value.trim(),
    description: document.querySelector("#f-description").value.trim(),
    background: document.querySelector("#f-background").value.trim(),
    effort: document.querySelector("#f-effort").value.trim(),
    github: document.querySelector("#f-github").value.trim(),
    liveUrl: document.querySelector("#f-liveurl").value.trim(),
    docUrl: document.querySelector("#f-docurl").value.trim(),
    order: Number(document.querySelector("#f-order").value) || 0,
    published: document.querySelector("#f-published").checked,
    techStack: techStackInput.getItems(),
    tags: tagsInput.getItems(),
  };

  const errors = validate({
    title: { value: values.title, required: true, label: "タイトル", max: 100 },
    summary: { value: values.summary, required: true, label: "概要", max: 300 },
  });

  if (Object.keys(errors).length > 0) {
    statusEl.append(el("div", { class: "status-banner error" }, "必須項目を入力してください。"));
    return;
  }

  saveBtn.disabled = true;
  saveBtn.textContent = "保存中...";

  try {
    let id = existingId;
    if (!id) {
      id = await createWork({ ...values, thumbnailUrl: currentThumbnailUrl });
    } else {
      await updateWork(id, values);
    }

    if (thumbnailFile) {
      const path = `works/${id}/thumbnail-${Date.now()}-${thumbnailFile.name}`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, thumbnailFile);
      const url = await getDownloadURL(storageRef);
      await updateWork(id, { thumbnailUrl: url });
    }

    location.href = "/admin/works.html";
  } catch (err) {
    console.error("Failed to save work", err);
    statusEl.append(el("div", { class: "status-banner error" }, "保存に失敗しました。時間をおいて再度お試しください。"));
    saveBtn.disabled = false;
    saveBtn.textContent = existingId ? "更新する" : "作成する";
  }
}
