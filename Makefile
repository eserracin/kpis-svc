.PHONY: help up down build logs clean install-backend install-frontend dev-backend dev-frontend test-backend lint-frontend

help:
	@echo "KPIs Service - Available commands:"
	@echo "  make up              - Start all services with docker-compose"
	@echo "  make down            - Stop all services"
	@echo "  make build           - Build all docker images"
	@echo "  make logs            - Show logs from all services"
	@echo "  make clean           - Remove all containers, volumes, and images"
	@echo "  make install-backend - Install backend dependencies"
	@echo "  make install-frontend- Install frontend dependencies"
	@echo "  make dev-backend     - Run backend in development mode"
	@echo "  make dev-frontend    - Run frontend in development mode"
	@echo "  make test-backend    - Run backend tests"
	@echo "  make lint-frontend   - Lint frontend code"

up:
	docker-compose up -d

down:
	docker-compose down

build:
	docker-compose build

logs:
	docker-compose logs -f

clean:
	docker-compose down -v --rmi all

install-backend:
	cd backend && python -m venv .venv && .venv/bin/pip install -r requirements.txt

install-frontend:
	cd frontend && npm install

dev-backend:
	cd backend && python start_dev.py

dev-frontend:
	cd frontend && npm run dev

test-backend:
	cd backend && pytest

lint-frontend:
	cd frontend && npm run lint
