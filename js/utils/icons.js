// Minimal inline SVG icon set (24x24, currentColor) — no external icon font/library.
const icons = {
  github: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.78-.25.78-.55v-2.16c-3.2.7-3.87-1.36-3.87-1.36-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.74.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .3.21.66.79.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/></svg>`,
  note: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><path d="M8.5 8.5v7l5-3.5-5-3.5Z" fill="currentColor" stroke="none"/></svg>`,
  x: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.98 10.62 21.1 2.5h-2.4l-6.17 7.03L7.6 2.5H2l7.47 10.62L2 21.5h2.4l6.5-7.4 5.24 7.4H22l-8.02-10.88Zm-2.3 2.62-.76-1.06L5.1 4.13h2.02l4.83 6.75.76 1.06 6.28 8.79h-2.02l-5.1-7.13Z"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.83v1.5h.05c.53-.96 1.83-1.98 3.77-1.98 4.03 0 4.78 2.55 4.78 5.87v6.61h-4v-5.86c0-1.4-.03-3.2-2-3.2-2 0-2.31 1.5-2.31 3.1v5.96h-4v-11Z"/></svg>`,
  youtube: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23 12s0-3.36-.43-4.98a2.94 2.94 0 0 0-2.07-2.08C18.88 4.5 12 4.5 12 4.5s-6.88 0-8.5.44A2.94 2.94 0 0 0 1.43 7.02C1 8.64 1 12 1 12s0 3.36.43 4.98a2.94 2.94 0 0 0 2.07 2.08c1.62.44 8.5.44 8.5.44s6.88 0 8.5-.44a2.94 2.94 0 0 0 2.07-2.08C23 15.36 23 12 23 12ZM9.75 15.5v-7l6 3.5-6 3.5Z"/></svg>`,
  mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="2.5" y="4.5" width="19" height="15" rx="3"/><path d="m3.5 6 8.5 6.5L20.5 6"/></svg>`,
  menu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`,
  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19"/></svg>`,
  arrowRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
  arrowLeft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>`,
  external: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4 10 14M19 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h6"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M9 7V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V7m2 0-.7 12.1a2 2 0 0 1-2 1.9H9.7a2 2 0 0 1-2-1.9L7 7"/></svg>`,
  edit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"/></svg>`,
  drag: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="9" cy="6" r="1.4"/><circle cx="9" cy="12" r="1.4"/><circle cx="9" cy="18" r="1.4"/><circle cx="15" cy="6" r="1.4"/><circle cx="15" cy="12" r="1.4"/><circle cx="15" cy="18" r="1.4"/></svg>`,
  rocket: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.5 9.5c2-2 5-2.5 6-2 .5 1 0 4-2 6l-4 4-4-4 4-4Z"/><path d="M9 15 5 19M8.5 12S6 11 4.5 12.5C3 14 3 18 3 18s4 0 5.5-1.5C10 15 9 12.5 9 12.5Z"/><circle cx="16" cy="8" r="1"/></svg>`,
  brain: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 4.5a2.5 2.5 0 0 0-2.5 2.5v.2A3 3 0 0 0 4 10v1a3 3 0 0 0 1.5 2.6A3 3 0 0 0 8 18a2.5 2.5 0 0 0 2.5-2.5v-8A2.5 2.5 0 0 0 9 4.5ZM15 4.5a2.5 2.5 0 0 1 2.5 2.5v.2A3 3 0 0 1 20 10v1a3 3 0 0 1-1.5 2.6A3 3 0 0 1 16 18a2.5 2.5 0 0 1-2.5-2.5v-8A2.5 2.5 0 0 1 15 4.5Z"/></svg>`,
  code: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m8 8-4 4 4 4M16 8l4 4-4 4M13 5l-2 14"/></svg>`,
  cloud: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 18a4 4 0 0 1-.5-7.97A5 5 0 0 1 16.2 8.1 4.5 4.5 0 0 1 17 18H7Z"/></svg>`,
};

export function icon(name, extraClass = "") {
  const markup = icons[name] || "";
  if (!extraClass) return markup;
  return markup.replace("<svg ", `<svg class="${extraClass}" `);
}
