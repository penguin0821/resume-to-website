"""Professional / elite resume-site generator.

Rebuilt on the shared design system. Three presets (executive / swiss / poster)
define palette + typography + decoration; the ``content_layout`` control
(classic / poster / sidebar) defines page structure. Both are independent so the
user can mix, e.g. swiss palette with a sidebar structure.
"""
from typing import Optional

from app.models import ResumeData, ProfessionalStyle
from app.generators.i18n import TOGGLE_SCRIPT, TOGGLE_BUTTON, t
from app.generators.utils import escape_html as _escape, sanitize_url as _sanitize_url
from app.generators.design_system import (
    font_stack, render_base_css, render_reveal_js, render_head_meta,
)

DEFAULT_PRESET = "executive"
_LEGACY_MAP = {
    "elegant": "executive", "minimal": "swiss", "corporate": "executive",
    "executive": "executive", "swiss": "swiss", "poster": "poster",
}

PRO_PRESETS = {
    "executive": {
        "fonts": ("Source Serif 4", "Inter"),
        "fd": font_stack("Source Serif 4"),
        "fb": font_stack("Inter"),
        "bg": "#FFFFFF",
        "surface": "#FBFAF8",
        "text": "#14213D",
        "muted": "#5A6478",
        "line": "#E4E7EF",
        "accent": "#B08D57",
        "accent2": "#14213D",
        "side_bg": "#14213D",
        "side_fg": "#F4F1EA",
        "extra_css": """
.hero { text-align: center; }
.hero-split { grid-template-columns: 1fr; justify-items: center; gap: var(--space-4); }
.display { font-weight: 600; }
.contact-row { justify-content: center; }
.section-title { font-family: var(--font-display); }
.side { background: #14213D; color: #F4F1EA; }
.side .micro-label, .side .section-title { color: #E7CDA3; }
.side .side-title { color: #C9A96E; }
.side .contact-row a, .side .contact-row span { color: rgba(244,241,234,.82); }
.side .skill-name { color: #F4F1EA; }
.side .bar { background: rgba(255,255,255,.18); }
.side .bar-fill { background: #C9A96E; }
.side .tag { background: rgba(255,255,255,.08); border-color: rgba(255,255,255,.2); color: #F4F1EA; }
""",
    },
    "swiss": {
        "fonts": ("Inter",),
        "fd": font_stack("Inter"),
        "fb": font_stack("Inter"),
        "bg": "#FFFFFF",
        "surface": "#FFFFFF",
        "text": "#111111",
        "muted": "#555555",
        "line": "#111111",
        "accent": "#D40000",
        "accent2": "#111111",
        "side_bg": "#111111",
        "side_fg": "#FFFFFF",
        "extra_css": """
.hero { border-bottom: 2px solid var(--text); }
.hero-split { grid-template-columns: 1fr auto; align-items: end; }
.display { font-weight: 800; letter-spacing: -0.045em; text-transform: lowercase; }
.micro-label { color: var(--text); font-weight: 700; }
.section { border-top: 1px solid var(--text); }
.section-title { text-transform: uppercase; font-weight: 700; letter-spacing: -0.01em; }
.card { border: 1px solid var(--text); border-radius: 0; }
.card:hover { transform: none; box-shadow: 4px 4px 0 var(--accent); }
.tag { border-radius: 0; border: 1px solid var(--text); }
.bar { border-radius: 0; height: 8px; background: #ECECEC; }
.bar-fill { border-radius: 0; background: var(--accent); }
.avatar, .avatar-fallback { border-radius: 0; border: 2px solid var(--text); }
.side { background: #111111; color: #FFFFFF; }
.side .micro-label, .side .section-title { color: #FFFFFF; }
.side .side-title { color: #FF4B4B; }
.side .contact-row a, .side .contact-row span { color: rgba(255,255,255,.8); }
.side .skill-name { color: #FFFFFF; }
.side .bar { background: rgba(255,255,255,.2); }
.side .section { border-top: 1px solid rgba(255,255,255,.25); }
""",
    },
    "poster": {
        "fonts": ("Playfair Display", "Inter"),
        "fd": font_stack("Playfair Display"),
        "fb": font_stack("Inter"),
        "bg": "#0E0E10",
        "surface": "#17171A",
        "text": "#F5F2EC",
        "muted": "#A9A49B",
        "line": "rgba(255,255,255,.13)",
        "accent": "#C8A15A",
        "accent2": "#F5F2EC",
        "side_bg": "#17171A",
        "side_fg": "#F5F2EC",
        "extra_css": """
.display { font-weight: 700; }
.section-title { font-family: var(--font-display); font-weight: 600; }
.card { background: var(--surface); border: 1px solid var(--line); }
.poster-banner { position: relative; min-height: 340px; display: flex; align-items: flex-end; overflow: hidden; }
.poster-banner .scrim { position: absolute; inset: 0; background: linear-gradient(to top, rgba(14,14,16,.94) 6%, rgba(14,14,16,.45) 55%, rgba(14,14,16,.15) 100%); }
.poster-banner .banner-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.poster-inner { position: relative; z-index: 1; }
.side { background: #17171A; color: #F5F2EC; }
.side .micro-label, .side .section-title { color: #C8A15A; }
.side .side-title { color: #C8A15A; }
.side .contact-row a, .side .contact-row span { color: rgba(245,242,236,.8); }
.side .skill-name { color: #F5F2EC; }
.side .bar { background: rgba(255,255,255,.16); }
.side .section { border-top: 1px solid rgba(255,255,255,.14); }
""",
    },
}


