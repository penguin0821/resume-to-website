"""AI Service - Generate CSS/JS visual effects from text descriptions using Gemini API."""
import os
import re
import google.generativeai as genai
from typing import Optional

# Initialize Gemini client
_api_key = os.environ.get("GEMINI_API_KEY", "")
if _api_key:
    genai.configure(api_key=_api_key)

_model = None


def _get_model():
    global _model
    if _model is None:
        if not _api_key:
            raise ValueError("GEMINI_API_KEY not set. Get one at https://aistudio.google.com/apikey")
        _model = genai.GenerativeModel("gemini-1.5-flash")
    return _model


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
        api_key: Optional API key override
        
    Returns:
        dict with keys: css (str), js (str), description (str)
    """
    key = api_key or _api_key
    if not key:
        raise ValueError("No Gemini API key provided")
    
    if api_key and api_key != _api_key:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-1.5-flash")
    else:
        model = _get_model()
    
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
