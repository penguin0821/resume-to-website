"""AI Service - Generate CSS/JS visual effects from text descriptions using Gemini API."""
import os
import re
import threading
import google.generativeai as genai
from typing import Optional

# Default API key from environment (optional - users provide their own)
_default_api_key = os.environ.get("GEMINI_API_KEY", "")

# Thread-local storage to avoid global race conditions
_thread_local = threading.local()


def _get_model_for_key(api_key: str):
    """Create a GenerativeModel with the given API key (thread-safe).
    
    Users provide their own API key. We configure per-call to avoid
    global state race conditions in concurrent scenarios.
    """
    genai.configure(api_key=api_key)
    return genai.GenerativeModel("gemini-1.5-flash")


SYSTEM_PROMPT = """You are a frontend effects generator. The user will describe a visual effect they want for their personal website.

You must return ONLY valid, self-contained code in the following JSON format:
{
  "css": "...",
  "js": "...",
  "description": "A brief one-line description of the effect in the same language as the user's request"
}

Rules:
1. The CSS and JS must work in a standalone HTML page (no external dependencies)
2. Use vanilla JavaScript only (no libraries)
3. The effect should be visually appealing and performant
4. CSS animations preferred over JS animations where possible
5. The JS should add DOM elements on load (use DOMContentLoaded)
6. Keep effects lightweight - no heavy computations
7. Return ONLY the JSON object, no markdown, no code blocks, no explanation
8. Make sure the effect doesn't block user interaction with the page content
9. The effect should use pointer-events: none where appropriate

CRITICAL LAYOUT PROTECTION RULES:
10. NEVER use global CSS selectors like 'body', '*', 'html', 'div', 'section', 'h1-h6', 'p', 'a'. All CSS must target a scoped container with id 'ai-effect-container' or its children.
11. NEVER set 'position: fixed' or 'position: absolute' on body/html. Create a dedicated overlay container instead.
12. Z-index for AI effects MUST NOT exceed 999. The page has existing UI controls that need to stay on top.
13. JS must ONLY create elements inside an element with id 'ai-effect-container'. If it doesn't exist, create it first as a child of body.
14. NEVER modify existing DOM elements. Only ADD new decorative elements inside 'ai-effect-container'.
15. NEVER use document.querySelector to modify existing elements. Only use it to find/create 'ai-effect-container'.
16. CSS must NOT contain 'background-color', 'color', 'font-family', 'font-size', 'line-height', 'margin', 'padding', 'display', 'flex', 'grid', 'width', 'height' applied to any selector without '#ai-effect-container' prefix.
17. All AI-generated CSS MUST be prefixed with '#ai-effect-container ' to scope it.

Examples of what users might request:
- "falling cherry blossom petals" -> CSS keyframe animation with JS-created elements inside ai-effect-container
- "floating particles background" -> Canvas-based particle system inside ai-effect-container
- "glowing text effect" -> CSS text-shadow animation scoped to ai-effect-container
- "snow falling effect" -> JS-created snowflake elements with CSS animation inside ai-effect-container
- "anime character floating in corner" -> CSS positioned decorative element inside ai-effect-container
- "neon glow border around sections" -> CSS box-shadow animation scoped to ai-effect-container"""


def _sanitize_ai_css(css: str) -> str:
    """Post-process AI-generated CSS to ensure it doesn't break existing layout."""
    if not css or not css.strip():
        return ""
    
    # Dangerous global selectors that could break layout
    dangerous_selectors = [
        r'(?<![.#\w])body\s*\{',
        r'(?<![.#\w])\*\s*\{',
        r'(?<![.#\w])html\s*\{',
        r'(?<![.#\w])section\s*\{',
        r'(?<![.#\w])div\s*\{',
        r'(?<![.#\w])h[1-6]\s*\{',
        r'(?<![.#\w])p\s*\{',
        r'(?<![.#\w])a\s*\{',
        r'(?<![.#\w])aside\s*\{',
    ]
    
    for pattern in dangerous_selectors:
        if re.search(pattern, css):
            # Strip the dangerous rule entirely
            css = re.sub(pattern + r'[^}]*\}', '', css)
    
    # Force z-index cap: replace any z-index > 999
    def cap_zindex(match):
        val = int(match.group(1))
        if val > 999:
            return f'z-index: 999'
        return match.group(0)
    css = re.sub(r'z-index\s*:\s*(\d+)', cap_zindex, css)
    
    return css