def _icon(name: str) -> str:
    paths = {
        "mail": '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
        "phone": '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/>',
    }
    inner = paths.get(name, "")
    return ('<svg class="icon" width="15" height="15" viewBox="0 0 24 24" fill="none" '
            'stroke="currentColor" stroke-width="1.7" stroke-linecap="round" '
            f'stroke-linejoin="round" aria-hidden="true">{inner}</svg>')


def _avatar_html(resume: ResumeData, name: str, cls: str = "avatar") -> str:
    safe_url = _sanitize_url(resume.avatar_url)
    if safe_url:
        return f'<img class="{cls}" src="{safe_url}" alt="{_escape(name)}">'
    initial = _escape(name[0]) if name else "?"
    return f'<div class="avatar-fallback" aria-hidden="true">{initial}</div>'


def generate_professional_site(resume: ResumeData, style: Optional[ProfessionalStyle] = None,
                               lang: str = "zh", bilingual: bool = False,
                               ai_effects: list = None) -> str:
    if style is None:
        style = ProfessionalStyle()

    preset_id = _LEGACY_MAP.get(getattr(style, "ui_style", "") or "", DEFAULT_PRESET)
    preset = PRO_PRESETS[preset_id]

    tokens = {k: preset[k] for k in ("fd", "fb", "fonts", "bg", "surface", "text",
                                     "muted", "line", "accent", "accent2")}

    # User colour overrides
    accent_color = getattr(style, "accent_color", "") or ""
    if accent_color:
        tokens["accent"] = accent_color
    header_bg = getattr(style, "header_bg", "") or ""

    # Layout resolution (with legacy photo_layout alias)
    content_layout = getattr(style, "content_layout", "classic") or "classic"
    photo_layout = getattr(style, "photo_layout", "") or ""
    if photo_layout and content_layout == "classic":
        content_layout = "poster" if photo_layout == "poster" else "classic"
    if content_layout not in ("classic", "poster", "sidebar"):
        content_layout = "classic"

    timeline_style = getattr(style, "timeline_style", "linear") or "linear"
    section_order = getattr(style, "section_order", []) or []
    header_image = _sanitize_url(getattr(style, "header_image", ""))
    dark_mode = getattr(style, "dark_mode", False)

    name_en, name_cn = _escape(resume.name), _escape(resume.name_cn or resume.name)
    title_en, title_cn = _escape(resume.title), _escape(resume.title_cn or resume.title)
    bio_en, bio_cn = _escape(resume.bio), _escape(resume.bio_cn or resume.bio)

    def _contact(vertical=False):
        items = []
        if resume.email:
            items.append(f'<a href="mailto:{_escape(resume.email)}">{_icon("mail")}<span>{_escape(resume.email)}</span></a>')
        if resume.phone:
            items.append(f'<span>{_icon("phone")}{_escape(resume.phone)}</span>')
        return f'<div class="contact-row">{"".join(items)}</div>' if items else ""

    # ---- section builders ----
    def _bio(lc, num=None):
        bio = bio_en if lc == "en" else bio_cn
        if not bio:
            return ""
        label = t("profile_summary")[0] if lc == "en" else t("profile_summary")[1]
        n = f'<span class="num">{num}</span>' if num else ""
        return f'''
        <section class="section reveal">
          <div class="section-head">{n}<h2 class="section-title">{label}</h2></div>
          <p class="lead">{bio}</p>
        </section>'''

    def _work(lc, num=None):
        if not resume.work_experiences:
            return ""
        label = t("professional_experience")[0] if lc == "en" else t("professional_experience")[1]
        total = len(resume.work_experiences)
        items = ""
        for exp in resume.work_experiences:
            pos = _escape(exp.position if lc == "en" else (exp.position_cn or exp.position))
            comp = _escape(exp.company if lc == "en" else (exp.company_cn or exp.company))
            dur = _escape(exp.duration if lc == "en" else (exp.duration_cn or exp.duration))
            desc = _escape(exp.description if lc == "en" else (exp.description_cn or exp.description))
            items += f'''
          <div class="timeline-item">
            <h3>{pos}</h3>
            <div class="meta">{comp} &nbsp;&middot;&nbsp; {dur}</div>
            <p>{desc}</p>
          </div>'''
        alt = "timeline timeline--alt" if (total >= 2 and timeline_style == "alternate") else "timeline"
        n = f'<span class="num">{num}</span>' if num else ""
        return f'''
        <section class="section reveal">
          <div class="section-head">{n}<h2 class="section-title">{label}</h2></div>
          <div class="{alt}">{items}
          </div>
        </section>'''

    def _edu(lc, num=None):
        if not resume.educations:
            return ""
        label = t("education")[0] if lc == "en" else t("education")[1]
        rows = ""
        for edu in resume.educations:
            school = _escape(edu.school if lc == "en" else (edu.school_cn or edu.school))
            major = _escape(edu.major if lc == "en" else (edu.major_cn or edu.major))
            dur = _escape(edu.duration if lc == "en" else (edu.duration_cn or edu.duration))
            safe_logo = _sanitize_url(edu.school_logo)
            logo = f'<img class="edu-logo" src="{safe_logo}" alt="">' if safe_logo else ""
            rows += f'''
          <div class="edu-head" style="padding:var(--space-4) 0;border-bottom:1px solid var(--line);">
            {logo}
            <div style="flex:1;"><h3 class="section-title" style="font-size:1.02rem;">{school}</h3>
            <div style="color:var(--muted);font-size:.9rem;margin-top:2px;">{major}</div></div>
            <span class="micro-label" style="align-self:center;">{dur}</span>
          </div>'''
        n = f'<span class="num">{num}</span>' if num else ""
        return f'''
        <section class="section reveal">
          <div class="section-head">{n}<h2 class="section-title">{label}</h2></div>
          <div>{rows}
          </div>
        </section>'''

    def _skills(lc, num=None, compact=False):
        skill_list = resume.skills if lc == "en" else (resume.skills_cn or resume.skills)
        if not skill_list:
            return ""
        label = t("core_competencies")[0] if lc == "en" else t("core_competencies")[1]
        bars = ""
        for i, s in enumerate(skill_list):
            pct = min(98, 66 + (len(skill_list) - i) * 5) if len(skill_list) > 1 else 82
            bars += f'''
          <div class="skill">
            <div class="skill-top"><span class="skill-name">{_escape(s)}</span>{"" if compact else f'<span class="skill-pct">{pct}%</span>'}</div>
            <div class="bar"><div class="bar-fill" style="width:{pct}%;"></div></div>
          </div>'''
        n = f'<span class="num">{num}</span>' if num else ""
        return f'''
        <section class="section reveal">
          <div class="section-head">{n}<h2 class="section-title">{label}</h2></div>
          <div>{bars}
          </div>
        </section>'''

    def _hobbies(lc, num=None):
        hobby_list = resume.hobbies if lc == "en" else (resume.hobbies_cn or resume.hobbies)
        if not hobby_list:
            return ""
        label = t("interests")[0] if lc == "en" else t("interests")[1]
        tags = "".join(f'<span class="tag">{_escape(h)}</span>' for h in hobby_list)
        n = f'<span class="num">{num}</span>' if num else ""
        return f'''
        <section class="section reveal">
          <div class="section-head">{n}<h2 class="section-title">{label}</h2></div>
          <div class="tag-row">{tags}</div>
        </section>'''

    def _ordered(lc, exclude=None, start=1):
        exclude = exclude or []
        default_order = ["bio", "work", "education", "skills", "hobbies"]
        order = section_order or default_order
        builders = {"bio": _bio, "work": _work, "education": _edu,
                    "skills": _skills, "hobbies": _hobbies}
        out, num = "", start
        for key in order:
            if key in exclude or key not in builders:
                continue
            out += builders[key](lc, f"{num:02d}")
            num += 1
        return out

    def _footer(lc, name):
        footer_label = t("footer_built_with")[0] if lc == "en" else t("footer_built_with")[1]
        return f'''
      <footer class="footer"><div class="wrap">{name} &nbsp;&middot;&nbsp; {footer_label} &nbsp;&copy;&nbsp; 2026</div></footer>'''

    def _build_page(lc):
        name = name_en if lc == "en" else name_cn
        title = title_en if lc == "en" else title_cn
        avatar = _avatar_html(resume, name)
        contact = _contact()

        # ===== SIDEBAR =====
        if content_layout == "sidebar":
            aside = f'''
        <aside class="side">
          <div class="side-id">
            {avatar}
            <h1>{name}</h1>
            <div class="side-title">{title}</div>
          </div>
          {contact}
          {_skills(lc, compact=True)}
          {_hobbies(lc)}
        </aside>'''
            main = f'''
        <div class="side-main">
          {_ordered(lc, exclude=["skills", "hobbies"])}
        </div>'''
            return f'''
      <div class="shell">{aside}{main}
      </div>{_footer(lc, name)}'''

        # ===== POSTER =====
        if content_layout == "poster":
            banner_img = header_image or (_sanitize_url(resume.avatar_url) or "")
            if banner_img:
                bg_layer = f'<img class="banner-img" src="{banner_img}" alt="">'
            else:
                bg_layer = f'<div class="banner-img" style="background:linear-gradient(135deg,{preset["side_bg"]},{tokens["accent"]}55);"></div>'
            header_html = f'''
        <header class="poster-banner">
          {bg_layer}
          <div class="scrim"></div>
          <div class="wrap poster-inner" style="padding-top:var(--space-9);padding-bottom:var(--space-7);">
            <p class="micro-label" style="color:var(--accent);">{title}</p>
            <h1 class="display">{name}</h1>
            {contact}
          </div>
        </header>'''
            return f'''
      {header_html}
      <main class="wrap">{_ordered(lc)}
      </main>{_footer(lc, name)}'''

        # ===== CLASSIC (default) =====
        header_html = f'''
        <header class="hero">
          <div class="wrap hero-split">
            <div class="hero-main reveal in">
              <p class="micro-label">{title}</p>
              <h1 class="display">{name}</h1>
              {contact}
            </div>
            <div class="hero-side reveal in">{avatar}</div>
          </div>
        </header>'''
        return f'''
      <div class="accent-bar" style="background:linear-gradient(90deg,{tokens["accent"]},{tokens["accent2"]});"></div>
      {header_html}
      <main class="wrap">{_ordered(lc)}
      </main>{_footer(lc, name)}'''

    # ---- language assembly ----
    if bilingual:
        body = f'''{TOGGLE_BUTTON}
    <div class="lang-zh">{_build_page("zh")}</div>
    <div class="lang-en" style="display:none;">{_build_page("en")}</div>'''
        lang_css = ".lang-en { display: none; }"
        script = TOGGLE_SCRIPT
        html_lang = "zh-CN"
        page_title = name_cn
    else:
        lc = "zh" if lang == "zh" else "en"
        body = _build_page(lc)
        lang_css = ""
        script = ""
        html_lang = "zh-CN" if lang == "zh" else "en"
        page_title = name_cn if lang == "zh" else name_en

    dark_css = ""
    if dark_mode:
        dark_css = """
@media (prefers-color-scheme: dark) {
  :root { --bg:#0E0E10; --surface:#17171A; --text:#F2EDE7; --muted:#A9A49B; --line:rgba(255,255,255,.13); }
}
"""

    ai_css_parts, ai_js_parts = [], []
    for effect in (ai_effects or []):
        if isinstance(effect, dict):
            ai_css_parts.append(effect.get("css", ""))
            ai_js_parts.append(effect.get("js", ""))
    ai_css = "\n".join(ai_css_parts)
    ai_js = "\n".join(ai_js_parts)

    tokens["extra_css"] = (preset["extra_css"] + "\n" + lang_css + "\n" + dark_css + "\n" + ai_css)
    base_css = render_base_css(tokens)

    seo_desc = (bio_en or f"{name_en} - {title_en}")[:160]
    avatar_url_safe = _sanitize_url(resume.avatar_url) if resume.avatar_url else ""
    head_meta = render_head_meta(page_title, seo_desc, avatar_url_safe)

    return f'''<!DOCTYPE html>
<html lang="{html_lang}">
<head>
{head_meta}<style>
{base_css}</style>
{script}
</head>
<body class="preset-{preset_id} layout-{content_layout}">
<div class="site">
{body}
</div>
<div id="ai-effect-container" style="position:fixed;inset:0;pointer-events:none;z-index:900;overflow:hidden;"></div>
{render_reveal_js()}
<script>{ai_js}</script>
</body>
</html>'''
