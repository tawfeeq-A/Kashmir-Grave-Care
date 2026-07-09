import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

/**
 * Meaningful empty state — calm, branded, never a dead-end.
 * A soft illustrative icon medallion, clear message, and an optional action.
 */
export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`text-center py-16 sm:py-20 px-6 rounded-3xl border border-dashed border-border/60 bg-secondary/20 ${className}`}
    >
      {/* Illustrative medallion — layered rings for soft depth */}
      <div className="relative mx-auto mb-6 h-20 w-20">
        <div className="absolute inset-0 rounded-full bg-primary/5" />
        <div className="absolute inset-2 rounded-full bg-primary/10" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="h-8 w-8 text-primary/70" strokeWidth={1.5} />
        </div>
      </div>
      <h3 className="text-lg sm:text-xl font-bold font-serif text-foreground">{title}</h3>
      <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-md mx-auto leading-relaxed text-pretty">
        {description}
      </p>
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}
