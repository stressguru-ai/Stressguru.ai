import "dotenv/config";
import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./routers";
import { createContext } from "./_core/context";
import adminRoutes from "./adminRoutes";
import { installSeoStatic } from "./seoStatic";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Direct admin auth routes (not through tRPC)
  app.use("/api/admin", adminRoutes);

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  installSeoStatic(app, {
    staticPath,
    resolvePublishedBlog: async slug => {
      // Never let a restored Manus TiDB value become the public blog authority.
      const url = new URL(process.env.DATABASE_URL || "");
      if (
        url.protocol !== "mysql:" ||
        url.hostname !== "db.dentasmart.ai" ||
        decodeURIComponent(url.pathname.slice(1)) !== "manus-stressguru" ||
        (url.port && url.port !== "3306")
      ) {
        throw new Error("Approved AWS blog database unavailable");
      }
      const { getDb, getBlogBySlug } = await import("./db");
      if (!(await getDb())) throw new Error("Blog database unavailable");
      const blog = await getBlogBySlug(slug);
      return blog?.status === "published";
    },
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
