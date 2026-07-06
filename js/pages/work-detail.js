import { renderHeader } from "../components/header.js";
import { renderFooter } from "../components/footer.js";
import { getWorkById } from "../data/works.js";
import { clear, qs, el } from "../utils/dom.js";
import { icon } from "../utils/icons.js";

renderHeader("works");
renderFooter();

const root = qs("#work-detail-root");
const params = new URLSearchParams(location.search);
const id = params.get("id");

function renderNotFound(message) {
  clear(root);
  root.append(
    el("a", { href: "/works.html", class: "back-link" }, [el("span", { html: icon("arrowLeft") }), "Worksへ戻る"]),
    el("p", { class: "empty-state" }, message),
  );
}

function setMeta(work) {
  document.title = `${work.title} | Takaya Shiobara`;
  qs("#page-description").setAttribute("content", work.summary || "");
  qs("#og-title").setAttribute("content", `${work.title} | Takaya Shiobara`);
  qs("#og-description").setAttribute("content", work.summary || "");
  qs("#og-image").setAttribute("content", work.thumbnailUrl || "/assets/images/work-placeholder.svg");
  qs("#canonical-link").setAttribute("href", `/work.html?id=${work.id}`);

  const ld = document.createElement("script");
  ld.type = "application/ld+json";
  ld.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: work.title,
    description: work.summary,
    creator: { "@type": "Person", name: "Takaya Shiobara" },
    keywords: (work.tags || []).join(", "),
    url: `/work.html?id=${work.id}`,
    image: work.thumbnailUrl || undefined,
  });
  document.head.append(ld);
}

function linkRow(label, href, iconName = "external") {
  if (!href) return null;
  return el("a", { href, target: "_blank", rel: "noopener noreferrer", class: "btn btn-secondary" }, [
    label,
    el("span", { html: icon(iconName) }),
  ]);
}

function renderWork(work) {
  clear(root);
  setMeta(work);

  const techTags = el("div", { class: "tag-list" });
  (work.techStack || []).forEach((tech) => techTags.append(el("span", { class: "tag" }, tech)));

  const links = [
    linkRow("GitHubを見る", work.github, "github"),
    linkRow("公開サイトを見る", work.liveUrl),
    linkRow("資料を見る", work.docUrl),
  ].filter(Boolean);

  const sidebar = el("div", { class: "card work-detail-sidebar" }, [
    el("div", { class: "card-body" }, [
      el("div", {}, [
        el("h2", { style: "font-size:1rem;font-weight:700;margin-bottom:12px;" }, "使用技術"),
        techTags,
      ]),
      links.length
        ? el("div", { class: "work-detail-links" }, links)
        : null,
    ]),
  ]);

  const sections = [];
  if (work.background) {
    sections.push(
      el("div", { class: "work-detail-section" }, [el("h2", {}, "作成背景"), el("p", {}, work.background)]),
    );
  }
  if (work.description) {
    sections.push(
      el("div", { class: "work-detail-section" }, [el("h2", {}, "概要"), el("p", {}, work.description)]),
    );
  }
  if (work.effort) {
    sections.push(
      el("div", { class: "work-detail-section" }, [el("h2", {}, "工夫した点"), el("p", {}, work.effort)]),
    );
  }

  root.append(
    el("a", { href: "/works.html", class: "back-link" }, [el("span", { html: icon("arrowLeft") }), "Worksへ戻る"]),
    el("div", { class: "work-detail-header" }, [
      el("div", { class: "work-detail-meta" }, [el("span", { class: "category-badge" }, work.category)]),
      el("h1", { style: "font-size:2rem;font-weight:800;letter-spacing:-0.02em;margin-bottom:12px;" }, work.title),
      el("p", { style: "color:var(--color-text-muted);font-size:1.05rem;" }, work.summary),
    ]),
    el("div", { class: "work-detail-thumb" }, [
      el("img", { src: work.thumbnailUrl || "/assets/images/work-placeholder.svg", alt: "" }),
    ]),
    el("div", { class: "work-detail-body" }, [el("div", {}, sections), sidebar]),
  );
}

async function load() {
  if (!id) {
    renderNotFound("作品が見つかりませんでした。");
    return;
  }
  try {
    const work = await getWorkById(id);
    if (!work || !work.published) {
      renderNotFound("作品が見つかりませんでした。");
      return;
    }
    renderWork(work);
  } catch (err) {
    console.error("Failed to load work", err);
    renderNotFound("読み込みに失敗しました。時間をおいて再度お試しください。");
  }
}

load();
