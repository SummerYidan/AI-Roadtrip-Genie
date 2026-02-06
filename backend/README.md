# AI Roadtrip Genie - Backend

FastAPI 后端服务，提供 AI 驱动的高端自驾路线定制功能。

## 快速开始

### 环境要求

- Python 3.11+
- PostgreSQL 14+
- Stripe 账户
- Anthropic API 密钥

### 安装步骤

1. 创建虚拟环境:
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

2. 安装依赖:
```bash
pip install -r requirements.txt
```

3. 配置环境变量:
```bash
cp .env.example .env
# 编辑 .env 文件，填入实际的配置值
```

4. 初始化数据库:
```bash
alembic upgrade head
```

5. 启动开发服务器:
```bash
python main.py
# 或者使用 uvicorn
uvicorn main:app --reload
```

## API 文档

启动服务后访问:
- Swagger UI: http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc

## 项目结构

```
backend/
├── main.py                 # FastAPI 应用入口
├── requirements.txt        # Python 依赖
├── .env.example           # 环境变量模板
├── app/
│   ├── core/              # 核心配置
│   │   ├── config.py      # 应用配置
│   │   └── database.py    # 数据库连接
│   ├── models/            # Pydantic 模型
│   │   ├── itinerary.py   # 路线相关模型
│   │   └── payment.py     # 支付相关模型
│   ├── routes/            # API 路由
│   │   ├── health.py      # 健康检查
│   │   ├── itinerary.py   # 路线生成
│   │   ├── payment.py     # 支付处理
│   │   └── export.py      # PDF 导出
│   └── services/          # 业务逻辑
│       ├── itinerary_service.py  # 路线生成服务
│       ├── payment_service.py    # 支付服务
│       └── export_service.py     # 导出服务
```

## 核心功能

### 三轴驱动原则

根据 CLAUDE.md 项目宪法，所有路线生成遵循:

1. **硬核物流保障 (Hardcore Logistics)**
   - 车型适配与通过性评估
   - 季节安全预警
   - 精准预算计算（含 10% 预备金）

2. **体力探索 (Physical Discovery)**
   - 户外运动难度评级
   - 专业装备清单
   - 动态活动建议

3. **脑力探索 (Intellectual Discovery)**
   - 地质/生态/天文科学解释
   - 科学观测点标记
   - 深度学习价值

## 开发规范

- 代码注释、Git commit、变量命名使用英文
- 所有数据交互通过 Pydantic 模型验证
- 使用 async/await 异步编程
- 遵循 FastAPI 最佳实践

## 测试

```bash
pytest
```

## 部署

TODO: 添加部署文档

## License

Proprietary - All Rights Reserved
