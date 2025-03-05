import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { DatePickerRange } from '@/components/datePickerRange';
import { DateRange } from 'react-day-picker';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { subDays, subMonths } from 'date-fns';

type FilterMode = '7days' | '1month' | 'custom';

interface TemporalFilterProps {
  onRangeChange: (range: DateRange | undefined) => void;
  minDate: Date;
  maxDate: Date;
}

export const TemporalFilter: React.FC<TemporalFilterProps> = ({
  onRangeChange,
  minDate,
  maxDate,
}) => {
  const [filterMode, setFilterMode] = useLocalStorage<FilterMode>(
    'filterMode',
    'custom'
  );
  const [dateRange, setDateRange] = useLocalStorage<DateRange | undefined>(
    'dateRange',
    undefined
  );

  const handleModeChange = useCallback(
    (mode: FilterMode) => {
      setFilterMode(mode);

      if (mode === '7days') {
        const to = new Date();
        const from = subDays(to, 7);
        const newRange = { from, to };
        setDateRange(newRange);
        onRangeChange(newRange);
      } else if (mode === '1month') {
        const to = new Date();
        const from = subMonths(to, 1);
        const newRange = { from, to };
        setDateRange(newRange);
        onRangeChange(newRange);
      } else {
        onRangeChange(dateRange);
      }
    },
    [dateRange, onRangeChange, setDateRange, setFilterMode]
  );

  const handleCustomRangeChange = useCallback(
    (range: DateRange | undefined) => {
      setDateRange(range);
      onRangeChange(range);
    },
    [onRangeChange, setDateRange]
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Button
          aria-label="Seleccionar últimos 7 días"
          variant={filterMode === '7days' ? 'default' : 'outline'}
          onClick={() => handleModeChange('7days')}
        >
          Últimos 7 días
        </Button>
        <Button
          aria-label="Seleccionar último mes"
          variant={filterMode === '1month' ? 'default' : 'outline'}
          onClick={() => handleModeChange('1month')}
        >
          Último mes
        </Button>
        <Button
          aria-label="Seleccionar Personalizado"
          variant={filterMode === 'custom' ? 'default' : 'outline'}
          onClick={() => handleModeChange('custom')}
        >
          Personalizado
        </Button>
      </div>

      {filterMode === 'custom' && (
        <div className="flex items-center gap-2">
          <DatePickerRange
            dateRange={dateRange}
            onChange={handleCustomRangeChange}
            minDate={minDate}
            maxDate={maxDate}
          />
        </div>
      )}
    </div>
  );
};
