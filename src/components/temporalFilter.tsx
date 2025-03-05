// temporalFilter.tsx
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
  // Para el modo activo (que puede ser live o personalizado)
  const [filterMode, setFilterMode] = useLocalStorage<FilterMode>('filterMode', 'custom');
  // Guardamos el rango personalizado por separado (persistente)
  const [customDateRange, setCustomDateRange] = useLocalStorage<DateRange | null>('customDateRange', null);

  const handleModeChange = useCallback(
    (mode: FilterMode) => {
      setFilterMode(mode);

      if (mode === '7days') {
        const to = new Date();
        const from = subDays(to, 7);
        const newRange = { from, to };
        // Actualizamos el rango personalizado y la selección activa
        setCustomDateRange(newRange);
        onRangeChange(newRange);
      } else if (mode === '1month') {
        const to = new Date();
        const from = subMonths(to, 1);
        const newRange = { from, to };
        setCustomDateRange(newRange);
        onRangeChange(newRange);
      } else if (mode === 'custom') {
        // En modo personalizado, se utiliza el valor previamente guardado
        onRangeChange(customDateRange);
      } else if (mode === 'live') {
        // En vivo: no se filtra por fecha, pero no se borra el rango personalizado
        onRangeChange(null);
      }
    },
    [customDateRange, onRangeChange, setCustomDateRange, setFilterMode]
  );

  const handleCustomRangeChange = useCallback(
    (range: DateRange | null) => {
      setCustomDateRange(range);
      onRangeChange(range);
    },
    [onRangeChange, setCustomDateRange]
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
        <Button
          aria-label="Seleccionar En Vivo"
          variant={filterMode === 'live' ? 'default' : 'outline'}
          onClick={() => handleModeChange('live')}
        >
          En Vivo
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
