# 🌍 Travel Planner

Travel Planner is a full-stack dynamic web application that allows users to create trips, add locations with interactive maps, and visualize itineraries in a modern dashboard.  
It is built with the latest **Next.js App Router**, **Auth.js v5**, **PostgreSQL + Drizzle ORM**, **Tailwind CSS + daisyUI**, and **Mapbox GL**.

---

## ✨ Features

- 🔑 **Authentication** with GitHub (Auth.js + Drizzle adapter)
- 👤 **User dashboard** to manage trips
- 📝 **Trip creation** with title, description, dates, and optional image upload
- 🗂️ **Trip overview**: upcoming vs. past trips with cards
- 🗺️ **Trip detail page**:
  - Hero image + title + dates
  - Tabs: _Overview_ (itinerary, ordered destinations) and _Map_ (pins + connected path)
- 📍 **Location management**:
  - Add new locations with title, optional address, latitude/longitude
  - Click on the map to drop a pin, draggable marker updates inputs
  - Automatic ordering (`order = MAX + 1`)
- 📊 **Database schema** with `users`, `accounts`, `sessions`, `trips`, and `locations`
- 🖼️ **File uploads** for trip images, preview in form
- 🎨 **Responsive UI** with Tailwind + daisyUI (light/dark themes)
- 🦶 Minimalistic footer with developer credit + "scroll to top" button

---

## 🚀 Tech Stack

- [Next.js (App Router)](https://nextjs.org/)
- [Auth.js v5](https://authjs.dev/) (with GitHub provider)
- [Drizzle ORM](https://orm.drizzle.team/) with PostgreSQL
- [Tailwind CSS](https://tailwindcss.com/) + [daisyUI](https://daisyui.com/)
- [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/)

---

## 📂 Project Structure (simplified)

app/
├─ api/ # Auth + API handlers
├─ trips/ # Trip pages
│ ├─ [id]/ # Trip detail page
│ │ ├─ locations/ # Location form + actions
│ │ └─ page.tsx
│ └─ page.tsx # Dashboard
├─ layout.tsx # Global layout
└─ page.tsx # Landing page
db/
├─ schema.ts # Drizzle schema
└─ migrations/ # SQL migrations

---

## ⚙️ Getting Started

### Prerequisites

- Node.js (latest LTS recommended)
- PostgreSQL (installed locally with pgAdmin or Docker)

### Setup

1. **Clone repo**
   ```bash
   git clone https://github.com/yourusername/travel-planner.git
   cd travel-planner
   ```
2. **Install dependencies**
   npm install
3. **Environment variables**
   Create a .env.local file:
   DATABASE_URL=postgres://username:password@localhost:5432/travelplanner
   AUTH_GITHUB_ID=your_github_client_id
   AUTH_GITHUB_SECRET=your_github_client_secret
   NEXTAUTH_SECRET=super-secret-key
   NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token

4. **Run database migrations**
   npm run db:push

or

npm run db:migrate

5. **Start dev server**
   npm run dev

6. **Open http://localhost:3000**

🛠️ Development Steps (Completed)

Step 1: Setup Next.js, TailwindCSS, daisyUI, header/footer

Step 2: Configure Drizzle ORM with PostgreSQL

Step 3: Authentication (Auth.js v5 + Drizzle adapter + GitHub)

Step 4: Trip dashboard (create trips, display trips)

Step 5: Trip detail page with tabs (Overview & Map)

Step 6: Add location form with Mapbox integration, validation, and DB insert

🔮 Future Work

Step 7: Add Mapbox Geocoder, auto-fit bounds, and map UX polish

Step 8: Edit/Delete/Reorder locations (drag & drop)

Step 9: Public sharing of trips with read-only view

Step 10: Validation (Zod), loading states, error boundaries

Step 11: Deployment to Vercel + env hardening

Step 12: Testing (Vitest, Playwright) + GitHub Actions CI

Step 13: Performance tuning (indexes, caching, revalidatePath)

Step 14: Nice-to-haves (export GPX/ICS, notes, dark map theme sync, trip filters)

👨‍💻 Developer

Built by Ahmad Sadin
