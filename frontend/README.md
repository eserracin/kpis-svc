# KPIs Service - Frontend

React + Vite + TailwindCSS frontend for the KPIs Service.

## Features

- **React 18** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **Module Federation** for micro-frontend architecture
- **React Query** for data fetching and caching
- **Lucide React** for icons
- **Responsive** KPI cards with expand/collapse

## Development

```bash
npm install
npm run dev
```

The app will be available at http://localhost:3002

## Building

```bash
npm run build
npm run preview
```

## Module Federation

This frontend exposes the `KpiCard` component for consumption by other micro-frontends:

```typescript
// vite.config.ts
exposes: {
  './KpiCard': './src/components/KpiCard.tsx',
}
```

### Using in Another App

```typescript
// In the consuming app's vite.config.ts
remotes: {
  kpis_ui: {
    type: 'module',
    entry: 'http://localhost:3002/remoteEntry.js',
    name: 'kpis_ui',
    entryGlobalName: 'kpis_ui',
    shareScope: 'default',
  },
}

// In your component
import KpiCard from 'kpis_ui/KpiCard';
import type { EquityData } from 'kpis_ui/KpiCard';
```

## KpiCard Component

### Props

```typescript
interface KpiCardProps {
  variant: 'equity' | 'daily' | 'period' | 'drawdown';
  data: EquityData | DailyPnLData | PeriodPnLData | DrawdownData | null;
  isLoading?: boolean;
  className?: string;
  formatCurrency: (value: number, options?: { abbreviated?: boolean }) => string;
  formatPercentage: (value: number) => string;
  defaultExpanded?: boolean;
}
```

### Example Usage

```typescript
<KpiCard
  variant="equity"
  data={equityData}
  isLoading={false}
  formatCurrency={formatCurrency}
  formatPercentage={formatPercentage}
  defaultExpanded={false}
/>
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier

## Environment Variables

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8002
VITE_APP_BASE_URL=http://localhost:3002
```

## Styling

TailwindCSS is configured with:
- Custom color palette
- Forms plugin
- Typography plugin
- Dark mode support

## API Integration

The frontend proxies API requests to the backend:

```typescript
// vite.config.ts
proxy: {
  '/api': {
    target: 'http://localhost:8002',
    changeOrigin: true,
    secure: false,
  },
}
```
