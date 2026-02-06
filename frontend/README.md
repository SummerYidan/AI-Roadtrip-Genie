# AI Roadtrip Genie - Frontend

Next.js 前端应用，提供高端、极简的自驾路线定制体验。

## 技术栈

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** (极简硬核风格)
- **Framer Motion** (动画效果)
- **React Markdown** (路书渲染)
- **Recharts** (预算可视化)
- **Lucide React** (图标库)

## 设计规范

### 视觉风格
- **灵感**：Arc'teryx、National Geographic
- **背景色**：深碳色 (#1A1A1A)
- **文字色**：米白色 (#F5F5F0)
- **品牌色**：森林绿 (#2D5F3F)
- **风格**：极简、硬核、高端户外感

### 页面结构

#### 首页 (/)
- 巨大的 Slogan: "AI Roadtrip Genie"
- 精致的表单（目的地、车型、活动偏好）
- Framer Motion 动画效果

#### 结果页 (/result)
- **左侧大栏**：Markdown 格式长路书
- **右侧侧边栏**：
  - 物流保障数据
  - 预算饼图（Recharts）
  - 科学科普亮点
  - 风险提示

## 快速开始

### 环境要求
- Node.js 18+
- npm 或 yarn

### 安装步骤

1. 安装依赖:
```bash
npm install
# 或
yarn install
```

2. 启动开发服务器:
```bash
npm run dev
# 或
yarn dev
```

3. 访问应用:
```
http://localhost:3000
```

## 后端连接

前端连接到后端 API:
- **Base URL**: `http://localhost:8000`
- **生成路书**: `POST /api/itinerary/generate`

确保后端服务已启动：
```bash
cd ../backend
source venv/bin/activate
python main.py
```

## 项目结构

```
frontend/
├── app/
│   ├── layout.tsx          # 全局布局
│   ├── page.tsx            # 首页（表单）
│   ├── result/
│   │   └── page.tsx        # 结果页（路书展示）
│   └── globals.css         # 全局样式
├── components/             # （待扩展）可复用组件
├── public/                 # 静态资源
├── tailwind.config.ts      # Tailwind 配置
├── tsconfig.json           # TypeScript 配置
└── package.json            # 依赖管理
```

## 核心功能

### 1. 表单提交
- 目的地、日期、车型选择
- 兴趣偏好（徒步、攀岩、地质学等）
- 活动强度（轻松、中等、挑战、专家）
- 实时表单验证

### 2. 加载动画
使用 Framer Motion 实现科技感加载动画：
- 旋转的山峰图标
- 动态切换的文案：
  - "正在分析地层年代..."
  - "正在评估 CX-50 通过性..."
  - "正在计算燃油消耗与预算..."
  - "正在标记科学观测点..."

### 3. 路书展示
- Markdown 渲染（带自定义样式）
- 响应式布局（移动端友好）
- 侧边栏数据可视化
- 预算饼图交互

## 开发规范

### 代码规范
- TypeScript 严格模式
- ESLint 代码检查
- 组件使用函数式风格
- 状态管理使用 React Hooks

### 命名规范
- 组件文件：PascalCase (HomePage.tsx)
- 工具函数：camelCase (formatCurrency.ts)
- CSS 类：kebab-case 或 Tailwind utilities

### Git 提交规范
```
feat: 添加新功能
fix: 修复 Bug
style: 样式调整
refactor: 代码重构
docs: 文档更新
```

## 部署

### 构建生产版本
```bash
npm run build
npm run start
```

### Vercel 部署
```bash
vercel --prod
```

## 待优化项

- [ ] 添加支付流程（Stripe Checkout）
- [ ] PDF 导出功能
- [ ] 用户认证系统
- [ ] 历史路书管理
- [ ] 移动端优化
- [ ] 离线地图集成

## License

Proprietary - All Rights Reserved
