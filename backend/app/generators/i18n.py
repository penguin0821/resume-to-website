# Shared i18n utilities for bilingual HTML generation
# Generates two completely separate language versions, toggled by button

TOGGLE_SCRIPT = '''
<script>
  let currentLang = "zh";
  function toggleLang() {
    currentLang = currentLang === "zh" ? "en" : "zh";
    document.querySelectorAll(".lang-zh").forEach(el => {
      el.style.display = currentLang === "zh" ? "" : "none";
    });
    document.querySelectorAll(".lang-en").forEach(el => {
      el.style.display = currentLang === "en" ? "" : "none";
    });
    const btn = document.getElementById("lang-toggle");
    if (btn) btn.textContent = currentLang === "zh" ? "English" : "\\u4E2D\\u6587";
    document.documentElement.lang = currentLang === "zh" ? "zh-CN" : "en";
  }
</script>
'''

TOGGLE_BUTTON = '''
<div style="position:fixed;top:16px;right:16px;z-index:9999;">
  <button id="lang-toggle" onclick="toggleLang()" style="
    background:rgba(255,255,255,0.95);
    border:1px solid #ddd;
    padding:8px 20px;
    border-radius:20px;
    cursor:pointer;
    font-size:14px;
    font-weight:600;
    color:#333;
    box-shadow:0 2px 8px rgba(0,0,0,0.1);
    transition:all 0.2s;
    letter-spacing:0.5px;
  " onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'" onmouseout="this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)'">
    English
  </button>
</div>
'''

# Section labels: (english, chinese)
LABELS = {
    "about_me": ("About Me", "关于我"),
    "work_experience": ("Work Experience", "工作经历"),
    "education": ("Education", "教育背景"),
    "skills": ("Skills", "专业技能"),
    "hobbies": ("Hobbies", "兴趣爱好"),
    "profile_summary": ("Profile Summary", "个人简介"),
    "professional_experience": ("Professional Experience", "职业经历"),
    "core_competencies": ("Core Competencies", "核心能力"),
    "interests": ("Interests", "兴趣领域"),
    "footer_built_with": ("Built with Resume-to-Site", "由 Resume-to-Site 生成"),
}


def t(key: str) -> tuple:
    """Get (en, zh) label pair"""
    return LABELS.get(key, (key, key))
