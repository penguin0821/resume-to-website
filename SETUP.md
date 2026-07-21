# 项目复现指南 — 从零到运行

> 这份文档告诉你：拿到一台全新的电脑后，如何从 GitHub 仓库把这个项目完整跑起来。
> 全程不需要任何前置知识，跟着做就行。

---

## 目录

1. [你需要先装什么](#1-你需要先装什么)
2. [把代码从 GitHub 下载到电脑](#2-把代码从-github-下载到电脑)
3. [启动后端服务](#3-启动后端服务)
4. [启动前端服务](#4-启动前端服务)
5. [打开浏览器验证](#5-打开浏览器验证)
6. [运行测试](#6-运行测试)
7. [常见问题排查](#7-常见问题排查)
8. [项目文件结构说明](#8-项目文件结构说明)

---

## 1. 你需要先装什么

在你的新电脑上，需要安装以下三个工具：

### 1.1 安装 Git

Git 是版本控制工具，用来从 GitHub 下载代码。

**检查是否已安装：** 打开终端（Mac: `Cmd+Space` 输入 `terminal`，Windows: 搜索 `cmd`），输入：

```bash
git --version
```

如果显示版本号（如 `git version 2.x.x`）就说明已经装了。

**如果没有安装：**
- **Mac**: 终端输入 `xcode-select --install`，按提示安装
- **Windows**: 去 [https://git-scm.com/download/win](https://git-scm.com/download/win) 下载安装，一路 Next 即可

### 1.2 安装 Node.js（前端需要）

Node.js 是 JavaScript 的运行环境，前端代码需要它来运行。

**要求版本：>= 18**

**检查是否已安装：**

```bash
node --version
```

如果显示 `v18.x.x` 或更高就行。

**如果没有安装：**
- 推荐去 [https://nodejs.org](https://nodejs.org) 下载 LTS 版本安装
- 或者用 nvm（Node 版本管理器）安装：

```bash
# 安装 nvm（Mac/Linux）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash

# 重启终端后
nvm install 20
nvm use 20
```

### 1.3 安装 Python（后端需要）

Python 是后端的编程语言。

**要求版本：>= 3.9**

**检查是否已安装：**

```bash
python3 --version
```

如果显示 `Python 3.9.x` 或更高就行。（Windows 上可能命令是 `python --version`）

**如果没有安装：**
- **Mac**: `brew install python@3.11`（需要先装 Homebrew: [https://brew.sh](https://brew.sh)）
- **Windows**: 去 [https://www.python.org/downloads/](https://www.python.org/downloads/) 下载安装，**勾选 "Add Python to PATH"**

---

## 2. 把代码从 GitHub 下载到电脑

打开终端，进入你想放项目的目录（比如桌面），然后执行：

```bash
cd ~/Desktop
git clone https://github.com/penguin0821/resume-to-website.git
cd resume-to-website
```

执行完后，你的电脑上就有了一个 `resume-to-website` 文件夹，里面包含项目的所有代码。

> **提示**：如果你以后修改了代码想更新，只需进入这个目录执行 `git pull` 即可拉取最新代码。

---

## 3. 启动后端服务

后端是用 Python 写的 FastAPI 服务，负责生成 HTML 页面和 AI 功能。

### 3.1 进入后端目录

```bash
cd backend
```

### 3.2 创建 Python 虚拟环境

虚拟环境是一个隔离的 Python 环境，安装依赖不会影响你电脑上的其他项目。

```bash
# 创建虚拟环境（名字叫 venv）
python3 -m venv venv

# 激活虚拟环境
# Mac / Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate
```

激活后，你的终端提示符前面会出现 `(venv)`，说明虚拟环境已激活。

> **重要**：以后每次打开新终端窗口，都要重新 `cd backend` 然后 `source venv/bin/activate`。

### 3.3 安装后端依赖

```bash
pip install -r requirements.txt
```

这会安装项目需要的所有 Python 库（FastAPI、LiteLLM、Pydantic 等）。安装过程可能需要 1-2 分钟，耐心等待。

### 3.4 启动后端

```bash
uvicorn app.main:app --reload --port 8000
```

看到类似这样的输出就说明后端启动成功了：

```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Started reloader process
```

> `--reload` 参数让后端在代码修改后自动重启，开发时很方便。

**不要关闭这个终端窗口！** 后端需要一直运行。新开一个终端窗口继续下面的步骤。

---

## 4. 启动前端服务

前端是用 React + Vite 写的单页应用，负责用户界面。

### 4.1 新开一个终端，进入前端目录

```bash
cd ~/Desktop/resume-to-website/frontend
```

（路径根据你实际 clone 的位置调整）

### 4.2 安装前端依赖

```bash
npm install
```

这会安装 React、Vite、Tailwind CSS、Three.js 等所有前端库。可能需要 1-2 分钟。

### 4.3 启动前端

```bash
npm run dev
```

看到类似这样的输出就说明前端启动成功了：

```
  VITE v8.x.x  ready in xxx ms
  ➜  Local:   http://localhost:3000/
```

**同样不要关闭这个终端窗口！**

---

## 5. 打开浏览器验证

现在打开浏览器，访问：

**http://localhost:3000**

你应该能看到项目的首页（赛博风能量核心页面）。

### 功能验证清单

| 测试项 | 怎么测 | 预期结果 |
|---|---|---|
| 首页加载 | 访问 http://localhost:3000 | 看到赛博风首页 |
| 个性创意风 | 点击"个性创意风" | 进入表单页，可以填写信息 |
| 职业精英风 | 点击"职业精英风" | 进入另一个表单页 |
| 生成网站 | 填完表单点"生成" | 预览页显示生成的 HTML |
| 中英切换 | 点右上角 EN / 中文 | 界面语言切换 |
| AI 模型面板 | 表单页展开 AI 助手 | 看到模型选择器 + 自定义输入 |

---

## 6. 运行测试

项目自带 77 个自动化测试，用来保证代码改动不会破坏功能。

### 一键运行所有测试

在项目根目录执行：

```bash
cd ~/Desktop/resume-to-website
bash run_tests.sh
```

### 或者分开运行

**后端测试（69 个用例）：**

```bash
cd backend
source venv/bin/activate
python -m pytest tests/ -v
```

**前端测试（8 个用例）：**

```bash
cd frontend
npx vitest run
```

全部通过会显示 `ALL TESTS PASSED`。

---

## 7. 常见问题排查

### Q: `node: command not found` 或 `npm: command not found`

Node.js 没装好，重新安装或检查 PATH 环境变量。

### Q: `python3: command not found`

Mac 上试试 `python --version`，Windows 上确认安装时勾选了 "Add to PATH"。

### Q: `pip install` 报错权限不够

在命令前加 `--user` 或使用虚拟环境（按上面的步骤走虚拟环境就不会有这个问题）。

### Q: 后端启动报 `Address already in use`

端口 8000 被占用了。先找到占用进程：

```bash
# Mac/Linux
lsof -i :8000
# 然后用 kill -9 <PID> 关掉它
```

或者换一个端口：`uvicorn app.main:app --reload --port 8001`（同时需要改前端的 Vite proxy 配置）。

### Q: 前端启动报 `Port 3000 is already in use`

同上，端口被占用。可以：

```bash
npx vite --port 3001
```

然后用 http://localhost:3001 访问。

### Q: 点击生成后白屏或报错

检查后端是否正常运行。在另一个终端访问 http://localhost:8000 看是否返回 JSON。

### Q: `ModuleNotFoundError: No module named 'xxx'`

后端虚拟环境没激活。确保执行了 `source venv/bin/activate`（Mac）或 `venv\Scripts\activate`（Windows）。

### Q: AI 功能不能用

AI 功能需要 API Key。在 AI 助手面板中选择模型厂商，去对应网站申请 Key 后粘贴即可。不需要 Key 也能正常使用表单和生成功能。

---

## 8. 项目文件结构说明

```
resume-to-website/
│
├── backend/                     # 后端（Python FastAPI）
│   ├── app/
│   │   ├── main.py              # 后端入口，启动 FastAPI 服务
│   │   ├── routes.py            # API 路由定义（/api/generate 等）
│   │   ├── models.py            # 数据模型（简历、风格、请求格式）
│   │   ├── ai_service.py        # AI 服务（LiteLLM 多模型调用）
│   │   ├── deploy_service.py    # 部署服务（Netlify / GitHub Pages）
│   │   └── generators/          # HTML 生成器
│   │       ├── personal.py      # 个性创意风 HTML 生成
│   │       ├── professional.py  # 职业精英风 HTML 生成
│   │       ├── utils.py         # 工具函数（XSS 防护、URL 清洗）
│   │       └── i18n.py          # 双语切换脚本和标签
│   ├── tests/                   # 后端测试
│   ├── requirements.txt         # Python 依赖清单
│   └── venv/                    # Python 虚拟环境（不上传 GitHub）
│
├── frontend/                    # 前端（React + Vite）
│   ├── src/
│   │   ├── main.jsx             # React 入口
│   │   ├── App.jsx              # 路由配置
│   │   ├── i18n.js              # 中英文翻译字典
│   │   ├── config.js            # API 地址配置
│   │   ├── components/          # 共享组件
│   │   │   ├── ResumeForm.jsx   # 简历表单（核心组件）
│   │   │   ├── AIChatPanel.jsx  # AI 风格助手面板
│   │   │   ├── Navbar.jsx       # 导航栏
│   │   │   ├── SectionOrder.jsx # 拖拽排序
│   │   │   └── reactbits/       # 3D WebGL 动效组件
│   │   ├── pages/               # 页面
│   │   │   ├── Home.jsx         # 首页
│   │   │   ├── PersonalForm.jsx # 个性创意表单
│   │   │   ├── ProfessionalForm.jsx # 职业精英表单
│   │   │   └── Preview.jsx      # 预览 & 部署页
│   │   └── __tests__/           # 前端测试
│   ├── package.json             # Node.js 依赖清单
│   └── vite.config.js           # Vite 配置（端口 3000 + API 代理）
│
├── AGENTS.md                    # AI 编程助手规则文件
├── run_tests.sh                 # 一键测试脚本
├── SETUP.md                     # 本文档
└── README.md                    # 项目介绍文档
```

---

## 快速参考卡片

把这段命令复制粘贴，就能把项目跑起来：

```bash
# 1. 下载代码
git clone https://github.com/penguin0821/resume-to-website.git
cd resume-to-website

# 2. 启动后端（终端 1）
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# 3. 启动前端（新开终端 2）
cd frontend
npm install
npm run dev

# 4. 打开浏览器
# 访问 http://localhost:3000
```
