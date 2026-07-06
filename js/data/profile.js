import {
  doc,
  getDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { db } from "../firebase-init.js";

const PROFILE_DOC = doc(db, "profiles", "main");

export const defaultProfile = {
  name: "Takaya Shiobara",
  title: "IT Engineer / AI Developer",
  tagline: "技術で、働き方をもっと自由に。",
  description:
    "業務改善・AI活用・Webアプリ開発を通して、効率的で価値ある仕組みづくりを目指しています。",
  bio: "",
  career: [],
  strengths: [],
  futureGoals: "",
};

/** @returns {Promise<typeof defaultProfile>} */
export async function getProfile() {
  const snap = await getDoc(PROFILE_DOC);
  if (!snap.exists()) return { ...defaultProfile };
  return { ...defaultProfile, ...snap.data() };
}

export async function saveProfile(data) {
  await setDoc(PROFILE_DOC, data, { merge: true });
}
