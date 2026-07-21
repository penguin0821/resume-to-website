"""Tests for backend/app/models.py — Pydantic data model validation.

Pydantic validates data automatically when requests enter the API.
Testing the validation logic = testing the API's first line of defense.
"""
import pytest
from pydantic import ValidationError
from app.models import (
    ResumeData, WorkExperience, Education,
    PersonalStyle, ProfessionalStyle,
    GenerateRequest, AIEffectRequest, AIEffectResponse,
    AIStyleChatRequest, AIStyleChatResponse,
    DeployNetlifyRequest, DeployGitHubPagesRequest,
)


# ── ResumeData ───────────────────────────────────────────────

class TestResumeData:

    def test_minimal_required_fields(self):
        """Only name and title are required."""
        r = ResumeData(name="Bob", title="Designer")
        assert r.name == "Bob"
        assert r.title == "Designer"

    def test_missing_name_raises(self):
        with pytest.raises(ValidationError):
            ResumeData(title="Designer")

    def test_missing_title_raises(self):
        with pytest.raises(ValidationError):
            ResumeData(name="Bob")

    def test_optional_fields_default_empty(self):
        r = ResumeData(name="Bob", title="Designer")
        assert r.email == ""
        assert r.phone == ""
        assert r.bio == ""
        assert r.avatar_url == ""
        assert r.work_experiences == []
        assert r.educations == []
        assert r.skills == []
        assert r.hobbies == []

    def test_bilingual_fields_default_empty(self):
        """Second language fields should default to empty strings."""
        r = ResumeData(name="Bob", title="Designer")
        assert r.name_cn == ""
        assert r.title_cn == ""
        assert r.bio_cn == ""
        assert r.skills_cn == []
        assert r.hobbies_cn == []


# ── WorkExperience & Education ───────────────────────────────

class TestWorkExperience:

    def test_required_fields(self):
        w = WorkExperience(company="Acme", position="Dev", duration="2020", description="Built stuff")
        assert w.company == "Acme"

    def test_missing_company_raises(self):
        with pytest.raises(ValidationError):
            WorkExperience(position="Dev", duration="2020", description="x")

    def test_cn_fields_default_empty(self):
        w = WorkExperience(company="A", position="B", duration="C", description="D")
        assert w.company_cn == ""
        assert w.position_cn == ""


class TestEducation:

    def test_required_fields(self):
        e = Education(school="MIT", major="CS", duration="2020")
        assert e.school == "MIT"

    def test_school_logo_default_empty(self):
        e = Education(school="MIT", major="CS", duration="2020")
        assert e.school_logo == ""


# ── Style Models ─────────────────────────────────────────────

class TestPersonalStyle:

    def test_defaults(self):
        s = PersonalStyle()
        assert s.primary_color == "#6366f1"
        assert s.ui_style == "cartoon"
        assert s.color_effects == ["solid"]
        assert s.accent_pattern == "dots"
        assert s.dark_mode is False

    def test_custom_values(self):
        s = PersonalStyle(ui_style="minimal", dark_mode=True, primary_color="#ff0000")
        assert s.ui_style == "minimal"
        assert s.dark_mode is True


class TestProfessionalStyle:

    def test_defaults(self):
        s = ProfessionalStyle()
        assert s.accent_color == "#c9a96e"
        assert s.ui_style == "elegant"
        assert s.content_layout == "classic"
        assert s.dark_mode is False


# ── Request/Response Models ──────────────────────────────────

class TestGenerateRequest:

    def test_personal_mode(self, full_resume):
        req = GenerateRequest(mode="personal", resume=full_resume)
        assert req.mode == "personal"
        assert req.lang == "zh"
        assert req.ai_effects == []

    def test_professional_mode(self, full_resume):
        req = GenerateRequest(mode="professional", resume=full_resume)
        assert req.mode == "professional"


class TestAIEffectRequest:

    def test_defaults(self):
        r = AIEffectRequest(description="Add particles")
        assert r.model == "gemini/gemini-2.5-flash"
        assert r.api_key == ""


class TestAIStyleChatRequest:

    def test_defaults(self):
        r = AIStyleChatRequest(message="Make it blue")
        assert r.mode == "personal"
        assert r.model == "gemini/gemini-2.5-flash"
        assert r.conversation == []


class TestDeployRequests:

    def test_netlify_request(self):
        r = DeployNetlifyRequest(html="<html></html>")
        assert r.html == "<html></html>"

    def test_github_pages_request(self):
        r = DeployGitHubPagesRequest(html="<html></html>", github_token="ghp_xxx")
        assert r.repo_name == "my-resume-site"
