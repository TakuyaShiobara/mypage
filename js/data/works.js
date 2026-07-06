import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit as fsLimit,
  writeBatch,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { db } from "../firebase-init.js";

const worksCol = collection(db, "works");

export const CATEGORIES = ["アプリ", "Webサイト", "資料", "業務改善", "AI"];

export const defaultWork = {
  title: "",
  category: CATEGORIES[0],
  summary: "",
  description: "",
  background: "",
  effort: "",
  techStack: [],
  tags: [],
  github: "",
  liveUrl: "",
  docUrl: "",
  thumbnailUrl: "",
  order: 0,
  published: false,
};

function mapDoc(snapDoc) {
  return { id: snapDoc.id, ...defaultWork, ...snapDoc.data() };
}

/** Published works ordered for the public site. */
export async function getPublishedWorks(count) {
  const constraints = [where("published", "==", true), orderBy("order", "asc")];
  if (count) constraints.push(fsLimit(count));
  const snap = await getDocs(query(worksCol, ...constraints));
  return snap.docs.map(mapDoc);
}

/** All works (including drafts), for the admin panel. */
export async function getAllWorks() {
  const snap = await getDocs(query(worksCol, orderBy("order", "asc")));
  return snap.docs.map(mapDoc);
}

export async function getWorkById(id) {
  const snap = await getDoc(doc(db, "works", id));
  if (!snap.exists()) return null;
  return mapDoc(snap);
}

export async function createWork(data) {
  const ref = await addDoc(worksCol, {
    ...defaultWork,
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateWork(id, data) {
  await updateDoc(doc(db, "works", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteWork(id) {
  await deleteDoc(doc(db, "works", id));
}

export async function setWorkPublished(id, published) {
  await updateDoc(doc(db, "works", id), { published, updatedAt: serverTimestamp() });
}

/** Persists a new relative ordering. `orderedIds` is the full list in display order. */
export async function reorderWorks(orderedIds) {
  const batch = writeBatch(db);
  orderedIds.forEach((id, index) => {
    batch.update(doc(db, "works", id), { order: index });
  });
  await batch.commit();
}

/** Next order value to append a new work at the end of the list. */
export function nextOrder(works) {
  return works.reduce((max, w) => Math.max(max, w.order ?? 0), -1) + 1;
}
