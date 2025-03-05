import { useMemo } from 'react'
import { FinancialData } from '@/types/financial'
import { DateRange } from 'react-day-picker'

export function useFilteredFinancialData(
  financialData: FinancialData[],
  dateRange: DateRange | undefined,
  selectedSymbols: string[]
): FinancialData[] {
  return useMemo(() => {
    if (!dateRange?.from || !dateRange.to) {
      return financialData.filter((item) => selectedSymbols.includes(item.symbol))
    }
    const fromTime = new Date(dateRange.from).getTime()
    const toTime = new Date(dateRange.to).getTime()
    return financialData.filter((item) => {
      const itemTime = item.timestamp
      return itemTime >= fromTime && itemTime <= toTime && selectedSymbols.includes(item.symbol)
    })
  }, [financialData, dateRange, selectedSymbols])
}
