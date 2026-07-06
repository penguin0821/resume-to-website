from typing import Optional
from app.models import ResumeData, PersonalStyle
from app.generators.i18n import TOGGLE_SCRIPT, TOGGLE_BUTTON, t


STYLE_PRESETS = {
    "cartoon": {
        "border_radius": "20px",
        "font_family": "'Comic Sans MS', 'PingFang SC', cursive, sans-serif",
        "card_shadow": "0 8px 30px rgba(0,0,0,0.12)",
        "heading_decoration": "&#x2728;",
    },
    "minimal": {
        "border_radius": "8px",
        "font_family": "'Helvetica Neue', 'PingFang SC', sans-serif",
        "card_shadow": "0 2px 10px rgba(0,0,0,0.06)",
        "heading_decoration": "",
    },
    "artistic": {
        "border_radius": "12px",
        "font_family": "Georgia, 'STSong', serif",
        "card_shadow": "0 4px 20px rgba(0,0,0,0.1)",
        "heading_decoration": "&#x1F3A8;",
    },
    "retro": {
        "border_radius": "4px",
        "font_family": "'Courier New', 'STFangsong', monospace",
        "card_shadow": "4px 4px 0 rgba(0,0,0,0.2)",
        "heading_decoration": "&#x1F4E0;",
    },
}


def _get_style_config(style: Optional[PersonalStyle] = None):
    if style is None:
        style = PersonalStyle()
    preset = STYLE_PRESETS.get(style.ui_style, STYLE_PRESETS["cartoon"])
    return {
        "primary_color": style.primary_color,
        "border_radius": preset["border_radius"],
        "font_family": preset["font_family"],
        "card_shadow": preset["card_shadow"],
        "heading_decoration": preset["heading_decoration"],
        "bg_image": getattr(style, 'bg_image', ''),
    }


def _hex_to_lighter(hex_color: str, factor: float = 0.9) -> str:
    hex_color = hex_color.lstrip("#")
    r, g, b = int(hex_color[:2], 16), int(hex_color[2:4], 16), int(hex_color[4:6], 16)
    r = int(r + (255 - r) * factor)
    g = int(g + (255 - g) * factor)
    b = int(b + (255 - b) * factor)
    return f"#{r:02x}{g:02x}{b:02x}"


def _render_avatar(resume: ResumeData, name: str) -> str:
    if resume.avatar_url:
        return f'<img src="{resume.avatar_url}" alt="avatar" style="width:120px;height:120px;border-radius:50%;object-fit:cover;border:4px solid white;" />'
    initial = name[0] if name else "?"
    return f'<div style="width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;color:white;font-size:48px;font-weight:bold;border:4px solid white;">{initial}</div>'


