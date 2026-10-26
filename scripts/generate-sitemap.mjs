import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://www.drnur.ai';

const routes = [
  '/',
  '/how-it-works',
  '/plans',
  '/about',
  '/contact',
  '/privacy-policy',
  '/gurus',
  '/gurus/stress',
  '/gurus/sleep',
  '/gurus/anxiety',
  '/gurus/motivation',
  '/gurus/relationship',
  '/gurus/happiness',
  '/gurus/calm',
  '/gurus/spiritual',
];

const generateSitemap = () => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes
    .map((route) => {
      return `
  <url>
    <loc>${BASE_URL}${route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`;
    })
    .join('')}
</urlset>`;

  const publicDir = path.join(__dirname, '../client/public');
  
  // Ensure public directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
  console.log('✅ Sitemap generated successfully at client/public/sitemap.xml');
};

generateSitemap();
