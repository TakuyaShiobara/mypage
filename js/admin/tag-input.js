import { el, clear } from "../utils/dom.js";

/**
 * A simple add/remove chip input, e.g. for tags or tech stack.
 * Renders into `container` and returns { getItems() }.
 */
export function tagInput(container, initialItems = []) {
  let items = [...initialItems];

  const pillWrap = el("div", { class: "skill-pill-editor" });
  const textInput = el("input", { type: "text", placeholder: "入力してEnterまたは追加ボタン" });
  const addBtn = el("button", { type: "button", class: "btn btn-secondary btn-sm" }, "追加");
  const row = el("div", { style: "display:flex;gap:8px;margin-bottom:8px;" }, [textInput, addBtn]);

  function renderPills() {
    clear(pillWrap);
    items.forEach((item, index) => {
      pillWrap.append(
        el("span", { class: "tag" }, [
          item,
          el("button", {
            type: "button",
            "aria-label": `${item}を削除`,
            onClick: () => {
              items.splice(index, 1);
              renderPills();
            },
          }, "×"),
        ]),
      );
    });
  }

  function addFromInput() {
    const value = textInput.value.trim();
    if (!value) return;
    if (!items.includes(value)) items.push(value);
    textInput.value = "";
    renderPills();
  }

  addBtn.addEventListener("click", addFromInput);
  textInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addFromInput();
    }
  });

  renderPills();
  container.append(pillWrap, row);

  return {
    getItems: () => [...items],
  };
}
