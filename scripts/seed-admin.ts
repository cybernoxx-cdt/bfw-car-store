/**
 * One-off script to bootstrap the very first admin account.
 *
 * Why this exists: Firestore security rules only let an *existing* admin
 * grant the admin role to someone else (see firestore.rules). The very
 * first admin has to be created some other way — this script uses the
 * Firebase Admin SDK (a service account with full access) to do it once,
 * from your own machine, completely outside of the security rules.
 *
 * Usage:
 *   1. Firebase Console → Project Settings → Service Accounts →
 *      "Generate new private key". Save the downloaded JSON somewhere safe
 *      (never commit it).
 *   2. In .env (or exported in your shell), set:
 *        FIREBASE_SERVICE_ACCOUNT_JSON  — the full JSON contents (as one line), or
 *        FIREBASE_SERVICE_ACCOUNT_PATH  — a path to the downloaded file
 *        SEED_ADMIN_EMAIL
 *        SEED_ADMIN_PASSWORD
 *   3. npm run seed:admin
 */
import "dotenv/config";
import { readFileSync } from "fs";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function loadServiceAccount() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  }
  if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    return JSON.parse(readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_PATH, "utf-8"));
  }
  throw new Error(
    "Set FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_SERVICE_ACCOUNT_PATH before running this script."
  );
}

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD before running this script.");
  }

  if (!getApps().length) {
    initializeApp({ credential: cert(loadServiceAccount()) });
  }

  const auth = getAuth();
  const db = getFirestore();

  let uid: string;
  try {
    const existing = await auth.getUserByEmail(email);
    uid = existing.uid;
    console.log(`Found existing auth user ${email} (${uid}). Updating password + role…`);
    await auth.updateUser(uid, { password });
  } catch {
    console.log(`Creating new auth user for ${email}…`);
    const created = await auth.createUser({ email, password, emailVerified: true });
    uid = created.uid;
  }

  await db.collection("users").doc(uid).set(
    { email, role: "admin", createdAt: new Date() },
    { merge: true }
  );

  console.log(`✅ ${email} is now an admin. Sign in at /admin/login.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
