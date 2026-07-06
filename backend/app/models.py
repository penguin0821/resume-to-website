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
    """\u4e2a\u6027\u5316\u6a21\u5f0f\u98ce\u683c\u914d\u7f6e"""
    keywords: list[str] = []
    primary_color: str = "#6366f1"
    ui_style: str = "cartoon"  # cartoon / minimal / artistic / retro
    bg_image: str = ""  # base64 data URL or image URL


class GenerateRequest(BaseModel):
    mode: str  # "personal" or "professional"
    resume: ResumeData
    style: Optional[PersonalStyle] = None
    lang: str = "zh"  # "zh" or "en" - UI language
