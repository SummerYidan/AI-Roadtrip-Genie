# 🚀 AI Roadtrip Genie - 快速启动指南

## 项目结构总览

```
/Users/yidanluo/
├── CLAUDE.md                    # 项目宪法
├── README.md                    # 项目文档
├── QUICKSTART.md               # 本文件
├── backend/                    # FastAPI 后端 ✅ 已完成
│   ├── main.py
│   ├── requirements.txt
│   ├── .env
│   ├── venv/                  # 虚拟环境（已创建）
│   └── app/
│       ├── core/              # 配置与数据库
│       ├── models/            # Pydantic 模型
│       ├── routes/            # API 路由
│       └── services/          # 业务逻辑（含黄金样板）
└── frontend/                  # Next.js 前端 ✅ 已完成
    ├── package.json
    ├── tailwind.config.ts
    ├── tsconfig.json
    └── app/
        ├── layout.tsx         # 全局布局
        ├── globals.css        # 全局样式
        ├── page.tsx           # 首页（表单）
        └── result/
            └── page.tsx       # 结果页（路书展示）
```

---

## 第一步：启动后端

### 1.1 进入后端目录
```bash
cd ~/backend
```

### 1.2 激活虚拟环境
虚拟环境已创建，直接激活：
```bash
source venv/bin/activate
```

### 1.3 检查依赖（可选）
如果需要补充安装依赖：
```bash
pip install -r requirements.txt
```

### 1.4 启动后端服务
```bash
python main.py
```

**预期输出**：
```
🚀 AI Roadtrip Genie Backend Started
📍 Environment: development
💰 Price per itinerary: $12.99
⚠️  Running in mock data mode (database disabled)
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

**验证后端**：
- 浏览器访问: http://localhost:8000/api/docs
- 测试根端点: http://localhost:8000/

---

## 第二步：启动前端

### 2.1 安装 Node.js（如果未安装）

**macOS**：
```bash
# 使用 Homebrew
brew install node

# 验证安装
node --version
npm --version
```

**官网下载**: https://nodejs.org/ (推荐 LTS 版本)

### 2.2 进入前端目录
打开**新的终端窗口**（保持后端运行）：
```bash
cd ~/frontend
```

### 2.3 安装依赖
```bash
npm install
```

**预期耗时**: 1-3 分钟（取决于网速）

**安装的包包括**：
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- React Markdown
- Recharts
- Lucide React

### 2.4 启动前端开发服务器
```bash
npm run dev
```

**预期输出**：
```
▲ Next.js 14.0.4
- Local:        http://localhost:3000
- Ready in 2.3s
```

**验证前端**：
浏览器访问: http://localhost:3000

---

## 第三步：测试完整流程

### 3.1 填写表单
在首页 (http://localhost:3000) 填写表单：

**示例数据**：
- **出发地**: Portland, OR
- **目的地**: Crater Lake, OR
- **出发日期**: 2024-02-15
- **行程天数**: 7
- **车型类别**: 跨界车 (Crossover)
- **具体车型**: Mazda CX-50
- **兴趣偏好**: 徒步、地质学、攀岩
- **活动强度**: 挑战
- ✅ 包含非铺装路段
- ✅ 包含详细科学解释

### 3.2 生成路书
点击 **"生成专家级路书 - $12.99"** 按钮

### 3.3 查看加载动画
观察科技感加载动画，文案每 2 秒切换：
- "正在分析地层年代..."
- "正在评估 CX-50 通过性..."
- "正在计算燃油消耗与预算..."
- "正在标记科学观测点..."
- "正在生成攀岩难度评级..."
- "正在整合物流保障数据..."
- "正在渲染专家级路书..."

### 3.4 查看结果页
结果页包含：

**左侧大栏**：
- 7 天详细 Markdown 路书
- 每日行程安排
- 科学重点解读
- 安全提示
- 预算明细表

**右侧侧边栏**：
- 📊 预算饼图（交互式）
- 🔬 科学观测点（4 个）
- ⚠️ 核心风险提示
- 🚗 物流保障摘要

---

## 第四步：开发调试

### 4.1 后端调试
查看后端日志（Terminal 1）：
```bash
# 后端运行的终端会显示所有 API 请求
INFO:     127.0.0.1:52634 - "POST /api/itinerary/generate HTTP/1.1" 200 OK
```

访问 API 文档测试端点：
http://localhost:8000/api/docs

### 4.2 前端调试
查看前端日志（Terminal 2）：
```bash
# 前端运行的终端会显示编译信息和错误
✓ Compiled in 234ms (1234 modules)
```

使用浏览器开发者工具：
- Chrome DevTools (F12)
- Network 标签查看 API 请求
- Console 标签查看日志

### 4.3 修改代码实时预览
- **后端**: 修改 Python 文件后，uvicorn 会自动重载
- **前端**: 修改 TypeScript/React 文件后，Next.js 会自动刷新页面

---

## 常见问题排查

### Q1: 后端启动失败 - "Module not found"
**解决方案**：
```bash
cd ~/backend
source venv/bin/activate
pip install -r requirements.txt
```

### Q2: 前端启动失败 - "command not found: npm"
**解决方案**：
安装 Node.js (见第二步 2.1)

### Q3: 前端无法连接后端 - CORS 错误
**检查项**：
1. 后端是否在运行？(http://localhost:8000)
2. 前端 API 请求 URL 是否正确？(app/page.tsx 第 33 行)
3. 后端 CORS 配置是否包含 `http://localhost:3000`？(backend/.env)

### Q4: 加载动画卡住
**可能原因**：
- 后端服务未启动
- 网络连接问题
- sessionStorage 权限问题

**排查步骤**：
1. 打开浏览器 DevTools → Console
2. 查看是否有错误信息
3. 打开 Network 标签，查看 API 请求状态

---

## 下一步开发

### 短期任务
- [ ] 接入 Anthropic Claude API（替换 Mock 数据）
- [ ] 配置 PostgreSQL 数据库
- [ ] 集成 Stripe 支付流程
- [ ] 实现 PDF 导出功能

### 长期规划
- [ ] 用户认证系统
- [ ] 历史路书管理
- [ ] 移动端 App
- [ ] 社交分享功能
- [ ] 多语言支持

---

## 技术支持

### 后端相关
- FastAPI 文档: https://fastapi.tiangolo.com/
- Pydantic 文档: https://docs.pydantic.dev/
- SQLAlchemy 文档: https://docs.sqlalchemy.org/

### 前端相关
- Next.js 文档: https://nextjs.org/docs
- Tailwind CSS 文档: https://tailwindcss.com/docs
- Framer Motion 文档: https://www.framer.com/motion/

### 项目文档
- [CLAUDE.md](./CLAUDE.md) - 项目宪法
- [README.md](./README.md) - 项目概述
- [backend/README.md](./backend/README.md) - 后端详细说明
- [frontend/README.md](./frontend/README.md) - 前端详细说明

---

**🎉 恭喜！你已成功启动 AI Roadtrip Genie 全栈应用！**

**✨ 由 AI Roadtrip Genie 倾情打造**
**专家级路线设计 | $12.99 一次性购买 | 终身访问**
