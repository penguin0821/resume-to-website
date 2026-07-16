"""Shared utility functions for HTML generators."""
import html as _html_mod
from urllib.parse import urlparse


def escape_html(text: str) -> str:
    """Escape HTML special characters in user-provided text."""
    if not text:
        return ''
    return _html_mod.escape(str(text))


def sanitize_url(url: str) -> str:
    """Validate URL protocol - only allow http/https/data:image."""
    if not url:
        return ''
    if url.startswith('data:image/'):
        return url
    try:
        parsed = urlparse(url)
        if parsed.scheme in ('http', 'https'):
            return url
    except Exception:
        pass
    return ''


# Backward-compatible aliases
_escape = escape_html
_sanitize_url = sanitize_url