def _sanitize_ai_js(js: str) -> str:
    """Post-process AI-generated JS to ensure it's scoped to ai-effect-container."""
    if not js or not js.strip():
        return ""
    
    # Wrap in safety scope: ensure ai-effect-container exists
    wrapper_prefix = """
// AI Effect Safety Wrapper
(function() {
  if (!document.getElementById('ai-effect-container')) {
    var aiC = document.createElement('div');
    aiC.id = 'ai-effect-container';
    aiC.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:900;overflow:hidden;';
    document.body.appendChild(aiC);
  }
  var aiEffectContainer = document.getElementById('ai-effect-container');
"""
    wrapper_suffix = """
})();
"""
    
    # Replace common DOM creation patterns to use aiEffectContainer
    safe_js = js
    
    # Replace document.body.appendChild with aiEffectContainer.appendChild
    safe_js = re.sub(
        r'document\.body\.appendChild',
        'aiEffectContainer.appendChild',
        safe_js
    )
    
    # Replace document.body.append with aiEffectContainer.append  
    safe_js = re.sub(
        r'document\.body\.append\b',
        'aiEffectContainer.append',
        safe_js
    )
    
    # Remove any document.body.style modifications
    safe_js = re.sub(r'document\.body\.style\.[^;]*;', '', safe_js)
    safe_js = re.sub(r'document\.body\.classList\.[^;]*;', '', safe_js)
    safe_js = re.sub(r'document\.body\.setAttribute\([^;]*;', '', safe_js)
    
    return wrapper_prefix + safe_js + wrapper_suffix


