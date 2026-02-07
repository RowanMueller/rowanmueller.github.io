#!/usr/bin/env python3
"""
Generate projects.json from project data.
Run from project root: python python/generate_projects.py
"""

import json
from pathlib import Path

PROJECTS = [
    {
        "id": "1",
        "title": "System Modeling Application for IoT",
        "description": "Web app for modeling navy systems: create systems, upload SysML/CSV data, visualize as graphs, and export to SysML. Built with Django (backend), React (frontend), and PostgreSQL.",
        "technologies": ["Django, React, Node.js, PostgreSQL"],
        "video": "/assets/videoClips/ProjectOne.mov",
        "link": "https://github.com/RowanMueller/ModelingNavySystems",
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
