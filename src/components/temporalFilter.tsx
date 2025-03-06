import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { DatePickerRange } from '@/components/datePickerRange';
import { DateRange } from 'react-day-picker';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { subDays, subMonths } from 'date-fns';

type FilterMode = '7days' | '1month' | 'custom' | 'live';

interface TemporalFilterProps {
  onRangeChange: (range: DateRange | null) => void;
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
    'live'
  );

  const [customDateRange, setCustomDateRange] =
    useLocalStorage<DateRange | null>('customDateRange', null);

  //  Maneja el cambio de modo de filtro y actualiza el rango de fechas de acuerdo al modo seleccionado.
  const handleModeChange = useCallback(
    (mode: FilterMode) => {
      setFilterMode(mode);

      if (mode === '7days') {
        const to = new Date();
        const from = subDays(to, 7);
        const newRange = { from, to };
        onRangeChange(newRange);
      } else if (mode === '1month') {
        const to = new Date();
        const from = subMonths(to, 1);
        const newRange = { from, to };
        onRangeChange(newRange);
      } else if (mode === 'custom') {
        onRangeChange(customDateRange);
      } else if (mode === 'live') {
        onRangeChange(null);
      }
    },
    [customDateRange, onRangeChange, setFilterMode]
  );

  //  Actualiza el rango de fechas personalizado y notifica el cambio al componente padre.
  const handleCustomRangeChange = useCallback(
    (range: DateRange | null) => {
      setCustomDateRange(range);
      onRangeChange(range);
    },
    [onRangeChange, setCustomDateRange]
  );

  return (
    <div className="flex flex-col gap-2 mb-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          aria-label="Seleccionar últimos 7 días"
          variant={filterMode === '7days' ? 'default' : 'outline'}
          className="w-full sm:w-auto"
          onClick={() => handleModeChange('7days')}
        >
          Últimos 7 días
        </Button>
        <Button
          aria-label="Seleccionar último mes"
          variant={filterMode === '1month' ? 'default' : 'outline'}
          className="w-full sm:w-auto"
          onClick={() => handleModeChange('1month')}
        >
          Último mes
        </Button>
        <Button
          aria-label="Seleccionar Personalizado"
          variant={filterMode === 'custom' ? 'default' : 'outline'}
          className="w-full sm:w-auto"
          onClick={() => handleModeChange('custom')}
        >
          Personalizado
        </Button>
        <Button
          aria-label="Seleccionar En vivo"
          variant={filterMode === 'live' ? 'default' : 'outline'}
          className="w-full sm:w-auto"
          onClick={() => handleModeChange('live')}
        >
          En vivo
        </Button>
      </div>

      {filterMode === 'custom' && (
        <div className="flex items-center gap-2">
          <DatePickerRange
            dateRange={customDateRange}
            onChange={handleCustomRangeChange}
            minDate={minDate}
            maxDate={maxDate}
          />
        </div>
      )}
    </div>
  );
};

export default TemporalFilter;
