"""Personal / creative resume-site generator.

Rebuilt on top of the shared design system: semantic HTML + component classes
instead of string-concatenated inline styles. Each preset is a set of design
tokens (fonts, palette) plus a layout variant expressed in CSS. The multi-effect
colour system (solid / gradient / shadow / accent / splice) maps onto tokens and
decorative layers so the output looks like a designed product.
"""
from typing import Optional
import math
import random as _rnd

from app.models import ResumeData, PersonalStyle
from app.generators.i18n import TOGGLE_SCRIPT, TOGGLE_BUTTON, t
from app.generators.utils import escape_html as _escape, sanitize_url as _sanitize_url
from app.generators.design_system import (
    font_stack, render_base_css, render_reveal_js, render_head_meta,
)

DEFAULT_PRESET = "editorial"
# Old ids still accepted (bookmarks / saved drafts / AI chat) -> new preset.
_LEGACY_MAP = {
    "cartoon": "editorial", "minimal": "studio",
    "artistic": "aurora", "retro": "editorial",
    "editorial": "editorial", "studio": "studio", "aurora": "aurora",
}

PERSONAL_PRESETS = {
    "editorial": {
        "fonts": ("Fraunces", "Inter"),
        "fd": font_stack("Fraunces"),
        "fb": font_stack("Inter"),
        "bg": "#FAF7F2",
        "surface": "#FFFFFF",
        "text": "#1C1917",
        "muted": "#6B625B",
        "line": "#E7DFD4",
        "accent": "#C4552D",
        "accent2": "#8A6F4D",
        "extra_css": """
.hero { padding-bottom: var(--space-7); }
.hero-split { grid-template-columns: 1.5fr .5fr; align-items: end; }
.hero-side { justify-content: flex-end; }
.display { font-weight: 600; }
.section:first-of-type { border-top: none; }
.card { border-radius: 4px; }
.tag { border-radius: 2px; }
.timeline-item h3 { font-family: var(--font-display); font-weight: 600; }
""",
    },
    "studio": {
        "fonts": ("Space Grotesk",),
        "fd": font_stack("Space Grotesk"),
        "fb": font_stack("Space Grotesk"),
        "bg": "#F2F2F0",
        "surface": "#FFFFFF",
        "text": "#111111",
        "muted": "#5A5A57",
        "line": "#111111",
        "accent": "#FF4D00",
        "accent2": "#111111",
        "extra_css": """
.hero { border-bottom: 3px solid var(--text); padding-bottom: var(--space-6); }
.hero-split { grid-template-columns: 1fr auto; align-items: end; }
.display { font-size: clamp(3rem, 11vw, 7.5rem); text-transform: uppercase; letter-spacing: -0.04em; line-height: .88; }
.hero-side .avatar, .hero-side .avatar-fallback { border-radius: 0; border: 3px solid var(--text); box-shadow: 10px 10px 0 var(--accent); }
.section { border-top: 2px solid var(--text); }
.section-title { text-transform: uppercase; }
.micro-label { color: var(--text); }
.card { border: 2px solid var(--text); border-radius: 0; box-shadow: 6px 6px 0 var(--accent); }
.card:hover { transform: translate(-3px, -3px); box-shadow: 9px 9px 0 var(--accent); }
.tag { border: 2px solid var(--text); border-radius: 0; font-weight: 600; }
.bar { border-radius: 0; height: 10px; background: #dddcd8; }
.bar-fill { border-radius: 0; }
""",
    },
    "aurora": {
        "fonts": ("Sora",),
        "fd": font_stack("Sora"),
        "fb": font_stack("Sora"),
        "bg": "#F6F7FC",
        "surface": "rgba(255,255,255,.62)",
        "text": "#141824",
        "muted": "#5B6478",
        "line": "rgba(20,24,36,.10)",
        "accent": "#0D9488",
        "accent2": "#6366F1",
        "extra_css": """
body {
  background:
    radial-gradient(1100px 620px at 8% -12%, rgba(45,212,191,.30), transparent 58%),
    radial-gradient(1000px 700px at 102% -4%, rgba(129,140,248,.28), transparent 55%),
    radial-gradient(900px 620px at 50% 118%, rgba(253,186,116,.26), transparent 55%),
    var(--bg);
  background-attachment: fixed;
}
.hero { text-align: center; }
.hero-split { grid-template-columns: 1fr; justify-items: center; gap: var(--space-5); }
.hero-side { order: -1; }
.hero .lead { margin-inline: auto; }
.contact-row { justify-content: center; }
.card { background: var(--surface); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,.7); border-radius: var(--radius-lg); box-shadow: var(--shadow-md); }
.tag { background: rgba(255,255,255,.55); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,.7); }
.avatar { border: 3px solid rgba(255,255,255,.85); box-shadow: var(--shadow-lg); }
.section { border-top: 1px solid var(--line); }
""",
    },
}


