import { Plus, Minus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  size?: "sm" | "md";
}

export function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
  size = "md",
}: QuantitySelectorProps) {
  const buttonSize = size === "sm" ? "w-7 h-7" : "w-9 h-9";
  const iconSize = size === "sm" ? "w-3 h-3" : "w-4 h-4";
  const textSize = size === "sm" ? "text-sm" : "text-base";

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onDecrease}
        className={`${buttonSize} flex items-center justify-center rounded-full bg-secondary hover:bg-primary/20 transition-colors border border-border`}
      >
        <Minus className={iconSize} />
      </button>
      <span className={`${textSize} text-foreground min-w-[2rem] text-center`}>
        {quantity}
      </span>
      <button
        onClick={onIncrease}
        className={`${buttonSize} flex items-center justify-center rounded-full bg-secondary hover:bg-primary/20 transition-colors border border-border`}
      >
        <Plus className={iconSize} />
      </button>
    </div>
  );
}
