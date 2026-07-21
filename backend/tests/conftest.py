"""Shared test fixtures for pytest.

Fixtures defined here are automatically available to all test files.
This avoids duplicating test data across multiple test modules.
"""
import pytest
from app.models import (
    ResumeData, WorkExperience, Education,
    PersonalStyle, ProfessionalStyle, GenerateRequest,
)


@pytest.fixture
def minimal_resume():
    """最小有效简历 — 只填必填字段。"""
    return ResumeData(name="Alice", title="Engineer")


@pytest.fixture
def full_resume():
    """完整简历 — 所有字段填满，含双语。"""
    return ResumeData(
        name="Alice",
        title="Senior Engineer",
        email="alice@example.com",
        phone="+1-555-0100",
        bio="Passionate about building great products.",
        avatar_url="https://example.com/avatar.jpg",
        work_experiences=[
            WorkExperience(
                company="Acme Corp",
                position="Senior Engineer",
                duration="2020-2024",
                description="Led frontend team of 5.",
                company_cn="阿克米公司",
                position_cn="高级工程师",
                duration_cn="2020-2024",
                description_cn="带领5人前端团队。",
            )
        ],
        educations=[
            Education(
                school="MIT",
                major="Computer Science",
                duration="2016-2020",
                school_cn="麻省理工",
                major_cn="计算机科学",
                duration_cn="2016-2020",
            )
        ],
        skills=["Python", "React", "TypeScript"],
        hobbies=["Hiking", "Photography"],
        # Bilingual
        name_cn="爱丽丝",
        title_cn="高级工程师",
        bio_cn="热爱打造优秀产品。",
        skills_cn=["Python", "React", "TypeScript"],
        hobbies_cn=["徒步", "摄影"],
    )


@pytest.fixture
def personal_style():
    """默认个性创意风格配置。"""
    return PersonalStyle()


@pytest.fixture
def professional_style():
    """默认职业精英风格配置。"""
    return ProfessionalStyle()


@pytest.fixture
def personal_request(full_resume, personal_style):
    """完整的个人风格生成请求。"""
    return GenerateRequest(
        mode="personal",
        resume=full_resume,
        style=personal_style,
        lang="zh",
    )


@pytest.fixture
def professional_request(full_resume, professional_style):
    """完整的职业精英生成请求。"""
    return GenerateRequest(
        mode="professional",
        resume=full_resume,
        pro_style=professional_style,
        lang="zh",
    )
