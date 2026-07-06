import {
  doc,
  getDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { db } from "../firebase-init.js";

const SOCIALS_DOC = doc(db, "socials", "main");

export const defaultSocials = {
  github: "",
  note: "",
  x: "",
  linkedin: "",
  youtube: "",
  email: "",
};

/** @returns {Promise<typeof defaultSocials>} */
export async function getSocials() {
  const snap = await getDoc(SOCIALS_DOC);
  if (!snap.exists()) return { ...defaultSocials };
  return { ...defaultSocials, ...snap.data() };
}

export async function saveSocials(data) {
  await setDoc(SOCIALS_DOC, data, { merge: true });
}
