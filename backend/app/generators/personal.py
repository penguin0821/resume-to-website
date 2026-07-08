from typing import Optional
from app.models import ResumeData, PersonalStyle
from app.generators.i18n import TOGGLE_SCRIPT, TOGGLE_BUTTON, t


STYLE_PRESETS = {
    "cartoon": {
        "border_radius": "24px",
        "font_family": "'Comic Sans MS', 'PingFang SC', cursive, sans-serif",
        "card_shadow": "0 8px 30px rgba(0,0,0,0.12)",
        "heading_decoration": "&#x2728;",
        "header_bg": "linear-gradient(135deg, {pc}, {pc2})",
        "header_style": "position:relative;overflow:hidden;",
        "card_bg": "white",
        "card_border": "3px solid {pc}",
        "section_title_style": "font-size:32px;color:{pc};text-shadow:2px 2px 0 rgba(0,0,0,0.05);",
        "tag_style": "background:{pc};color:white;border-radius:50px;padding:10px 24px;box-shadow:3px 3px 0 rgba(0,0,0,0.1);",
        "hobby_tag_style": "background:white;border:3px dashed {pc};color:{pc};border-radius:50px;padding:12px 24px;",
        "body_bg": "{bg_light}",
        "footer_bg": "{pc}",
        "footer_color": "white",
        "extra_css": """@keyframes float {{ 0%,100% {{ transform: translateY(0); }} 50% {{ transform: translateY(-6px); }} }}
        header img, header > div > div:first-child {{ animation: float 3s ease-in-out infinite; }}""",
    },
    "minimal": {
        "border_radius": "4px",
        "font_family": "'Helvetica Neue', 'Inter', 'PingFang SC', sans-serif",
        "card_shadow": "none",
        "heading_decoration": "",
        "header_bg": "white",
        "header_style": "border-bottom:1px solid #eaeaea;",
        "card_bg": "transparent",
        "card_border": "none",
        "section_title_style": "font-size:13px;letter-spacing:4px;text-transform:uppercase;color:#999;font-weight:500;",
        "tag_style": "background:transparent;color:#333;border:1px solid #ddd;border-radius:2px;padding:8px 18px;",
        "hobby_tag_style": "background:transparent;border:1px solid #ddd;color:#666;border-radius:2px;padding:10px 18px;",
        "body_bg": "#ffffff",
        "footer_bg": "white",
        "footer_color": "#bbb",
        "extra_css": "header h1 {{ color: #111 !important; }} header p {{ color: #666 !important; }}",
    },
    "artistic": {
        "border_radius": "16px",
        "font_family": "Georgia, 'STSong', 'Noto Serif SC', serif",
        "card_shadow": "0 4px 24px rgba(0,0,0,0.06)",
        "heading_decoration": "&#x1F3A8;",
        "header_bg": "linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        "header_style": "",
        "card_bg": "rgba(255,255,255,0.9)",
        "card_border": "none",
        "section_title_style": "font-size:24px;color:#0f3460;font-style:italic;border-left:4px solid #e94560;padding-left:16px;",
        "tag_style": "background:linear-gradient(135deg, #0f3460, #e94560);color:white;border-radius:8px;padding:8px 20px;",
        "hobby_tag_style": "background:rgba(233,69,96,0.08);border:1px solid #e94560;color:#e94560;border-radius:8px;padding:10px 20px;",
        "body_bg": "linear-gradient(180deg, #f8f0e3 0%, #fefcf6 100%)",
        "footer_bg": "#1a1a2e",
        "footer_color": "#e94560",
        "extra_css": "body {{ background-attachment: fixed; }}",
    },
    "retro": {
        "border_radius": "0px",
        "font_family": "'Courier New', 'STFangsong', monospace",
        "card_shadow": "6px 6px 0 rgba(0,0,0,0.2)",
        "heading_decoration": "&#x1F4E0;",
        "header_bg": "#2d2d2d",
        "header_style": "border-bottom:4px solid #f0c040;",
        "card_bg": "#fffef5",
        "card_border": "2px solid #2d2d2d",
        "section_title_style": "font-size:22px;color:#2d2d2d;border-bottom:3px double #2d2d2d;padding-bottom:8px;text-transform:uppercase;letter-spacing:2px;",
        "tag_style": "background:#f0c040;color:#2d2d2d;border:2px solid #2d2d2d;border-radius:0;padding:8px 16px;font-weight:bold;",
        "hobby_tag_style": "background:#fffef5;border:2px solid #2d2d2d;color:#2d2d2d;border-radius:0;padding:10px 16px;",
        "body_bg": "#f5f0e0",
        "footer_bg": "#2d2d2d",
        "footer_color": "#f0c040",
        "extra_css": "body {{ background-image: url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%224%22 height=%224%22><rect width=%224%22 height=%224%22 fill=%22%23f5f0e0%22/><rect width=%221%22 height=%221%22 fill=%22%23e8e3d0%22/></svg>'); background-repeat: repeat; }}",
    },
}


