import { renderHeader } from "../components/header.js";
import { renderFooter } from "../components/footer.js";
import { getProfile } from "../data/profile.js";
import { clear, qs, el } from "../utils/dom.js";

renderHeader("about");
renderFooter();

async function load() {
  try {
    const profile = await getProfile();

    qs("#about-bio").textContent = profile.bio || "自己紹介は準備中です。";
    qs("#about-future").textContent = profile.futureGoals || "準備中です。";

    const strengthsEl = qs("#about-strengths");
    clear(strengthsEl);
    if (profile.strengths?.length) {
      profile.strengths.forEach((s) => strengthsEl.append(el("span", { class: "tag" }, s)));
    } else {
      strengthsEl.append(el("p", { class: "empty-state" }, "準備中です。"));
    }

    const careerEl = qs("#about-career");
    clear(careerEl);
    if (profile.career?.length) {
      profile.career.forEach((item) => {
        careerEl.append(
          el("div", { class: "timeline-item" }, [
            el("span", { class: "timeline-date" }, item.period),
            el("div", {}, [
              el("h3", { style: "font-size:1rem;font-weight:700;margin-bottom:4px;" }, item.title),
              el("p", { style: "margin:0;" }, item.description),
            ]),
          ]),
        );
      });
    } else {
      careerEl.append(el("p", { class: "empty-state" }, "準備中です。"));
    }
  } catch (err) {
    console.error("Failed to load profile", err);
    qs("#about-bio").textContent = "読み込みに失敗しました。時間をおいて再度お試しください。";
  }
}

load();