# ---------------------------------------------------------------------------
# Colour helpers
# ---------------------------------------------------------------------------
def _hex_to_lighter(hex_color: str, factor: float = 0.9) -> str:
    hex_color = hex_color.lstrip("#")
    try:
        r, g, b = int(hex_color[:2], 16), int(hex_color[2:4], 16), int(hex_color[4:6], 16)
    except ValueError:
        return hex_color
    r = int(r + (255 - r) * factor)
    g = int(g + (255 - g) * factor)
    b = int(b + (255 - b) * factor)
    return f"#{r:02x}{g:02x}{b:02x}"


def _hex_to_darker(hex_color: str, factor: float = 0.7) -> str:
    hex_color = hex_color.lstrip("#")
    try:
        r, g, b = int(hex_color[:2], 16), int(hex_color[2:4], 16), int(hex_color[4:6], 16)
    except ValueError:
        return hex_color
    return f"#{int(r*factor):02x}{int(g*factor):02x}{int(b*factor):02x}"


# ---------------------------------------------------------------------------
# Inline SVG icons (no emoji)
# ---------------------------------------------------------------------------
def _icon(name: str) -> str:
    paths = {
        "mail": '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
        "phone": '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/>',
    }
    inner = paths.get(name, "")
    return (
        '<svg class="icon" width="15" height="15" viewBox="0 0 24 24" fill="none" '
        'stroke="currentColor" stroke-width="1.7" stroke-linecap="round" '
        f'stroke-linejoin="round" aria-hidden="true">{inner}</svg>'
    )


