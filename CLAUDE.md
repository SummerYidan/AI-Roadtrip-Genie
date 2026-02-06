# AI Roadtrip Genie - 项目宪法 (Project Constitution)

## 1. 项目愿景 (Project Vision)
打造一个按次收费 ($12.99) 的高端 AI 自驾路书平台。核心竞争力在于提供“专家领队级”的确定性，将自驾物流、硬核户外探索与自然科学科普深度结合，解决用户在行程规划、安全保障与深度体验上的痛点。

## 2. 核心业务逻辑 (Core Business Logic)
Claude 在生成代码、逻辑或 Prompt 时必须遵循以下三轴驱动原则：

### A. 硬核物流保障 (Hardcore Logistics)
- **车型适配:** 必须根据用户车型（如 Mazda CX-50）评估非铺装路面（Off-road）通过性及后备箱空间。
- **安全预警:** 针对季节（如 2 月俄勒冈雪季）强制加入雪链提醒、黑冰预警及关键补给站（加油/充电）坐标。
- **财务精算:** 预算模块需包含油价波动预估、过路费，并强制预留 10% 的预备金 (Buffer Fund)。

### B. 体力探索：户外运动 (Physical Discovery)
- **徒步/攀岩专项:** 必须包含徒步路线的难度等级（Class 1-5）、累计升降、预计耗时及地形描述。
- **动态建议:** 根据用户兴趣（如平花滑雪、室内抱石）匹配目的地，并给出专业装备检查清单。

### C. 脑力探索：科学叙事 (Intellectual Discovery)
- **地学解释:** 每一个核心自然景观必须包含地质学（Geology）、生态学（Ecology）或天文学（Astronomy）的简明科学解释，提供“边走边学”的深度价值。
- **科普点位:** 在路书中标记“科学观测点”，引导用户观察特定的自然现象。

## 3. 技术规范 (Tech Stack & standards)
- **后端 (Backend):** FastAPI (Python 3.11+)。必须使用异步 (async/await) 逻辑，所有数据交互需通过 Pydantic 模型验证。
- **前端 (Frontend):** Next.js (App Router) + Tailwind CSS + Lucide Icons。UI 风格追求“极简、高级、户外感”。
- **数据库 (Database):** PostgreSQL (通过 SQLAlchemy 或 Prisma)。
- **支付 (Payment):** Stripe API (Stripe Checkout 模式)。
- **导出 (Export):** 使用 WeasyPrint 将结构化的 Markdown 转换为出版级的精美 PDF 路书。

## 4. 交付物标准 (Deliverable Standards)
- **结构化:** AI 输出的行程必须是严谨的 Markdown 格式，具备清晰的层级。
- **避坑指南:** 每个行程必须包含一个基于真实路况的“避坑/风险提示”模块。
- **视觉化建议:** 指明哪些点位需要配以高清风景图或动态地图链接。

## 5. 交互与协作规则 (Collaboration Rules)
- **语言策略:** 业务逻辑、文档说明、用户交互使用 **中文**；代码注释、Git Commit Message、变量命名使用 **英文**。
- **开发流程:** 在进行重大架构调整（如修改数据库 Schema 或接入新 API）前，必须先提供一个 Plan 供确认。
- **身份合规:** 考虑到初创公司的背景，代码需体现出专业性与安全性，为未来的商业扩展和 H-1B 资质证明提供技术支撑。