"""Integration tests for API endpoints using FastAPI TestClient.

TestClient simulates HTTP requests in-memory without starting a real server.
This tests the full chain: routing, middleware, validation, and response.
"""
import pytest
from httpx import ASGITransport, AsyncClient
from app.main import app


@pytest.fixture
def client():
    """Create a synchronous test client from the FastAPI app."""
    from starlette.testclient import TestClient
    return TestClient(app)


# ── Root ─────────────────────────────────────────────────────

class TestRoot:

    def test_root_endpoint(self, client):
        resp = client.get("/")
        assert resp.status_code == 200
        assert "message" in resp.json()


# ── AI Models ────────────────────────────────────────────────

class TestAIModels:

    def test_get_ai_models(self, client):
        """GET /api/ai-models should return models and providers lists."""
        resp = client.get("/api/ai-models")
        assert resp.status_code == 200
        data = resp.json()
        assert "models" in data
        assert "providers" in data
        assert len(data["models"]) >= 13
        assert len(data["providers"]) >= 8

    def test_models_have_required_fields(self, client):
        """Each model should have id, name, provider."""
        resp = client.get("/api/ai-models")
        for m in resp.json()["models"]:
            assert "id" in m
            assert "name" in m
            assert "provider" in m

    def test_providers_have_key_url(self, client):
        """Each provider should have a keyUrl for API key signup."""
        resp = client.get("/api/ai-models")
        for p in resp.json()["providers"]:
            assert "name" in p
            assert "keyUrl" in p


# ── Generate ─────────────────────────────────────────────────

class TestGenerate:

    def test_generate_personal(self, client, full_resume):
        """POST /api/generate with mode=personal should return HTML."""
        resp = client.post("/api/generate", json={
            "mode": "personal",
            "resume": full_resume.model_dump(),
            "lang": "zh",
        })
        assert resp.status_code == 200
        data = resp.json()
        assert "html" in data
        assert data["mode"] == "personal"
        assert "<html" in data["html"]
        assert "Alice" in data["html"]

    def test_generate_professional(self, client, full_resume):
        """POST /api/generate with mode=professional should return HTML."""
        resp = client.post("/api/generate", json={
            "mode": "professional",
            "resume": full_resume.model_dump(),
            "lang": "zh",
        })
        assert resp.status_code == 200
        data = resp.json()
        assert "html" in data
        assert data["mode"] == "professional"
        assert "<html" in data["html"]

    def test_generate_minimal_resume(self, client):
        """Even minimal resume data should generate successfully."""
        resp = client.post("/api/generate", json={
            "mode": "personal",
            "resume": {"name": "Test", "title": "Dev"},
        })
        assert resp.status_code == 200
        assert "<html" in resp.json()["html"]

    def test_generate_missing_resume_fails(self, client):
        """Missing required 'resume' field should return 422."""
        resp = client.post("/api/generate", json={"mode": "personal"})
        assert resp.status_code == 422


# ── AI Effects (no real API call) ────────────────────────────

class TestAIEffects:

    def test_effects_without_api_key(self, client):
        """Requesting AI effects without an API key should fail gracefully."""
        resp = client.post("/api/ai-effects", json={
            "description": "Add floating particles",
            "api_key": "",
        })
        # Should return an error (400 or 500) since no API key
        assert resp.status_code in (400, 500)


class TestAIStyleChat:

    def test_chat_without_api_key(self, client):
        """Style chat without API key should fail gracefully."""
        resp = client.post("/api/ai-style-chat", json={
            "message": "Make it more colorful",
            "api_key": "",
        })
        assert resp.status_code in (400, 500)


# ── Deploy (error cases only — no real deployment) ───────────

class TestDeploy:

    def test_deploy_netlify_empty_html(self, client):
        """Deploying empty HTML should fail."""
        resp = client.post("/api/deploy/netlify", json={"html": ""})
        assert resp.status_code == 500

    def test_deploy_github_pages_missing_token(self, client):
        """Deploying without GitHub token should fail."""
        resp = client.post("/api/deploy/github-pages", json={
            "html": "<html></html>",
            "github_token": "",
        })
        assert resp.status_code == 500