# ---------------------------------------------------------------------------
# Accent pattern SVG (dots / clover / star / ...) — kept from the colour system
# ---------------------------------------------------------------------------
def _shape_svg(pattern, color, size=6):
    r = size / 2
    if pattern == "clover":
        lr = size * 0.38
        cx, cy = r, r
        leaf = ""
        for angle_deg in [0, 90, 180, 270]:
            a = math.radians(angle_deg)
            lx = cx + lr * 0.6 * math.cos(a)
            ly = cy + lr * 0.6 * math.sin(a)
            leaf += (f"<ellipse cx='{lx:.1f}' cy='{ly:.1f}' rx='{lr:.1f}' ry='{lr*0.6:.1f}' "
                     f"transform='rotate({angle_deg} {lx:.1f} {ly:.1f})' fill='{color}' opacity='0.22'/>")
        return leaf
    if pattern == "hollow":
        return f"<circle cx='{r}' cy='{r}' r='{r-1}' fill='none' stroke='{color}' stroke-width='1' opacity='0.28'/>"
    if pattern == "coin":
        cr = size * 0.5
        return ("".join(
            f"<circle cx='{x}' cy='{y}' r='{cr:.1f}' fill='none' stroke='{color}' stroke-width='1' opacity='0.2'/>"
            for x, y in [(0, 0), (size, 0), (0, size), (size, size), (r, r)]))
    if pattern == "star":
        pts = []
        for i in range(10):
            angle = math.pi / 2 + i * math.pi / 5
            radius = r - 1 if i % 2 == 0 else r * 0.4
            pts.append(f"{r + radius * math.cos(angle):.1f},{r - radius * math.sin(angle):.1f}")
        return f"<polygon points='{' '.join(pts)}' fill='{color}' opacity='0.22'/>"
    if pattern == "star4":
        return (f"<polygon points='{r},0 {r+1.5},{r-1.5} {size},{r} {r+1.5},{r+1.5} "
                f"{r},{size} {r-1.5},{r+1.5} 0,{r} {r-1.5},{r-1.5}' fill='{color}' opacity='0.22'/>")
    if pattern == "diamond":
        return f"<polygon points='{r},0 {size},{r} {r},{size} 0,{r}' fill='{color}' opacity='0.22'/>"
    if pattern == "cross":
        w = max(1, size // 4)
        return (f"<rect x='{r-w}' y='1' width='{w*2}' height='{size-2}' fill='{color}' opacity='0.22'/>"
                f"<rect x='1' y='{r-w}' width='{size-2}' height='{w*2}' fill='{color}' opacity='0.22'/>")
    if pattern == "heart":
        hr = size * 0.25
        return (f"<circle cx='{r-hr}' cy='{r-hr*0.5}' r='{hr}' fill='{color}' opacity='0.22'/>"
                f"<circle cx='{r+hr}' cy='{r-hr*0.5}' r='{hr}' fill='{color}' opacity='0.22'/>"
                f"<polygon points='{r-hr*2},{r} {r},{size} {r+hr*2},{r}' fill='{color}' opacity='0.22'/>")
    if pattern == "wave":
        return (f"<path d='M0,{r} Q{size/4},{r-3} {size/2},{r} T{size},{r}' fill='none' "
                f"stroke='{color}' stroke-width='1.5' opacity='0.22'/>")
    return f"<circle cx='{r}' cy='{r}' r='{r*0.4}' fill='{color}' opacity='0.28'/>"


def _build_pattern_css(accent_colors, pattern, layout) -> str:
    """Return a `url("data:image/svg+xml,...") repeat` background value or ''."""
    if not accent_colors:
        return ""
    _rnd.seed()
    if layout == "random":
        canvas = 200
        shapes = ""
        for _ in range(30):
            x = _rnd.uniform(0, canvas - 10)
            y = _rnd.uniform(0, canvas - 10)
            s = _rnd.uniform(6, 16)
            c = _rnd.choice(accent_colors)
            shapes += f"<g transform='translate({x:.1f},{y:.1f})'>{_shape_svg(pattern, c, s)}</g>"
        full_svg = f"<svg xmlns='http://www.w3.org/2000/svg' width='{canvas}' height='{canvas}'>{shapes}</svg>"
    elif len(accent_colors) > 1:
        cols = len(accent_colors)
        tile_single = 30
        tile = tile_single * cols
        shapes = ""
        for i, c in enumerate(accent_colors):
            shapes += f"<g transform='translate({i * tile_single},0)'>{_shape_svg(pattern, c, tile_single)}</g>"
        full_svg = f"<svg xmlns='http://www.w3.org/2000/svg' width='{tile}' height='{tile_single}'>{shapes}</svg>"
    else:
        tile = 30
        full_svg = f"<svg xmlns='http://www.w3.org/2000/svg' width='{tile}' height='{tile}'>{_shape_svg(pattern, accent_colors[0], tile)}</svg>"
    svg_enc = full_svg.replace("'", "%27").replace('"', "%22").replace("#", "%23")
    return f'url("data:image/svg+xml,{svg_enc}") repeat'


# ---------------------------------------------------------------------------
# Resolve colour-effect system -> token overrides + decorative CSS/HTML
# ---------------------------------------------------------------------------
def _resolve_effects(style: PersonalStyle, tokens: dict):
    effect_colors = getattr(style, "effect_colors", {}) or {}
    if not effect_colors:
        primary_colors = getattr(style, "primary_colors", []) or []
        extra_colors = getattr(style, "extra_colors", []) or []
        primary_list = primary_colors if primary_colors else [style.primary_color]
        all_legacy = primary_list + extra_colors
        effect_colors = {
            "solid": [style.primary_color],
            "gradient": all_legacy if len(all_legacy) > 1 else primary_list,
            "splice": all_legacy if len(all_legacy) > 1 else primary_list,
            "shadow": extra_colors,
            "accent": extra_colors,
        }

    color_effects = getattr(style, "color_effects", []) or []
    if not color_effects:
        color_effects = [getattr(style, "color_effect", "solid") or "solid"]

    solid = effect_colors.get("solid", []) or []
    gradient = effect_colors.get("gradient", []) or []
    splice = effect_colors.get("splice", []) or []
    shadow = effect_colors.get("shadow", []) or []
    accent = effect_colors.get("accent", []) or []

    pc = solid[0] if solid else (gradient[0] if gradient else (splice[0] if splice else ""))

    # Solid -> override accent token
    if pc:
        tokens["accent"] = pc
        tokens["accent2"] = _hex_to_darker(pc, 0.78) if len(solid) < 2 else solid[1]

    effect_css = ""
    bar_html = ""
    bg_decor = ""

    has_gradient = "gradient" in color_effects and len(gradient) > 1
    has_splice = "splice" in color_effects and len(splice) > 1
    has_shadow = "shadow" in color_effects and shadow
    has_accent = "accent" in color_effects and accent

    if has_gradient:
        grad = f"linear-gradient(120deg, {', '.join(gradient)})"
        if len(gradient) > 1:
            tokens["accent"] = gradient[0]
            tokens["accent2"] = gradient[-1]
        effect_css += (
            f".display {{ background: {grad}; -webkit-background-clip: text; "
            f"background-clip: text; color: transparent; -webkit-text-fill-color: transparent; }}\n"
        )
        bar_html = f'<div class="accent-bar" style="background:{grad};"></div>'

    if has_splice:
        direction = getattr(style, "splice_direction", "horizontal") or "horizontal"
        repeat = getattr(style, "splice_repeat", False)
        colors = splice * 3 if (repeat and len(splice) > 1) else splice
        step = 100 / len(colors)
        stops = []
        for i, c in enumerate(colors):
            stops.append(f"{c} {i*step:.1f}%")
            stops.append(f"{c} {(i+1)*step:.1f}%")
        angle = "135deg" if direction == "diagonal" else "90deg"
        splice_css = f"linear-gradient({angle}, {', '.join(stops)})"
        bar_html = f'<div class="accent-bar" style="background:{splice_css};"></div>'
        effect_css += f".footer {{ background: {splice_css}; color:#fff; }}\n"

    if has_shadow:
        if len(shadow) > 1:
            layers = [f"0 4px 10px {shadow[0]}30"]
            for i, sc in enumerate(shadow):
                layers.append(f"{(i+1)*3}px {(i+1)*5}px {12+i*10}px {sc}55")
            shadow_css = ", ".join(layers)
        else:
            shadow_css = f"0 10px 30px {shadow[0]}40"
        effect_css += f".card {{ box-shadow: {shadow_css} !important; }}\n"

    if has_accent:
        pattern = getattr(style, "accent_pattern", "dots") or "dots"
        layout = getattr(style, "accent_layout", "even") or "even"
        pat_css = _build_pattern_css(accent, pattern, layout)
        if pat_css:
            bg_decor = f'<div class="bg-decor" style="background-image:{pat_css};opacity:.5;"></div>'

    return {"effect_css": effect_css, "bar_html": bar_html, "bg_decor": bg_decor}


def _avatar_html(resume: ResumeData, name: str) -> str:
    safe_url = _sanitize_url(resume.avatar_url)
    if safe_url:
        return f'<img class="avatar" src="{safe_url}" alt="{_escape(name)}">'
    initial = _escape(name[0]) if name else "?"
    return f'<div class="avatar-fallback" aria-hidden="true">{initial}</div>'


# ---------------------------------------------------------------------------
# Main generator
# ---------------------------------------------------------------------------
def generate_personal_site(resume: ResumeData, style: Optional[PersonalStyle] = None,
                           lang: str = "zh", bilingual: bool = False,
                           ai_effects: list = None) -> str:
    if style is None:
        style = PersonalStyle()

    preset_id = _LEGACY_MAP.get(getattr(style, "ui_style", "") or "", DEFAULT_PRESET)
    preset = PERSONAL_PRESETS[preset_id]

    # Build token dict for the design system
    tokens = {k: preset[k] for k in ("fd", "fb", "fonts", "bg", "surface", "text",
                                     "muted", "line", "accent", "accent2")}
    fx = _resolve_effects(style, tokens)

    # Background image override
    bg_image = _sanitize_url(getattr(style, "bg_image", ""))
    bg_image_css = ""
    if bg_image:
        bg_image_css = (f"body {{ background-image: url('{bg_image}'); background-size: cover; "
                        f"background-position: center; background-attachment: fixed; }}\n"
                        f"body::before {{ content:''; position:fixed; inset:0; "
                        f"background:rgba(255,255,255,.72); z-index:-1; }}\n")

    timeline_style = getattr(style, "timeline_style", "linear") or "linear"
    section_order = getattr(style, "section_order", []) or []
    dark_mode = getattr(style, "dark_mode", False)

    # ---- text (both languages) ----
    name_en, name_cn = _escape(resume.name), _escape(resume.name_cn or resume.name)
    title_en, title_cn = _escape(resume.title), _escape(resume.title_cn or resume.title)
    bio_en, bio_cn = _escape(resume.bio), _escape(resume.bio_cn or resume.bio)

    # ---- contact ----
    def _contact():
        items = []
        if resume.email:
            items.append(f'<a href="mailto:{_escape(resume.email)}">{_icon("mail")}<span>{_escape(resume.email)}</span></a>')
        if resume.phone:
            items.append(f'<span>{_icon("phone")}{_escape(resume.phone)}</span>')
        return f'<div class="contact-row">{"".join(items)}</div>' if items else ""

    contact_html = _contact()

    # ---- section builders ----
    def _bio_section(lc, num):
        bio = bio_en if lc == "en" else bio_cn
        if not bio:
            return ""
        label = t("about_me")[0] if lc == "en" else t("about_me")[1]
        return f'''
      <section class="section reveal">
        <div class="section-head"><span class="num">{num}</span><h2 class="section-title">{label}</h2></div>
        <p class="lead">{bio}</p>
      </section>'''

    def _work_section(lc, num):
        if not resume.work_experiences:
            return ""
        label = t("work_experience")[0] if lc == "en" else t("work_experience")[1]
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
        return f'''
      <section class="section reveal">
        <div class="section-head"><span class="num">{num}</span><h2 class="section-title">{label}</h2></div>
        <div class="{alt}">{items}
        </div>
      </section>'''

    def _edu_section(lc, num):
        if not resume.educations:
            return ""
        label = t("education")[0] if lc == "en" else t("education")[1]
        cards = ""
        for edu in resume.educations:
            school = _escape(edu.school if lc == "en" else (edu.school_cn or edu.school))
            major = _escape(edu.major if lc == "en" else (edu.major_cn or edu.major))
            dur = _escape(edu.duration if lc == "en" else (edu.duration_cn or edu.duration))
            safe_logo = _sanitize_url(edu.school_logo)
            logo = f'<img class="edu-logo" src="{safe_logo}" alt="">' if safe_logo else ""
            cards += f'''
        <div class="card edu-item">
          {logo}
          <div><h3 class="section-title" style="font-size:1.05rem;">{school}</h3>
          <div class="meta" style="color:var(--accent);font-size:.9rem;margin:2px 0;">{major}</div>
          <div style="color:var(--muted);font-size:.82rem;">{dur}</div></div>
        </div>'''
        return f'''
      <section class="section reveal">
        <div class="section-head"><span class="num">{num}</span><h2 class="section-title">{label}</h2></div>
        <div class="edu-grid">{cards}
        </div>
      </section>'''

    def _skills_section(lc, num):
        skill_list = resume.skills if lc == "en" else (resume.skills_cn or resume.skills)
        if not skill_list:
            return ""
        label = t("skills")[0] if lc == "en" else t("skills")[1]
        total = len(skill_list)
        bars = ""
        for i, s in enumerate(skill_list):
            pct = 72 + ((i * 7) % 27)
            bars += f'''
        <div class="skill">
          <div class="skill-top"><span class="skill-name">{_escape(s)}</span><span class="skill-pct">{pct}%</span></div>
          <div class="bar"><div class="bar-fill" style="width:{pct}%;"></div></div>
        </div>'''
        return f'''
      <section class="section reveal">
        <div class="section-head"><span class="num">{num}</span><h2 class="section-title">{label}</h2></div>
        <div class="grid-2" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:var(--space-5) var(--space-7);">{bars}
        </div>
      </section>'''

    def _hobbies_section(lc, num):
        hobby_list = resume.hobbies if lc == "en" else (resume.hobbies_cn or resume.hobbies)
        if not hobby_list:
            return ""
        label = t("hobbies")[0] if lc == "en" else t("hobbies")[1]
        tags = "".join(f'<span class="tag">{_escape(h)}</span>' for h in hobby_list)
        return f'''
      <section class="section reveal">
        <div class="section-head"><span class="num">{num}</span><h2 class="section-title">{label}</h2></div>
        <div class="tag-row">{tags}</div>
      </section>'''

    def _keywords_row():
        kws = getattr(style, "keywords", []) or []
        if not kws:
            return ""
        tags = "".join(f'<span class="tag">{_escape(k)}</span>' for k in kws)
        return f'<div class="tag-row" style="margin-top:var(--space-5);">{tags}</div>'

    def _build_page(lc):
        name = name_en if lc == "en" else name_cn
        title = title_en if lc == "en" else title_cn
        avatar = _avatar_html(resume, name)
        footer_label = t("footer_built_with")[0] if lc == "en" else t("footer_built_with")[1]

        default_order = ["bio", "work", "education", "skills", "hobbies"]
        order = [k for k in (section_order or default_order)]
        builders = {
            "bio": _bio_section, "work": _work_section, "education": _edu_section,
            "skills": _skills_section, "hobbies": _hobbies_section,
        }
        sections = ""
        num = 0
        for key in order:
            b = builders.get(key)
            if not b:
                continue
            num += 1
            sections += b(lc, f"{num:02d}")

        return f'''
    <div class="site">
      {fx["bar_html"]}
      <header class="hero">
        <div class="wrap hero-split">
          <div class="hero-main reveal in">
            <p class="micro-label">{title}</p>
            <h1 class="display">{name}</h1>
            {_keywords_row()}
            {contact_html}
          </div>
          <div class="hero-side reveal in">{avatar}</div>
        </div>
      </header>
      <main class="wrap">{sections}
      </main>
      <footer class="footer">
        <div class="wrap">{footer_label} &nbsp;&middot;&nbsp; {name} &copy; 2026</div>
      </footer>
    </div>'''

    # ---- language assembly ----
    if bilingual:
        body = f'''{TOGGLE_BUTTON}
    {fx["bg_decor"]}
    <div class="lang-zh">{_build_page("zh")}</div>
    <div class="lang-en" style="display:none;">{_build_page("en")}</div>'''
        lang_css = ".lang-en { display: none; }"
        script = TOGGLE_SCRIPT
        html_lang = "zh-CN"
        page_title = name_cn
    else:
        lc = "zh" if lang == "zh" else "en"
        body = f'''{fx["bg_decor"]}
    {_build_page(lc)}'''
        lang_css = ""
        script = ""
        html_lang = "zh-CN" if lang == "zh" else "en"
        page_title = name_cn if lang == "zh" else name_en

    # ---- dark mode ----
    dark_css = ""
    if dark_mode:
        dark_css = """
@media (prefers-color-scheme: dark) {
  :root { --bg:#14110F; --surface:#1F1B18; --text:#F2EDE7; --muted:#A79C90; --line:#332C26; }
  .card { background: var(--surface); }
}
"""

    # ---- ai effects ----
    ai_css_parts, ai_js_parts = [], []
    for effect in (ai_effects or []):
        if isinstance(effect, dict):
            ai_css_parts.append(effect.get("css", ""))
            ai_js_parts.append(effect.get("js", ""))
    ai_css = "\n".join(ai_css_parts)
    ai_js = "\n".join(ai_js_parts)

    # ---- final CSS ----
    tokens["extra_css"] = preset["extra_css"] + "\n" + fx["effect_css"] + "\n" + bg_image_css + "\n" + lang_css + "\n" + dark_css + "\n" + ai_css
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
<body class="preset-{preset_id}">
{body}
<div id="ai-effect-container" style="position:fixed;inset:0;pointer-events:none;z-index:900;overflow:hidden;"></div>
{render_reveal_js()}
<script>{ai_js}</script>
</body>
</html>'''
