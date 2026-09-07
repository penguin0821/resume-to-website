"""Shared design system for generated resume websites.

Emits a coherent CSS design-token layer, typography scale, component classes,
scroll-reveal micro-interaction, print styles and responsive breakpoints.
All generated presets build on top of this so the output looks like a
designed product rather than string-concatenated inline styles.
"""

# Google Fonts import queries per family (weights kept lean).
FONT_IMPORTS = {
    "Fraunces": "family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700",
    "Inter": "family=Inter:wght@400;500;600;700",
    "Space Grotesk": "family=Space+Grotesk:wght@400;500;600;700",
    "Sora": "family=Sora:wght@400;600;700",
    "Source Serif 4": "family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700",
    "Playfair Display": "family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400",
}

_FALLBACK_SERIF = "Georgia, 'Songti SC', serif"
_FALLBACK_SANS = "'Helvetica Neue', 'PingFang SC', 'Microsoft YaHei', sans-serif"


def font_stack(family: str) -> str:
    """Return a CSS font-family stack for a known family."""
    if family in ("Fraunces", "Source Serif 4", "Playfair Display"):
        return f"'{family}', {_FALLBACK_SERIF}"
    return f"'{family}', {_FALLBACK_SANS}"


def fonts_import(*families: str) -> str:
    """Build a single Google Fonts @import for the given families."""
    parts = [FONT_IMPORTS[f] for f in families if f in FONT_IMPORTS]
    if not parts:
        return ""
    url = "https://fonts.googleapis.com/css2?" + "&".join(parts) + "&display=swap"
    return f"@import url('{url}');\n"


