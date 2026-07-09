from pydantic import BaseModel
from typing import Optional


class WorkExperience(BaseModel):
    company: str
    position: str
    duration: str
    description: str
    company_cn: str = ""
    position_cn: str = ""
    duration_cn: str = ""
    description_cn: str = ""


class Education(BaseModel):
    school: str
    major: str
    duration: str
    school_cn: str = ""
    major_cn: str = ""
    duration_cn: str = ""
    school_logo: str = ""  # base64 or URL for school logo/badge


class ResumeData(BaseModel):
    name: str
    title: str
    email: str = ""
    phone: str = ""
    bio: str = ""
    avatar_url: str = ""
    work_experiences: list[WorkExperience] = []
    educations: list[Education] = []
    skills: list[str] = []
    hobbies: list[str] = []
    # Bilingual fields
    name_cn: str = ""
    title_cn: str = ""
    bio_cn: str = ""
    skills_cn: list[str] = []
    hobbies_cn: list[str] = []


class PersonalStyle(BaseModel):
    """个性化模式风格配置"""
    keywords: list[str] = []
    primary_color: str = "#6366f1"
    primary_colors: list[str] = []  # legacy: up to 2 primary colors
    extra_colors: list[str] = []  # legacy: secondary colors
    effect_colors: dict = {}  # NEW: per-effect color arrays e.g. {"solid": ["#xxx"], "gradient": [...], "shadow": [...], "accent": [...], "splice": [...]}
    color_effect: str = "solid"   # legacy single effect (backward compat)
    color_effects: list[str] = ["solid"]  # multiple effects e.g. ["gradient", "shadow"]
    splice_direction: str = "horizontal"  # horizontal / diagonal
    splice_repeat: bool = False  # interval repeat pattern
    accent_pattern: str = "dots"  # dots/clover/hollow/coin/star/star4/diamond/cross/heart/wave
    accent_layout: str = "even"  # even / random
    ui_style: str = "cartoon"  # cartoon / minimal / artistic / retro
    bg_image: str = ""  # base64 data URL or image URL
    timeline_style: str = "alternate"  # alternate / linear
    section_order: list[str] = []  # e.g. ["bio","education","work","skills","hobbies"]


class ProfessionalStyle(BaseModel):
    """职业精英模式风格配置"""
    accent_color: str = "#c9a96e"  # gold accent
    header_bg: str = "#1a1a2e"     # dark header bg
    ui_style: str = "elegant"      # elegant / minimal / corporate
    keywords: list[str] = []
    content_layout: str = "classic"  # classic / poster / sidebar
    photo_layout: str = ""  # legacy alias for content_layout (backward compat)
    header_image: str = ""  # base64 or URL for poster banner background
    timeline_style: str = "alternate"  # alternate / linear
    section_order: list[str] = []  # e.g. ["bio","education","work","skills","hobbies"]


class GenerateRequest(BaseModel):
    mode: str  # "personal" or "professional"
    resume: ResumeData
    style: Optional[PersonalStyle] = None
    pro_style: Optional[ProfessionalStyle] = None  # professional style config
    lang: str = "zh"  # "zh" or "en" - UI language
    ai_effects: list = []  # list of {"css": "...", "js": "...", "description": "..."}
    section_order: list[str] = []  # override section order for both styles


class AIEffectRequest(BaseModel):
    description: str
    api_key: str = ""


class AIEffectResponse(BaseModel):
    css: str = ""
    js: str = ""
    description: str = ""


class AIStyleChatRequest(BaseModel):
    message: str  # user's natural language message
    api_key: str = ""
    mode: str = "personal"  # personal or professional
    current_style: dict = {}  # current style parameters
    conversation: list = []  # previous messages [{"role": "user/ai", "content": "..."}]


class AIStyleChatResponse(BaseModel):
    reply: str = ""  # AI's natural language reply
    style_updates: dict = {}  # suggested style parameter changes
    effect: dict = {}  # optional effect {css, js, description}
    applied: bool = False  # whether changes were auto-applied


class DeployNetlifyRequest(BaseModel):
    html: str


class DeployGitHubPagesRequest(BaseModel):
    html: str
    github_token: str
    repo_name: str = "my-resume-site"
