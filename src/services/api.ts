import { FinancialData } from '../types/types';

export async function fetchFinancialData(): Promise<FinancialData[]> {
  try {
    const response = await fetch('/data.json'); 
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const data: FinancialData[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error en fetchFinancialData:', error);
    return [];
  }
}
