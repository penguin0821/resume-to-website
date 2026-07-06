from app.models import ResumeData
from app.generators.i18n import TOGGLE_SCRIPT, TOGGLE_BUTTON, t


def generate_professional_site(resume: ResumeData, lang: str = "zh", bilingual: bool = False) -> str:
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

    def _avatar(name):
        if resume.avatar_url:
            return f'<img src="{resume.avatar_url}" alt="avatar" style="width:100px;height:100px;border-radius:50%;object-fit:cover;border:3px solid #c9a96e;" />'
        initial = name[0] if name else ""
        return f'<div style="width:100px;height:100px;border-radius:50%;background:#1a1a2e;display:flex;align-items:center;justify-content:center;color:#c9a96e;font-size:40px;font-weight:300;border:3px solid #c9a96e;">{initial}</div>'

    def _build_work(lang_code):
        if not resume.work_experiences:
            return ""
        label = t("professional_experience")[0] if lang_code == "en" else t("professional_experience")[1]
        items = ""
        for exp in resume.work_experiences:
            pos = exp.position if lang_code == "en" else (exp.position_cn or exp.position)
            comp = exp.company if lang_code == "en" else (exp.company_cn or exp.company)
            dur = exp.duration if lang_code == "en" else (exp.duration_cn or exp.duration)
            desc = exp.description if lang_code == "en" else (exp.description_cn or exp.description)
            items += f'''
            <div style="position:relative;padding-left:32px;margin-bottom:32px;border-left:2px solid #c9a96e;">
                <div style="position:absolute;left:-7px;top:4px;width:12px;height:12px;background:#c9a96e;border-radius:50%;"></div>
                <h3 style="margin:0 0 2px 0;font-size:18px;color:#1a1a2e;font-weight:600;">{pos}</h3>
                <p style="margin:0 0 2px 0;color:#c9a96e;font-weight:500;letter-spacing:0.5px;">{comp}</p>
                <p style="margin:0 0 8px 0;color:#999;font-size:13px;letter-spacing:1px;">{dur}</p>
                <p style="margin:0;color:#555;line-height:1.7;font-size:15px;">{desc}</p>
            </div>'''
        return f'<section style="margin-bottom:56px;"><h2 style="font-size:14px;letter-spacing:3px;color:#c9a96e;margin-bottom:32px;font-weight:600;">{label}</h2>{items}</section>'

    def _build_edu(lang_code):
        if not resume.educations:
            return ""
        label = t("education")[0] if lang_code == "en" else t("education")[1]
        items = ""
        for edu in resume.educations:
            school = edu.school if lang_code == "en" else (edu.school_cn or edu.school)
            major = edu.major if lang_code == "en" else (edu.major_cn or edu.major)
            dur = edu.duration if lang_code == "en" else (edu.duration_cn or edu.duration)
            items += f'''
            <div style="display:flex;justify-content:space-between;align-items:baseline;padding:16px 0;border-bottom:1px solid #f0f0f0;">
                <div>
                    <h3 style="margin:0;font-size:16px;color:#1a1a2e;font-weight:600;">{school}</h3>
                    <p style="margin:4px 0 0 0;color:#666;font-size:14px;">{major}</p>
                </div>
                <span style="color:#999;font-size:13px;white-space:nowrap;">{dur}</span>
            </div>'''
        return f'<section style="margin-bottom:56px;"><h2 style="font-size:14px;letter-spacing:3px;color:#c9a96e;margin-bottom:24px;font-weight:600;">{label}</h2>{items}</section>'

    def _build_skills(lang_code):
        skill_list = resume.skills if lang_code == "en" else (resume.skills_cn if resume.skills_cn else resume.skills)
        if not skill_list:
            return ""
        label = t("core_competencies")[0] if lang_code == "en" else t("core_competencies")[1]
        tags = "".join(f'<span style="display:inline-block;padding:6px 16px;margin:4px;border:1px solid #e0e0e0;color:#555;font-size:13px;letter-spacing:0.5px;">{s}</span>' for s in skill_list)
        return f'<section style="margin-bottom:56px;"><h2 style="font-size:14px;letter-spacing:3px;color:#c9a96e;margin-bottom:24px;font-weight:600;">{label}</h2><div style="display:flex;flex-wrap:wrap;gap:4px;">{tags}</div></section>'

    def _build_hobbies(lang_code):
        hobby_list = resume.hobbies if lang_code == "en" else (resume.hobbies_cn if resume.hobbies_cn else resume.hobbies)
        if not hobby_list:
            return ""
        label = t("interests")[0] if lang_code == "en" else t("interests")[1]
        items = " &nbsp;&middot;&nbsp; ".join(f'<span style="color:#666;">{h}</span>' for h in hobby_list)
        return f'<section style="margin-bottom:56px;"><h2 style="font-size:14px;letter-spacing:3px;color:#c9a96e;margin-bottom:16px;font-weight:600;">{label}</h2><p style="font-size:15px;line-height:1.8;">{items}</p></section>'

    def _build_full_page(lang_code):
        name = name_en if lang_code == "en" else name_cn
        title = title_en if lang_code == "en" else title_cn
        bio = bio_en if lang_code == "en" else bio_cn
        avatar = _avatar(name)
        profile_label = t("profile_summary")[0] if lang_code == "en" else t("profile_summary")[1]
        footer_label = t("footer_built_with")[0] if lang_code == "en" else t("footer_built_with")[1]
        title_style = 'text-transform:uppercase;' if lang_code == "en" else ''
        return f'''
        <header style="background:#1a1a2e;padding:60px 20px;text-align:center;">
            <div style="max-width:720px;margin:0 auto;">
                {avatar}
                <h1 style="font-size:36px;margin:24px 0 4px 0;color:#ffffff;font-weight:300;letter-spacing:2px;">{name}</h1>
                <p style="font-size:16px;color:#c9a96e;letter-spacing:3px;font-weight:500;{title_style}">{title}</p>
                {f'<p style="margin-top:16px;color:#888;font-size:13px;letter-spacing:1px;">{contact_html}</p>' if contact_html else ''}
            </div>
        </header>
        <div style="height:4px;background:linear-gradient(90deg, #c9a96e, #e8d5a3, #c9a96e);"></div>
        <main style="max-width:720px;margin:0 auto;padding:56px 20px;">
            {f'<section style="margin-bottom:56px;"><h2 style="font-size:14px;letter-spacing:3px;color:#c9a96e;margin-bottom:16px;font-weight:600;">{profile_label}</h2><p style="font-size:15px;color:#555;line-height:1.9;padding:20px 0;border-bottom:1px solid #f0f0f0;">{bio}</p></section>' if bio else ''}
            {_build_work(lang_code)}
            {_build_edu(lang_code)}
            {_build_skills(lang_code)}
            {_build_hobbies(lang_code)}
        </main>
        <footer style="text-align:center;padding:40px 20px;background:#1a1a2e;color:#666;font-size:12px;letter-spacing:1px;">
            <p style="color:#c9a96e;margin-bottom:4px;">{name}</p>
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

    html = f'''<!DOCTYPE html>
<html lang="{html_lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{page_title}</title>
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{
            font-family: 'Helvetica Neue', 'PingFang SC', -apple-system, sans-serif;
            background: #fafafa;
            color: #333;
            line-height: 1.6;
        }}
        {extra_css}
    </style>
    {script}
</head>
<body>
    {body}
</body>
</html>'''
    return html
