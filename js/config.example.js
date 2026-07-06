// Copy this file to js/config.js and fill in your own values.
// js/config.js is gitignored — never commit real credentials.
//
// Firebase web config is not a secret (it is safe to expose client-side;
// access is controlled by Firestore/Storage security rules), but keeping it
// out of the repo makes it easy to swap projects (dev/staging/prod).

export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// The only Google account allowed to sign in to /admin.
export const adminEmail = "tak.sobr@gmail.com";

// EmailJS (see https://www.emailjs.com/) — used by the Contact page.
// The public key is meant to be used client-side; scope abuse is limited
// on the EmailJS dashboard (domain allowlist + per-template rate limits).
export const emailjsConfig = {
  publicKey: "YOUR_EMAILJS_PUBLIC_KEY",
  serviceId: "YOUR_EMAILJS_SERVICE_ID",
  templateId: "YOUR_EMAILJS_TEMPLATE_ID",
};
