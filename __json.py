import os
import json
import re
from datetime import datetime

# Maps month abbreviations to their numeric values
_MONTHS = {
    "jan": 1, "feb": 2, "mar": 3, "apr": 4, "may": 5, "jun": 6,
    "jul": 7, "aug": 8, "sep": 9, "sept": 9, "oct": 10, "nov": 11, "dec": 12
}

def _parse_date(s: str) -> datetime:
    s = s.strip()
    # Format: "13th July, 2025"
    m = re.match(r"(\d+)(?:st|nd|rd|th)?\s+([A-Za-z]+),\s*(\d{4})", s)
    if m:
        day = int(m.group(1))
        mon = m.group(2)[:3].lower()
        year = int(m.group(3))
        return datetime(year, _MONTHS.get(mon, 1), day)
    # Format: "Jul 2025"
    m = re.match(r"([A-Za-z]+)\s+(\d{4})", s)
    if m:
        mon = m.group(1)[:3].lower()
        year = int(m.group(2))
        return datetime(year, _MONTHS.get(mon, 1), 1)
    return datetime.min  # fallback if no match

def generate_blog_info():
    base = "blog-posts"
    entries = []

    for folder in os.listdir(base):
        folder_path = os.path.join(base, folder)
        if not os.path.isdir(folder_path):
            continue

        metadata = {
            "title": folder,
            "date": "",
            "author": "Naich Naznafi",
            "categories": []
        }

        info_path = os.path.join(folder_path, "__INFO.txt")
        if os.path.isfile(info_path):
            with open(info_path, encoding="utf-8") as info_file:
                for line in info_file:
                    if ":" in line:
                        key, val = line.split(":", 1)
                        k = key.strip().lower()
                        v = val.strip()
                        if not v:
                            continue
                        if k == "title":
                            metadata["title"] = v
                        elif k == "date":
                            metadata["date"] = v
                        elif k == "author":
                            metadata["author"] = v
                        elif k == "categories":
                            metadata["categories"] = [c.strip() for c in v.split(",") if c.strip()]

        html_files = [f for f in os.listdir(folder_path) if f.lower().endswith(".html")]
        if len(html_files) != 1:
            raise RuntimeError(f"Expected one HTML file in {folder_path}, found: {html_files}")

        entries.append({
            "title": metadata["title"],
            "date": metadata["date"],
            "author": metadata["author"],
            "categories": metadata["categories"],
            "url": f"{base}/{folder}/{html_files[0]}",
            "image": f"{base}/{folder}/cover.jpg"
        })

    # Sort by parsed date, most recent first
    entries.sort(key=lambda e: _parse_date(e["date"]), reverse=True)
    return entries

def generate_portfolio_items():
    base = "portfolio-works"
    items = []

    for folder in os.listdir(base):
        folder_path = os.path.join(base, folder)
        if not os.path.isdir(folder_path):
            continue

        metadata = {
            "title": folder,
            "category": "",
            "tag": ""
        }

        info_path = os.path.join(folder_path, "__INFO.txt")
        if os.path.isfile(info_path):
            with open(info_path, encoding="utf-8") as info_file:
                for line in info_file:
                    if ":" in line:
                        key, val = line.split(":", 1)
                        k = key.strip().lower()
                        v = val.strip()
                        if k in metadata and v:
                            metadata[k] = v

        html_files = [f for f in os.listdir(folder_path) if f.lower().endswith(".html")]
        if len(html_files) != 1:
            raise RuntimeError(f"Expected one HTML file in {folder_path}, found: {html_files}")

        image_path = os.path.join(folder_path, "cover.jpg")
        if not os.path.isfile(image_path):
            raise RuntimeError(f"No cover.jpg found in {folder_path}")

        items.append({
            "title": metadata["title"],
            "category": metadata["category"],
            "tag": metadata["tag"],
            "link": f"{base}/{folder}/{html_files[0]}",
            "image": f"{base}/{folder}/cover.jpg"
        })

    return items

