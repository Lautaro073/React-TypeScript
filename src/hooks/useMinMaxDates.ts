import { useMemo } from 'react';
import { FinancialData } from '@/types/types';

export function useMinMaxDates(financialData: FinancialData[]) {
  return useMemo(() => {
    if (!financialData.length) {
      return { minDate: new Date(), maxDate: new Date() };
    }
    const timestamps = financialData.map((item) => item.timestamp);
    const minTs = Math.min(...timestamps);
    const maxTs = Math.max(...timestamps);
    return {
      minDate: new Date(minTs),
      maxDate: new Date(maxTs),
    };
  }, [financialData]);
}
