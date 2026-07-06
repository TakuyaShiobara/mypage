document.getElementById("year").textContent = new Date().getFullYear();

const worksList = document.getElementById("works-list");

function showStatus(message) {
  worksList.replaceChildren();
  const li = document.createElement("li");
  li.className = "works-status";
  li.textContent = message;
  worksList.appendChild(li);
}

function formatDate(yyyyMm) {
  const [year, month] = yyyyMm.split("-");
  return `${year}.${month}`;
}

function createWorkItem(work) {
  const li = document.createElement("li");

  const row = document.createElement("div");
  row.className = "work-row";

  const main = document.createElement("div");
  main.className = "work-main";

  const titleLink = document.createElement("a");
  titleLink.className = "work-title-link";
  titleLink.href = work.url;
  titleLink.textContent = work.title;
  titleLink.target = "_blank";
  titleLink.rel = "noopener noreferrer";

  // Reserved for future thumbnail support: work.image
  if (work.image) {
    const thumb = document.createElement("img");
    thumb.className = "work-thumb";
    thumb.src = work.image;
    thumb.alt = "";
    thumb.loading = "lazy";
    main.appendChild(thumb);
  }

  const description = document.createElement("p");
  description.className = "work-description";
  description.textContent = work.description;

  const tags = document.createElement("ul");
  tags.className = "work-tags";
  (work.tags || []).forEach((tag) => {
    const tagItem = document.createElement("li");
    tagItem.textContent = tag;
    tags.appendChild(tagItem);
  });

  main.appendChild(titleLink);
  main.appendChild(description);
  main.appendChild(tags);

  const date = document.createElement("time");
  date.className = "work-date";
  date.dateTime = work.date;
  date.textContent = formatDate(work.date);

  row.appendChild(main);
  row.appendChild(date);
  li.appendChild(row);

  return li;
}

async function loadWorks() {
  try {
    const response = await fetch("works.json");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const works = await response.json();

    if (!Array.isArray(works) || works.length === 0) {
      showStatus("まだ作品がありません。");
      return;
    }

    const sorted = [...works].sort((a, b) => (a.date < b.date ? 1 : -1));

    worksList.replaceChildren();
    sorted.forEach((work) => {
      worksList.appendChild(createWorkItem(work));
    });
  } catch (error) {
    showStatus("作品の読み込みに失敗しました。");
    console.error("Failed to load works.json", error);
  }
}

loadWorks();
