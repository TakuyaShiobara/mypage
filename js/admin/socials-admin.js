import { requireAdmin } from "./auth-guard.js";
import { renderAdminShell } from "../components/admin-shell.js";
import { getSocials, saveSocials } from "../data/socials.js";
import { el, clear } from "../utils/dom.js";
import { isValidEmail } from "../utils/validators.js";

const FIELDS = [
  { key: "github", label: "GitHub URL", placeholder: "https://github.com/yourname" },
  { key: "note", label: "note URL", placeholder: "https://note.com/yourname" },
  { key: "x", label: "X (Twitter) URL", placeholder: "https://x.com/yourname" },
  { key: "linkedin", label: "LinkedIn URL", placeholder: "https://linkedin.com/in/yourname" },
  { key: "youtube", label: "YouTube URL", placeholder: "https://youtube.com/@yourname" },
  { key: "email", label: "メールアドレス", placeholder: "you@example.com" },
];

requireAdmin(async (user) => {
  const main = renderAdminShell("socials", user);
  await load(main);
});

async function load(main) {
  clear(main);
  main.append(el("div", { class: "admin-header" }, [el("h1", {}, "SNS編集")]));

  try {
    const socials = await getSocials();
    renderForm(main, socials);
  } catch (err) {
    console.error("Failed to load socials", err);
    main.append(el("p", { class: "empty-state" }, "読み込みに失敗しました。"));
  }
}

function renderForm(main, socials) {
  const form = el("form", { class: "admin-form", id: "socials-form" });
  const inputs = {};

  FIELDS.forEach(({ key, label, placeholder }) => {
    const input = el("input", {
      type: key === "email" ? "email" : "url",
      id: `f-${key}`,
      value: socials[key] || "",
      placeholder,
    });
    inputs[key] = input;
    form.append(el("div", { class: "field" }, [el("label", { for: `f-${key}` }, label), input]));
  });

  form.append(
    el("div", { id: "form-status" }),
    el("div", { class: "form-actions" }, [
      el("button", { type: "submit", class: "btn btn-primary", id: "save-btn" }, "保存する"),
    ]),
  );

  main.append(form);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const statusEl = document.querySelector("#form-status");
    const saveBtn = document.querySelector("#save-btn");
    clear(statusEl);

    const values = {};
    FIELDS.forEach(({ key }) => {
      values[key] = inputs[key].value.trim();
    });

    if (values.email && !isValidEmail(values.email)) {
      statusEl.append(el("div", { class: "status-banner error" }, "メールアドレスの形式が正しくありません。"));
      return;
    }

    saveBtn.disabled = true;
    saveBtn.textContent = "保存中...";
    try {
      await saveSocials(values);
      statusEl.append(el("div", { class: "status-banner success" }, "保存しました。"));
    } catch (err) {
      console.error("Failed to save socials", err);
      statusEl.append(el("div", { class: "status-banner error" }, "保存に失敗しました。時間をおいて再度お試しください。"));
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = "保存する";
    }
  });
}
