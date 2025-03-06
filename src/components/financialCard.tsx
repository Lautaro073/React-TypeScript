import { useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { FinancialCardProps } from '@/types/types';

export function FinancialCard({
  symbol,
  currentPrice,
  previousPrice,
  iconPath,
}: FinancialCardProps) {
  const priceDifference = currentPrice - previousPrice;
  const hasIncreased = priceDifference > 0;
  const differenceLabel = `${hasIncreased ? '+' : ''}${priceDifference.toFixed(2)}`;

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      // Actualiza el atributo aria-label del elemento para reflejar dinámicamente
      // el precio actual y su cambio, mejorando la accesibilidad.
      cardRef.current.setAttribute(
        'aria-label',
        `Acción ${symbol}: precio actual $${currentPrice.toFixed(
          2
        )}, cambio ${differenceLabel}`
      );
    }
  }, [symbol, currentPrice, differenceLabel]);

  return (
    <Card ref={cardRef} tabIndex={0} className="w-full p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={iconPath} alt={`${symbol} icon`} className="h-5 w-5" />
          <span className="text-sm font-medium">{symbol}</span>
        </div>
        <div className="flex items-center gap-2">
          {hasIncreased ? (
            <ArrowUp className="h-4 w-4 text-green-500" />
          ) : (
            <ArrowDown className="h-4 w-4 text-red-500" />
          )}
          <span className="text-base font-bold">
            ${currentPrice.toFixed(2)}
          </span>
          <span
            className={
              hasIncreased ? 'text-green-500 text-xs' : 'text-red-500 text-xs'
            }
          >
            {differenceLabel}
          </span>
        </div>
      </div>
    </Card>
  );
}
