import { renderHeader } from "../components/header.js";
import { renderFooter } from "../components/footer.js";
import { validate } from "../utils/validators.js";
import { clear, qs, el } from "../utils/dom.js";
import { emailjsConfig } from "../config.js";

renderHeader("contact");
renderFooter();

const form = qs("#contact-form");
const statusEl = qs("#form-status");
const submitBtn = qs("#submit-btn");

if (window.emailjs && emailjsConfig.publicKey && !emailjsConfig.publicKey.startsWith("YOUR_")) {
  window.emailjs.init({ publicKey: emailjsConfig.publicKey });
}

function setFieldError(fieldId, message) {
  const field = qs(`#field-${fieldId}`);
  field.classList.toggle("has-error", Boolean(message));
  field.querySelector(".error").textContent = message || "";
}

function clearErrors() {
  ["name", "email", "subject", "message"].forEach((id) => setFieldError(id, ""));
}

function showStatus(type, message) {
  clear(statusEl);
  statusEl.append(el("div", { class: `status-banner ${type}` }, message));
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearErrors();
  clear(statusEl);

  const values = {
    name: qs("#name").value,
    email: qs("#email").value,
    subject: qs("#subject").value,
    message: qs("#message").value,
  };

  const errors = validate({
    name: { value: values.name, required: true, label: "名前", max: 100 },
    email: { value: values.email, required: true, email: true, label: "メールアドレス" },
    subject: { value: values.subject, required: true, label: "件名", max: 200 },
    message: { value: values.message, required: true, label: "お問い合わせ内容", max: 5000 },
  });

  if (Object.keys(errors).length > 0) {
    Object.entries(errors).forEach(([field, message]) => setFieldError(field, message));
    showStatus("error", "入力内容をご確認ください。");
    return;
  }

  if (!window.emailjs || emailjsConfig.publicKey.startsWith("YOUR_")) {
    console.error("EmailJS is not configured. See js/config.example.js");
    showStatus("error", "現在お問い合わせフォームが利用できません。時間をおいて再度お試しください。");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "送信中...";

  try {
    await window.emailjs.send(emailjsConfig.serviceId, emailjsConfig.templateId, {
      from_name: values.name,
      reply_to: values.email,
      subject: values.subject,
      message: values.message,
    });
    form.reset();
    showStatus("success", "お問い合わせありがとうございます。内容を送信しました。");
  } catch (err) {
    console.error("Failed to send contact form", err);
    showStatus("error", "送信に失敗しました。時間をおいて再度お試しください。");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "送信する";
  }
});
