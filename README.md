# KPIs Service

Microservice for managing and serving KPI (Key Performance Indicator) data for trading dashboards.

## Architecture

This service follows a microservices architecture with:
- **Backend**: FastAPI (Python 3.11)
- **Frontend**: React + Vite + TailwindCSS + TypeScript
- **Database**: PostgreSQL 15
- **Module Federation**: Exposes KpiCard component for consumption by other services

## Features

### Backend
- RESTful API for KPI data
- Async PostgreSQL support with SQLAlchemy
- Database migrations with Alembic
- Health check endpoints
- Docker support

### Frontend
- Modern React 18 with TypeScript
- TailwindCSS for styling
- Lucide React icons
- Module Federation for micro-frontend architecture
- React Query for data fetching
- Responsive KPI cards with expand/collapse functionality

## KPI Types

1. **Equity KPI**: Current net value, balance, and unrealized P&L
2. **Daily P&L KPI**: Today's profit/loss (realized + unrealized)
3. **Period P&L KPI**: Performance summary (MTD, YTD)
4. **Drawdown KPI**: Risk analysis and drawdown metrics

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 22+ (for local development)
- Python 3.11+ (for local development)

### Using Docker Compose

1. Start all services:
```bash
cd services/kpis-svc
docker-compose up -d
```

2. Access the services:
   - Frontend: http://localhost:3002
   - Backend API: http://localhost:8002
   - API Docs: http://localhost:8002/docs
   - Database: localhost:5434

3. Stop services:
```bash
docker-compose down
```

### Local Development

#### Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp env.example .env
python start_dev.py
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### Health & Info
- `GET /` - Root endpoint
- `GET /health` - Health check

### KPIs
- `GET /api/v1/kpis/equity` - Equity KPI data
- `GET /api/v1/kpis/daily` - Daily P&L data
- `GET /api/v1/kpis/period` - Period P&L data (MTD, YTD)
- `GET /api/v1/kpis/drawdown` - Drawdown analysis
- `GET /api/v1/kpis/all` - All KPIs at once

## Module Federation

The frontend exposes the `KpiCard` component via Module Federation:

```typescript
// In consuming application
import KpiCard from 'kpis_ui/KpiCard';
```

**Exposed Components:**
- `./KpiCard` - Main KPI card component with all variants

**Remote Entry:** `http://localhost:3002/remoteEntry.js`

## Environment Variables

### Backend
```env
APP_ENV=development
APP_BASE_URL=http://localhost:8002
POSTGRES_SERVER=localhost
POSTGRES_PORT=5434
POSTGRES_USER=svc_kpis_user
POSTGRES_PASSWORD=svc_kpis_user
POSTGRES_DB=kpis-svc
```

### Frontend
```env
VITE_API_BASE_URL=http://localhost:8002
VITE_APP_BASE_URL=http://localhost:3002
```

## Project Structure

```
kpis-svc/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       └── routes/
│   │   │           └── kpis.py
│   │   ├── core/
│   │   │   └── config.py
│   │   └── main.py
│   ├── alembic/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── start_dev.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── KpiCard.tsx
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── docker-compose.yml
└── README.md
```

## Database

The service uses its own independent PostgreSQL database instance (port 5434) following the microservices architecture pattern where each service has its own database.

## Integration with Dashboard

This service is designed to be consumed by the main dashboard application via Module Federation. The KpiCard component can be imported and used in the dashboard without bundling the entire service.

## Development Notes

- Backend runs on port 8002
- Frontend runs on port 3002
- Database runs on port 5434 (mapped from container's 5432)
- Hot reload is enabled for both backend and frontend in development mode
- Module Federation allows the dashboard to consume components without rebuilding

## Testing

### Backend
```bash
cd backend
pytest
pytest --cov=app tests/
```

### Frontend
```bash
cd frontend
npm run lint
npm run build  # Test production build
```

## Contributing

When adding new KPI types:
1. Add the data interface in `KpiCard.tsx`
2. Add the variant configuration
3. Implement the render function
4. Add the backend endpoint in `kpis.py`
5. Update this README

## License

Internal use only - CropBotX project
