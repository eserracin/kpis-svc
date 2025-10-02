from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from datetime import datetime

router = APIRouter()


@router.get("/kpis/equity")
async def get_equity_kpi() -> Dict[str, Any]:
    """Get equity KPI data"""
    # Mock data - replace with actual database queries
    return {
        "balance": 50000.00,
        "unrealizedPnL": 2500.00,
        "totalEquity": 52500.00,
        "changePercent": 5.26,
        "changeAmount": 2500.00,
    }


@router.get("/kpis/daily")
async def get_daily_pnl_kpi() -> Dict[str, Any]:
    """Get daily P&L KPI data"""
    # Mock data - replace with actual database queries
    return {
        "realized": 1200.00,
        "unrealized": 800.00,
        "total": 2000.00,
        "changePercent": 4.17,
    }


@router.get("/kpis/period")
async def get_period_pnl_kpi() -> Dict[str, Any]:
    """Get period P&L KPI data"""
    # Mock data - replace with actual database queries
    return {
        "today": 2000.00,
        "todayChangePercent": 4.17,
        "mtd": 15000.00,
        "mtdDelta": 3000.00,
        "mtdChangePercent": 25.00,
        "ytd": 45000.00,
        "ytdDelta": 12000.00,
        "ytdChangePercent": 36.36,
    }


@router.get("/kpis/drawdown")
async def get_drawdown_kpi() -> Dict[str, Any]:
    """Get drawdown KPI data"""
    # Mock data - replace with actual database queries
    return {
        "currentDrawdown": 2000.00,
        "maxDrawdown": 5000.00,
        "drawdownRatio": 0.40,
        "currentDrawdownPercent": 3.81,
        "maxDrawdownPercent": 9.09,
        "peakEquity": 55000.00,
        "currentEquity": 52500.00,
        "recoveryPercent": 60.00,
    }


@router.get("/kpis/all")
async def get_all_kpis() -> Dict[str, Any]:
    """Get all KPI data at once"""
    return {
        "equity": await get_equity_kpi(),
        "daily": await get_daily_pnl_kpi(),
        "period": await get_period_pnl_kpi(),
        "drawdown": await get_drawdown_kpi(),
        "timestamp": datetime.utcnow().isoformat(),
    }
