# Showroom — Premium Automotive Website

A cinematic, dark-luxury automotive showroom and modification platform built with
Next.js (App Router), TypeScript, Tailwind CSS, GSAP + Lenis + Swiper for
motion, and Firebase (Auth + Firestore) + Cloudinary for all content and
media. Every car, modification, and piece of business/about
copy is driven entirely from Firestore — there is nothing to hardcode or
redeploy when the showroom's inventory changes.

---

## 1. What's included

**Public site** — `/`, `/cars`, `/cars/[carId]`, `/modifications`, `/about`, `/contact`
- Cinematic preloader → animated multi-slide hero (Swiper + GSAP, SplitText
  word reveals, crossfade + parallax image transitions)
- Featured vehicles carousel, full inventory grid with search/brand/
  category/price/featured filters
- Car detail page with gallery/lightbox, specs, and a full **Build Your
  Car** configurator: category tabs, add/remove modification cards, an
  optional layered visual configurator (for transparent PNG/WebP cutouts),
  and a sticky live build summary (desktop sidebar / mobile bottom sheet)
- Buy / Contact Seller: writes a `leads` document, then opens a
  pre-filled WhatsApp message to the business number in Firestore settings
- `/modifications`: a parts catalog grouped by category, linking back into
  each compatible car's configurator (added because the brief's own nav
  asks for a "Modifications" link; see **Design notes** below)

**Admin panel** — `/admin/*`
- Firebase Auth email/password login, guarded client-side, with Firestore
  security rules as the real enforcement boundary
- Full CRUD + Cloudinary uploads for Cars, Modifications, Categories, and a
  Leads table with status updates
