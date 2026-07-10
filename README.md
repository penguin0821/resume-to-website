# Resume-to-Website 简历转个人网站

> 把你的简历变成一个精美的个人网站，支持中英双语。

[![Status](https://img.shields.io/badge/status-work_in_progress-yellow)](https://github.com/penguin0821/resume-to-website)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

## 项目简介

Resume-to-Website 是一个全栈 Web 应用，帮助用户将简历信息快速生成精美的个人网站。提供两种风格模式：

- **个性创意风** - 自定义配色、UI 风格、关键词标签，适合个人博客和作品集
- **职业精英风** - 简洁大气的 LinkedIn 风格，适合求职和职业展示

生成的网站支持**中英双语切换**，可下载为独立 HTML 文件直接部署。

## 功能特性

- 两种网站风格：个性创意 / 职业精英
- 表单录入简历信息（工作经历、教育背景、技能、爱好）
- 头像上传（支持本地上传 + URL 链接，2MB 大小限制）
- 背景图片上传（个性创意模式）
- 4 种 UI 风格预设：卡通风、极简风、艺术风、复古风
- **多效果组合颜色系统**：纯色 / 渐变 / 阴影 / 点缀 / 拼接，支持多效果叠加（如渐变+阴影、拼接+点缀）
- **10 种点缀花纹**：圆点、四叶草、空心圆、铜钱纹、五角星、四角星、菱形、十字、爱心、波浪
- **点缀布局模式**：均匀 / 随机（随机布局每次生成不同效果）
- **拼接模式**：横向 / 斜向方向 + 间隔重复（如红蓝红蓝红蓝）
- 职业精英风支持 3 种 UI 预设：优雅 / 极简 / 商务，可自定义点缀色和头部背景
- 职业精英风支持 3 种内容布局：经典 / 海报 / 侧边栏
- **AI 风格助手**：通过 Gemini API 对话调整设计风格（用户自主申请 Key）
- **AI 特效**：基于 Gemini API 生成动态 CSS/JS 特效，含安全清洗机制
- **拖拽板块排序**：自定义简历各板块的展示顺序
- **网站截图下载**：预览页一键截图保存为 PNG（基于 html-to-image）
- **预览持久化**：预览数据存入 sessionStorage，刷新页面不丢失
- **安全防护**：所有用户输入 HTML 转义（XSS 防护）+ URL 协议清洗
- 一键部署到 GitHub Pages / Netlify（匿名部署，24h 过期）
- 中英双语界面（前端应用 + 生成网站均支持 EN/CN 切换）
- 双语网站生成（可分别填写中英文内容，一键切换）
- 动态添加多条工作经历 / 教育经历
- 多标签技能 & 爱好输入
- 预览生成结果 + 下载 HTML 文件
- **3D 动态首页**：MetaBalls、粒子场、能量核心、魔法环等 WebGL 动效

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | React 19 + Vite 8 |
| UI 样式 | Tailwind CSS 4 |
| 路由 | React Router DOM v7 |
| 3D 动效 | Three.js + OGL + Motion |
| 截图 | html-to-image |
| 后端框架 | Python FastAPI + Uvicorn |
| 数据校验 | Pydantic v2 |
| AI 服务 | Google Generative AI (Gemini 1.5 Flash) |
| 双语方案 | React Context + 自定义 i18n |

## 本地运行

### 前置要求

- **Node.js** >= 18（推荐通过 [nvm](https://github.com/nvm-sh/nvm) 安装）
- **Python** >= 3.9

### 1. 克隆项目

```bash
git clone https://github.com/penguin0821/resume-to-website.git
cd resume-to-website
```

### 2. 启动后端

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 3. 启动前端（新开一个终端）

```bash
cd frontend
npm install
npm run dev
```

### 4. 打开浏览器

访问 `http://localhost:3000`（Vite 配置固定端口 3000）。

## 项目结构

```
resume-to-website/
├── backend/
│   └── app/
│       ├── main.py                 # FastAPI 入口
│       ├── routes.py               # API 路由
│       ├── models.py               # Pydantic 数据模型
│       ├── ai_service.py           # AI 特效服务（Gemini API）
│       ├── deploy_service.py       # 部署服务（GitHub Pages / Netlify）
│       └── generators/
│           ├── i18n.py             # 双语工具（切换脚本、标签字典）
│           ├── personal.py         # 个性创意风格生成器
│           └── professional.py     # 职业精英风格生成器
├── frontend/
│   └── src/
│       ├── main.jsx                # React 入口
│       ├── App.jsx                 # 路由配置
│       ├── i18n.js                 # 中英文翻译字典
│       ├── LanguageContext.jsx     # 语言状态管理
│       ├── components/
│       │   ├── Navbar.jsx          # 导航栏（含 EN/CN 切换按钮）
│       │   ├── ResumeForm.jsx      # 简历表单（核心组件）
│       │   ├── AIChatPanel.jsx     # AI 风格助手面板
│       │   ├── SectionOrder.jsx    # 拖拽板块排序
│       │   └── reactbits/          # 3D WebGL 动效组件
│       │       ├── MetaBalls.jsx        # 元球特效
│       │       ├── MagicRings.jsx       # 魔法环特效
│       │       ├── Orb.jsx              # 能量核心特效
│       │       └── ElectricBorder.jsx   # 电光边框特效
│       └── pages/
│           ├── Home.jsx            # 首页（风格选择）
│           ├── PersonalForm.jsx    # 个性创意表单
│           ├── ProfessionalForm.jsx# 职业精英表单
│           └── Preview.jsx         # 预览 & 截图 & 部署页
└── README.md
```

## 使用指南

### 基本流程

1. 打开首页，选择网站风格（个性创意 / 职业精英）
2. 填写基本信息（姓名、职位、邮箱等）
3. 添加工作经历、教育背景、技能、爱好
4. （个性创意模式）设置配色、UI 风格、关键词、背景图
5. 点击生成按钮
6. 在预览页查看效果，满意后点击"下载 HTML"

### 双语网站

1. 点击右上角 **EN / 中文** 切换前端界面语言
2. 表单中打开 **中英双语支持** 开关，为中文字段填写对应翻译
3. 生成的网站将自动支持语言切换
4. 如果只填写了一种语言，则生成单语言网站

## 开发计划

- [x] AI 特效（基于 Gemini API，用户自主申请 Key）
- [x] 一键部署到 GitHub Pages / Netlify
- [ ] AI 简历解析（上传 PDF/Word 自动提取信息）
- [ ] 更多网站模板和风格
- [ ] 在线编辑器（实时调整生成网站样式）
- [ ] 移动端响应式优化

## 贡献

本项目目前处于早期开发阶段，欢迎提出 Issue 和 Pull Request。

## 许可证

[MIT](LICENSE)