def render_base_css(t: dict) -> str:
    """Render the full base stylesheet for a preset token dict.

    Expected keys on ``t``:
      fd, fb            CSS font-family stacks for display / body
      fonts             tuple of Google family names to import
      bg, surface, text, muted, line, accent, accent2   colors
      extra_css         optional preset-specific CSS appended at the end
    """
    imp = fonts_import(*t.get("fonts", ()))
    extra = t.get("extra_css", "")
    return f"""{imp}:root {{
  --font-display: {t['fd']};
  --font-body: {t['fb']};
  --bg: {t['bg']};
  --surface: {t['surface']};
  --text: {t['text']};
  --muted: {t['muted']};
  --line: {t['line']};
  --accent: {t['accent']};
  --accent-2: {t.get('accent2', t['accent'])};
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px;
  --space-5: 24px; --space-6: 32px; --space-7: 48px; --space-8: 64px; --space-9: 96px;
  --radius-sm: 6px; --radius-md: 12px; --radius-lg: 20px;
  --shadow-sm: 0 1px 2px rgba(0,0,0,.05);
  --shadow-md: 0 8px 24px rgba(0,0,0,.08);
  --shadow-lg: 0 24px 60px rgba(0,0,0,.12);
  --maxw: 1080px;
}}
* {{ box-sizing: border-box; margin: 0; padding: 0; }}
html {{ scroll-behavior: smooth; }}
body {{
  font-family: var(--font-body);
  background: var(--bg);
  color: var(--text);
  line-height: 1.7;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
}}
img {{ max-width: 100%; display: block; }}
a {{ color: inherit; text-decoration: none; }}

/* ===== Typography scale ===== */
.display {{
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  line-height: 1.05;
  letter-spacing: -0.02em;
  font-weight: 700;
}}
.micro-label {{
  font-family: var(--font-body);
  font-size: .75rem;
  letter-spacing: .18em;
  text-transform: uppercase;
  color: var(--muted);
  font-weight: 600;
}}
.section-title {{
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.01em;
}}
.lead {{ font-size: 1.125rem; color: var(--muted); line-height: 1.8; }}

/* ===== Layout ===== */
.wrap {{ max-width: var(--maxw); margin: 0 auto; padding: 0 var(--space-5); }}
.hero {{ padding: var(--space-9) 0 var(--space-8); }}
.hero-split {{ display: grid; grid-template-columns: 1.4fr .6fr; gap: var(--space-7); align-items: center; }}
.grid-2 {{ display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-5); }}
.section {{ padding: var(--space-8) 0; border-top: 1px solid var(--line); }}
.section-head {{ display: flex; align-items: baseline; gap: var(--space-4); margin-bottom: var(--space-5); }}
.section-head .micro-label {{ color: var(--accent); }}

/* ===== Components ===== */
.card {{
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  padding: var(--space-5);
  box-shadow: var(--shadow-sm);
  transition: transform .25s ease, box-shadow .25s ease;
}}
.card:hover {{ transform: translateY(-3px); box-shadow: var(--shadow-md); }}
.tag {{
  display: inline-block;
  padding: 6px 14px;
  border: 1px solid var(--line);
  border-radius: 999px;
  font-size: .85rem;
  background: var(--surface);
  color: var(--text);
}}
.tag-row {{ display: flex; flex-wrap: wrap; gap: var(--space-2); }}
.hairline {{ height: 1px; background: var(--line); border: none; }}
.avatar {{ width: 132px; height: 132px; border-radius: 50%; object-fit: cover; border: 1px solid var(--line); }}
.avatar-fallback {{
  width: 132px; height: 132px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: var(--accent); color: #fff;
  font-family: var(--font-display); font-size: 3rem; font-weight: 700;
}}
.contact-row {{ display: flex; flex-wrap: wrap; gap: var(--space-4); margin-top: var(--space-5); }}
.contact-row a, .contact-row span {{ display: inline-flex; align-items: center; gap: 8px; font-size: .9rem; color: var(--muted); }}
.contact-row a:hover {{ color: var(--accent); }}
.icon {{ flex-shrink: 0; display: inline-flex; }}

/* Hero parts */
.hero-main {{ min-width: 0; }}
.hero-side {{ display: flex; justify-content: center; }}
.hero .lead {{ max-width: 46ch; }}

/* Section number marker (typographic, replaces emoji) */
.section-head .num {{ font-family: var(--font-display); font-size: .95rem; font-weight: 600; color: var(--accent); letter-spacing: .04em; font-variant-numeric: tabular-nums; }}

/* Skills */
.skill {{ margin-bottom: var(--space-4); }}
.skill:last-child {{ margin-bottom: 0; }}
.skill-top {{ display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 7px; gap: var(--space-3); }}
.skill-name {{ font-size: .95rem; font-weight: 500; }}
.skill-pct {{ font-size: .72rem; color: var(--muted); font-variant-numeric: tabular-nums; letter-spacing: .04em; }}
.bar {{ height: 6px; background: var(--line); border-radius: 999px; overflow: hidden; }}
.bar-fill {{ height: 100%; background: var(--accent); border-radius: 999px; }}

/* Education */
.edu-grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: var(--space-4); }}
.edu-logo {{ width: 44px; height: 44px; object-fit: contain; border-radius: var(--radius-sm); flex-shrink: 0; }}
.edu-head {{ display: flex; gap: var(--space-3); align-items: flex-start; }}

/* Decor + effect layers */
.bg-decor {{ position: fixed; inset: 0; z-index: -1; pointer-events: none; }}
.site {{ position: relative; z-index: 1; }}
.accent-bar {{ height: 5px; width: 100%; }}

/* Timeline */
.timeline {{ position: relative; padding-left: var(--space-5); }}
.timeline::before {{ content: ''; position: absolute; left: 0; top: 8px; bottom: 8px; width: 1px; background: var(--line); }}
.timeline-item {{ position: relative; padding-bottom: var(--space-6); }}
.timeline-item:last-child {{ padding-bottom: 0; }}
.timeline-item::before {{
  content: ''; position: absolute; left: calc(-1 * var(--space-5)); top: 9px;
  width: 9px; height: 9px; border-radius: 50%; background: var(--accent);
}}
.timeline-item h3 {{ font-size: 1.05rem; font-weight: 600; }}
.timeline-item .meta {{ font-size: .85rem; color: var(--muted); margin: 2px 0 8px; }}
.timeline-item p {{ font-size: .95rem; color: var(--muted); }}

/* Timeline variant: alternating cards in a 2-col grid (used by 'alternate') */
.timeline--alt {{ padding-left: 0; display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }}
.timeline--alt::before {{ display: none; }}
.timeline--alt .timeline-item {{ padding-bottom: 0; background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius-md); padding: var(--space-5); box-shadow: var(--shadow-sm); transition: transform .25s ease, box-shadow .25s ease; }}
.timeline--alt .timeline-item:hover {{ transform: translateY(-3px); box-shadow: var(--shadow-md); }}
.timeline--alt .timeline-item::before {{ display: none; }}
@media (max-width: 768px) {{ .timeline--alt {{ grid-template-columns: 1fr; }} }}

/* Sidebar layout (professional) */
.layout-sidebar .shell {{ display: grid; grid-template-columns: 300px 1fr; min-height: 100vh; }}
.side {{ padding: var(--space-7) var(--space-5); }}
.side .side-id {{ text-align: center; margin-bottom: var(--space-6); }}
.side .avatar, .side .avatar-fallback {{ margin: 0 auto var(--space-4); }}
.side h1 {{ font-family: var(--font-display); font-size: 1.5rem; line-height: 1.15; margin-bottom: 6px; }}
.side .side-title {{ font-size: .8rem; letter-spacing: .12em; text-transform: uppercase; }}
.side .contact-row {{ flex-direction: column; gap: var(--space-3); align-items: flex-start; margin-top: var(--space-5); }}
.side .section {{ border-top: 1px solid rgba(255,255,255,.16); padding: var(--space-5) 0 0; margin-top: var(--space-5); }}
.side-main {{ padding: var(--space-8) var(--space-7); }}
@media (max-width: 768px) {{
  .layout-sidebar .shell {{ grid-template-columns: 1fr; }}
  .side-main {{ padding: var(--space-6) var(--space-5); }}
}}

.footer {{ padding: var(--space-7) 0; border-top: 1px solid var(--line); color: var(--muted); font-size: .85rem; }}

/* ===== Micro-interaction: scroll reveal ===== */
.reveal {{ opacity: 0; transform: translateY(18px); transition: opacity .6s ease, transform .6s ease; }}
.reveal.in {{ opacity: 1; transform: none; }}

/* ===== Print ===== */
@media print {{
  .reveal {{ opacity: 1 !important; transform: none !important; transition: none !important; }}
  .no-print {{ display: none !important; }}
  body {{ background: #fff; }}
  .card {{ box-shadow: none; break-inside: avoid; }}
  .section {{ break-inside: avoid; }}
  .hero {{ padding: var(--space-6) 0; }}
}}

/* ===== Responsive ===== */
@media (max-width: 768px) {{
  .grid-2 {{ grid-template-columns: 1fr; }}
  .hero-split {{ grid-template-columns: 1fr; }}
  .display {{ font-size: clamp(2rem, 9vw, 3rem); }}
  .hero {{ padding: var(--space-7) 0 var(--space-6); }}
}}
{extra}
"""


def render_reveal_js() -> str:
    """IntersectionObserver-based scroll reveal; degrades gracefully."""
    return """<script>
(function(){
  var els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach(function(e){ e.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(function(e){ io.observe(e); });
})();
</script>"""


def render_head_meta(title: str, description: str, avatar_url: str = "") -> str:
    """OG / meta tags so generated sites share nicely."""
    og_image = f'<meta property="og:image" content="{avatar_url}">' if avatar_url else ""
    return (
        f'<meta charset="UTF-8">\n'
        f'<meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
        f'<meta name="description" content="{description}">\n'
        f'<meta property="og:title" content="{title}">\n'
        f'<meta property="og:description" content="{description}">\n'
        f'<meta property="og:type" content="profile">\n'
        f"{og_image}\n"
        f"<title>{title}</title>\n"
    )
