import { format } from 'date-fns'
import { DateRange } from 'react-day-picker'
import { Button } from '@/components/ui/button'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'

interface DatePickerRangeProps {
  dateRange: DateRange | null;
  onChange: (range: DateRange | null) => void;
  minDate: Date;
  maxDate: Date;
}

export function DatePickerRange({
  dateRange,
  onChange,
  minDate,
  maxDate,
}: DatePickerRangeProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[260px] justify-start text-left font-normal"
        >
          {dateRange?.from ? (
            dateRange.to ? (
              `${format(dateRange.from, 'LLL dd, y')} - ${format(dateRange.to, 'LLL dd, y')}`
            ) : (
              format(dateRange.from, 'LLL dd, y')
            )
          ) : (
            'Seleccione una fecha'
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0 dark" align="start">
        <Calendar
          mode="range"
          numberOfMonths={2}
          // Si dateRange es null, pasamos undefined para que el Calendar lo entienda
          selected={dateRange ?? undefined}
          // Convertimos undefined a null en el handler
          onSelect={(range: DateRange | undefined) => onChange(range ?? null)}
          initialFocus
          disabled={[{ before: minDate, after: maxDate }]}
        />
      </PopoverContent>
    </Popover>
  )
}
