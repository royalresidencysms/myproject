# Royal Residency — website (static)

Plain HTML, CSS and JavaScript. No server, no database, no booking, no admin panel.

## Pages
- `404.html` — branded "page not found" page (Netlify, Vercel, GitHub Pages and Cloudflare Pages use it automatically; keep it in the root folder)
- `index.html` — home page
- `rooms.html` — **View Rooms**: room grid (Non-A/C, A/C, Deluxe); tap a room number to see its photo (rooms.js holds the room list and photo paths)
- `rooms-near-theni-gh.html`, `stay-in-theni-for-family-couples-business.html`, `tourist-places-theni.html` — SEO pages

## Hosting
Upload this whole folder to any static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages, or normal web hosting). Nothing to install or run.

## Before going live
Run once, with your real website address: `python3 set-domain.py https://www.yourwebsite.com` (updates all `.html` files, `robots.txt` and `sitemap.xml`). Or do one find-and-replace of `https://www.yourdomain.com` across the folder.

## Changing room photos
Edit `rooms.js`: each room line has its photo file(s) from `images/rooms/`.
