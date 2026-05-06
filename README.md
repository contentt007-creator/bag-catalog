# Bag Catalog

A full-stack bag catalog web app with public storefront and password-protected admin dashboard.

**Stack:** React + Vite (Vercel) · Node.js + Express (Render) · MongoDB Atlas · Cloudinary

---

## Project Structure

```
bag-catalog/
├── client/          React + Vite frontend
└── server/          Express API backend
```

---

## 1. Clone the repo

```bash
git clone <your-repo-url>
cd bag-catalog
```

---

## 2. Set up MongoDB Atlas (free tier)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2. Create a new **free cluster** (M0).
3. Under **Database Access**, add a user with read/write permissions. Save the username and password.
4. Under **Network Access**, add `0.0.0.0/0` (allow all IPs) for development, or restrict to Render's IPs for production.
5. Click **Connect → Drivers** and copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<username>` and `<password>` with the user you created. This is your `MONGODB_URI`.

---

## 3. Set up Cloudinary (free tier)

1. Go to [cloudinary.com](https://cloudinary.com) and create a free account.
2. From the **Dashboard**, copy:
   - **Cloud Name** → `CLOUDINARY_CLOUD_NAME`
   - **API Key** → `CLOUDINARY_API_KEY`
   - **API Secret** → `CLOUDINARY_API_SECRET`

---

## 4. Fill in environment variables

### Server (`/server/.env`)

Copy `/server/.env.example` to `/server/.env` and fill in:

```env
MONGODB_URI=mongodb+srv://...
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=any_long_random_string_here
ADMIN_PASSWORD=your_chosen_admin_password
PORT=5000
```

> **JWT_SECRET** can be any random string (e.g., run `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)  
> **ADMIN_PASSWORD** is what you'll type on the `/admin` login screen.

### Client (`/client/.env`)

Copy `/client/.env.example` to `/client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

(You'll change this to your Render URL for production.)

---

## 5. Run locally

### Server

```bash
cd server
npm install
npm run dev        # starts on port 5000 with nodemon
```

### Client (in a separate terminal)

```bash
cd client
npm install
npm run dev        # starts Vite dev server on port 5173
```

Open [http://localhost:5173](http://localhost:5173) for the catalog.  
Open [http://localhost:5173/admin](http://localhost:5173/admin) for the admin panel.

---

## 6. Deploy server to Render

1. Push your code to GitHub.
2. Go to [render.com](https://render.com) → **New → Web Service**.
3. Connect your GitHub repo. Set:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
   - **Environment:** Node
4. Under **Environment Variables**, add all variables from `/server/.env`.
5. Click **Create Web Service**. Render will give you a URL like `https://bag-catalog-api.onrender.com`.

> **Note:** Free Render instances spin down after inactivity. The first request after sleep may take ~30 seconds.

---

## 7. Deploy client to Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**.
2. Import your GitHub repo. Set:
   - **Root Directory:** `client`
   - **Framework Preset:** Vite (auto-detected)
3. Under **Environment Variables**, add:
   ```
   VITE_API_URL = https://bag-catalog-api.onrender.com
   ```
   (Replace with your actual Render URL.)
4. Click **Deploy**. Vercel will give you a live URL.

---

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/bags` | No | List bags (optional `?category=`) |
| POST | `/api/bags` | Yes | Create bag |
| PUT | `/api/bags/:id` | Yes | Update bag |
| DELETE | `/api/bags/:id` | Yes | Delete bag |
| POST | `/api/upload` | Yes | Upload image to Cloudinary |
| GET | `/api/health` | No | Health check |

---

## Admin Usage

1. Visit `/admin` on your site.
2. Enter the `ADMIN_PASSWORD` you set in `.env`.
3. Use the dashboard to add, edit, or delete bags.
4. Images are uploaded directly to Cloudinary before the bag is saved.
