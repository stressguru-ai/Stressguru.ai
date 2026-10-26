from __future__ import annotations

import hashlib
import json
import mimetypes
import re
import shutil
from pathlib import Path
from urllib.parse import unquote, urlparse

import requests

ROOT = Path(__file__).resolve().parents[1]
PUBLIC_IMAGES = ROOT / "client/public/images"
BLOG_EXPORT = Path("/home/ubuntu/aws_blogs_full.json")
SOURCE_SUFFIXES = {".ts", ".tsx", ".js", ".jsx", ".css", ".html", ".json", ".md", ".txt"}
REMOTE_HOST_MARKERS = ("manuscdn.com", "cloudfront.net")
IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".avif"}
URL_RE = re.compile(r"https://[^\s\"'<>)}]+")


def source_files() -> list[Path]:
    roots = [ROOT / "client/src", ROOT / "client/index.html", ROOT / "server", ROOT / "shared"]
    files: list[Path] = []
    for item in roots:
        if item.is_file():
            files.append(item)
        elif item.exists():
            files.extend(p for p in item.rglob("*") if p.is_file() and p.suffix.lower() in SOURCE_SUFFIXES)
    return sorted(set(files))


def extension_for(response: requests.Response, url: str) -> str:
    ext = Path(unquote(urlparse(url).path)).suffix.lower()
    if ext in IMAGE_EXTS:
        return ".jpg" if ext == ".jpeg" else ext
    content_type = response.headers.get("content-type", "").split(";", 1)[0].strip().lower()
    guessed = mimetypes.guess_extension(content_type) or ".img"
    return ".jpg" if guessed == ".jpe" else guessed


def safe_name(url: str, response: requests.Response) -> str:
    basename = Path(unquote(urlparse(url).path)).name
    stem = re.sub(r"[^A-Za-z0-9._-]+", "-", Path(basename).stem).strip("-._")
    ext = extension_for(response, url)
    if stem and len(stem) <= 80:
        return stem + ext
    return "asset-" + hashlib.sha256(url.encode()).hexdigest()[:16] + ext


def download(session: requests.Session, url: str, preferred_name: str | None = None) -> str:
    response = session.get(url, timeout=45, allow_redirects=True)
    response.raise_for_status()
    body = response.content
    looks_like_image = (
        body.startswith(b"\x89PNG\r\n\x1a\n")
        or body.startswith(b"\xff\xd8\xff")
        or body.startswith((b"GIF87a", b"GIF89a"))
        or (body.startswith(b"RIFF") and body[8:12] == b"WEBP")
        or body.lstrip().startswith(b"<svg")
    )
    if not response.headers.get("content-type", "").lower().startswith("image/") and not looks_like_image:
        raise RuntimeError(f"not an image: {url} ({response.headers.get('content-type')})")
    name = preferred_name or safe_name(url, response)
    target = PUBLIC_IMAGES / name
    if target.exists() and target.read_bytes() == body:
        return f"/images/{name}"
    if target.exists() and target.read_bytes() != body:
        name = f"{Path(name).stem}-{hashlib.sha256(url.encode()).hexdigest()[:8]}{Path(name).suffix}"
        target = PUBLIC_IMAGES / name
    target.write_bytes(body)
    return f"/images/{name}"


def main() -> None:
    PUBLIC_IMAGES.mkdir(parents=True, exist_ok=True)
    session = requests.Session()
    session.headers.update({"User-Agent": "StressGuru asset migration/1.0"})

    local_paths: set[str] = set()
    blogs: list[dict] = []
    blog_remotes: set[str] = set()
    if BLOG_EXPORT.exists():
        blogs = json.loads(BLOG_EXPORT.read_text(encoding="utf-8"))
        for blog in blogs:
            for key in ("image", "authorImage", "ogImage"):
                value = blog.get(key)
                if isinstance(value, str) and value.startswith("/images/"):
                    local_paths.add(value)
                elif isinstance(value, str) and any(marker in value for marker in REMOTE_HOST_MARKERS):
                    blog_remotes.add(value)

    failures: list[str] = []
    for path in sorted(local_paths):
        name = Path(path).name
        target = PUBLIC_IMAGES / name
        if target.exists():
            continue
        try:
            download(session, "https://stressguru.ai" + path, preferred_name=name)
            print(f"downloaded live asset {path}", flush=True)
        except Exception as exc:
            failures.append(f"{path}: {exc}")
            print(f"warning: could not fetch {path}: {exc}", flush=True)

    files = source_files()
    remotes: set[str] = set(blog_remotes)
    for path in files:
        text = path.read_text(encoding="utf-8", errors="replace")
        for url in URL_RE.findall(text):
            clean = url.rstrip(".,;")
            if any(marker in clean for marker in REMOTE_HOST_MARKERS):
                remotes.add(clean)

    mapping: dict[str, str] = {}
    for url in sorted(remotes):
        try:
            mapping[url] = download(session, url)
            print(f"localized {urlparse(url).netloc} -> {mapping[url]}", flush=True)
        except Exception as exc:
            failures.append(f"{url}: {exc}")
            print(f"warning: could not fetch {url}: {exc}", flush=True)

    changed = []
    for path in files:
        original = path.read_text(encoding="utf-8", errors="replace")
        updated = original
        for url, local in mapping.items():
            updated = updated.replace(url, local)
        if updated != original:
            path.write_text(updated, encoding="utf-8")
            changed.append(str(path.relative_to(ROOT)))

    blog_fields_changed = 0
    if blogs:
        for blog in blogs:
            for key in ("image", "authorImage", "ogImage"):
                value = blog.get(key)
                if value in mapping:
                    blog[key] = mapping[value]
                    blog_fields_changed += 1
        BLOG_EXPORT.write_text(json.dumps(blogs, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    report = {
        "downloaded_or_present": len(list(PUBLIC_IMAGES.glob("*"))),
        "database_paths_requested": len(local_paths),
        "remote_urls_localized": len(mapping),
        "database_export_fields_localized": blog_fields_changed,
        "source_files_changed": changed,
        "failures": failures,
    }
    report_path = ROOT / "docs/seo/image-localization-report.json"
    report_path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, indent=2), flush=True)
    if failures:
        raise SystemExit(2)


if __name__ == "__main__":
    main()
