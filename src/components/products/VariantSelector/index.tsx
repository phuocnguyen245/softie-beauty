interface VariantSelectorProps {
  label: string;
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
}

export function VariantSelector({
  label,
  options,
  selected,
  onSelect,
}: VariantSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm text-muted-foreground">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onSelect(option)}
            className={`px-5 py-2.5 rounded-full border transition-all ${
              selected === option
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-white text-foreground border-border hover:border-primary/50 hover:shadow-sm"
            }`}
          >
            <span className="text-sm">{option}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
