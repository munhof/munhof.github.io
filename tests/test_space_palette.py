"""Regression checks for the portfolio's space-inspired palette."""

from pathlib import Path
import json
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]


class SpacePaletteTests(unittest.TestCase):
    def test_portfolio_uses_blue_violet_and_pink_accents(self):
        stylesheet = (ROOT / "style.css").read_text(encoding="utf-8")

        for color in ("#070b1f", "#8b5cf6", "#f472b6", "#e0e7ff"):
            self.assertIn(color, stylesheet)

        self.assertNotIn("#c7ff4a", stylesheet)
        self.assertNotIn("#5d7d00", stylesheet)

    def test_no_academic_grades_are_published(self):
        profile = json.loads((ROOT / "data" / "profile.json").read_text(encoding="utf-8"))
        published_copy = json.dumps(profile["i18n"], ensure_ascii=False)

        self.assertNotRegex(published_copy, r"10/10|Calificación|Grade:")

    def test_project_cards_share_a_fluid_size(self):
        stylesheet = (ROOT / "style.css").read_text(encoding="utf-8")
        project_rules = re.search(
            r"\.project-card \{(?P<rules>.*?)\n\}\n",
            stylesheet,
            re.DOTALL,
        )

        self.assertIsNotNone(project_rules)
        self.assertIn("min-height: clamp(360px, 38vw, 440px);", project_rules.group("rules"))
        self.assertNotIn(".project-card:first-child", stylesheet)
        self.assertNotIn(".project-card:nth-child(2)", stylesheet)
        self.assertNotIn(".project-card:nth-child(3) h3", stylesheet)

    def test_project_card_titles_align_below_their_number(self):
        stylesheet = (ROOT / "style.css").read_text(encoding="utf-8")
        title_rules = re.search(
            r"\.project-card h3 \{(?P<rules>.*?)\n\}",
            stylesheet,
            re.DOTALL,
        )
        link_rules = re.search(
            r"\.project-card \.text-link \{(?P<rules>.*?)\n\}",
            stylesheet,
            re.DOTALL,
        )

        self.assertIsNotNone(title_rules)
        self.assertIsNotNone(link_rules)
        self.assertIn("margin: 16px 0 6px;", title_rules.group("rules"))
        self.assertNotIn("margin: auto 0 6px;", title_rules.group("rules"))
        self.assertIn("margin-top: auto;", link_rules.group("rules"))

    def test_project_cards_stack_on_narrow_screens(self):
        stylesheet = (ROOT / "style.css").read_text(encoding="utf-8")
        tablet_rules = re.search(
            r"@media \(max-width: 1100px\) \{(?P<rules>.*?)\n\}",
            stylesheet,
            re.DOTALL,
        )

        self.assertIsNotNone(tablet_rules)
        self.assertIn(".project-card {\n    grid-column: 1 / -1;", tablet_rules.group("rules"))

    def test_hero_has_a_compact_top_gap_below_the_header(self):
        stylesheet = (ROOT / "style.css").read_text(encoding="utf-8")
        hero_rules = re.search(
            r"\.hero \{(?P<rules>.*?)\n\}",
            stylesheet,
            re.DOTALL,
        )

        self.assertIsNotNone(hero_rules)
        self.assertIn("padding: clamp(0px, 3vw, 10px) 0 50px;", hero_rules.group("rules"))
        self.assertIn("min-height: auto;", hero_rules.group("rules"))
        self.assertNotIn("min-height: calc(100vh - 72px);", hero_rules.group("rules"))

    def test_hero_keeps_the_professional_status_without_a_monogram_card(self):
        portfolio = (ROOT / "index.html").read_text(encoding="utf-8")
        stylesheet = (ROOT / "style.css").read_text(encoding="utf-8")
        hero_rules = re.search(
            r"\.hero \{(?P<rules>.*?)\n\}",
            stylesheet,
            re.DOTALL,
        )

        self.assertNotIn('class="hero-card', portfolio)
        self.assertIn('class="hero-status" data-copy="hero.status"', portfolio)
        self.assertIn("grid-template-columns: 1fr;", hero_rules.group("rules"))

    def test_about_section_includes_a_bilingual_personal_story(self):
        profile = json.loads((ROOT / "data" / "profile.json").read_text(encoding="utf-8"))
        portfolio = (ROOT / "index.html").read_text(encoding="utf-8")
        script = (ROOT / "script.js").read_text(encoding="utf-8")

        self.assertIn('id="story"', portfolio)
        self.assertIn("copy.about.story", script)
        for language in ("es", "en"):
            story = profile["i18n"][language]["about"]["story"]
            self.assertEqual(len(story), 2)
            self.assertTrue(all(paragraph.strip() for paragraph in story))

    def test_background_has_an_interactive_starfield(self):
        portfolio = (ROOT / "index.html").read_text(encoding="utf-8")
        script = (ROOT / "script.js").read_text(encoding="utf-8")
        stylesheet = (ROOT / "style.css").read_text(encoding="utf-8")

        self.assertIn('class="starfield"', portfolio)
        self.assertIn("function initStarfield()", script)
        self.assertIn('document.addEventListener("click"', script)
        self.assertIn("initStarfield();", script)
        self.assertIn(".starfield {", stylesheet)
        self.assertIn("pointer-events: none;", stylesheet)

    def test_starfield_adds_gentle_periodic_twinkles(self):
        script = (ROOT / "script.js").read_text(encoding="utf-8")

        self.assertIn("let twinkles = [];", script)
        self.assertIn("setInterval(() =>", script)
        self.assertIn("twinkles.push({", script)

    def test_contact_uses_clear_actions_without_a_decorative_panel(self):
        portfolio = (ROOT / "index.html").read_text(encoding="utf-8")
        stylesheet = (ROOT / "style.css").read_text(encoding="utf-8")
        contact_rules = re.search(
            r"\.contact \{(?P<rules>.*?)\n\}",
            stylesheet,
            re.DOTALL,
        )

        self.assertIn('data-copy="ui.contactEmail"', portfolio)
        self.assertIn('class="contact-socials"', portfolio)
        self.assertIn('class="button button-secondary"', portfolio)
        self.assertIsNotNone(contact_rules)
        self.assertNotIn("border:", contact_rules.group("rules"))
        self.assertNotIn("background:", contact_rules.group("rules"))

    def test_project_titles_use_pretext_after_fonts_are_ready(self):
        script = (ROOT / "script.js").read_text(encoding="utf-8")
        portfolio = (ROOT / "index.html").read_text(encoding="utf-8")
        resume = (ROOT / "cv.html").read_text(encoding="utf-8")

        self.assertIn('from "https://esm.sh/@chenglou/pretext@0.0.3"', script)
        self.assertIn("await document.fonts.ready", script)
        self.assertIn("ResizeObserver", script)
        self.assertIn("layout(prepared", script)
        self.assertIn('<script type="module" src="script.js"></script>', portfolio)
        self.assertIn('<script type="module" src="script.js"></script>', resume)


if __name__ == "__main__":
    unittest.main()