def _hex_to_lighter(hex_color: str, factor: float = 0.9) -> str:
    hex_color = hex_color.lstrip("#")
    r, g, b = int(hex_color[:2], 16), int(hex_color[2:4], 16), int(hex_color[4:6], 16)
    r = int(r + (255 - r) * factor)
    g = int(g + (255 - g) * factor)
    b = int(b + (255 - b) * factor)
    return f"#{r:02x}{g:02x}{b:02x}"


def _hex_to_darker(hex_color: str, factor: float = 0.7) -> str:
    hex_color = hex_color.lstrip("#")
    r, g, b = int(hex_color[:2], 16), int(hex_color[2:4], 16), int(hex_color[4:6], 16)
    r = int(r * factor)
    g = int(g * factor)
    b = int(b * factor)
    return f"#{r:02x}{g:02x}{b:02x}"


def _get_style_config(style: Optional[PersonalStyle] = None):
    if style is None:
        style = PersonalStyle()
    preset = STYLE_PRESETS.get(style.ui_style, STYLE_PRESETS["cartoon"])
    bg_image = getattr(style, 'bg_image', '')

    # Multi-effect support
    color_effects = getattr(style, 'color_effects', []) or []
    if not color_effects:
        # Backward compat: use single color_effect
        ce = getattr(style, 'color_effect', 'solid') or 'solid'
        color_effects = [ce]
    splice_direction = getattr(style, 'splice_direction', 'horizontal') or 'horizontal'
    splice_repeat = getattr(style, 'splice_repeat', False)
    timeline_style = getattr(style, 'timeline_style', 'alternate')

    # NEW: Per-effect color arrays (effect_colors)
    effect_colors = getattr(style, 'effect_colors', {}) or {}

    # Backward compat: if effect_colors is empty, build from legacy fields
    if not effect_colors:
        primary_colors = getattr(style, 'primary_colors', []) or []
        extra_colors = getattr(style, 'extra_colors', []) or []
        primary_list = primary_colors if primary_colors else [style.primary_color]
        all_legacy = primary_list + extra_colors
        effect_colors = {
            'solid': [style.primary_color],
            'gradient': all_legacy if len(all_legacy) > 1 else primary_list,
            'splice': all_legacy if len(all_legacy) > 1 else primary_list,
            'shadow': extra_colors if extra_colors else [],
            'accent': extra_colors if extra_colors else [],
        }

    # Read colors per effect
    solid_colors = effect_colors.get('solid', []) or [style.primary_color]
    gradient_colors = effect_colors.get('gradient', []) or []
    splice_colors_list = effect_colors.get('splice', []) or []
    shadow_colors = effect_colors.get('shadow', []) or []
    accent_colors = effect_colors.get('accent', []) or []

    # Base color (pc) for templates: solid[0] > gradient[0] > splice[0] > default
    pc = solid_colors[0] if solid_colors else (gradient_colors[0] if gradient_colors else (splice_colors_list[0] if splice_colors_list else style.primary_color))
    pc2 = _hex_to_darker(pc, 0.75)
    bg_light = _hex_to_lighter(pc, 0.92)
    primary_list = solid_colors if solid_colors else [pc]

    # All colors merged (for backward compat in template)
    all_colors = gradient_colors if gradient_colors else (splice_colors_list if splice_colors_list else primary_list)

    # Gradient: smooth transition across gradient colors
    if len(gradient_colors) > 1:
        gradient_css = f"linear-gradient(135deg, {', '.join(gradient_colors)})"
        gradient_h_css = f"linear-gradient(90deg, {', '.join(gradient_colors)})"
    elif gradient_colors:
        gradient_css = gradient_colors[0]
        gradient_h_css = gradient_colors[0]
    else:
        gradient_css = pc
        gradient_h_css = pc

    # Shadow: multi-layered colored shadows from shadow colors
    if shadow_colors:
        if len(shadow_colors) > 1:
            # Multi-color shadow: gradient-like layered shadows
            shadow_layers = []
            for i, sc in enumerate(shadow_colors):
                ox = (i + 1) * 3
                oy = (i + 1) * 5
                blur = 12 + i * 10
                shadow_layers.append(f"{ox}px {oy}px {blur}px {sc}60")
            # Add a soft base shadow
            shadow_layers.insert(0, f"0 4px 8px {shadow_colors[0]}30")
            shadow_css = ", ".join(shadow_layers)
        else:
            # Single color shadow
            shadow_css = f"0 8px 24px {shadow_colors[0]}40"
    else:
        shadow_css = f"0 8px 24px {pc}20"

    # Accent: SVG pattern generation
    accent_pattern = getattr(style, 'accent_pattern', 'dots') or 'dots'
    accent_layout = getattr(style, 'accent_layout', 'even') or 'even'
    if not accent_colors and 'accent' in color_effects:
        accent_colors = [_hex_to_lighter(pc, 0.6)]

    import random as _rnd
    _rnd.seed()  # fresh random each time

    def _shape_svg(pattern, color, size=6):
        """Return SVG shape content for a given pattern type."""
        r = size / 2
        if pattern == 'clover':
            # Four-leaf clover: 4 heart-shaped leaves around center
            lr = size * 0.38
            cx, cy = r, r
            leaf = ""
            for angle_deg in [0, 90, 180, 270]:
                import math
                a = math.radians(angle_deg)
                lx = cx + lr * 0.6 * math.cos(a)
                ly = cy + lr * 0.6 * math.sin(a)
                leaf += f"<ellipse cx='{lx:.1f}' cy='{ly:.1f}' rx='{lr:.1f}' ry='{lr*0.6:.1f}' transform='rotate({angle_deg} {lx:.1f} {ly:.1f})' fill='{color}' opacity='0.2'/>"
            return leaf
        elif pattern == 'hollow':
            return f"<circle cx='{r}' cy='{r}' r='{r-1}' fill='none' stroke='{color}' stroke-width='1' opacity='0.25'/>"
        elif pattern == 'coin':
            # Copper coin pattern: overlapping circles forming interlocking lattice
            cr = size * 0.5
            return (f"<circle cx='0' cy='0' r='{cr:.1f}' fill='none' stroke='{color}' stroke-width='1' opacity='0.18'/>"
                    f"<circle cx='{size}' cy='0' r='{cr:.1f}' fill='none' stroke='{color}' stroke-width='1' opacity='0.18'/>"
                    f"<circle cx='0' cy='{size}' r='{cr:.1f}' fill='none' stroke='{color}' stroke-width='1' opacity='0.18'/>"
                    f"<circle cx='{size}' cy='{size}' r='{cr:.1f}' fill='none' stroke='{color}' stroke-width='1' opacity='0.18'/>"
                    f"<circle cx='{r}' cy='{r}' r='{cr:.1f}' fill='none' stroke='{color}' stroke-width='1' opacity='0.18'/>")
        elif pattern == 'star':
            import math
            pts = []
            for i in range(10):
                angle = math.pi / 2 + i * math.pi / 5
                radius = r - 1 if i % 2 == 0 else r * 0.4
                pts.append(f"{r + radius * math.cos(angle):.1f},{r - radius * math.sin(angle):.1f}")
            return f"<polygon points='{' '.join(pts)}' fill='{color}' opacity='0.2'/>"
        elif pattern == 'star4':
            return f"<polygon points='{r},0 {r+1.5},{r-1.5} {size},{r} {r+1.5},{r+1.5} {r},{size} {r-1.5},{r+1.5} 0,{r} {r-1.5},{r-1.5}' fill='{color}' opacity='0.2'/>"
        elif pattern == 'diamond':
            return f"<polygon points='{r},0 {size},{r} {r},{size} 0,{r}' fill='{color}' opacity='0.2'/>"
        elif pattern == 'cross':
            w = max(1, size // 4)
            return (f"<rect x='{r-w}' y='1' width='{w*2}' height='{size-2}' fill='{color}' opacity='0.2'/>"
                    f"<rect x='1' y='{r-w}' width='{size-2}' height='{w*2}' fill='{color}' opacity='0.2'/>")
        elif pattern == 'heart':
            hr = size * 0.25
            return (f"<circle cx='{r-hr}' cy='{r-hr*0.5}' r='{hr}' fill='{color}' opacity='0.2'/>"
                    f"<circle cx='{r+hr}' cy='{r-hr*0.5}' r='{hr}' fill='{color}' opacity='0.2'/>"
                    f"<polygon points='{r-hr*2},{r} {r},{size} {r+hr*2},{r}' fill='{color}' opacity='0.2'/>")
        elif pattern == 'wave':
            return f"<path d='M0,{r} Q{size/4},{r-3} {size/2},{r} T{size},{r}' fill='none' stroke='{color}' stroke-width='1.5' opacity='0.2'/>"
        else:  # dots (default)
            return f"<circle cx='{r}' cy='{r}' r='{r*0.4}' fill='{color}' opacity='0.25'/>"

    # Build the full SVG for the pattern (only when accent colors exist)
    dot_pattern_css = ""
    corner_color = _hex_to_darker(pc, 0.7)
    if accent_colors:
        if accent_layout == 'random':
            # Random layout: scatter shapes across a larger canvas
            canvas = 200
            shapes = ""
            for _ in range(30):
                x = _rnd.uniform(0, canvas - 10)
                y = _rnd.uniform(0, canvas - 10)
                s = _rnd.uniform(6, 16)
                c = _rnd.choice(accent_colors)
                shape = _shape_svg(accent_pattern, c, s)
                shapes += f"<g transform='translate({x:.1f},{y:.1f})'>{shape}</g>"
            full_svg = f"<svg xmlns='http://www.w3.org/2000/svg' width='{canvas}' height='{canvas}'>{shapes}</svg>"
        else:
            # Even layout: use SVG <pattern> for uniform spacing
            if len(accent_colors) > 1:
                # Multi-color even: larger tile with shapes in different colors
                cols = len(accent_colors)
                tile_single = 30
                tile = tile_single * cols
                shapes = ""
                for i, c in enumerate(accent_colors):
                    x = i * tile_single
                    shape = _shape_svg(accent_pattern, c, tile_single)
                    shapes += f"<g transform='translate({x},0)'>{shape}</g>"
                full_svg = f"<svg xmlns='http://www.w3.org/2000/svg' width='{tile}' height='{tile_single}'>{shapes}</svg>"
            else:
                tile = 30
                c = accent_colors[0]
                shape = _shape_svg(accent_pattern, c, tile)
                full_svg = f"<svg xmlns='http://www.w3.org/2000/svg' width='{tile}' height='{tile}'>{shape}</svg>"

        svg_enc = full_svg.replace("'", "%27").replace('"', "%22").replace('#', "%23")
        dot_pattern_css = f"url(\"data:image/svg+xml,{svg_enc}\") repeat"
        corner_color = accent_colors[1] if len(accent_colors) > 1 else _hex_to_darker(pc, 0.7)

    # Splice: hard-edge color blocks with direction and repeat support
    splice_colors = splice_colors_list if splice_colors_list else [pc]
    if splice_repeat and len(splice_colors) > 1:
        # Interval repeat: e.g. red,blue,red,blue,red,blue
        repeated = splice_colors * 3  # triple the pattern for coverage
        stops = []
        step = 100 / len(repeated)
        for i, c in enumerate(repeated):
            stops.append(f"{c} {i * step:.1f}%")
            stops.append(f"{c} {(i + 1) * step:.1f}%")
    else:
        stops = []
        step = 100 / len(splice_colors)
        for i, c in enumerate(splice_colors):
            stops.append(f"{c} {i * step:.1f}%")
            stops.append(f"{c} {(i + 1) * step:.1f}%")

    if splice_direction == 'diagonal':
        splice_css = f"linear-gradient(135deg, {', '.join(stops)})"
    else:
        splice_css = f"linear-gradient(90deg, {', '.join(stops)})"
    splice_v_css = f"linear-gradient(180deg, {', '.join(stops)})"

    # Accent color (first accent color or darker primary)
    accent_color = accent_colors[0] if accent_colors else pc2

    # Expand template placeholders in all preset values
    def _expand(val):
        if isinstance(val, str):
            return val.format(pc=pc, pc2=pc2, bg_light=bg_light)
        return val

    result = {}
    for k, v in preset.items():
        result[k] = _expand(v)
    result["primary_color"] = pc
    result["bg_image"] = bg_image
    result["extra_colors"] = accent_colors  # legacy: accent colors
    result["effect_colors"] = effect_colors  # NEW: per-effect colors
    result["color_effects"] = color_effects
    result["all_colors"] = all_colors
    result["gradient_css"] = gradient_css
    result["gradient_h_css"] = gradient_h_css
    result["multi_shadow_css"] = shadow_css
    result["accent_color"] = accent_color
    result["dot_pattern_css"] = dot_pattern_css
    result["corner_color"] = corner_color
    result["splice_css"] = splice_css
    result["splice_v_css"] = splice_v_css
    result["primary_list"] = primary_list
    result["accent_pattern"] = accent_pattern
    result["accent_layout"] = accent_layout
    result["shadow_colors"] = shadow_colors
    result["timeline_style"] = timeline_style
    return result


def _render_avatar(resume: ResumeData, name: str) -> str:
    if resume.avatar_url:
        return f'<img src="{resume.avatar_url}" alt="avatar" style="width:120px;height:120px;border-radius:50%;object-fit:cover;border:4px solid white;" />'
    initial = name[0] if name else "?"
    return f'<div style="width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;color:white;font-size:48px;font-weight:bold;border:4px solid white;">{initial}</div>'


def generate_personal_site(resume: ResumeData, style: Optional[PersonalStyle] = None, lang: str = "zh", bilingual: bool = False, ai_effects: list = None) -> str:
    cfg = _get_style_config(style)
    bg_image = cfg.get('bg_image', '')
    decor = cfg["heading_decoration"]
    br = cfg["border_radius"]
    cs = cfg["card_shadow"]
    pc = cfg["primary_color"]
    card_bg = cfg.get("card_bg", "white")
    card_border = cfg.get("card_border", "none")
    section_title = cfg.get("section_title_style", "font-size:28px;color:#1a1a2e;")
    tag_style = cfg.get("tag_style", f"background:{pc};color:white;padding:8px 20px;")
    hobby_tag_style = cfg.get("hobby_tag_style", f"background:white;padding:10px 20px;border:2px solid {pc};color:{pc};")
    header_bg = cfg.get("header_bg", pc)
    header_style = cfg.get("header_style", "")
    body_bg = cfg.get("body_bg", "#f5f5f5")
    footer_bg = cfg.get("footer_bg", "transparent")
    footer_color = cfg.get("footer_color", "#999")
    preset_extra_css = cfg.get("extra_css", "")

    # Multi-color effects (array-based)
    color_effects = cfg.get("color_effects", ["solid"])
    effect_colors_raw = cfg.get("effect_colors", {})
    gradient_colors_list = effect_colors_raw.get('gradient', []) or []
    splice_colors_list = effect_colors_raw.get('splice', []) or []
    shadow_colors_list = effect_colors_raw.get('shadow', []) or []
    accent_colors_list = effect_colors_raw.get('accent', []) or []
    all_colors = cfg.get("all_colors", [pc])
    gradient_css = cfg.get("gradient_css", pc)
    gradient_h_css = cfg.get("gradient_h_css", pc)
    multi_shadow = cfg.get("multi_shadow_css", "none")
    accent = cfg.get("accent_color", pc)
    dot_pattern = cfg.get("dot_pattern_css", "")
    corner_color = cfg.get("corner_color", pc)
    timeline_style = cfg.get("timeline_style", "alternate")
    splice_css = cfg.get("splice_css", pc)
    splice_v_css = cfg.get("splice_v_css", pc)

    # --- Apply multiple color effects (layered) ---
    extra_body_css = ""
    corner_html = ""

    has_gradient = 'gradient' in color_effects and len(gradient_colors_list) > 1
    has_shadow = 'shadow' in color_effects
    has_accent = 'accent' in color_effects and len(accent_colors_list) > 0
    has_splice = 'splice' in color_effects and len(splice_colors_list) > 1

    # Gradient: smooth transition on header/tags
    if has_gradient:
        header_bg = gradient_css
        tag_style = f"background:{gradient_h_css};color:white;border-radius:50px;padding:10px 24px;"
        card_border = "2px solid transparent"

    # Splice: hard-edge blocks on header/footer (overrides gradient header if both)
    if has_splice:
        header_bg = splice_css

    # Shadow: colored shadows on cards
    if has_shadow:
        cs = multi_shadow

    # Accent: dot pattern on body + corner decorations in header
    if has_accent:
        extra_body_css = f"background-image: {dot_pattern};"
        header_style += "position:relative;"
        corner_html = (
            f'<div style="position:absolute;top:0;left:0;width:80px;height:80px;'
            f'background:{corner_color};opacity:0.15;'
            f'clip-path:polygon(0 0, 100% 0, 0 100%);"></div>'
            f'<div style="position:absolute;bottom:0;right:0;width:80px;height:80px;'
            f'background:{accent_colors_list[0]};opacity:0.15;'
            f'clip-path:polygon(100% 0, 100% 100%, 0 100%);"></div>'
            f'<div style="position:absolute;top:20%;right:10%;width:30px;height:30px;'
            f'border-radius:50%;background:{accent_colors_list[0]};opacity:0.12;"></div>'
            f'<div style="position:absolute;bottom:20%;left:8%;width:20px;height:20px;'
            f'border-radius:50%;background:{corner_color};opacity:0.1;"></div>'
        )

    # Build tag styles list for cycling through colors
    tag_styles_list = [tag_style]
    if has_gradient and len(gradient_colors_list) > 1:
        for c in gradient_colors_list:
            tag_styles_list.append(f"background:{c};color:white;border-radius:50px;padding:10px 24px;")
    elif has_splice and len(splice_colors_list) > 1:
        for c in splice_colors_list:
            tag_styles_list.append(f"background:{c};color:white;border-radius:50px;padding:10px 24px;")

    # If bg_image is set, override body_bg
    if bg_image:
        body_bg_css = f"url('{bg_image}') center/cover no-repeat fixed"
    elif extra_body_css:
        body_bg_css = body_bg  # dot pattern applied via CSS
    else:
        body_bg_css = body_bg

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
        total = len(resume.work_experiences)
        for idx, exp in enumerate(resume.work_experiences):
            pos = exp.position if lang_code == "en" else (exp.position_cn or exp.position)
            comp = exp.company if lang_code == "en" else (exp.company_cn or exp.company)
            dur = exp.duration if lang_code == "en" else (exp.duration_cn or exp.duration)
            desc = exp.description if lang_code == "en" else (exp.description_cn or exp.description)
            # Alternating timeline for 2+ items
            if total >= 2 and timeline_style == 'alternate':
                is_right = idx % 2 == 0
                dot_color = tag_styles_list[idx % len(tag_styles_list)].split(';')[0].replace('background:', '') if tag_styles_list else pc
                if is_right:
                    items += f'''
                <div style="display:flex;margin-bottom:24px;">
                    <div style="flex:1;padding-right:24px;text-align:right;">
                        <div style="background:{card_bg};padding:20px;border-radius:{br};box-shadow:{cs};border:{card_border};">
                            <h3 style="margin:0 0 4px 0;font-size:18px;color:#1a1a2e;">{pos}</h3>
                            <p style="margin:0 0 4px 0;color:{pc};font-weight:bold;">{comp}</p>
                            <p style="margin:0 0 8px 0;color:#999;font-size:14px;">{dur}</p>
                            <p style="margin:0;color:#555;line-height:1.6;">{desc}</p>
                        </div>
                    </div>
                    <div style="position:relative;width:20px;flex-shrink:0;">
                        <div style="position:absolute;left:50%;top:24px;transform:translateX(-50%);width:16px;height:16px;background:{pc};border-radius:50%;border:3px solid white;z-index:1;"></div>
                        <div style="position:absolute;left:50%;top:0;bottom:0;transform:translateX(-50%);width:3px;background:{pc}30;"></div>
                    </div>
                    <div style="flex:1;"></div>
                </div>'''
                else:
                    items += f'''
                <div style="display:flex;margin-bottom:24px;">
                    <div style="flex:1;"></div>
                    <div style="position:relative;width:20px;flex-shrink:0;">
                        <div style="position:absolute;left:50%;top:24px;transform:translateX(-50%);width:16px;height:16px;background:{pc};border-radius:50%;border:3px solid white;z-index:1;"></div>
                        <div style="position:absolute;left:50%;top:0;bottom:0;transform:translateX(-50%);width:3px;background:{pc}30;"></div>
                    </div>
                    <div style="flex:1;padding-left:24px;">
                        <div style="background:{card_bg};padding:20px;border-radius:{br};box-shadow:{cs};border:{card_border};">
                            <h3 style="margin:0 0 4px 0;font-size:18px;color:#1a1a2e;">{pos}</h3>
                            <p style="margin:0 0 4px 0;color:{pc};font-weight:bold;">{comp}</p>
                            <p style="margin:0 0 8px 0;color:#999;font-size:14px;">{dur}</p>
                            <p style="margin:0;color:#555;line-height:1.6;">{desc}</p>
                        </div>
                    </div>
                </div>'''
            else:
                # Single item: standard card
                items += f'''
                <div style="background:{card_bg};padding:24px;margin-bottom:16px;border-radius:{br};box-shadow:{cs};border:{card_border};">
                    <h3 style="margin:0 0 4px 0;font-size:18px;color:#1a1a2e;">{pos}</h3>
                    <p style="margin:0 0 4px 0;color:{pc};font-weight:bold;">{comp}</p>
                    <p style="margin:0 0 8px 0;color:#999;font-size:14px;">{dur}</p>
                    <p style="margin:0;color:#555;line-height:1.6;">{desc}</p>
                </div>'''
        return f'<section style="margin-bottom:48px;"><h2 style="{section_title}margin-bottom:24px;">{decor} {label}</h2>{items}</section>'

    def _build_edu(lang_code):
        if not resume.educations:
            return ""
        label = t("education")[0] if lang_code == "en" else t("education")[1]
        total = len(resume.educations)
        items = ""
        for edu in resume.educations:
            school = edu.school if lang_code == "en" else (edu.school_cn or edu.school)
            major = edu.major if lang_code == "en" else (edu.major_cn or edu.major)
            dur = edu.duration if lang_code == "en" else (edu.duration_cn or edu.duration)
            items += f'''
            <div style="background:{card_bg};padding:24px;border-radius:{br};box-shadow:{cs};border:{card_border};">
                <h3 style="margin:0 0 4px 0;font-size:18px;color:#1a1a2e;">{school}</h3>
                <p style="margin:0 0 4px 0;color:{pc};">{major}</p>
                <p style="margin:0;color:#999;font-size:14px;">{dur}</p>
            </div>'''
        # 2-column grid if 2+ items, else single column
        grid_style = 'display:grid;grid-template-columns:1fr 1fr;gap:16px;' if total >= 2 else ''
        return f'<section style="margin-bottom:48px;"><h2 style="{section_title}margin-bottom:24px;">{decor} {label}</h2><div style="{grid_style}">{items}</div></section>'

    def _build_skills(lang_code):
        if lang_code == "en":
            skill_list = resume.skills
        else:
            skill_list = resume.skills_cn if resume.skills_cn else resume.skills
        if not skill_list:
            return ""
        label = t("skills")[0] if lang_code == "en" else t("skills")[1]
        # Progress bar visualization with multi-color cycling
        bars = ""
        total = len(skill_list)
        for i, s in enumerate(skill_list):
            # Width: varies for visual interest (70-98%)
            width = 70 + ((i * 7) % 29)
            # Cycle through tag colors for bar color
            bar_color = pc
            if has_gradient and len(gradient_colors_list) > 1:
                bar_color = gradient_colors_list[i % len(gradient_colors_list)]
            elif has_splice and len(splice_colors_list) > 1:
                bar_color = splice_colors_list[i % len(splice_colors_list)]
            bars += f'''
            <div style="margin-bottom:14px;">
                <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                    <span style="font-size:13px;color:#444;font-weight:500;">{s}</span>
                </div>
                <div style="height:10px;background:rgba(0,0,0,0.06);border-radius:{br};overflow:hidden;">
                    <div style="height:100%;width:{width}%;background:{bar_color};border-radius:{br};"></div>
                </div>
            </div>'''
        return f'<section style="margin-bottom:48px;"><h2 style="{section_title}margin-bottom:24px;">{decor} {label}</h2>{bars}</section>'

    def _build_hobbies(lang_code):
        if lang_code == "en":
            hobby_list = resume.hobbies
        else:
            hobby_list = resume.hobbies_cn if resume.hobbies_cn else resume.hobbies
        if not hobby_list:
            return ""
        label = t("hobbies")[0] if lang_code == "en" else t("hobbies")[1]
        # Cycle through colors for multi-color hobbies
        # Use solid colors for hobbies, fall back to primary
        hobby_color_list = effect_colors_raw.get('solid', [pc]) or [pc]
        hobby_styles = []
        for i, _ in enumerate(hobby_list):
            c = hobby_color_list[i % len(hobby_color_list)]
            hobby_styles.append(f"background:white;border:2px solid {c};color:{c};border-radius:50px;padding:10px 24px;")
        tags = "".join(
            f'<span style="display:inline-block;{hobby_styles[i]}margin:6px;">{h}</span>'
            for i, h in enumerate(hobby_list)
        )
        return f'<section style="margin-bottom:48px;"><h2 style="{section_title}margin-bottom:24px;">{decor} {label}</h2><div style="display:flex;flex-wrap:wrap;gap:4px;">{tags}</div></section>'

    def _build_full_page(lang_code):
        name = name_en if lang_code == "en" else name_cn
        title = title_en if lang_code == "en" else title_cn
        bio = bio_en if lang_code == "en" else bio_cn
        avatar = avatar_en if lang_code == "en" else avatar_cn
        about_label = t("about_me")[0] if lang_code == "en" else t("about_me")[1]
        footer_label = t("footer_built_with")[0] if lang_code == "en" else t("footer_built_with")[1]
        # Footer color effect (multi-effect aware)
        f_bg = footer_bg
        if has_splice:
            f_bg = splice_css
        elif has_gradient:
            f_bg = gradient_h_css
        # Accent bar at top
        accent_bar = ''
        if has_splice:
            accent_bar = f'<div style="height:6px;background:{splice_css};"></div>'
        elif has_gradient:
            accent_bar = f'<div style="height:4px;background:{gradient_h_css};"></div>'
        return f'''
        {accent_bar}
        <header style="background:{header_bg};padding:60px 20px;text-align:center;color:white;{header_style}">
            {corner_html}
            <div style="max-width:800px;margin:0 auto;position:relative;z-index:1;">
                {avatar}
                <h1 style="font-size:42px;margin:20px 0 8px 0;">{name}</h1>
                <p style="font-size:20px;opacity:0.9;">{title}</p>
                {f'<p style="margin-top:12px;opacity:0.8;font-size:14px;">{contact_html}</p>' if contact_html else ''}
            </div>
        </header>
        <main style="max-width:800px;margin:0 auto;padding:48px 20px;">
            {f'<section style="margin-bottom:48px;"><h2 style="{section_title}margin-bottom:16px;">{decor} {about_label}</h2><p style="font-size:16px;color:#555;line-height:1.8;background:{card_bg};padding:24px;border-radius:{br};box-shadow:{cs};border:{card_border};">{bio}</p></section>' if bio else ''}
            {_build_edu(lang_code)}
            {_build_work(lang_code)}
            {_build_skills(lang_code)}
            {_build_hobbies(lang_code)}
        </main>
        <footer style="text-align:center;padding:32px;background:{f_bg};color:{footer_color};font-size:14px;">
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
            font-family: {cfg['font_family']};
            background: {body_bg_css};
            {extra_body_css}
            color: #333;
            line-height: 1.6;
        }}
        {extra_css}
        {preset_extra_css}
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
