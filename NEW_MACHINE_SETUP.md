# 新电脑快速启动指南

> 换电脑后，按以下步骤操作即可在新机器上跑起项目。

## 第一步：安装环境

新电脑需要先装两个东西：

| 软件 | 版本要求 | 下载地址 |
|------|---------|---------|
| **Node.js** | >= 18 | https://nodejs.org |
| **Python** | >= 3.9 | https://python.org |

装完后打开终端验证：
```bash
node -v    # 应显示 v18.x 或更高
python3 -V # 应显示 Python 3.9.x 或更高
```

## 第二步：克隆项目

```bash
git clone https://github.com/penguin0821/resume-to-website.git
cd resume-to-website
```

## 第三步：启动后端（终端 1）

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Mac/Linux
# venv\Scripts\activate         # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

看到 `Uvicorn running on http://0.0.0.0:8000` 说明后端启动成功。

## 第四步：启动前端（终端 2，不要关掉终端 1）

新开一个终端窗口：
```bash
cd resume-to-site/frontend
npm install
npx vite --port 3000
```

看到 `Local: http://localhost:3000/` 说明前端启动成功。

## 第五步：打开浏览器

访问 **http://localhost:3000**

---

## 常见问题

**Q: `pip install` 报错？**
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**Q: `npm install` 报错？**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Q: 端口被占用？**
```bash
# 查看谁占了 3000 端口
lsof -ti:3000
# 杀掉进程
kill -9 $(lsof -ti:3000)
```

**Q: 前端能打开但生成按钮没反应？**
检查后端是否正常运行，访问 http://localhost:8000/docs 看能否打开 API 文档页面。

---

## 每次启动只需两步

环境装好后，以后每次开项目只需要：

1. **终端 1**：`cd backend && source venv/bin/activate && uvicorn app.main:app --reload --port 8000`
2. **终端 2**：`cd frontend && npx vite --port 3000`

然后访问 http://localhost:3000 即可。
