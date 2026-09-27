# Via Federico Photography — Static Site

This is a static HTML/CSS/JS website ready for deployment.

## Local preview

Open `index.html` in your browser or use a simple local server.

### Option 1: Open directly
- Double-click `index.html`.

### Option 2: Use a local server
- If you have Python installed:
  ```bash
  python -m http.server 8000
  ```
- Then open `http://localhost:8000`.

## Deploy to Vercel

1. Install Vercel CLI if needed:
   ```bash
   npm install -g vercel
   ```
2. Login to Vercel:
   ```bash
   vercel login
   ```
3. Deploy from this folder:
   ```bash
   cd "c:\Users\joefe\OneDrive\Desktop\Via.Federico.Photography.code"
   vercel --prod
   ```

## Files included

- `index.html`
- `about.html`
- `services.html`
- `portfolio.html`
- `pricing.html`
- `contact.html`
- `site.css`
- `site.js`
- `logo.png`

## Notes

- No build step is required for this static site.
- All pages are plain HTML and can be hosted on any static hosting provider.
