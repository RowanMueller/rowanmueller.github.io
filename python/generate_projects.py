#!/usr/bin/env python3
"""
Generate projects.json from project data.
Run from project root: python python/generate_projects.py
"""

import json
from pathlib import Path

# Example projects - customize as needed
PROJECTS = [
    {
        "id": "1",
        "title": "Sample Project",
        "description": "A sample project description.",
        "technologies": ["React", "Vite"],
        "link": "https://github.com/rowanmueller",
    },
]


def main():
    script_dir = Path(__file__).parent
    projects_path = script_dir.parent / "src" / "data" / "projects.json"

    data = {"projects": PROJECTS}

    with open(projects_path, "w") as f:
        json.dump(data, f, indent=2)

    print(f"Generated {projects_path}")


if __name__ == "__main__":
    main()
