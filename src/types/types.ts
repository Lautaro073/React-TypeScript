export interface FinancialData {
  timestamp: number;
  symbol: string;
  price: number;
}

export interface CardState {
  symbol: string;
  currentPrice: number;
  previousPrice: number;
}

export interface UseRealtimePriceUpdatesParams {
  financialData: FinancialData[];
  symbols: string[];
  updateInterval: number;
}

export interface LiveChartData {
  labels: string[]; 
  datasets: Array<{
    label: string;              
    data: number[];             
    fill: boolean;              
    backgroundColor: string;    
    borderColor: string;        
    tension: number;            
    pointRadius: number;       
    pointHoverRadius: number;   
    hidden: boolean;            
  }>;
}

export interface UseLiveFilterChartDataParams {
  symbols: string[];
  updateInterval: number;
  maxPoints: number;
  removeCount: number;
}

export interface FinancialChartProps {
  financialData?: FinancialData[];
  selectedSymbols?: string[];
  chartData?: LiveChartData;
}
