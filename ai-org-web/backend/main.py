"""
AI Organization Solution Hub - 后端 API
基于 FastAPI + Supabase

启动：
    pip install fastapi uvicorn supabase pydantic[email]
    uvicorn main:app --reload --port 8000
"""
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
import os

app = FastAPI(
    title="AI Organization Hub API",
    description="AI 组织解决方案网站后端 API",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://your-domain.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# 数据模型
# ============================================================

class LeadForm(BaseModel):
    """留资表单"""
    name: str = Field(..., min_length=1, max_length=50)
    company: str = Field(..., min_length=1, max_length=100)
    position: Optional[str] = Field(None, max_length=50)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=20)
    source: Optional[str] = Field(None, description="来源页面 / 渠道")
    topic: Optional[str] = Field(None, description="兴趣主题")
    message: Optional[str] = Field(None, max_length=1000)


class AssessmentPayload(BaseModel):
    """测评提交"""
    answers: Dict[str, int]
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    company: Optional[str] = None


class ContentItem(BaseModel):
    """内容条目"""
    id: str
    slug: str
    type: str
    title: str
    subtitle: Optional[str] = None
    summary: str
    thumbnail: Optional[str] = None
    author: Optional[str] = None
    published_at: datetime
    tags: List[str] = []
    topic: Optional[str] = None
    audience: List[str] = []
    industry: List[str] = []


# ============================================================
# Auth 登录 API (mock - 真实项目接入 Supabase Auth)
# ============================================================

# 默认管理员（仅供开发）
ADMIN_ACCOUNTS = {
    "admin": {
        "password": "admin123456",
        "admin": {
            "id": "admin-001",
            "username": "admin",
            "email": "[email protected]",
            "role": "super_admin",
        },
    },
    "editor": {
        "password": "editor123",
        "admin": {
            "id": "admin-002",
            "username": "editor",
            "email": "[email protected]",
            "role": "editor",
        },
    },
}


class LoginRequest(BaseModel):
    username: str
    password: str


@app.post("/api/auth/login")
async def auth_login(body: LoginRequest):
    """登录（mock）"""
    acct = ADMIN_ACCOUNTS.get(body.username)
    if not acct or acct["password"] != body.password:
        raise HTTPException(401, "账号或密码错误")
    # 用 username + 时间戳生成一个简单 token
    token = f"mock-{body.username}-{int(datetime.utcnow().timestamp())}"
    return {"ok": True, "data": {"token": token, "admin": acct["admin"]}}


@app.get("/api/auth/me")
async def auth_me(authorization: Optional[str] = None):
    """获取当前用户（mock）"""
    if not authorization or not authorization.startswith("Bearer mock-"):
        raise HTTPException(401, "未登录")
    parts = authorization.replace("Bearer mock-", "").split("-")
    username = parts[0]
    acct = ADMIN_ACCOUNTS.get(username)
    if not acct:
        raise HTTPException(401, "token 无效")
    return {"ok": True, "data": {**acct["admin"], "lastLoginAt": datetime.utcnow().isoformat()}}


# ============================================================
# Lead 留资 API
# ============================================================

@app.post("/api/lead")
async def submit_lead(lead: LeadForm):
    """
    提交留资信息
    TODO: 接入 Supabase
    """
    # 实际生产：写入数据库 + 触发自动化邮件
    lead_data = lead.model_dump()
    lead_data["created_at"] = datetime.utcnow().isoformat()
    lead_data["id"] = f"lead_{datetime.utcnow().timestamp()}"

    # 这里应该写入 Supabase
    # supabase.table("leads").insert(lead_data).execute()

    print(f"[LEAD] {lead_data}")
    return {"ok": True, "id": lead_data["id"]}


@app.post("/api/lead/download")
async def download_resource(payload: Dict[str, Any]):
    """下载资料（带留资）"""
    resource_id = payload.get("resourceId")
    if not resource_id:
        raise HTTPException(400, "resourceId required")

    # 1. 写入 lead
    lead = LeadForm(**{k: v for k, v in payload.items() if k != "resourceId"})
    await submit_lead(lead)

    # 2. 返回下载链接
    # 实际：根据 resource_id 从 CMS / S3 取链接
    return {
        "ok": True,
        "downloadUrl": f"https://cdn.your-domain.com/resources/{resource_id}.pdf"
    }


# ============================================================
# Assessment 测评 API
# ============================================================

