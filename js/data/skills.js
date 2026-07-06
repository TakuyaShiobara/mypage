import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  writeBatch,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { db } from "../firebase-init.js";

const skillsCol = collection(db, "skills");

/** @typedef {{ id: string, category: string, order: number, items: string[] }} SkillCategory */

/** @returns {Promise<SkillCategory[]>} */
export async function getSkillCategories() {
  const snap = await getDocs(query(skillsCol, orderBy("order", "asc")));
  return snap.docs.map((d) => ({ id: d.id, category: "", order: 0, items: [], ...d.data() }));
}

export async function createSkillCategory(data) {
  const ref = await addDoc(skillsCol, { category: "", order: 0, items: [], ...data });
  return ref.id;
}

export async function updateSkillCategory(id, data) {
  await updateDoc(doc(db, "skills", id), data);
}

export async function deleteSkillCategory(id) {
  await deleteDoc(doc(db, "skills", id));
}

export async function reorderSkillCategories(orderedIds) {
  const batch = writeBatch(db);
  orderedIds.forEach((id, index) => {
    batch.update(doc(db, "skills", id), { order: index });
  });
  await batch.commit();
}

export function nextSkillOrder(categories) {
  return categories.reduce((max, c) => Math.max(max, c.order ?? 0), -1) + 1;
}
