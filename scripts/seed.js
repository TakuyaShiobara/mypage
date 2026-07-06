// One-off helper to populate Firestore with starter content so the site
// isn't empty right after Firebase setup. Not part of the deployed site.
//
// Usage:
//   cd scripts && npm install
//   GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccountKey.json node seed.js
//
// The service account key comes from:
//   Firebase Console > Project settings > Service accounts > Generate new private key

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import admin from "firebase-admin";

const __dirname = dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(readFileSync(join(__dirname, "seed-data.json"), "utf-8"));

admin.initializeApp({ credential: admin.credential.applicationDefault() });
const db = admin.firestore();

async function seed() {
  await db.collection("profiles").doc("main").set(data.profile, { merge: true });
  console.log("Seeded profiles/main");

  await db.collection("socials").doc("main").set(data.socials, { merge: true });
  console.log("Seeded socials/main");

  for (const skill of data.skills) {
    await db.collection("skills").add(skill);
  }
  console.log(`Seeded ${data.skills.length} skill categories`);

  for (const work of data.works) {
    await db.collection("works").add({
      ...work,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
  console.log(`Seeded ${data.works.length} works`);

  console.log("Done.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
