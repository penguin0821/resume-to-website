from fastapi import APIRouter, HTTPException
from app.models import (
    GenerateRequest, AIEffectRequest, AIEffectResponse,
    DeployNetlifyRequest, DeployGitHubPagesRequest,
)
from app.generators.personal import generate_personal_site
from app.generators.professional import generate_professional_site
from app.ai_service import generate_effects

router = APIRouter()


@router.post("/api/generate")
def generate_site(request: GenerateRequest):
    r = request.resume
    has_cn = bool(r.name_cn or r.title_cn or r.bio_cn)
    bilingual = has_cn

    if request.mode == "personal":
        html = generate_personal_site(
            r, request.style,
            lang=request.lang, bilingual=bilingual,
            ai_effects=request.ai_effects,
        )
    else:
        html = generate_professional_site(
            r, style=request.pro_style, lang=request.lang, bilingual=bilingual,
            ai_effects=request.ai_effects,
        )
    return {"html": html, "mode": request.mode}


@router.post("/api/ai-effects")
def ai_effects(request: AIEffectRequest):
    try:
        result = generate_effects(request.description, api_key=request.api_key or None)
        return AIEffectResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")


@router.post("/api/deploy/netlify")
def deploy_netlify(request: DeployNetlifyRequest):
    from app.deploy_service import deploy_to_netlify
    try:
        url = deploy_to_netlify(request.html)
        return {"url": url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Deploy failed: {str(e)}")


@router.post("/api/deploy/github-pages")
def deploy_github_pages(request: DeployGitHubPagesRequest):
    from app.deploy_service import deploy_to_github_pages
    try:
        url = deploy_to_github_pages(request.html, request.github_token, request.repo_name)
        return {"url": url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Deploy failed: {str(e)}")
