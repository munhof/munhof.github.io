"""Checks for the bilingual featured-project collection."""

import json
from pathlib import Path
import unittest


class FeaturedProjectsTests(unittest.TestCase):
    def test_sintonizados_has_github_link_and_bilingual_copy(self):
        root = Path(__file__).resolve().parents[1]
        profile = json.loads((root / "data/profile.json").read_text())
        projects = {project["id"]: project for project in profile["projects"]}
        self.assertIn("sintonizados", projects)
        self.assertEqual(projects["sintonizados"]["url"],
                         "https://github.com/munhof/sintonizados")
        for language in ("es", "en"):
            with self.subTest(language=language):
                copy = profile["i18n"][language]
                self.assertTrue(copy["projects"]["sintonizados"]["description"].strip())
                self.assertTrue(copy["projects"]["sintonizados"]["kicker"].strip())
                self.assertEqual(int(copy["stats"][0]["value"]), len(projects))

    def test_cv_includes_sintonizados_in_both_languages(self):
        root = Path(__file__).resolve().parents[1]
        profile = json.loads((root / "data/profile.json").read_text())
        for language in ("es", "en"):
            text = profile["i18n"][language]["cv"].get("sintonizados", "")
            self.assertIn("Sintonizados", text)
            self.assertIn("2026", text)
        script = (root / "script.js").read_text()
        self.assertIn("copy.cv.sintonizados", script)

    def test_cv_links_san_poster_and_describes_the_presentation(self):
        root = Path(__file__).resolve().parents[1]
        profile = json.loads((root / "data/profile.json").read_text())
        url = "https://csan2026.saneurociencias.org.ar/poster/unsupervised-categorization-of-animal-behavioral-patterns-using-deep-neural-networks/"
        for language in ("es", "en"):
            bullets = profile["i18n"][language]["cv"]["projectBullets"]
            poster = next((item for item in bullets if isinstance(item, dict) and item.get("url") == url), None)
            self.assertIsNotNone(poster)
            self.assertIn("SAN 2026", poster["text"])
            self.assertIn("STORM", poster["text"])
            self.assertTrue(poster["label"])