def generate_effects(description: str, api_key: Optional[str] = None) -> dict:
    """Generate CSS/JS effects from a text description using Gemini.
    
    Args:
        description: User's text description of desired effect
        api_key: User's Gemini API key (required)
        
    Returns:
        dict with keys: css (str), js (str), description (str)
    """
    key = api_key or _default_api_key
    if not key:
        raise ValueError("No Gemini API key provided. Please paste your API key.")
    
    model = _get_model_for_key(key)
    
    prompt = f"{SYSTEM_PROMPT}\n\nUser request: {description}\n\nReturn ONLY the JSON object:"
    
    response = model.generate_content(prompt)
    text = response.text.strip()
    
    # Remove markdown code blocks if present
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```$", "", text)
    
    # Parse JSON
    import json
    try:
        result = json.loads(text)
    except json.JSONDecodeError:
        # Try to extract JSON from the response
        match = re.search(r'\{[\s\S]*\}', text)
        if match:
            result = json.loads(match.group())
        else:
            raise ValueError(f"Failed to parse AI response as JSON: {text[:200]}")
    
    # Validate structure and sanitize
    raw_css = result.get("css", "")
    raw_js = result.get("js", "")
    
    return {
        "css": _sanitize_ai_css(raw_css),
        "js": _sanitize_ai_js(raw_js),
        "description": result.get("description", description),
    }


# ==============================
# AI Style Chat Assistant
# ==============================

STYLE_CHAT_PROMPT = """You are a web design assistant for a resume-to-website tool.
Your job is to help users customize their personal/professional website through natural conversation.

The user's website has these configurable parameters:

For Personal Style:
- primary_color: hex color string (main theme color)
- color_effects: list of effect types from ["solid", "gradient", "shadow", "accent", "splice"]
- effect_colors: dict like {"solid": ["#xxx"], "gradient": ["#a","#b"], "shadow": ["#c"], "accent": ["#d"], "splice": ["#e","#f"]}
- ui_style: one of "cartoon", "minimal", "artistic", "retro"
- timeline_style: "alternate" (left-right zigzag) or "linear" (top-down)
- section_order: list like ["bio", "education", "work", "skills", "hobbies"]
- bg_image: background image URL or base64
- accent_pattern: "dots", "clover", "hollow", "coin", "star", "diamond", "cross", "heart", "wave"

For Professional Style:
- accent_color: hex color (accent/highlight color, e.g. gold #c9a96e)
- header_bg: hex color (header background, e.g. dark #1a1a2e)
- content_layout: "classic" (top-down), "poster" (LinkedIn banner), "sidebar" (left panel)
- timeline_style: "alternate" or "linear"
- section_order: list like ["bio", "education", "work", "skills", "hobbies"]
- ui_style: "elegant", "minimal", "corporate"

Your capabilities:
1. Suggest style parameter changes based on natural language descriptions
2. Generate visual effects (CSS/JS) for decorative elements
3. Reorder sections
4. Recommend color schemes for themes (e.g. "Harry Potter", "cyberpunk", "minimalist")

You MUST respond in JSON format:
{
  "reply": "Your friendly, concise reply in the same language as the user",
  "style_updates": { ... parameters to change ... },
  "effect": { "css": "...", "js": "...", "description": "..." } (optional, only if user wants visual effects)
}

Rules:
- reply: Always provide a helpful, friendly response explaining what you changed
- style_updates: Only include parameters that should change. Use valid values from the lists above.
- effect: Only include if the user specifically requests a visual/decorative effect (particles, animations, etc.)
- For effect CSS/JS: scope everything under '#ai-effect-container', use pointer-events:none, z-index <= 999
- Respond in the same language the user used
- Keep replies concise (2-3 sentences max)
- When user describes a theme (e.g. "Harry Potter"), suggest appropriate colors + layout + effects
- For color suggestions, always provide valid hex colors

Current style: {current_style}
Mode: {mode}"""


def generate_style_chat(message: str, api_key: Optional[str] = None, mode: str = "personal",
                        current_style: dict = None, conversation: list = None) -> dict:
    """Process a style chat message and return AI suggestions."""
    import json
    
    key = api_key or _default_api_key
    if not key:
        raise ValueError("No Gemini API key provided. Please paste your API key.")
    
    model = _get_model_for_key(key)
    
    system = STYLE_CHAT_PROMPT.format(
        current_style=json.dumps(current_style or {}, ensure_ascii=False),
        mode=mode
    )
    
    # Build conversation context
    context_parts = [system]
    if conversation:
        for msg in conversation[-6:]:  # last 6 messages for context
            role = "User" if msg.get("role") == "user" else "Assistant"
            context_parts.append(f"{role}: {msg.get('content', '')}")
    context_parts.append(f"User: {message}")
    
    prompt = "\n".join(context_parts) + "\n\nRespond ONLY with the JSON object:"
    
    response = model.generate_content(prompt)
    text = response.text.strip()
    
    # Remove markdown code blocks
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```$", "", text)
    
    try:
        result = json.loads(text)
    except json.JSONDecodeError:
        match = re.search(r'\{[\s\S]*\}', text)
        if match:
            result = json.loads(match.group())
        else:
            return {"reply": text, "style_updates": {}, "effect": {}}
    
    # Sanitize effect if present
    effect = result.get("effect", {})
    if effect and (effect.get("css") or effect.get("js")):
        effect["css"] = _sanitize_ai_css(effect.get("css", ""))
        effect["js"] = _sanitize_ai_js(effect.get("js", ""))
    
    return {
        "reply": result.get("reply", ""),
        "style_updates": result.get("style_updates", {}),
        "effect": effect if effect else {},
    }