- About and Business Settings single-document editors
- A Media Library that lists every Cloudinary upload made anywhere in the
  admin (see **Design notes** — this is backed by a Firestore `media`
  collection, not Cloudinary's Admin API)

---

## 2. Tech stack

Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS · GSAP 3.13
(ScrollTrigger + the now-free SplitText) · Lenis · Swiper · lucide-react ·
Firebase (Auth + Firestore, client SDK only) · Cloudinary (unsigned client
uploads) · firebase-admin (used only by the one-off admin-seeding script)

---

## 3. Setup

### 3.1 Install

```bash
npm install
```

### 3.2 Firebase project

1. Create a project at console.firebase.google.com.
2. **Authentication** → Sign-in method → enable **Email/Password**.
3. **Firestore Database** → create a database (production mode).
4. Project Settings → General → "Your apps" → add a **Web app** → copy the
   config values into `.env.local` (copy `.env.example` first).
5. Deploy the security rules and indexes in this repo (requires the
   [Firebase CLI](https://firebase.google.com/docs/cli)):

   ```bash
   npm install -g firebase-tools
   firebase login
   firebase use --add            # pick your project
   firebase deploy --only firestore:rules,firestore:indexes
   ```

   If you skip this, Firestore's default rules will block almost every
   read/write. If you ever see a Firestore error in the browser console
   with a link to "create this index," you can click it instead of
   editing `firestore.indexes.json` by hand.

### 3.3 Cloudinary

1. Create a free account at cloudinary.com, note your **Cloud name**.
2. Settings → Upload → **Add upload preset** → set **Signing Mode** to
   **Unsigned** → save, note the preset name.
3. Put both values in `.env.local`. No Cloudinary API key/secret is ever
   needed by this app — unsigned uploads are the whole point.

### 3.4 Environment variables

```bash
cp .env.example .env.local
```

Fill in the `NEXT_PUBLIC_FIREBASE_*` and `NEXT_PUBLIC_CLOUDINARY_*` values
from the steps above. The remaining variables
(`FIREBASE_SERVICE_ACCOUNT_JSON` / `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`)
are only read by the one-off seeding script below and are never bundled
into the browser.

### 3.5 Create your first admin

Firestore rules only let an *existing* admin promote someone else, so the
very first admin has to be created out-of-band with the Admin SDK:

1. Firebase Console → Project Settings → Service Accounts → **Generate new
   private key** → save the JSON somewhere outside the repo.
2. Set in `.env.local` (or export in your shell):
   - `FIREBASE_SERVICE_ACCOUNT_PATH` → path to that downloaded file, **or**
     `FIREBASE_SERVICE_ACCOUNT_JSON` → the file's contents as one line
   - `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`
3. Run:

   ```bash
   npm run seed:admin
   ```

This creates (or updates) the Firebase Auth user and writes
`users/{uid} = { role: "admin" }` in Firestore. Sign in at `/admin/login`.

### 3.6 Run it

```bash
npm run dev
```

Visit `/admin` and start adding cars, categories, and
modifications — the public site is empty until you do, and shows
purpose-built empty states in the meantime rather than looking broken.

### 3.7 Deploy

Any Next.js host works (Vercel is the path of least resistance — `vercel
deploy`, with the same `.env.local` values added as project environment
variables). Nothing here needs a custom server or the Firebase Admin SDK
at runtime — only `npm run seed:admin` does, and that's meant to be run
locally, once.

---

## 4. Design notes & intentional decisions

A few places where the brief was ambiguous, self-contradictory, or where I
made a deliberate simplification. Flagging these so nothing is a surprise:

- **`/modifications` isn't in the brief's route list (§2), but the navbar
  spec (§3) asks for a "Modifications" link.** Since modifications only
  really make sense attached to a specific car, I added a light parts
  catalog page grouped by category that links back into each car's
  configurator, rather than either breaking the nav requirement or
  inventing a modification-only purchase flow that isn't elsewhere in the
  brief.
- **Media Library doesn't call Cloudinary's Admin API.** Listing existing
  Cloudinary assets requires the Admin API, which needs your Cloudinary
  API secret — that can never run in the browser. Instead, every upload
  (anywhere in the admin) writes a small record to a Firestore `media`
  collection, and the Media Library page reads that collection. Deleting
  a record here removes it from the library list, not from Cloudinary
  itself — delete the asset in your Cloudinary dashboard too if you want
  it fully gone.
- **Admin route protection is client-side (a Firebase Auth state check +
  redirect), not Next.js middleware.** This matches the brief's own
  instruction ("Do NOT rely only on frontend route protection — implement
  Firebase security rules"): the actual boundary is `firestore.rules`,
  independently re-checked by Firestore on every read/write regardless of
  what the admin UI shows. True SSR-level route protection would need
  Firebase session cookies verified via the Admin SDK in Next.js
  middleware, which is a reasonable future upgrade but adds a server-side
  secret this architecture otherwise has no need for.
- **Hero slides are static, not admin-managed.** They used to be a full
  Firestore + Cloudinary + admin-panel feature (add/edit/delete/reorder);
  that's been removed. The hero images now live in `/public/images/hero/`
  and the slide content (title, description, CTAs, which images, what
  order) lives in `src/data/heroSlides.ts` — edit that file directly to
  change slides. See the `README.txt` inside `public/images/hero/` for the
  expected file names.
- **Hero slider doesn't use Swiper's `loop` mode.** Loop mode clones slide
  DOM nodes, which would collide with the per-slide ref map the GSAP
  timeline needs (so it can animate the exact outgoing/incoming image and
  text elements). Autoplay, wraparound, and the per-slide progress bar are
  implemented manually instead — Swiper still owns touch/mouse drag and
  keyboard navigation.
- **Car "category" (§21) and modification "category" (§25) are
  deliberately different taxonomies.** Section 25's own examples
  (Exterior, Interior, Performance, Wheels…) are clearly modification
  categories, so the `categories` Firestore collection backs the
  modification category tabs/admin page only. A car's `category` (Coupe,
  SUV, Supercar…) is a free-text field you set per car, and the Cars page
  filter derives its dropdown options from whatever values are actually in
  use — this avoids silently merging two unrelated taxonomies into one
  collection.
- **The visual (layered) configurator (§13) needs a transparent PNG/WebP
  per modification plus optional top/left/width % offsets**, set in the
  modification form's "Visual Configurator" section. Leave the overlay
  image empty and that part simply shows as a normal card — nothing else
  changes.
- **Cars are publicly readable regardless of `available`.** The public
  queries only ever fetch available cars, but `firestore.rules` allows
  open read access to the whole `cars` collection (same for
  `modifications`/`categories`/`settings`/`about`) rather than filtering
  at the rules layer — a sold car's listing isn't sensitive information,
  and this keeps the rules considerably simpler. Tighten this if your use
  case disagrees.

---

## 5. A note on how this was built

This repository was generated in a sandboxed environment with no outbound
network access, so **`npm install`, `next build`, and `tsc` were never
run against this code** — there was no package registry to install
Next.js/React/Firebase/etc. from, and no way to compile or type-check the
result before handing it to you. The code follows current, stable APIs
for every library involved (Next.js 14 App Router, Firebase JS SDK v10,
Swiper 11, GSAP 3.13) and was written and reviewed carefully, but you
should still expect to run `npm install` and fix the occasional small
issue — a renamed prop, a version mismatch — rather than treating this as
pre-verified, production-tested output. Please treat the first `npm run
dev` as the real first compile.

If you'd like help debugging anything that comes up once you can actually
run it, paste the error back and I can fix it directly.
