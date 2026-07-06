import { el } from "../utils/dom.js";
import { icon } from "../utils/icons.js";

const PLACEHOLDER_THUMB = "/assets/images/work-placeholder.svg";

export function workCard(work) {
  const thumb = el("div", { class: "work-card-thumb" }, [
    el("img", {
      src: work.thumbnailUrl || PLACEHOLDER_THUMB,
      alt: "",
      loading: "lazy",
    }),
    el("span", { class: "category-badge" }, work.category),
  ]);

  const tagList = el("div", { class: "tag-list work-card-tags" });
  (work.techStack || []).slice(0, 3).forEach((tech) => {
    tagList.append(el("span", { class: "tag" }, tech));
  });

  const body = el("div", { class: "work-card-body" }, [
    el("h3", { class: "work-card-title" }, work.title),
    el("p", { class: "work-card-summary" }, work.summary),
    tagList,
    el("span", { class: "work-card-link" }, ["詳細を見る", el("span", { html: icon("arrowRight") })]),
  ]);

  return el("a", { href: `/work.html?id=${work.id}`, class: "card work-card" }, [thumb, body]);
}
