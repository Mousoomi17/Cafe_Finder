
# ☕ Cafe Finder

A **React-based web application** that helps users discover nearby cafes using a Tinder-like swipe interface. Users can swipe right to save their favorite spots and swipe left to pass.

**Live Link:** https://cafe-finder-ivory.vercel.app/

## ✨ Features

* **Nearby Discovery:** Automatically locates cafes within a 1.5km radius using the **Google Places API**.
* **Swipe Interface:** Intuitive card-based UI where users swipe right to "Like" (save) and left to "Pass".
* **Saved Favorites:** View a curated list of all your saved cafes.
* **Responsive Design:** Fully optimized for mobile and desktop devices using **Tailwind CSS**.
* **Real-time Data:** Displays ratings, opening status, and photos directly from Google Maps.

---

## 🚀 Getting Started


### Prerequisites

* **Node.js** (v14 or higher)
* **npm** (v6 or higher)
* **Google Maps API Key** with the *Places API* enabled.


---

## 🔑 API Configuration

This project uses the **Google Maps Places API**. You need to configure your API key for both the frontend (images) and the backend (search results).

### 1. Local Development

Open `src/App.js` and replace the placeholder with your actual API key:

```javascript
const HARDCODED_KEY = "YOUR_ACTUAL_GOOGLE_API_KEY";

```

> **Note on CORS:** For local development, you may encounter CORS errors since the Google Places API does not natively support client-side requests from localhost. The app includes a built-in fallback to `cors-anywhere.herokuapp.com` for this purpose.

### 2. Deployment (Vercel)

To deploy on Vercel:

1. Push your code to GitHub.
2. Import the project into Vercel.
3. Add your API Key as an **Environment Variable** in the Vercel dashboard settings to keep it secure.
