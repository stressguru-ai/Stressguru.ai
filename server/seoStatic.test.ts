import express from "express";
import fs from "node:fs/promises";
import http, { type Server } from "node:http";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { installSeoStatic } from "./seoStatic";

type HttpResponse = {
  body: string;
  headers: http.IncomingHttpHeaders;
  statusCode: number;
};

function request(server: Server, requestPath: string): Promise<HttpResponse> {
  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Test server did not bind to a TCP port");
  }

  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        host: "127.0.0.1",
        method: "GET",
        path: requestPath,
        port: address.port,
      },
      res => {
        let body = "";
        res.setEncoding("utf8");
        res.on("data", chunk => {
          body += chunk;
        });
        res.on("end", () => {
          resolve({
            body,
            headers: res.headers,
            statusCode: res.statusCode ?? 0,
          });
        });
      }
    );

    req.on("error", reject);
    req.end();
  });
}

async function writeFixture(
  root: string,
  relativePath: string,
  content: string
): Promise<void> {
  const filePath = path.join(root, relativePath);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content);
}

describe("installSeoStatic", () => {
  let fixturePath: string;
  let server: Server;

  beforeEach(async () => {
    fixturePath = await fs.mkdtemp(
      path.join(os.tmpdir(), "stressguru-seo-static-")
    );

    await writeFixture(
      fixturePath,
      "index.html",
      "<!doctype html><html><head><title>StressGuru</title></head><body>public app shell</body></html>"
    );
    await writeFixture(
      fixturePath,
      "anxiety-support/sunday-scaries.html",
      '<!doctype html><html><head><meta name="description" content="Sunday scaries support"></head><body><noscript><h1>Sunday scaries</h1><p data-answer="true">Try one small reset before Monday.</p></noscript></body></html>'
    );
    await writeFixture(
      fixturePath,
      "blogs/known.html",
      '<!doctype html><html><head><meta name="description" content="Known blog metadata"></head><body><p data-answer="true">Known blog direct answer.</p></body></html>'
    );
    await writeFixture(fixturePath, "assets/app.js", "console.log('asset');");
    await writeFixture(
      fixturePath,
      "images/existing.png",
      "not a real PNG, but a real fixture asset"
    );

    const app = express();
    installSeoStatic(app, { staticPath: fixturePath });
    server = http.createServer(app).listen(0, "127.0.0.1");
    await new Promise<void>(resolve => server.once("listening", resolve));
  });

  afterEach(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close(error => (error ? reject(error) : resolve()));
    });
    await fs.rm(fixturePath, { force: true, recursive: true });
  });

  it("serves extensionless public snapshots with their metadata and direct answers", async () => {
    const guide = await request(server, "/anxiety-support/sunday-scaries");
    const blog = await request(server, "/blogs/known");

    expect(guide.statusCode).toBe(200);
    expect(guide.body).toContain(
      'meta name="description" content="Sunday scaries support"'
    );
    expect(guide.body).toContain("Try one small reset before Monday.");
    expect(blog.statusCode).toBe(200);
    expect(blog.body).toContain(
      'meta name="description" content="Known blog metadata"'
    );
    expect(blog.body).toContain("Known blog direct answer.");
  });

  it("redirects a trailing snapshot slash to its extensionless canonical path", async () => {
    const guide = await request(
      server,
      "/anxiety-support/sunday-scaries/?source=weekly"
    );

    expect(guide.statusCode).toBe(301);
    expect(guide.headers.location).toBe(
      "/anxiety-support/sunday-scaries?source=weekly"
    );
  });

  it("keeps repeated-leading-slash canonical redirects on the same origin", async () => {
    const response = await request(server, "//anxiety-support/sunday-scaries/?source=weekly");
    expect(response.statusCode).toBe(301);
    expect(response.headers.location).toBe("/anxiety-support/sunday-scaries?source=weekly");
    expect(response.headers.location?.startsWith("//")).toBe(false);
  });

  it("does not redirect the root or unknown trailing-slash paths", async () => {
    const root = await request(server, "/?source=weekly");
    const unknown = await request(server, "/not-a-real-page/?source=weekly");

    expect(root.statusCode).toBe(200);
    expect(unknown.statusCode).toBe(404);
    expect(unknown.headers.location).toBeUndefined();
  });

  it("serves the root and real static assets", async () => {
    const root = await request(server, "/");
    const asset = await request(server, "/assets/app.js");
    const image = await request(server, "/images/existing.png");

    expect(root.statusCode).toBe(200);
    expect(root.body).toContain("public app shell");
    expect(asset.statusCode).toBe(200);
    expect(asset.body).toContain("console.log('asset')");
    expect(image.statusCode).toBe(200);
  });

  it("returns 404 for unknown public pages and missing assets", async () => {
    const page = await request(server, "/not-a-real-page");
    const image = await request(server, "/images/missing.png");

    expect(page.statusCode).toBe(404);
    expect(page.body).not.toContain("public app shell");
    expect(image.statusCode).toBe(404);
  });

  it("keeps the private admin client area available but non-indexable", async () => {
    const admin = await request(server, "/admin/login");

    expect(admin.statusCode).toBe(200);
    expect(admin.headers["x-robots-tag"]).toBe("noindex, nofollow");
    expect(admin.body).toContain("public app shell");
  });

  it("keeps new database-published posts available and blocks stale draft snapshots", async () => {
    await new Promise<void>(resolve => server.close(() => resolve()));
    const app = express();
    installSeoStatic(app, {
      staticPath: fixturePath,
      resolvePublishedBlog: async slug => slug === "new-published",
    });
    server = http.createServer(app).listen(0, "127.0.0.1");
    await new Promise<void>(resolve => server.once("listening", resolve));
    expect((await request(server, "/blogs/new-published")).statusCode).toBe(
      200
    );
    expect((await request(server, "/blogs/known")).statusCode).toBe(404);
    expect((await request(server, "/blogs/known.html")).statusCode).toBe(404);
    expect((await request(server, "/blogs/missing")).statusCode).toBe(404);
  });

  it("checks publication before equivalent encoded and normalized blog snapshot paths", async () => {
    await new Promise<void>(resolve => server.close(() => resolve()));
    const slugs: string[] = [];
    const app = express();
    installSeoStatic(app, { staticPath: fixturePath, resolvePublishedBlog: async slug => { slugs.push(slug); return false; } });
    server = http.createServer(app).listen(0, "127.0.0.1");
    await new Promise<void>(resolve => server.once("listening", resolve));
    const variants = ["/blogs/known", "/blogs/known.html", "/blogs/%6Bnown", "/blogs/%6Bnown.html", "/%62logs/known", "//blogs/known", "/blogs/../blogs/known", "/blogs/known/", "/blogs/%6Bnown/?source=test"];
    for (const variant of variants) {
      const response = await request(server, variant);
      expect(response.statusCode, variant).toBe(404);
      expect(response.body).not.toContain("Known blog direct answer");
      expect(response.headers.location).toBeUndefined();
    }
    expect(slugs).toEqual(variants.map(() => "known"));
  });

  it("keeps published encoded snapshots available and encoded lookup failures temporary", async () => {
    await new Promise<void>(resolve => server.close(() => resolve()));
    const app = express();
    installSeoStatic(app, { staticPath: fixturePath, resolvePublishedBlog: async slug => {
      if (slug === "unavailable") throw new Error("synthetic lookup failure");
      return slug === "known";
    } });
    server = http.createServer(app).listen(0, "127.0.0.1");
    await new Promise<void>(resolve => server.once("listening", resolve));
    for (const variant of ["/blogs/%6Bnown", "/blogs/%6Bnown.html", "/%62logs/known"]) {
      const response = await request(server, variant);
      expect(response.statusCode).toBe(200);
      expect(response.body).toContain("Known blog direct answer");
    }
    const redirect = await request(server, "/blogs/known/?source=test");
    expect(redirect.statusCode).toBe(301);
    expect(redirect.headers.location).toBe("/blogs/known?source=test");
    const unavailable = await request(server, "/blogs/%75navailable.html");
    expect(unavailable.statusCode).toBe(503);
    expect(unavailable.headers["retry-after"]).toBe("60");
    // Express rejects malformed wildcard percent-encoding before this handler.
    expect((await request(server, "/blogs/%ZZknown")).statusCode).toBe(400);
  });

  it("returns temporary failure rather than inventing publication when the lookup fails", async () => {
    await new Promise<void>(resolve => server.close(() => resolve()));
    const app = express();
    installSeoStatic(app, {
      staticPath: fixturePath,
      resolvePublishedBlog: async () => {
        throw new Error("synthetic unavailable");
      },
    });
    server = http.createServer(app).listen(0, "127.0.0.1");
    await new Promise<void>(resolve => server.once("listening", resolve));
    const response = await request(server, "/blogs/known");
    expect(response.statusCode).toBe(503);
    expect(response.headers["retry-after"]).toBe("60");
  });

  it("returns 404 instead of the public SPA shell for unknown API endpoints", async () => {
    const api = await request(server, "/api/does-not-exist");

    expect(api.statusCode).toBe(404);
    expect(api.body).not.toContain("public app shell");
  });
});
