# AGENTS.md — Resume-to-Website 项目规则

## 项目定位
全栈 Web 应用：用户填写简历 → 生成精美个人网站（HTML），支持双语、AI 风格调整、AI 特效。

## 本地运行
```bash
# 后端 (port 8000)
cd backend && source venv/bin/activate && uvicorn app.main:app --reload --port 8000

# 前端 (port 3000, 新开终端)
cd frontend && npx vite --port 3000 --host
```
- 前端固定端口 **3000**，后端固定端口 **8000**
- 前端通过 Vite proxy 将 `/api` 转发到 `localhost:8000`

## 技术栈
| 层 | 技术 |
|---|---|
| 前端 | React 19 + Vite 8 + Tailwind CSS 4 + Motion + Three.js/OGL |
| 后端 | Python 3.9+ + FastAPI + Uvicorn + Pydantic v2 |
| AI | LiteLLM (统一接口，8厂商13+模型) |
| 双语 | React Context + 自定义 i18n 字典 |

## 目录约定
```
backend/app/
  main.py          — FastAPI 入口
  routes.py        — API 路由
  models.py        — Pydantic 模型
  ai_service.py    — LiteLLM AI 服务（多模型）
  deploy_service.py— 部署服务
  generators/      — HTML 生成器 (personal/professional/utils/i18n)

frontend/src/
  App.jsx          — 路由
  i18n.js          — 中英文字典
  config.js        — API_BASE_URL 配置
  components/      — 共享组件 (ResumeForm, AIChatPanel, Navbar, SectionOrder)
  components/reactbits/ — WebGL 动效 (含 Lazy 懒加载版本)
  pages/           — 页面 (Home, PersonalForm, ProfessionalForm, Preview)
```

## 当前状态
- 前端：React 19 + Vite 8，运行正常
- 后端：FastAPI + LiteLLM，支持 8 个 AI 厂商
- 未提交改动：i18n 双语文案通用化、AI 模型选择器重构、API Key 文案更新
- 无 AGENTS.md 之前的规则文件

## 编码注意
- Python 3.9 不支持 `X | Y` 联合类型语法，用 `Optional[X]` 或 `Union[X, Y]`
- React 中 `useCallback` 依赖的变量必须在当前 callback 之前定义
- i18n 文案保持语言中立（双语功能用"第二语言"而非"中文"）
- AI 模型相关文案不硬编码厂商名（用通用 fallback）
- `google-generativeai` 是 LiteLLM 的 fallback 依赖，不要删除
