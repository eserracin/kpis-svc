import axios from 'axios';
import type { EquityData, DailyPnLData, PeriodPnLData, DrawdownData } from '../components/KpiCard';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8002';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const kpisApi = {
  getEquity: async (): Promise<EquityData> => {
    const response = await api.get<EquityData>('/api/v1/kpis/equity');
    return response.data;
  },

  getDaily: async (): Promise<DailyPnLData> => {
    const response = await api.get<DailyPnLData>('/api/v1/kpis/daily');
    return response.data;
  },

  getPeriod: async (): Promise<PeriodPnLData> => {
    const response = await api.get<PeriodPnLData>('/api/v1/kpis/period');
    return response.data;
  },

  getDrawdown: async (): Promise<DrawdownData> => {
    const response = await api.get<DrawdownData>('/api/v1/kpis/drawdown');
    return response.data;
  },

  getAll: async (): Promise<{
    equity: EquityData;
    daily: DailyPnLData;
    period: PeriodPnLData;
    drawdown: DrawdownData;
    timestamp: string;
  }> => {
    const response = await api.get('/api/v1/kpis/all');
    return response.data;
  },
};
