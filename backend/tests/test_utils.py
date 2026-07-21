"""Tests for backend/app/generators/utils.py — HTML escaping and URL sanitization.

These are pure functions (same input = same output), making them ideal for
unit testing. They are also the core of XSS protection, so they must have
tests to guarantee they are never broken.
"""
import pytest
from app.generators.utils import escape_html, sanitize_url


# ── escape_html ──────────────────────────────────────────────

class TestEscapeHtml:
    """escape_html() should convert dangerous characters to HTML entities."""

    def test_script_tag_escaped(self):
        """XSS: <script> should become &lt;script&gt;."""
        result = escape_html('<script>alert(1)</script>')
        assert '<script>' not in result
        assert '&lt;script&gt;' in result

    def test_angle_brackets_escaped(self):
        assert escape_html('<b>bold</b>') == '&lt;b&gt;bold&lt;/b&gt;'

    def test_ampersand_escaped(self):
        assert escape_html('Tom & Jerry') == 'Tom &amp; Jerry'

    def test_quotes_escaped(self):
        result = escape_html('"hello" \'world\'')
        assert '&quot;' in result or '&#x27;' in result or '&#39;' in result

    def test_empty_string(self):
        assert escape_html('') == ''

    def test_none_returns_empty(self):
        assert escape_html(None) == ''

    def test_normal_text_unchanged(self):
        """Normal text without special chars should pass through."""
        assert escape_html('Hello World 你好世界') == 'Hello World 你好世界'

    def test_chinese_text_unchanged(self):
        assert escape_html('张三 高级工程师') == '张三 高级工程师'

    def test_numeric_input_converted(self):
        """Non-string input should be converted to string first."""
        assert escape_html(123) == '123'


# ── sanitize_url ─────────────────────────────────────────────

class TestSanitizeUrl:
    """sanitize_url() should only allow safe URL protocols."""

    def test_https_url_passes(self):
        url = 'https://example.com/avatar.jpg'
        assert sanitize_url(url) == url

    def test_http_url_passes(self):
        url = 'http://example.com/photo.png'
        assert sanitize_url(url) == url

    def test_data_image_url_passes(self):
        url = 'data:image/png;base64,iVBORw0KGgo='
        assert sanitize_url(url) == url

    def test_javascript_protocol_blocked(self):
        """XSS: javascript: protocol must be stripped."""
        assert sanitize_url('javascript:alert(1)') == ''

    def test_data_non_image_blocked(self):
        """data: URLs that are not images should be blocked."""
        assert sanitize_url('data:text/html,<script>alert(1)</script>') == ''

    def test_ftp_protocol_blocked(self):
        assert sanitize_url('ftp://files.example.com/doc.pdf') == ''

    def test_empty_string(self):
        assert sanitize_url('') == ''

    def test_none_returns_empty(self):
        assert sanitize_url(None) == ''

    def test_malformed_url(self):
        assert sanitize_url('not a url at all') == ''
