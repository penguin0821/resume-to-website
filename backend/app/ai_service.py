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

Examples of what users might request:
- "falling cherry blossom petals" -> CSS keyframe animation with JS-created elements
- "floating particles background" -> Canvas-based particle system
- "glowing text effect" -> CSS text-shadow animation
- "snow falling effect" -> JS-created snowflake elements with CSS animation
- "anime character floating in corner" -> CSS positioned decorative element
- "neon glow border around sections" -> CSS box-shadow animation"""


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
    
    # Validate structure
    return {
        "css": result.get("css", ""),
        "js": result.get("js", ""),
        "description": result.get("description", description),
    }