def generate_certificates():
    base = "accomplishments/my-certificates"
    entries = []

    folders = [f for f in sorted(os.listdir(base)) if os.path.isdir(os.path.join(base, f))]

    for idx, folder in enumerate(folders):
        folder_path = os.path.join(base, folder)

        metadata = {
            "date": "",
            "title": folder,
            "issuer": "",
            "tags": [],
            "verifyLink": ""
        }

        info_path = os.path.join(folder_path, "__INFO.txt")
        if os.path.isfile(info_path):
            with open(info_path, encoding="utf-8") as f:
                for line in f:
                    if ":" not in line:
                        continue
                    key, val = line.split(":", 1)
                    k = key.strip().lower()
                    v = val.strip()
                    if not v:
                        continue
                    if k == "date":
                        metadata["date"] = v
                    elif k == "title":
                        metadata["title"] = v
                    elif k in ("issuer", "issued by"):
                        metadata["issuer"] = v
                    elif k == "verify":
                        metadata["verifyLink"] = v
                    elif k == "tags":
                        metadata["tags"] = [t.strip() for t in v.split(",") if t.strip()]

        files = sorted(os.listdir(folder_path))
        main_imgs = [f for f in files if f.lower().startswith("main-certificate") and f.lower().endswith((".jpg", ".jpeg", ".png", ".gif"))]
        other_imgs = [f for f in files if f.lower().endswith((".jpg", ".jpeg", ".png", ".gif")) and f not in main_imgs]

        images = []
        for fn in main_imgs + other_imgs:
            images.append({
                "src": f"{base}/{folder}/{fn}".replace("\\", "/"),
                "alt": f"Certificate: {metadata['title']}"
            })

        entries.append({
            "date": metadata["date"],
            "title": metadata["title"],
            "images": images,
            "issuer": metadata["issuer"],
            "tags": metadata["tags"],
            "verifyLink": metadata["verifyLink"],
            "offset": (idx % 2 == 1),                   # false, true, false, true...
            "duration": "0.5",
            "delay": f"{idx * 0.2:.1f}"                  # 0.0, 0.2, 0.4, 0.8...
        })

    entries.sort(key=lambda e: _parse_date(e["date"]), reverse=True)

    # Re-assign offset/delay based on *sorted* order
    for i, entry in enumerate(entries):
        entry["offset"] = (i % 2 == 1)
        entry["delay"] = f"{i * 0.02:.1f}"

    return entries

    base = "accomplishments/my-certificates"
    entries = []

    for idx, folder in enumerate(sorted(os.listdir(base))):
        folder_path = os.path.join(base, folder)
        if not os.path.isdir(folder_path):
            continue

        metadata = {
            "date": "",
            "title": folder,
            "issuer": "",
            "tags": [],
            "verifyLink": ""
        }

        info_path = os.path.join(folder_path, "__INFO.txt")
        if os.path.isfile(info_path):
            with open(info_path, encoding="utf-8") as f:
                for line in f:
                    if ":" not in line:
                        continue
                    key, val = line.split(":", 1)
                    k = key.strip().lower()
                    v = val.strip()
                    if not v:
                        continue
                    if k == "date":
                        metadata["date"] = v
                    elif k == "title":
                        metadata["title"] = v
                    elif k in ("issuer", "issued by"):
                        metadata["issuer"] = v
                    elif k == "verify":
                        metadata["verifyLink"] = v
                    elif k == "tags":
                        metadata["tags"] = [t.strip() for t in v.split(",") if t.strip()]

        files = sorted(os.listdir(folder_path))
        main_imgs = [f for f in files if f.lower().startswith("main-certificate") and f.lower().endswith((".jpg", ".jpeg", ".png", ".gif"))]
        other_imgs = [f for f in files if f.lower().endswith((".jpg", ".jpeg", ".png", ".gif")) and f not in main_imgs]

        images = []
        for fn in main_imgs + other_imgs:
            images.append({
                "src": f"{base}/{folder}/{fn}".replace("\\", "/"),
                "alt": f"Certificate: {metadata['title']}"
            })

        entries.append({
            "date": metadata["date"],
            "title": metadata["title"],
            "images": images,
            "issuer": metadata["issuer"],
            "tags": metadata["tags"],
            "verifyLink": metadata["verifyLink"],
            "offset": bool(idx % 2),
            "duration": "1.5",
            "delay": f"{idx * 0.4:.1f}"
        })

    # Sort by parsed date, most recent first
    entries.sort(key=lambda e: _parse_date(e["date"]), reverse=True)
    return entries

def main():
    os.makedirs("data", exist_ok=True)

    with open("data/blog-info.json", "w", encoding="utf-8") as f:
        json.dump(generate_blog_info(), f, indent=2)

    with open("data/portfolio-works.json", "w", encoding="utf-8") as f:
        json.dump(generate_portfolio_items(), f, indent=2)

    with open("data/certificates.json", "w", encoding="utf-8") as f:
        json.dump(generate_certificates(), f, indent=2)

    print("Generated: blog-info.json, portfolio-works.json, certificates.json")

if __name__ == "__main__":
    main()
