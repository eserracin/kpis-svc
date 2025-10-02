import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Activity, 
  BarChart3, 
  Calendar, 
  ChevronDown, 
  ChevronUp,
  TrendingDown,
  LucideIcon
} from 'lucide-react';

// ===== TIPOS DE DATOS =====

export interface EquityData {
  balance: number;
  unrealizedPnL: number;
  totalEquity: number;
  changePercent: number;
  changeAmount: number;
}

export interface DailyPnLData {
  realized: number;
  unrealized: number;
  total: number;
  changePercent: number;
}

export interface PeriodPnLData {
  today: number;
  todayChangePercent: number;
  mtd: number;
  mtdDelta: number;
  mtdChangePercent: number;
  ytd: number;
  ytdDelta: number;
  ytdChangePercent: number;
}

export interface DrawdownData {
  currentDrawdown: number;      // Drawdown actual (en valor absoluto o %)
  maxDrawdown: number;          // Máximo drawdown histórico
  drawdownRatio: number;        // KPI Final: currentDrawdown / maxDrawdown
  currentDrawdownPercent: number; // Drawdown actual en porcentaje
  maxDrawdownPercent: number;   // Máximo drawdown en porcentaje
  peakEquity: number;           // Equity en el pico antes del drawdown actual
  currentEquity: number;        // Equity actual
  recoveryPercent: number;      // % de recuperación desde el máximo drawdown
}

// ===== PROPS DEL COMPONENTE =====

type KpiCardVariant = 'equity' | 'daily' | 'period' | 'drawdown';

interface BaseKpiCardProps {
  variant: KpiCardVariant;
  isLoading?: boolean;
  className?: string;
  formatCurrency: (value: number, options?: { abbreviated?: boolean }) => string;
  formatPercentage: (value: number) => string;
  defaultExpanded?: boolean; // Por defecto: false (colapsado)
}

interface EquityKpiCardProps extends BaseKpiCardProps {
  variant: 'equity';
  data: EquityData | null;
}

interface DailyKpiCardProps extends BaseKpiCardProps {
  variant: 'daily';
  data: DailyPnLData | null;
}

interface PeriodKpiCardProps extends BaseKpiCardProps {
  variant: 'period';
  data: PeriodPnLData | null;
}

interface DrawdownKpiCardProps extends BaseKpiCardProps {
  variant: 'drawdown';
  data: DrawdownData | null;
}

type KpiCardProps = EquityKpiCardProps | DailyKpiCardProps | PeriodKpiCardProps | DrawdownKpiCardProps;

// ===== CONFIGURACIÓN DE VARIANTES =====

interface VariantConfig {
  title: string;
  icon: LucideIcon;
  contextLabel: string;
}

const VARIANT_CONFIG: Record<KpiCardVariant, VariantConfig> = {
  equity: {
    title: 'Valor Neto Actual',
    icon: DollarSign,
    contextLabel: 'from last month',
  },
  daily: {
    title: 'P&L del Día (Hoy)',
    icon: Activity,
    contextLabel: 'vs yesterday',
  },
  period: {
    title: 'Resumen de Rend. (P&L)',
    icon: BarChart3,
    contextLabel: '',
  },
  drawdown: {
    title: 'Análisis de Drawdown',
    icon: TrendingDown,
    contextLabel: 'risk metric',
  },
};

// ===== COMPONENTE PRINCIPAL =====

