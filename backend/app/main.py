from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

app = FastAPI(
    title="KPIs Service",
    description="Service for managing and serving KPI data",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
from app.api.v1.routes import kpis

app.include_router(kpis.router, prefix="/api/v1", tags=["kpis"])

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "kpis-svc"}

@app.get("/")
async def root():
    return {"message": "KPIs Service is running"}
