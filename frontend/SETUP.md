# 🎨 前端启动指南 - 第一阶段

## ✅ 项目状态

前端项目已完全创建，包含：
- ✅ Next.js 14 (App Router)
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Framer Motion (动画)
- ✅ Lucide React (图标)
- ✅ React Markdown (路书渲染)
- ✅ Recharts (数据可视化)

## 🎨 品牌规范 (已应用)

### 配色方案
```css
深碳色 (背景): #1A1A1A
米白色 (文字): #F5F5F5
森林绿 (强调): #2D5A27
```

### 设计风格
- **灵感**: Arc'teryx, National Geographic
- **特点**: 极简、硬核、高端户外感

## 🚀 启动步骤

### 第一步：确认 Node.js 已安装

```bash
node --version   # 应该显示 v18.x.x 或更高
npm --version    # 应该显示 9.x.x 或更高
```

**如果未安装**:
```bash
# macOS
brew install node

# 或访问: https://nodejs.org/
```

### 第二步：安装依赖

```bash
cd ~/frontend
npm install
```

**预期输出**:
```
added 423 packages in 45s
```

**安装的核心包**:
- `next@14.0.4` - React 框架
- `framer-motion@10.16.16` - 动画库
- `lucide-react@0.303.0` - 图标库
- `react-markdown@9.0.1` - Markdown 渲染
- `recharts@2.10.3` - 图表库

### 第三步：启动开发服务器

```bash
npm run dev
```

**预期输出**:
```
▲ Next.js 14.0.4
- Local:        http://localhost:3000
- Ready in 2.5s
```

### 第四步：访问应用

浏览器打开: **http://localhost:3000**

---

## 📱 功能演示

### 1️⃣ 首页 (Hero Section + 表单)

**视觉效果**:
- 巨大的 Logo: Mountain 图标 + "AI Roadtrip Genie"
- Slogan: "专家级自驾路线定制 | 硬核物流保障 + 户外深度体验 + 地质科学解读"
- Glass-effect 半透明表单卡片

**表单字段**:
```
✅ 出发地 (如: Portland, OR)
✅ 目的地 (如: Crater Lake, OR)
✅ 出发日期
✅ 行程天数 (1-30)
✅ 车型类别 (轿车/SUV/跨界/皮卡/面包车)
✅ 具体车型 (如: Mazda CX-50)
✅ 兴趣偏好 (徒步/攀岩/滑雪/摄影/野生动物/地质学/天文学)
✅ 活动强度 (轻松/中等/挑战/专家)
✅ 包含非铺装路段 (复选框)
✅ 包含详细科学解释 (复选框)
```

**提交按钮**:
```
🌟 生成专家级路书 - $12.99
```

### 2️⃣ 加载动画 (科技感)

**视觉元素**:
- 旋转的 Mountain 图标 (360° 循环)
- 进度条 (渐变森林绿)
- 动态文案 (每 2 秒切换)

**文案列表**:
```
1. 正在分析地层年代...
2. 正在评估 CX-50 通过性...
3. 正在计算燃油消耗与预算...
4. 正在标记科学观测点...
5. 正在生成攀岩难度评级...
6. 正在整合物流保障数据...
7. 正在渲染专家级路书...
```

### 3️⃣ 结果页 (路书展示)

**布局结构**:
```
┌─────────────────────────────────────────────────┐
│  Header (固定)                                  │
│  ← 返回  |  AI Roadtrip Genie  |  导出 PDF     │
├─────────────────────────┬───────────────────────┤
│                         │                       │
│  左侧 (2/3 宽度)        │  右侧 (1/3 宽度)      │
│  ─────────────────      │  ─────────────────    │
│  📍 路线概览            │  💰 预算明细          │
│                         │  ├─ 饼图 (交互)       │
│  📝 Markdown 路书       │  └─ 详细列表          │
│  ├─ Day 1: ...         │                       │
│  ├─ Day 2: ...         │  🔬 科学观测点        │
│  ├─ Day 3: ...         │  ├─ 哥伦比亚河玄武岩  │
│  ├─ ...                │  ├─ Smith Rock        │
│  └─ Day 7: ...         │  └─ Crater Lake       │
│                         │                       │
│  (长滚动内容)           │  ⚠️ 核心风险提示     │
│                         │  (固定位置 sticky)     │
│                         │                       │
│                         │  🚗 物流保障摘要      │
└─────────────────────────┴───────────────────────┘
```

**右侧侧边栏特性**:
- `position: sticky` - 滚动时固定在视口
- 预算饼图 - Recharts 交互式图表
- 科学观测点 - 折叠卡片展示
- 风险提示 - 黄色边框警告样式

---

## 🔌 后端连接

### API 端点
```typescript
POST http://localhost:8000/api/itinerary/generate
Content-Type: application/json
```

