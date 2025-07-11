#!/usr/bin/env python3
import os
import json

"""
This script scans the `blogs/` and `portfolio-works/` directories and dynamically
generates two JSON files in the project root:

- data/blog-info.json (blog metadata)
- data/portfolio-works.json (portfolio metadata)

It preserves each directory's natural filesystem order (as returned by os.listdir).
For both blogs and portfolio items, if a `__INFO.txt` file exists, it will parse
and override defaults for:
  - Blogs: `title:`, `date:`, `author:`, `categories:` (comma-separated list)
  - Portfolio: `title:`, `category:`, `tag:`
"""

def generate_blog_info():
    base = "blogs"
    entries = []

    for folder in os.listdir(base):
        folder_path = os.path.join(base, folder)
        if not os.path.isdir(folder_path):
            continue

        # Default blog metadata
        metadata = {
            "title": folder,
            "date": "",
            "author": "Naich Naznafi",
            "categories": []
        }
        # Override via __INFO.txt if present
        info_path = os.path.join(folder_path, "__INFO.txt")
        if os.path.isfile(info_path):
            with open(info_path, encoding="utf-8") as info_file:
                for line in info_file:
                    if ":" in line:
                        key, val = line.split(":", 1)
                        k = key.strip().lower()
                        v = val.strip()
                        if k == "title" and v:
                            metadata["title"] = v
                        elif k == "date" and v:
                            metadata["date"] = v
                        elif k == "author" and v:
                            metadata["author"] = v
                        elif k == "categories" and v:
                            metadata["categories"] = [c.strip() for c in v.split(",") if c.strip()]

        # Locate HTML and cover image
        html_files = [f for f in os.listdir(folder_path) if f.lower().endswith(".html")]
        if len(html_files) != 1:
            raise RuntimeError(f"Expected exactly one HTML file in {folder_path}, found {html_files}")
        url = f"{base}/{folder}/{html_files[0]}"
        image = f"{base}/{folder}/cover.jpg"

        # Append in order: title, date, author, categories, url, image
        entries.append({
            "title": metadata["title"],
            "date": metadata["date"],
            "author": metadata["author"],
            "categories": metadata["categories"],
            "url": url,
            "image": image
        })

    return entries


def generate_portfolio_items():
    base = "portfolio-works"
    items = []

    for folder in os.listdir(base):
        folder_path = os.path.join(base, folder)
        if not os.path.isdir(folder_path):
            continue

        # Default portfolio metadata
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

        # Cover image and link
        image = f"{base}/{folder}/cover.jpg"
        if not os.path.isfile(image):
            raise RuntimeError(f"No __cover.jpg found in {folder_path}")
        html_files = [f for f in os.listdir(folder_path) if f.lower().endswith(".html")]
        if len(html_files) != 1:
            raise RuntimeError(f"Expected exactly one HTML file in {folder_path}, found {html_files}")
        link = f"{base}/{folder}/{html_files[0]}"

        # Append in order: title, category, tag, link, image
        items.append({
            "title": metadata["title"],
            "category": metadata["category"],
            "tag": metadata["tag"],
            "link": link,
            "image": image
        })

    return items


def main():
    blog_entries = generate_blog_info()
    portfolio_entries = generate_portfolio_items()

    os.makedirs("data", exist_ok=True)
    with open(os.path.join("data", "blog-info.json"), "w", encoding="utf-8") as f:
        json.dump(blog_entries, f, indent=2)
    with open(os.path.join("data", "portfolio-works.json"), "w", encoding="utf-8") as f:
        json.dump(portfolio_entries, f, indent=2)

    print("Generated data/blog-info.json and data/portfolio-works.json successfully.")


if __name__ == "__main__":
    main()
