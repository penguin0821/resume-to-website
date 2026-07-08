from typing import Optional
from app.models import ResumeData, ProfessionalStyle
from app.generators.i18n import TOGGLE_SCRIPT, TOGGLE_BUTTON, t


def _is_light_bg(hex_color: str) -> bool:
    """Check if a hex color is light (luminance > 0.5)."""
    hex_color = hex_color.lstrip('#')
    if len(hex_color) != 6:
        return False
    r, g, b = int(hex_color[:2], 16) / 255, int(hex_color[2:4], 16) / 255, int(hex_color[4:6], 16) / 255
    luminance = 0.299 * r + 0.587 * g + 0.114 * b
    return luminance > 0.5


PRO_STYLE_PRESETS = {
    "elegant": {
        "accent": "#c9a96e",
        "header_bg": "#1a1a2e",
        "body_bg": "#fafafa",
        "footer_bg": "#1a1a2e",
        "font": "'Helvetica Neue', 'PingFang SC', -apple-system, sans-serif",
        "bar_style": "linear-gradient(90deg, {accent}, #e8d5a3, {accent})",
        "border_style": "#c9a96e",
        "section_color": "#c9a96e",
        "card_bg": "transparent",
        "card_border": "none",
    },
    "minimal": {
        "accent": "#333333",
        "header_bg": "#ffffff",
        "body_bg": "#ffffff",
        "footer_bg": "#f5f5f5",
        "font": "'Inter', 'PingFang SC', sans-serif",
        "bar_style": "#333",
        "border_style": "#e0e0e0",
        "section_color": "#999",
        "card_bg": "transparent",
        "card_border": "none",
    },
    "corporate": {
        "accent": "#1e40af",
        "header_bg": "#0f172a",
        "body_bg": "#f8fafc",
        "footer_bg": "#0f172a",
        "font": "'Segoe UI', 'PingFang SC', Roboto, sans-serif",
        "bar_style": "linear-gradient(90deg, #1e40af, #3b82f6, #1e40af)",
        "border_style": "#1e40af",
        "section_color": "#1e40af",
        "card_bg": "#ffffff",
        "card_border": "1px solid #e2e8f0",
    },
}


def _get_pro_style(style: Optional[ProfessionalStyle] = None) -> dict:
    if style is None:
        style = ProfessionalStyle()
    preset = PRO_STYLE_PRESETS.get(style.ui_style, PRO_STYLE_PRESETS["elegant"])
    accent = style.accent_color or preset.get("accent", "#c9a96e")
    header_bg = style.header_bg or preset.get("header_bg", "#1a1a2e")
    result = dict(preset)
    result["accent"] = accent
    result["header_bg"] = header_bg
    # Expand accent in bar_style
    result["bar_style"] = preset["bar_style"].replace("{accent}", accent)
    result["border_style"] = accent if style.accent_color else preset.get("border_style", accent)
    result["section_color"] = accent if style.accent_color else preset.get("section_color", accent)
    return result


