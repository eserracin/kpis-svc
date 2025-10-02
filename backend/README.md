# KPIs Service - Backend

FastAPI backend service for managing and serving KPI (Key Performance Indicator) data.

## Features

- **FastAPI** framework for high-performance API
- **PostgreSQL** database with async support
- **Alembic** for database migrations
- **Pydantic** for data validation
- **Docker** support for containerization

## API Endpoints

### Health Check
- `GET /health` - Service health check
- `GET /` - Root endpoint

### KPIs Endpoints
- `GET /api/v1/kpis/equity` - Get equity KPI data
- `GET /api/v1/kpis/daily` - Get daily P&L KPI data
- `GET /api/v1/kpis/period` - Get period P&L KPI data
- `GET /api/v1/kpis/drawdown` - Get drawdown KPI data
- `GET /api/v1/kpis/all` - Get all KPI data at once

## Setup

### Prerequisites
- Python 3.11+
- PostgreSQL 15+

### Installation

1. Create a virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Copy the environment file and configure:
```bash
cp env.example .env
# Edit .env with your configuration
```

4. Run database migrations:
```bash
alembic upgrade head
```

5. Start the development server:
```bash
python start_dev.py
```

The API will be available at `http://localhost:8002`

## Docker

Build and run with Docker:
```bash
docker build -t kpis-svc-backend .
docker run -p 8002:8002 kpis-svc-backend
```

Or use docker-compose from the service root directory.

## Development

- API documentation: `http://localhost:8002/docs`
- ReDoc documentation: `http://localhost:8002/redoc`

## Testing

Run tests with pytest:
```bash
pytest
```

With coverage:
```bash
pytest --cov=app tests/
```
