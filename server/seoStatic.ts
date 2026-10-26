import express, {
  type Express,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import fs from "node:fs";
import path from "node:path";

export type SeoStaticOptions = {
  staticPath: string;
  resolvePublishedBlog?: (slug: string) => Promise<boolean>;
};

const privateClientRoute = /^\/admin(?:\/.*)?$/;

function findSnapshot(
  staticPath: string,
  requestPath: string
): string | undefined {
  let pathname: string;

  try {
    pathname = decodeURIComponent(requestPath);
  } catch {
    return undefined;
  }

  if (
    !pathname.startsWith("/") ||
    pathname.includes("\0") ||
    path.posix.extname(pathname)
  ) {
    return undefined;
  }

  const relativePath = pathname.replace(/^\/+/, "");
  const snapshotPath = path.resolve(
    staticPath,
    `${relativePath || "index"}.html`
  );
  const relativeSnapshotPath = path.relative(staticPath, snapshotPath);

  if (
    relativeSnapshotPath.startsWith("..") ||
    path.isAbsolute(relativeSnapshotPath)
  ) {
    return undefined;
  }

  try {
    return fs.statSync(snapshotPath).isFile() ? snapshotPath : undefined;
  } catch {
    return undefined;
  }
}

function sendSnapshot(staticPath: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const snapshotPath = findSnapshot(staticPath, req.path);

    if (!snapshotPath) {
      next();
      return;
    }

    res.sendFile(snapshotPath, error => {
      if (error) {
        next(error);
      }
    });
  };
}

function sendPrivateClientShell(staticPath: string) {
  return (_req: Request, res: Response, next: NextFunction) => {
    res.set("X-Robots-Tag", "noindex, nofollow");
    res.sendFile(path.join(staticPath, "index.html"), error => {
      if (error) {
        next(error);
      }
    });
  };
}

/**
 * Serve built public files with truthful status codes.
 *
 * Generated SEO snapshots are selected by their actual `.html` files, while the
 * private admin client area deliberately receives the SPA shell. Call this only
 * after registered API routes so those routes retain their existing precedence.
 */
export function installSeoStatic(
  app: Express,
  { staticPath, resolvePublishedBlog }: SeoStaticOptions
): void {
  // Registered API routes run before this helper. Do not ever expose the public
  // SPA shell for an unknown or mistyped API endpoint.
  app.use("/api", (_req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  // Admin is a private client-only area, rather than a crawlable public route.
  app.get(privateClientRoute, sendPrivateClientShell(staticPath));

  // Blog publication is owned by the AWS database, not the build-time package.
  // This also protects direct .html snapshots after an article is unpublished.
  if (resolvePublishedBlog) {
    app.get(
      /^\/blogs\/([a-z0-9]+(?:-[a-z0-9]+)*)(?:\.html)?$/,
      (req, res, next) => {
        const slug = req.params[0];
        resolvePublishedBlog(slug)
          .then(published => {
            if (!published) {
              res.status(404).type("text/plain").send("Not found");
            } else if (findSnapshot(staticPath, `/blogs/${slug}`)) {
              next();
            } else {
              // New database-published posts remain usable before the next rebuild.
              // They need a refreshed snapshot for initial-HTML search quality.
              res.set("Cache-Control", "no-store");
              res.sendFile(path.join(staticPath, "index.html"), error => {
                if (error) next(error);
              });
            }
          })
          .catch(() => {
            res
              .status(503)
              .set("Retry-After", "60")
              .type("text/plain")
              .send("Blog temporarily unavailable");
          });
      }
    );
  }

  // Resolve extensionless snapshots before express.static so `/blogs` resolves
  // to `blogs.html` even when `blogs/` also contains individual blog snapshots.
  app.get("*", sendSnapshot(staticPath));

  // Serve Vite assets, images, direct `.html` files, and any other real build
  // output without using the SPA shell as a catch-all.
  app.use(express.static(staticPath));

  app.use((_req, res) => {
    res.status(404).type("text/plain").send("Not found");
  });
}