### 请求示例
```json
{
  "start_location": "Portland, OR",
  "end_location": "Crater Lake, OR",
  "trip_duration": 7,
  "start_date": "2024-02-15",
  "vehicle_type": "crossover",
  "vehicle_model": "Mazda CX-50",
  "interests": ["hiking", "geology", "climbing"],
  "activity_level": "challenging",
  "include_offroad": true,
  "scientific_depth": true
}
```

### 响应处理
```typescript
// 成功响应
const data = await response.json()
sessionStorage.setItem('itinerary', JSON.stringify(data))
router.push('/result')

// 错误处理
if (!response.ok) {
  alert('生成路书失败，请重试')
}
```

---

## 🧪 测试流程

### 1. 确认后端运行
```bash
# 终端 1: 后端
cd ~/backend
source venv/bin/activate
python main.py

# 验证: http://localhost:8000/api/docs
```

### 2. 启动前端
```bash
# 终端 2: 前端
cd ~/frontend
npm run dev

# 访问: http://localhost:3000
```

### 3. 填写测试数据
使用以下数据进行测试:
```
出发地: Portland, OR
目的地: Crater Lake, OR
出发日期: 2024-02-15
行程天数: 7
车型: Crossover
车型型号: Mazda CX-50
兴趣: 徒步, 地质学, 攀岩
活动强度: 挑战
✓ 包含非铺装路段
✓ 包含详细科学解释
```

### 4. 观察流程
1. 点击 "生成专家级路书"
2. 观察加载动画 (旋转图标 + 动态文案)
3. 自动跳转到结果页
4. 查看左侧 Markdown 路书
5. 查看右侧数据卡片 (预算、科学、风险)

### 5. 验证数据
- 路线总长: 1247.5 km
- 总预算: $2,494.20
- 科学观测点: 4 个
- 户外活动: 4 项
- 风险提示: 5 条

---

## 🐛 常见问题

### Q1: npm install 失败
**错误**: `EACCES: permission denied`

**解决**:
```bash
sudo chown -R $(whoami) ~/.npm
npm install
```

### Q2: 端口 3000 被占用
**错误**: `Port 3000 is already in use`

**解决**:
```bash
# 查找占用进程
lsof -ti:3000

# 杀死进程
kill -9 $(lsof -ti:3000)

# 或使用其他端口
npm run dev -- -p 3001
```

### Q3: 后端连接失败
**错误**: `Failed to fetch`

**检查**:
1. 后端是否在运行? (http://localhost:8000)
2. CORS 配置是否正确?
3. 浏览器控制台是否有错误?

**排查**:
```bash
# 测试后端
curl http://localhost:8000/

# 测试 API
curl -X POST http://localhost:8000/api/itinerary/generate \
  -H "Content-Type: application/json" \
  -d '{"start_location":"Portland, OR","end_location":"Bend, OR","trip_duration":3,"start_date":"2024-02-15","vehicle_type":"crossover","interests":[],"activity_level":"moderate"}'
```

### Q4: TypeScript 报错
**错误**: `Cannot find module 'tailwindcss'`

**原因**: 依赖未安装

**解决**:
```bash
npm install
```

---

## 📝 开发规范

### 代码风格
```typescript
// 组件命名: PascalCase
export default function HomePage() {}

// 函数命名: camelCase
const handleSubmit = async () => {}

// 常量命名: UPPER_SNAKE_CASE
const API_BASE_URL = 'http://localhost:8000'
```

### CSS 类名
```tsx
// 使用 Tailwind utilities
<div className="bg-carbon text-off-white p-6 rounded-xl">

// 自定义类
<div className="glass-effect text-gradient">
```

### 文件结构
```
app/
├── layout.tsx        # 全局布局
├── globals.css       # 全局样式
├── page.tsx          # 首页
└── result/
    └── page.tsx      # 结果页
```

---

## 🎯 第一阶段目标

- [x] 项目初始化 (Next.js + Tailwind + TypeScript)
- [x] 安装核心依赖 (Framer Motion, Lucide, React Markdown)
- [x] 配置品牌色彩 (#1A1A1A, #F5F5F5, #2D5A27)
- [x] 创建首页 (Hero + 表单)
- [x] 创建加载动画 (科技感 + 动态文案)
- [x] 创建结果页 (左侧路书 + 右侧数据)
- [x] 连接后端 API
- [x] 实现页面跳转

---

## 🚀 启动命令总结

```bash
# 1. 进入前端目录
cd ~/frontend

# 2. 安装依赖 (首次运行)
npm install

# 3. 启动开发服务器
npm run dev

# 4. 访问应用
open http://localhost:3000
```

---

**✨ 前端第一阶段开发完成！**

**下一步**: 测试完整流程，确认数据展示无误后，可以进入第二阶段开发（支付集成、PDF 导出等）。