def generate_professional_site(resume: ResumeData, style: Optional[ProfessionalStyle] = None, lang: str = "zh", bilingual: bool = False, ai_effects: list = None) -> str:
    cfg = _get_pro_style(style)
    accent = cfg["accent"]
    header_bg = cfg["header_bg"]
    body_bg = cfg["body_bg"]
    footer_bg = cfg["footer_bg"]
    font_family = cfg["font"]
    bar_style = cfg["bar_style"]
    section_color = cfg["section_color"]
    border_style = cfg["border_style"]
    card_bg = cfg["card_bg"]
    card_border = cfg["card_border"]
    photo_layout = getattr(style, 'photo_layout', '') if style else ''
    content_layout = getattr(style, 'content_layout', 'classic') if style else 'classic'
    # Backward compat: if photo_layout is set and content_layout is default, use photo_layout
    if photo_layout and content_layout == 'classic':
        content_layout = 'poster' if photo_layout == 'poster' else 'classic'
    header_image = getattr(style, 'header_image', '') if style else ''

    name_en = resume.name
    name_cn = resume.name_cn or resume.name
    title_en = resume.title
    title_cn = resume.title_cn or resume.title
    bio_en = resume.bio
    bio_cn = resume.bio_cn or resume.bio

    contact_items = []
    if resume.email:
        contact_items.append(resume.email)
    if resume.phone:
        contact_items.append(resume.phone)
    contact_html = " &nbsp;&nbsp;|&nbsp;&nbsp; ".join(contact_items)

    def _avatar(name, size=100):
        if resume.avatar_url:
            return f'<img src="{resume.avatar_url}" alt="avatar" style="width:{size}px;height:{size}px;border-radius:50%;object-fit:cover;border:3px solid {accent};" />'
        initial = name[0] if name else ""
        return f'<div style="width:{size}px;height:{size}px;border-radius:50%;background:{header_bg};display:flex;align-items:center;justify-content:center;color:{accent};font-size:{int(size*0.4)}px;font-weight:300;border:3px solid {accent};">{initial}</div>'

    def _build_work(lang_code, compact=False):
        if not resume.work_experiences:
            return ""
        label = t("professional_experience")[0] if lang_code == "en" else t("professional_experience")[1]
        items = ""
        for idx, exp in enumerate(resume.work_experiences):
            pos = exp.position if lang_code == "en" else (exp.position_cn or exp.position)
            comp = exp.company if lang_code == "en" else (exp.company_cn or exp.company)
            dur = exp.duration if lang_code == "en" else (exp.duration_cn or exp.duration)
            desc = exp.description if lang_code == "en" else (exp.description_cn or exp.description)
            # Alternating timeline: even items left, odd items right
            is_right = idx % 2 == 0
            if compact or len(resume.work_experiences) < 2:
                # Single column timeline (for sidebar or few items)
                items += f'''
            <div style="position:relative;padding-left:32px;margin-bottom:28px;border-left:2px solid {accent};">
                <div style="position:absolute;left:-7px;top:4px;width:12px;height:12px;background:{accent};border-radius:50%;"></div>
                <h3 style="margin:0 0 2px 0;font-size:{15 if compact else 18}px;color:#1a1a2e;font-weight:600;">{pos}</h3>
                <p style="margin:0 0 2px 0;color:{accent};font-weight:500;letter-spacing:0.5px;">{comp}</p>
                <p style="margin:0 0 6px 0;color:#999;font-size:12px;letter-spacing:1px;">{dur}</p>
                <p style="margin:0;color:#555;line-height:1.6;font-size:{13 if compact else 15}px;">{desc}</p>
            </div>'''
            else:
                # Alternating timeline
                if is_right:
                    items += f'''
            <div style="display:flex;margin-bottom:32px;">
                <div style="flex:1;padding-right:28px;text-align:right;">
                    <h3 style="margin:0 0 2px 0;font-size:18px;color:#1a1a2e;font-weight:600;">{pos}</h3>
                    <p style="margin:0 0 2px 0;color:{accent};font-weight:500;letter-spacing:0.5px;">{comp}</p>
                    <p style="margin:0 0 8px 0;color:#999;font-size:13px;letter-spacing:1px;">{dur}</p>
                    <p style="margin:0;color:#555;line-height:1.7;font-size:15px;">{desc}</p>
                </div>
                <div style="position:relative;width:16px;flex-shrink:0;">
                    <div style="position:absolute;left:50%;top:4px;transform:translateX(-50%);width:14px;height:14px;background:{accent};border-radius:50%;border:3px solid {body_bg};z-index:1;"></div>
                    <div style="position:absolute;left:50%;top:0;bottom:0;transform:translateX(-50%);width:2px;background:{accent}40;"></div>
                </div>
                <div style="flex:1;"></div>
            </div>'''
                else:
                    items += f'''
            <div style="display:flex;margin-bottom:32px;">
                <div style="flex:1;"></div>
                <div style="position:relative;width:16px;flex-shrink:0;">
                    <div style="position:absolute;left:50%;top:4px;transform:translateX(-50%);width:14px;height:14px;background:{accent};border-radius:50%;border:3px solid {body_bg};z-index:1;"></div>
                    <div style="position:absolute;left:50%;top:0;bottom:0;transform:translateX(-50%);width:2px;background:{accent}40;"></div>
                </div>
                <div style="flex:1;padding-left:28px;">
                    <h3 style="margin:0 0 2px 0;font-size:18px;color:#1a1a2e;font-weight:600;">{pos}</h3>
                    <p style="margin:0 0 2px 0;color:{accent};font-weight:500;letter-spacing:0.5px;">{comp}</p>
                    <p style="margin:0 0 8px 0;color:#999;font-size:13px;letter-spacing:1px;">{dur}</p>
                    <p style="margin:0;color:#555;line-height:1.7;font-size:15px;">{desc}</p>
                </div>
            </div>'''
        return f'<section style="margin-bottom:{40 if compact else 56}px;"><h2 style="font-size:{12 if compact else 14}px;letter-spacing:{2 if compact else 3}px;color:{section_color};margin-bottom:{20 if compact else 32}px;font-weight:600;">{label}</h2>{items}</section>'

    def _build_edu(lang_code, compact=False):
        if not resume.educations:
            return ""
        label = t("education")[0] if lang_code == "en" else t("education")[1]
        items = ""
        for edu in resume.educations:
            school = edu.school if lang_code == "en" else (edu.school_cn or edu.school)
            major = edu.major if lang_code == "en" else (edu.major_cn or edu.major)
            dur = edu.duration if lang_code == "en" else (edu.duration_cn or edu.duration)
            items += f'''
            <div style="display:flex;justify-content:space-between;align-items:baseline;padding:{12 if compact else 16}px 0;border-bottom:1px solid #f0f0f0;">
                <div>
                    <h3 style="margin:0;font-size:{14 if compact else 16}px;color:#1a1a2e;font-weight:600;">{school}</h3>
                    <p style="margin:4px 0 0 0;color:#666;font-size:13px;">{major}</p>
                </div>
                <span style="color:#999;font-size:12px;white-space:nowrap;">{dur}</span>
            </div>'''
        return f'<section style="margin-bottom:{40 if compact else 56}px;"><h2 style="font-size:{12 if compact else 14}px;letter-spacing:{2 if compact else 3}px;color:{section_color};margin-bottom:{16 if compact else 24}px;font-weight:600;">{label}</h2>{items}</section>'

    def _build_skills(lang_code, compact=False, dark=False):
        skill_list = resume.skills if lang_code == "en" else (resume.skills_cn if resume.skills_cn else resume.skills)
        if not skill_list:
            return ""
        label = t("core_competencies")[0] if lang_code == "en" else t("core_competencies")[1]
        # Progress bar visualization
        bars = ""
        total = len(skill_list)
        text_color = '#ccc' if dark else '#444'
        bar_bg = 'rgba(255,255,255,0.15)' if dark else '#e8e8e8'
        heading_color = accent if dark else section_color
        for i, s in enumerate(skill_list):
            # Width: first skills wider, last ones slightly shorter for visual interest
            width = min(100, 60 + (total - i) * 6) if total > 1 else 80
            bars += f'''
            <div style="margin-bottom:{8 if compact else 14}px;">
                <div style="display:flex;justify-content:space-between;margin-bottom:3px;">
                    <span style="font-size:{11 if compact else 13}px;color:{text_color};font-weight:500;">{s}</span>
                </div>
                <div style="height:{6 if compact else 8}px;background:{bar_bg};border-radius:4px;overflow:hidden;">
                    <div style="height:100%;width:{width}%;background:{accent};border-radius:4px;"></div>
                </div>
            </div>'''
        return f'<section style="margin-bottom:{40 if compact else 56}px;"><h2 style="font-size:{12 if compact else 14}px;letter-spacing:{2 if compact else 3}px;color:{heading_color};margin-bottom:{16 if compact else 24}px;font-weight:600;">{label}</h2>{bars}</section>'

    def _build_hobbies(lang_code, dark=False):
        hobby_list = resume.hobbies if lang_code == "en" else (resume.hobbies_cn if resume.hobbies_cn else resume.hobbies)
        if not hobby_list:
            return ""
        label = t("interests")[0] if lang_code == "en" else t("interests")[1]
        h_color = '#aaa' if dark else '#666'
        heading_color = accent if dark else section_color
        items = " &nbsp;&middot;&nbsp; ".join(f'<span style="color:{h_color};">{h}</span>' for h in hobby_list)
        return f'<section style="margin-bottom:{40 if dark else 56}px;"><h2 style="font-size:{12 if dark else 14}px;letter-spacing:{2 if dark else 3}px;color:{heading_color};margin-bottom:16px;font-weight:600;">{label}</h2><p style="font-size:14px;line-height:1.8;">{items}</p></section>'

    def _build_full_page(lang_code):
        name = name_en if lang_code == "en" else name_cn
        title = title_en if lang_code == "en" else title_cn
        bio = bio_en if lang_code == "en" else bio_cn
        avatar = _avatar(name)
        profile_label = t("profile_summary")[0] if lang_code == "en" else t("profile_summary")[1]
        footer_label = t("footer_built_with")[0] if lang_code == "en" else t("footer_built_with")[1]
        title_style = 'text-transform:uppercase;' if lang_code == "en" else ''

        # Determine text colors based on header background luminance
        is_light = _is_light_bg(header_bg)
        name_color = '#333333' if is_light else '#ffffff'
        title_shadow = 'text-shadow:0 1px 4px rgba(0,0,0,0.1);' if is_light else 'text-shadow:0 2px 20px rgba(0,0,0,0.3);'
        contact_color = '#666' if is_light else '#aaa'
        subtitle_shadow = 'text-shadow:0 1px 4px rgba(0,0,0,0.08);' if is_light else 'text-shadow:0 1px 10px rgba(0,0,0,0.2);'

        bio_html = f'<section style="margin-bottom:56px;"><h2 style="font-size:14px;letter-spacing:3px;color:{section_color};margin-bottom:16px;font-weight:600;">{profile_label}</h2><p style="font-size:15px;color:#555;line-height:1.9;padding:20px 0;border-bottom:1px solid #f0f0f0;">{bio}</p></section>' if bio else ''

        # === SIDEBAR LAYOUT ===
        if content_layout == 'sidebar':
            sidebar_avatar = _avatar(name, size=100)
            # Contact list for sidebar (vertical)
            sidebar_contact = ""
            if resume.email:
                sidebar_contact += f'<div style="font-size:12px;color:#888;margin-bottom:6px;">&#x2709; {resume.email}</div>'
            if resume.phone:
                sidebar_contact += f'<div style="font-size:12px;color:#888;margin-bottom:6px;">&#x1F4DE; {resume.phone}</div>'

            sidebar_html = f'''
            <aside style="width:280px;flex-shrink:0;background:{header_bg};color:white;padding:40px 24px;min-height:100vh;">
                <div style="text-align:center;margin-bottom:24px;">
                    {sidebar_avatar}
                    <h1 style="font-size:20px;margin:16px 0 4px 0;font-weight:600;letter-spacing:1px;">{name}</h1>
                    <p style="font-size:13px;color:{accent};letter-spacing:2px;margin:0;{title_style}">{title}</p>
                </div>
                <div style="border-top:1px solid rgba(255,255,255,0.15);padding-top:20px;margin-bottom:24px;">
                    {sidebar_contact}
                </div>
                {_build_skills(lang_code, compact=True, dark=True)}
                {_build_hobbies(lang_code, dark=True)}
            </aside>'''

            main_html = f'''
            <div style="flex:1;padding:48px 40px;max-width:calc(100% - 280px);">
                {bio_html}
                {_build_work(lang_code, compact=False)}
                {_build_edu(lang_code, compact=False)}
            </div>'''

            return f'''
        <div style="display:flex;min-height:100vh;">
            {sidebar_html}
            {main_html}
        </div>
        <footer style="text-align:center;padding:24px 20px;background:{footer_bg};color:#666;font-size:12px;letter-spacing:1px;">
            <p style="color:{accent};margin-bottom:4px;">{name}</p>
            <p>{footer_label}</p>
        </footer>'''

        # === POSTER LAYOUT ===
        elif content_layout == 'poster':
            # Banner background: header_image if available, else gradient
            if header_image:
                banner_bg = f"background:url('{header_image}') center/cover no-repeat, linear-gradient(135deg, {header_bg}, {accent}40);"
            elif resume.avatar_url:
                banner_bg = f"background:url('{resume.avatar_url}') center/cover no-repeat;"
            else:
                banner_bg = f"background:linear-gradient(135deg, {header_bg} 0%, {header_bg}dd 60%, {accent}30 100%);"

            # Avatar circle (larger, overlaps banner bottom)
            if resume.avatar_url:
                poster_avatar = (
                    f'<div style="position:absolute;bottom:-55px;left:40px;z-index:2;">'
                    f'<img src="{resume.avatar_url}" alt="avatar" '
                    f'style="width:120px;height:120px;border-radius:50%;object-fit:cover;'
                    f'border:4px solid {body_bg};box-shadow:0 4px 16px rgba(0,0,0,0.2);" />'
                    f'</div>'
                )
            else:
                initial = name[0] if name else ""
                poster_avatar = (
                    f'<div style="position:absolute;bottom:-55px;left:40px;z-index:2;">'
                    f'<div style="width:120px;height:120px;border-radius:50%;'
                    f'background:{header_bg};display:flex;align-items:center;justify-content:center;'
                    f'color:{accent};font-size:48px;font-weight:300;'
                    f'border:4px solid {body_bg};box-shadow:0 4px 16px rgba(0,0,0,0.2);">{initial}</div>'
                    f'</div>'
                )

            header_html = f'''
        <header style="position:relative;">
            <div style="height:280px;{banner_bg}position:relative;overflow:hidden;">
                <div style="position:absolute;inset:0;background:linear-gradient(to right, {header_bg}90 0%, transparent 50%, {header_bg}60 100%);"></div>
                <div style="position:absolute;bottom:0;left:0;right:0;height:80px;background:linear-gradient(to top, {header_bg}cc, transparent);"></div>
            </div>
            {poster_avatar}
            <div style="background:{body_bg};padding:72px 40px 32px 40px;max-width:720px;">
                <h1 style="font-size:32px;margin:0 0 4px 0;color:#1a1a2e;font-weight:700;letter-spacing:1px;">{name}</h1>
                <p style="font-size:16px;color:{accent};letter-spacing:2px;font-weight:500;margin:0 0 12px 0;{title_style}">{title}</p>
                {f'<p style="color:#888;font-size:13px;letter-spacing:1px;margin:0;">{contact_html}</p>' if contact_html else ''}
            </div>
        </header>'''

            return f'''
        {header_html}
        <div style="height:4px;background:{bar_style};"></div>
        <main style="max-width:720px;margin:0 auto;padding:56px 20px;">
            {bio_html}
            {_build_edu(lang_code)}
            {_build_work(lang_code)}
            {_build_skills(lang_code)}
            {_build_hobbies(lang_code)}
        </main>
        <footer style="text-align:center;padding:40px 20px;background:{footer_bg};color:#666;font-size:12px;letter-spacing:1px;">
            <p style="color:{accent};margin-bottom:4px;">{name}</p>
            <p>{footer_label}</p>
        </footer>'''

        # === CLASSIC LAYOUT (default) ===
        else:
            header_html = f'''
        <header style="background:{header_bg};padding:60px 20px;text-align:center;">
            <div style="max-width:720px;margin:0 auto;">
                {avatar}
                <h1 style="font-size:36px;margin:24px 0 4px 0;color:{name_color};font-weight:300;letter-spacing:2px;">{name}</h1>
                <p style="font-size:16px;color:{accent};letter-spacing:3px;font-weight:500;{title_style}">{title}</p>
                {f'<p style="margin-top:16px;color:{contact_color};font-size:13px;letter-spacing:1px;">{contact_html}</p>' if contact_html else ''}
            </div>
        </header>'''

            return f'''
        {header_html}
        <div style="height:4px;background:{bar_style};"></div>
        <main style="max-width:720px;margin:0 auto;padding:56px 20px;">
            {bio_html}
            {_build_edu(lang_code)}
            {_build_work(lang_code)}
            {_build_skills(lang_code)}
            {_build_hobbies(lang_code)}
        </main>
        <footer style="text-align:center;padding:40px 20px;background:{footer_bg};color:#666;font-size:12px;letter-spacing:1px;">
            <p style="color:{accent};margin-bottom:4px;">{name}</p>
            <p>{footer_label}</p>
        </footer>'''

    if bilingual:
        body = f'''
    {TOGGLE_BUTTON}
    <div class="lang-zh">{_build_full_page("zh")}</div>
    <div class="lang-en" style="display:none;">{_build_full_page("en")}</div>'''
        extra_css = ".lang-en { display: none; }"
        script = TOGGLE_SCRIPT
        html_lang = "zh-CN"
        page_title = name_cn
    elif lang == "zh":
        body = _build_full_page("zh")
        extra_css = ""
        script = ""
        html_lang = "zh-CN"
        page_title = name_cn
    else:
        body = _build_full_page("en")
        extra_css = ""
        script = ""
        html_lang = "en"
        page_title = name_en

    # Build AI effects CSS/JS
    ai_css_parts = []
    ai_js_parts = []
    if ai_effects:
        for effect in ai_effects:
            if isinstance(effect, dict):
                ai_css_parts.append(effect.get("css", ""))
                ai_js_parts.append(effect.get("js", ""))
    ai_css = "\n".join(ai_css_parts)
    ai_js = "\n".join(ai_js_parts)

    html = f'''<!DOCTYPE html>
<html lang="{html_lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{page_title}</title>
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{
            font-family: {font_family};
            background: {body_bg};
            color: #333;
            line-height: 1.6;
        }}
        {extra_css}
        {ai_css}
    </style>
    {script}
</head>
<body>
    {body}
    <script>{ai_js}</script>
</body>
</html>'''
    return html