DIMENSION_SUGGESTIONS = {
    "strategy": "建议参加高层 AI 战略工作坊，明确 AI 投入与目标",
    "people": "启动 AI Academy 培训，提升全员 AI 能力",
    "workflow": "使用 Workflow Demo 识别高价值场景，优先改造",
    "technology": "建立 AI 工具评估与采购规范",
    "data": "启动数据资产盘点与数据中台规划",
    "governance": "建立 AI 使用规范与治理委员会",
    "organization": "成立 AI 牵头部门，明确组织变革路径",
}

STAGES = [
    (0, 30, "L1", "认知期", "企业刚开始意识到 AI 的潜力，尚未系统化投入。",
     "从 AI 组织成熟度报告与趋势洞察开始，建立基础认知。"),
    (31, 50, "L2", "探索期", "局部团队开始 AI 工具试点，尚未形成组织共识。",
     "推荐 AI Academy 培训与 AI 个体地图，推动个体能力沉淀。"),
    (51, 70, "L3", "构建期", "已建立专项团队和试点项目，开始关注工作流与场景。",
     "推荐 AI Work Lab，识别高价值场景并设计 AI 工作流。"),
    (71, 85, "L4", "规模化期", "AI 在多个业务线规模化，需要组织机制保障。",
     "推荐组织变革咨询，建立 AI 组织的治理与流程机制。"),
    (86, 100, "L5", "AI 组织期", "AI 已深度融入组织运作，人机协作成为核心生产力。",
     "进入下一阶段：行业基准对标与生态合作。"),
]


def calculate_result(answers: Dict[str, int]):
    """计算测评结果"""
    total = sum(answers.values())
    max_score = len(answers) * 6
    percent = round((total / max_score) * 100)

    # 找阶段
    stage = next(
        (s for s in STAGES if s[0] <= percent <= s[1]),
        STAGES[0]
    )
    min_s, max_s, code, name, desc, next_step = stage

    # 维度分数
    dim_scores = {}
    for qid, score in answers.items():
        # qid 格式: q-{dim_code}-{num}
        dim = qid.split("-")[1] if "-" in qid else "unknown"
        dim_scores.setdefault(dim, []).append(score)

    dim_avg = {
        dim: round(sum(scores) / len(scores), 1)
        for dim, scores in dim_scores.items()
    }

    # Top 3 Gaps
    sorted_dims = sorted(dim_avg.items(), key=lambda x: x[1])[:3]
    top_gaps = [
        {
            "dimension": dim,
            "score": score,
            "suggestion": DIMENSION_SUGGESTIONS.get(dim, "建议系统化梳理")
        }
        for dim, score in sorted_dims
    ]

    return {
        "stage": {
            "code": code,
            "name": name,
            "min": min_s,
            "max": max_s,
            "description": desc,
            "nextStep": next_step,
        },
        "totalScore": percent,
        "dimensionScores": dim_avg,
        "topGaps": top_gaps,
        "nextStep": next_step,
    }


@app.post("/api/assessment/submit")
async def submit_assessment(payload: AssessmentPayload):
    """提交测评，计算结果"""
    result = calculate_result(payload.answers)

    # 如果有 email，存为 lead
    if payload.email:
        lead = LeadForm(
            name=payload.name or "Anonymous",
            company=payload.company or "Anonymous",
            email=payload.email,
            source="assessment",
        )
        await submit_lead(lead)

    return result


# ============================================================
# 内容 CMS API（简化示例）
# ============================================================

@app.get("/api/content")
async def list_content(
    type: Optional[str] = None,
    topic: Optional[str] = None,
    audience: Optional[str] = None,
    page: int = 1,
    pageSize: int = 12,
):
    """列表内容"""
    # 实际：从 Supabase 查询
    # 这里返回空 list，前端用静态数据
    return {
        "list": [],
        "total": 0,
        "page": page,
        "pageSize": pageSize,
    }


@app.get("/api/content/{slug}")
async def get_content(slug: str):
    """获取内容详情"""
    # 实际：根据 slug 从 Supabase 取
    raise HTTPException(404, "Content not found")


@app.get("/api/content/{content_id}/related")
async def related_content(content_id: str):
    """相关内容"""
    return []


# ============================================================
# Health
# ============================================================

@app.get("/api/health")
async def health():
    return {"ok": True, "ts": datetime.utcnow().isoformat()}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
