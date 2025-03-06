import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChartLegendProps } from '@/types/types';

export function ChartLegend({ datasets, toggleVisibility }: ChartLegendProps) {
  return (
    <ul className="flex gap-4  items-center mb-3 mt-4  justify-center">
      {datasets.map((ds, idx) => (
        <li key={idx}>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              'flex items-center gap-1',
              ds.hidden ? 'opacity-50' : 'opacity-100'
            )}
            onClick={() => toggleVisibility(ds.label)}
            aria-label={`Alternar visibilidad de ${ds.label}`}
          >
            <span
              style={{
                backgroundColor: ds.backgroundColor,
                border: `2px solid ${ds.borderColor}`,
              }}
              className="block h-3 w-3 rounded-full"
            ></span>
            <span className="text-sm">{ds.label}</span>
          </Button>
        </li>
      ))}
    </ul>
  );
}
