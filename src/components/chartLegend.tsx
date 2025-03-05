import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ChartLegendProps {
  datasets: Array<{
    label: string
    backgroundColor: string
    borderColor: string
    hidden: boolean
  }>
  toggleVisibility: (label: string) => void
}

export function ChartLegend({ datasets, toggleVisibility }: ChartLegendProps) {
  return (
    <ul className="flex gap-4 mt-2">
      {datasets.map((ds, idx) => (
        <li key={idx}>
          <Button
            variant="outline"
            size="sm"
            className={cn("flex items-center gap-1", ds.hidden ? "opacity-50" : "opacity-100")}
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
  )
}