const KpiCard = (props: KpiCardProps) => {
  const { 
    variant, 
    data, 
    isLoading = false, 
    className = '', 
    formatCurrency, 
    formatPercentage,
    defaultExpanded = true  // Cambiado a false para que inicie colapsado
  } = props;

  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const collapsedHeight = 145;
  const [expandedHeight, setExpandedHeight] = useState<number>(350);
  
  const cardRef = useRef<HTMLDivElement>(null);
  
  const config = VARIANT_CONFIG[variant];
  const Icon = config.icon;


  // useLayoutEffect(() => {
  //   if (cardRef.current) {
  //     const cardHeight = cardRef.current.style.maxHeight;
  //     console.log('222 cardHeight', cardHeight);
  //   }
  // }, []);


  // Calcular alturas dinámicamente
  useEffect(() => {
    if (cardRef.current && data) {
      // Guardar el estado actual
      const currentMaxHeight = cardRef.current.style.maxHeight;
      
      // Temporalmente remover max-height para medir el contenido completo
      cardRef.current.style.maxHeight = 'none';
      
      // Esperar al siguiente frame para que el DOM se actualice
      requestAnimationFrame(() => {
        if (cardRef.current) {
          const fullHeight = cardRef.current.scrollHeight;
          
          setExpandedHeight(fullHeight);
          setIsExpanded(false);
          
          // Restaurar el max-height
          cardRef.current.style.maxHeight = currentMaxHeight;
        }
      });
    }
  }, [data, variant]);

  // Handler para toggle
  const handleToggle = () => {
    console.log(`${variant} - Antes:`, isExpanded);
    setIsExpanded(!isExpanded);
  };

  // ===== RENDERIZADO DE LOADING =====
  
  const renderLoading = () => (
    <div className="flex items-center justify-center py-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
        <p className="text-sm text-gray-500">Cargando datos...</p>
      </div>
    </div>
  );

  // ===== RENDERIZADO DE CONTENIDO POR VARIANTE =====

  const renderEquityContent = (equityData: EquityData) => (
    <>
      <div className="mb-3">
        <div className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-mono">
          {formatCurrency(equityData.totalEquity)}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          ≈ {formatCurrency(equityData.totalEquity, { abbreviated: true })}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-1 text-sm font-medium ${equityData.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          <TrendingUp size={16} className={equityData.changePercent >= 0 ? '' : 'rotate-180'} />
          <span>{formatPercentage(equityData.changePercent)}</span>
        </div>
        <span className="text-sm text-gray-500">{config.contextLabel}</span>
      </div>
      
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="mt-4 pt-4 border-t border-gray-800">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-gray-500">Balance:</span>
            <span className="text-gray-300 font-medium">{formatCurrency(equityData.balance)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">P&L No Realizado:</span>
            <span className={`font-medium ${equityData.unrealizedPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatCurrency(equityData.unrealizedPnL)}
            </span>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-800">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Exchange:</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-gray-400">Pendiente configuración</span>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Conecta tu cuenta de Binance para ver datos en tiempo real
          </p>
        </div>
      </div>
    </>
  );

  const renderDailyContent = (dailyData: DailyPnLData) => (
    <>
      <div className="mb-3">
        <div className={`text-3xl sm:text-4xl font-bold tracking-tight font-mono ${dailyData.total >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {formatCurrency(dailyData.total)}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          ≈ {formatCurrency(dailyData.total, { abbreviated: true })}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-1 text-sm font-medium ${dailyData.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          <TrendingUp size={16} className={dailyData.changePercent >= 0 ? '' : 'rotate-180'} />
          <span>{formatPercentage(dailyData.changePercent)}</span>
        </div>
        <span className="text-sm text-gray-500">{config.contextLabel}</span>
      </div>
      
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="mt-4 pt-4 border-t border-gray-800">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-gray-500">P&L Realizado:</span>
            <span className={`font-medium ${dailyData.realized >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatCurrency(dailyData.realized)}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">P&L No Realizado:</span>
            <span className={`font-medium ${dailyData.unrealized >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatCurrency(dailyData.unrealized)}
            </span>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-800">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Período:</span>
            <span className="text-gray-400">Últimas 24 horas</span>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            P&L calculado desde {new Date().toLocaleDateString('es-ES')} 00:00
          </p>
        </div>
      </div>
    </>
  );

  const renderPeriodContent = (periodData: PeriodPnLData) => (
    <>
      <div className="mb-4 pb-4 border-b border-gray-800">
        <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">P&L de Hoy</div>
        <div className={`text-2xl sm:text-3xl font-bold tracking-tight font-mono ${periodData.today >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {formatCurrency(periodData.today)}
        </div>
        
        <div className="flex items-center gap-2 mt-2">
          <div className={`flex items-center gap-1 text-xs font-medium ${periodData.todayChangePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            <TrendingUp size={14} className={periodData.todayChangePercent >= 0 ? '' : 'rotate-180'} />
            <span>{formatPercentage(periodData.todayChangePercent)}</span>
          </div>
          <span className="text-xs text-gray-500">vs Ayer</span>
        </div>
        
        <p className="text-xs text-gray-600 mt-1">(Ganancia Abierta + Cerrada)</p>
      </div>
      
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="mb-4 pb-4 border-b border-gray-800">
          <div className="h-12 flex items-end justify-between gap-1">
            {[...Array(30)].map((_, i) => {
              const height = Math.random() * 100;
              const isPositive = Math.random() > 0.3;
              return (
                <div 
                  key={i} 
                  className={`flex-1 rounded-t ${isPositive ? 'bg-green-500/30' : 'bg-red-500/30'}`}
                  style={{ height: `${height}%` }}
                />
              );
            })}
          </div>
          <p className="text-xs text-gray-600 mt-2 text-center">Tendencia últimos 30 días</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-1 mb-2">
              <Calendar size={12} className="text-gray-500" />
              <span className="text-xs text-gray-500 uppercase tracking-wide">Este Mes (MTD)</span>
            </div>
            <div className={`text-lg font-bold font-mono ${periodData.mtd >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatCurrency(periodData.mtd, { abbreviated: true })}
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium mt-1 ${periodData.mtdDelta >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              <TrendingUp size={12} className={periodData.mtdDelta >= 0 ? '' : 'rotate-180'} />
              <span>{formatCurrency(periodData.mtdDelta, { abbreviated: true })}</span>
            </div>
            <p className="text-xs text-gray-600 mt-0.5">vs Mes Ant.</p>
          </div>
          
          <div>
            <div className="flex items-center gap-1 mb-2">
              <Calendar size={12} className="text-gray-500" />
              <span className="text-xs text-gray-500 uppercase tracking-wide">Este Año (YTD)</span>
            </div>
            <div className={`text-lg font-bold font-mono ${periodData.ytd >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatCurrency(periodData.ytd, { abbreviated: true })}
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium mt-1 ${periodData.ytdDelta >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              <TrendingUp size={12} className={periodData.ytdDelta >= 0 ? '' : 'rotate-180'} />
              <span>{formatCurrency(periodData.ytdDelta, { abbreviated: true })}</span>
            </div>
            <p className="text-xs text-gray-600 mt-0.5">vs Año Ant.</p>
          </div>
        </div>
      </div>
    </>
  );

  const renderDrawdownContent = (drawdownData: DrawdownData) => (
    <>
      <div className="mb-3">
        <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">KPI de Riesgo</div>
        <div className="text-3xl sm:text-4xl font-bold text-orange-500 tracking-tight font-mono">
          {(drawdownData.drawdownRatio * 100).toFixed(1)}%
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Drawdown Actual / Máximo Histórico
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 text-sm font-medium text-orange-400">
          <TrendingDown size={16} />
          <span>{formatPercentage(drawdownData.currentDrawdownPercent)}</span>
        </div>
        <span className="text-sm text-gray-500">{config.contextLabel}</span>
      </div>
      
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="mt-4 pt-4 border-t border-gray-800">
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <div className="text-xs text-gray-500 mb-1">Drawdown Actual</div>
              <div className="text-lg font-bold text-orange-400 font-mono">
                {formatPercentage(drawdownData.currentDrawdownPercent)}
              </div>
              <div className="text-xs text-gray-600 mt-0.5">
                {formatCurrency(drawdownData.currentDrawdown)}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Máximo Histórico</div>
              <div className="text-lg font-bold text-red-500 font-mono">
                {formatPercentage(drawdownData.maxDrawdownPercent)}
              </div>
              <div className="text-xs text-gray-600 mt-0.5">
                {formatCurrency(drawdownData.maxDrawdown)}
              </div>
            </div>
          </div>
          
          <div className="flex justify-between text-xs mb-2">
            <span className="text-gray-500">Equity en Pico:</span>
            <span className="text-gray-300 font-medium">{formatCurrency(drawdownData.peakEquity)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Equity Actual:</span>
            <span className="text-gray-300 font-medium">{formatCurrency(drawdownData.currentEquity)}</span>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-800">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-gray-500">Recuperación:</span>
            <span className={`font-medium ${drawdownData.recoveryPercent >= 50 ? 'text-green-500' : 'text-yellow-500'}`}>
              {formatPercentage(drawdownData.recoveryPercent)}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${drawdownData.recoveryPercent >= 50 ? 'bg-green-500' : 'bg-yellow-500'}`}
              style={{ width: `${Math.min(drawdownData.recoveryPercent, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Progreso hacia recuperación del máximo drawdown
          </p>
        </div>
      </div>
    </>
  );

  // ===== RENDERIZADO PRINCIPAL =====

  return (
    <div 
      ref={cardRef}
      className={`bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300 ease-in-out shadow-lg min-w-[280px] overflow-hidden ${className}`}
      style={{ maxHeight: isExpanded ? `${expandedHeight}px` : `${collapsedHeight}px` }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-400">{config.title}</h3>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gray-800 rounded-lg">
            <Icon size={20} className="text-gray-400" />
          </div>
          <button
            onClick={handleToggle}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label={isExpanded ? "Colapsar" : "Expandir"}
          >
            {isExpanded ? (
              <ChevronUp size={18} className="text-gray-400" />
            ) : (
              <ChevronDown size={18} className="text-gray-400" />
            )}
          </button>
        </div>
      </div>
      
      {isLoading || !data ? (
        renderLoading()
      ) : (
        <>
          {variant === 'equity' && renderEquityContent(data as EquityData)}
          {variant === 'daily' && renderDailyContent(data as DailyPnLData)}
          {variant === 'period' && renderPeriodContent(data as PeriodPnLData)}
          {variant === 'drawdown' && renderDrawdownContent(data as DrawdownData)}
        </>
      )}
    </div>
  );
};

export default KpiCard;
