"""Tests for HTML generators — the core output of the project.

The generators produce the final HTML that users receive. These tests
ensure the HTML is valid, contains expected content, and handles edge cases.
"""
import pytest
from app.models import ResumeData, PersonalStyle, ProfessionalStyle, WorkExperience, Education
from app.generators.personal import generate_personal_site
from app.generators.professional import generate_professional_site


# ── Personal Site Generator ──────────────────────────────────

class TestPersonalGenerator:

    def test_minimal_input_produces_valid_html(self, minimal_resume):
        """Even with just name+title, should produce complete HTML."""
        html = generate_personal_site(minimal_resume)
        assert '<html' in html
        assert '<head' in html
        assert '<body' in html
        assert '</html>' in html

    def test_html_contains_name(self, minimal_resume):
        html = generate_personal_site(minimal_resume)
        assert 'Alice' in html

    def test_html_contains_title(self, minimal_resume):
        html = generate_personal_site(minimal_resume)
        assert 'Engineer' in html

    def test_full_resume_contains_all_sections(self, full_resume):
        html = generate_personal_site(full_resume)
        # When CN fields are filled, the generator uses CN content by default
        # Work experience — check CN or EN version
        assert 'Acme Corp' in html or '阿克米公司' in html
        assert 'Senior Engineer' in html or '高级工程师' in html
        # Education
        assert 'MIT' in html or '麻省理工' in html
        assert 'Computer Science' in html or '计算机科学' in html
        # Skills
        assert 'Python' in html
        assert 'React' in html
        # Hobbies — CN version
        assert 'Hiking' in html or '徒步' in html
        # Bio
        assert 'Passionate about building' in html or '热爱打造' in html

    def test_email_in_html(self, full_resume):
        html = generate_personal_site(full_resume)
        assert 'alice@example.com' in html

    def test_bilingual_mode_has_toggle(self, full_resume):
        """When CN fields are filled, the generated site should include a language toggle."""
        html = generate_personal_site(full_resume, bilingual=True)
        # The toggle button or script should be present
        assert 'EN' in html or '中文' in html or 'toggleLang' in html or 'lang-switch' in html

    def test_bilingual_includes_cn_content(self, full_resume):
        html = generate_personal_site(full_resume, bilingual=True)
        assert '爱丽丝' in html
        assert '高级工程师' in html

    def test_xss_protection(self):
        """User input with <script> must be escaped in the output."""
        evil = ResumeData(name='<script>alert(1)</script>', title='Hacker')
        html = generate_personal_site(evil)
        assert '<script>alert(1)</script>' not in html
        assert '&lt;script&gt;' in html

    def test_dark_mode_css(self, full_resume):
        """When dark_mode=True, CSS should include prefers-color-scheme media query."""
        style = PersonalStyle(dark_mode=True)
        html = generate_personal_site(full_resume, style=style)
        assert 'prefers-color-scheme' in html or 'dark' in html.lower()

    def test_ui_style_presets(self, full_resume):
        """Each UI style preset should produce valid HTML."""
        for ui in ['cartoon', 'minimal', 'artistic', 'retro']:
            style = PersonalStyle(ui_style=ui)
            html = generate_personal_site(full_resume, style=style)
            assert '<html' in html
            assert len(html) > 1000

    def test_lang_en(self, full_resume):
        """English language mode should use English labels."""
        html = generate_personal_site(full_resume, lang='en')
        assert '<html' in html


# ── Professional Site Generator ──────────────────────────────

class TestProfessionalGenerator:

    def test_minimal_input_produces_valid_html(self, minimal_resume):
        html = generate_professional_site(minimal_resume)
        assert '<html' in html
        assert '<head' in html
        assert '<body' in html

    def test_html_contains_name(self, minimal_resume):
        html = generate_professional_site(minimal_resume)
        assert 'Alice' in html

    def test_full_resume_sections(self, full_resume):
        html = generate_professional_site(full_resume)
        # CN or EN content depending on generator behavior
        assert 'Acme Corp' in html or '阿克米公司' in html
        assert 'MIT' in html or '麻省理工' in html
        assert 'Python' in html

    def test_xss_protection(self):
        evil = ResumeData(name='<img src=x onerror=alert(1)>', title='Hacker')
        html = generate_professional_site(evil)
        assert 'onerror' not in html or '&lt;' in html

    def test_dark_mode(self, full_resume):
        style = ProfessionalStyle(dark_mode=True)
        html = generate_professional_site(full_resume, style=style)
        assert 'prefers-color-scheme' in html or 'dark' in html.lower()

    def test_content_layouts(self, full_resume):
        """Each content layout should produce valid HTML."""
        for layout in ['classic', 'poster', 'sidebar']:
            style = ProfessionalStyle(content_layout=layout)
            html = generate_professional_site(full_resume, style=style)
            assert '<html' in html
            assert len(html) > 1000

    def test_ui_style_presets(self, full_resume):
        """Each UI preset should produce valid HTML."""
        for ui in ['elegant', 'minimal', 'corporate']:
            style = ProfessionalStyle(ui_style=ui)
            html = generate_professional_site(full_resume, style=style)
            assert '<html' in html

    def test_bilingual_mode(self, full_resume):
        html = generate_professional_site(full_resume, bilingual=True)
        assert '爱丽丝' in html

    def test_ai_effects_injected(self, full_resume):
        """AI effects should be injected into the HTML when provided."""
        effects = [{"css": ".custom{color:red}", "js": "", "description": "Red theme"}]
        html = generate_professional_site(full_resume, ai_effects=effects)
        assert '.custom{color:red}' in html or 'color:red' in html
