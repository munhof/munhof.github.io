#!/usr/bin/env python3
"""Validate the shared portfolio/CV data without third-party dependencies."""

from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PROFILE_PATH = ROOT / "data" / "profile.json"
LANGUAGES = ("es", "en")


def require(condition: bool, message: str) -> None:
    if not condition:
        raise ValueError(message)


def validate_collection(
    profile: dict,
    translations: dict,
    collection: str,
) -> None:
    identifiers = [item["id"] for item in profile[collection]]
    require(
        len(identifiers) == len(set(identifiers)),
        f"Duplicate id in {collection}",
    )
    for language in LANGUAGES:
        localized = translations[language][collection]
        missing = set(identifiers) - set(localized)
        extra = set(localized) - set(identifiers)
        require(not missing, f"{language}.{collection} missing: {sorted(missing)}")
        require(not extra, f"{language}.{collection} extra: {sorted(extra)}")


def main() -> None:
    profile = json.loads(PROFILE_PATH.read_text(encoding="utf-8"))
    translations = profile["i18n"]

    require(set(translations) == set(LANGUAGES), "Expected es and en locales")
    require(profile["schemaVersion"] == 1, "Unsupported schema version")
    require(profile["updated"], "Missing update date")

    for collection in ("projects", "experience", "education"):
        validate_collection(profile, translations, collection)

    skill_ids = {group["id"] for group in profile["skills"]}
    for language in LANGUAGES:
        require(
            set(translations[language]["skillGroups"]) == skill_ids,
            f"{language}.skillGroups must match skills",
        )
        language_ids = set(translations[language]["languages"])
        require(
            language_ids == set(profile["languages"]),
            f"{language}.languages must match language list",
        )

    print("profile.json is valid and both languages are synchronized")


if __name__ == "__main__":
    main()