def generate_personal_site(resume: ResumeData, style: Optional[PersonalStyle] = None, lang: str = "zh", bilingual: bool = False) -> str:
    cfg = _get_style_config(style)
    bg_image = cfg.get('bg_image', '')
    bg_light = _hex_to_lighter(cfg["primary_color"])
    bg_style = f"background: url('{bg_image}') center/cover no-repeat fixed;" if bg_image else f"background: {bg_light};"
    decor = cfg["heading_decoration"]
    br = cfg["border_radius"]
    cs = cfg["card_shadow"]
    pc = cfg["primary_color"]

    name_en = resume.name
    name_cn = resume.name_cn or resume.name
    title_en = resume.title
    title_cn = resume.title_cn or resume.title
    bio_en = resume.bio
    bio_cn = resume.bio_cn or resume.bio

    contact_items = []
    if resume.email:
        contact_items.append(f'<span>&#x2709;&#xFE0F; {resume.email}</span>')
    if resume.phone:
        contact_items.append(f'<span>&#x1F4DE; {resume.phone}</span>')
    contact_html = " &nbsp;|&nbsp; ".join(contact_items) if contact_items else ""

    avatar_en = _render_avatar(resume, name_en)
    avatar_cn = _render_avatar(resume, name_cn)

    # --- Build section HTML for a given language ---
    def _build_work(lang_code):
        if not resume.work_experiences:
            return ""
        label = t("work_experience")[0] if lang_code == "en" else t("work_experience")[1]
        items = ""
        for exp in resume.work_experiences:
            pos = exp.position if lang_code == "en" else (exp.position_cn or exp.position)
            comp = exp.company if lang_code == "en" else (exp.company_cn or exp.company)
            dur = exp.duration if lang_code == "en" else (exp.duration_cn or exp.duration)
            desc = exp.description if lang_code == "en" else (exp.description_cn or exp.description)
            items += f'''
            <div style="background:white;padding:24px;margin-bottom:16px;border-radius:{br};box-shadow:{cs};">
                <h3 style="margin:0 0 4px 0;font-size:18px;color:#1a1a2e;">{pos}</h3>
                <p style="margin:0 0 4px 0;color:{pc};font-weight:bold;">{comp}</p>
                <p style="margin:0 0 8px 0;color:#999;font-size:14px;">{dur}</p>
                <p style="margin:0;color:#555;line-height:1.6;">{desc}</p>
            </div>'''
        return f'<section style="margin-bottom:48px;"><h2 style="font-size:28px;color:#1a1a2e;margin-bottom:24px;">{decor} {label}</h2>{items}</section>'

    def _build_edu(lang_code):
        if not resume.educations:
            return ""
        label = t("education")[0] if lang_code == "en" else t("education")[1]
        items = ""
        for edu in resume.educations:
            school = edu.school if lang_code == "en" else (edu.school_cn or edu.school)
            major = edu.major if lang_code == "en" else (edu.major_cn or edu.major)
            dur = edu.duration if lang_code == "en" else (edu.duration_cn or edu.duration)
            items += f'''
            <div style="background:white;padding:24px;margin-bottom:16px;border-radius:{br};box-shadow:{cs};">
                <h3 style="margin:0 0 4px 0;font-size:18px;color:#1a1a2e;">{school}</h3>
                <p style="margin:0 0 4px 0;color:{pc};">{major}</p>
                <p style="margin:0;color:#999;font-size:14px;">{dur}</p>
            </div>'''
        return f'<section style="margin-bottom:48px;"><h2 style="font-size:28px;color:#1a1a2e;margin-bottom:24px;">{decor} {label}</h2>{items}</section>'

    def _build_skills(lang_code):
        if lang_code == "en":
            skill_list = resume.skills
        else:
            skill_list = resume.skills_cn if resume.skills_cn else resume.skills
        if not skill_list:
            return ""
        label = t("skills")[0] if lang_code == "en" else t("skills")[1]
        tags = "".join(f'<span style="display:inline-block;background:{pc};color:white;padding:8px 20px;margin:6px;border-radius:{br};font-size:14px;">{s}</span>' for s in skill_list)
        return f'<section style="margin-bottom:48px;"><h2 style="font-size:28px;color:#1a1a2e;margin-bottom:24px;">{decor} {label}</h2><div style="display:flex;flex-wrap:wrap;gap:4px;">{tags}</div></section>'

    def _build_hobbies(lang_code):
        if lang_code == "en":
            hobby_list = resume.hobbies
        else:
            hobby_list = resume.hobbies_cn if resume.hobbies_cn else resume.hobbies
        if not hobby_list:
            return ""
        label = t("hobbies")[0] if lang_code == "en" else t("hobbies")[1]
        tags = "".join(f'<span style="display:inline-block;background:white;padding:10px 20px;margin:6px;border-radius:{br};border:2px solid {pc};color:{pc};">{h}</span>' for h in hobby_list)
        return f'<section style="margin-bottom:48px;"><h2 style="font-size:28px;color:#1a1a2e;margin-bottom:24px;">{decor} {label}</h2><div style="display:flex;flex-wrap:wrap;gap:4px;">{tags}</div></section>'

    def _build_full_page(lang_code):
        name = name_en if lang_code == "en" else name_cn
        title = title_en if lang_code == "en" else title_cn
        bio = bio_en if lang_code == "en" else bio_cn
        avatar = avatar_en if lang_code == "en" else avatar_cn
        about_label = t("about_me")[0] if lang_code == "en" else t("about_me")[1]
        footer_label = t("footer_built_with")[0] if lang_code == "en" else t("footer_built_with")[1]
        return f'''
        <header style="background:{pc};padding:60px 20px;text-align:center;color:white;">
            <div style="max-width:800px;margin:0 auto;">
                {avatar}
                <h1 style="font-size:42px;margin:20px 0 8px 0;">{name}</h1>
                <p style="font-size:20px;opacity:0.9;">{title}</p>
                {f'<p style="margin-top:12px;opacity:0.8;font-size:14px;">{contact_html}</p>' if contact_html else ''}
            </div>
        </header>
        <main style="max-width:800px;margin:0 auto;padding:48px 20px;">
            {f'<section style="margin-bottom:48px;"><h2 style="font-size:28px;color:#1a1a2e;margin-bottom:16px;">{decor} {about_label}</h2><p style="font-size:16px;color:#555;line-height:1.8;background:white;padding:24px;border-radius:{br};box-shadow:{cs};">{bio}</p></section>' if bio else ''}
            {_build_work(lang_code)}
            {_build_edu(lang_code)}
            {_build_skills(lang_code)}
            {_build_hobbies(lang_code)}
        </main>
        <footer style="text-align:center;padding:32px;color:#999;font-size:14px;">
            <p>{footer_label} | {name} &copy; 2026</p>
        </footer>'''

    # --- Assemble HTML ---
    if bilingual:
        # Two versions, toggle between them
        body = f'''
    {TOGGLE_BUTTON}
    <div class="lang-zh">{_build_full_page("zh")}</div>
    <div class="lang-en" style="display:none;">{_build_full_page("en")}</div>'''
        extra_css = ".lang-en { display: none; }"
        script = TOGGLE_SCRIPT
        html_lang = "zh-CN"
        page_title = name_cn
    elif lang == "zh":
        # Chinese only
        body = _build_full_page("zh")
        extra_css = ""
        script = ""
        html_lang = "zh-CN"
        page_title = name_cn
    else:
        # English only
        body = _build_full_page("en")
        extra_css = ""
        script = ""
        html_lang = "en"
        page_title = name_en

    html = f'''<!DOCTYPE html>
<html lang="{html_lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{page_title}</title>
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{
            font-family: {cfg['font_family']};
            {bg_style}
            color: #333;
            line-height: 1.6;
        }}
        {extra_css}
    </style>
    {script}
</head>
<body>
    {body}
</body>
</html>'''
    return html
