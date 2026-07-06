import { requireAdmin } from "./auth-guard.js";
import { renderAdminShell } from "../components/admin-shell.js";
import { getProfile, saveProfile } from "../data/profile.js";
import { tagInput } from "./tag-input.js";
import { el, clear } from "../utils/dom.js";
import { validate } from "../utils/validators.js";

let careerRows = [];
let strengthsInput;

requireAdmin(async (user) => {
  const main = renderAdminShell("profile", user);
  await load(main);
});

async function load(main) {
  clear(main);
  main.append(el("div", { class: "admin-header" }, [el("h1", {}, "プロフィール編集")]));

  try {
    const profile = await getProfile();
    renderForm(main, profile);
  } catch (err) {
    console.error("Failed to load profile", err);
    main.append(el("p", { class: "empty-state" }, "読み込みに失敗しました。"));
  }
}

function careerRow(item = { period: "", title: "", description: "" }) {
  const periodInput = el("input", { type: "text", value: item.period, placeholder: "例: 2022.04 - 現在" });
  const titleInput = el("input", { type: "text", value: item.title, placeholder: "役職・所属など" });
  const descInput = el("textarea", { rows: 2, placeholder: "説明" }, item.description);

  const removeBtn = el("button", { type: "button", class: "btn btn-danger btn-sm" }, "削除");
  const wrap = el("div", { class: "skill-editor-category" }, [
    el("div", { class: "form-grid-2" }, [
      el("div", { class: "field" }, [el("label", {}, "期間"), periodInput]),
      el("div", { class: "field" }, [el("label", {}, "タイトル"), titleInput]),
    ]),
    el("div", { class: "field" }, [el("label", {}, "説明"), descInput]),
    removeBtn,
  ]);

  const entry = { wrap, periodInput, titleInput, descInput };
  removeBtn.addEventListener("click", () => {
    careerRows = careerRows.filter((r) => r !== entry);
    wrap.remove();
  });

  return entry;
}

function renderForm(main, profile) {
  const form = el("form", { class: "admin-form", id: "profile-form" });

  const nameInput = el("input", { type: "text", id: "f-name", value: profile.name });
  const titleInput = el("input", { type: "text", id: "f-title", value: profile.title });
  const taglineInput = el("textarea", { id: "f-tagline", rows: 2 }, profile.tagline);
  const descriptionInput = el("textarea", { id: "f-description", rows: 2 }, profile.description);
  const bioInput = el("textarea", { id: "f-bio", rows: 5 }, profile.bio);
  const futureInput = el("textarea", { id: "f-future", rows: 4 }, profile.futureGoals);

  const strengthsField = el("div", { id: "strengths-field" });
  const careerField = el("div", { id: "career-field" });
  const addCareerBtn = el("button", { type: "button", class: "btn btn-secondary btn-sm" }, "+ 経歴を追加");

  form.append(
    field("名前", nameInput, "f-name"),
    field("肩書き", titleInput, "f-title"),
    field("キャッチコピー(改行は\\nで表示に反映されます)", taglineInput, "f-tagline"),
    field("トップページの説明文", descriptionInput, "f-description"),
    field("自己紹介", bioInput, "f-bio"),
    fieldRaw("得意分野", strengthsField),
    fieldRaw("経歴", el("div", {}, [careerField, addCareerBtn])),
    field("今後挑戦したいこと", futureInput, "f-future"),
    el("div", { id: "form-status" }),
    el("div", { class: "form-actions" }, [
      el("button", { type: "submit", class: "btn btn-primary", id: "save-btn" }, "保存する"),
    ]),
  );

  main.append(form);

  strengthsInput = tagInput(strengthsField, profile.strengths || []);

  careerRows = (profile.career || []).map((item) => careerRow(item));
  careerRows.forEach((entry) => careerField.append(entry.wrap));

  addCareerBtn.addEventListener("click", () => {
    const entry = careerRow();
    careerRows.push(entry);
    careerField.append(entry.wrap);
  });

  form.addEventListener("submit", handleSubmit);
}

function field(label, inputEl, id) {
  return el("div", { class: "field" }, [el("label", { for: id }, label), inputEl]);
}

function fieldRaw(label, node) {
  return el("div", { class: "field" }, [el("label", {}, label), node]);
}

async function handleSubmit(event) {
  event.preventDefault();
  const saveBtn = document.querySelector("#save-btn");
  const statusEl = document.querySelector("#form-status");
  clear(statusEl);

  const values = {
    name: document.querySelector("#f-name").value.trim(),
    title: document.querySelector("#f-title").value.trim(),
    tagline: document.querySelector("#f-tagline").value.trim(),
    description: document.querySelector("#f-description").value.trim(),
    bio: document.querySelector("#f-bio").value.trim(),
    futureGoals: document.querySelector("#f-future").value.trim(),
    strengths: strengthsInput.getItems(),
    career: careerRows.map((r) => ({
      period: r.periodInput.value.trim(),
      title: r.titleInput.value.trim(),
      description: r.descInput.value.trim(),
    })),
  };

  const errors = validate({
    name: { value: values.name, required: true, label: "名前" },
    title: { value: values.title, required: true, label: "肩書き" },
  });

  if (Object.keys(errors).length > 0) {
    statusEl.append(el("div", { class: "status-banner error" }, "必須項目を入力してください。"));
    return;
  }

  saveBtn.disabled = true;
  saveBtn.textContent = "保存中...";
  try {
    await saveProfile(values);
    statusEl.append(el("div", { class: "status-banner success" }, "保存しました。"));
  } catch (err) {
    console.error("Failed to save profile", err);
    statusEl.append(el("div", { class: "status-banner error" }, "保存に失敗しました。時間をおいて再度お試しください。"));
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = "保存する";
  }
}
