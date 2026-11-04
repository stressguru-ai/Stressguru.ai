import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "..");
const portraits = {
  "Relationship Guru": "/images/RiYvCLRiSOOKHHcr.png", // Beige-and-olive outfit.
  "Anxiety Guru": "/images/RjEvlDvMOtWTRzEq.png", // Maroon outfit.
};
const read = (relative: string) => fs.readFileSync(path.join(root, relative), "utf8");

function mappedPortrait(source: string, name: string, key: string): string | undefined {
  const nameIndex = source.indexOf(`"${name}"`);
  if (nameIndex < 0) return undefined;
  const match = source.slice(nameIndex).match(new RegExp(`${key}:\\s*"([^"]+)"`));
  return match?.[1];
}

describe("user-approved Guru portrait identities", () => {
  it("keeps Relationship in beige and Anxiety in maroon on their individual Guru pages", () => {
    for (const [name, image] of Object.entries(portraits)) {
      const component = name === "Relationship Guru" ? "RelationshipGuru" : "AnxietyGuru";
      expect(read(`client/src/pages/gurus/${component}.tsx`)).toContain(`avatarImage="${image}"`);
    }
  });

  it.each([
    ["client/src/pages/Gurus.tsx", "image"],
    ["client/src/components/Navigation.tsx", "icon"],
    ["client/src/components/FindYourGuruQuiz.tsx", "guruImage"],
    ["server/seed-gurus.ts", "image"],
  ])("keeps the same portraits in %s", (file, key) => {
    for (const [name, image] of Object.entries(portraits)) {
      expect(mappedPortrait(read(file), name, key)).toBe(image);
    }
  });

  it("keeps future generated blog author assignments correct", () => {
    const generator = read("scripts/generate_blog_content.py");
    for (const [name, image] of Object.entries(portraits)) {
      const row = generator.split("\n").find(line => line.includes(`"name": "${name}"`));
      expect(row).toContain(`"image": "${image}"`);
    }
  });

  it("keeps every generated blog author avatar aligned to Guru ID and name", () => {
    const blogs = JSON.parse(read("docs/seo/blogs.generated.json")) as {
      guruId: number; authorName: string; authorImage: string;
    }[];
    const affected = blogs.filter(blog => blog.guruId === 3 || blog.guruId === 5);
    expect(affected.length).toBeGreaterThan(0);
    for (const blog of affected) {
      const name = blog.guruId === 3 ? "Anxiety Guru" : "Relationship Guru";
      expect(blog.authorName).toBe(name);
      expect(blog.authorImage).toBe(portraits[name]);
    }
  });

  it("preserves both PNG assets as existing self-hosted files", () => {
    for (const image of Object.values(portraits)) {
      const bytes = fs.readFileSync(path.join(root, "client/public", image));
      expect(bytes.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
    }
  });
});
