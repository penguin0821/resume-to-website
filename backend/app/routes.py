from fastapi import APIRouter
from app.models import GenerateRequest
from app.generators.personal import generate_personal_site
from app.generators.professional import generate_professional_site

router = APIRouter()


@router.post("/api/generate")
def generate_site(request: GenerateRequest):
    # Determine if bilingual: user has Chinese fields filled in
    r = request.resume
    has_cn = bool(r.name_cn or r.title_cn or r.bio_cn)
    bilingual = has_cn  # Only bilingual if Chinese content exists

    if request.mode == "personal":
        html = generate_personal_site(r, request.style, lang=request.lang, bilingual=bilingual)
    else:
        html = generate_professional_site(r, lang=request.lang, bilingual=bilingual)
    return {"html": html, "mode": request.mode}
