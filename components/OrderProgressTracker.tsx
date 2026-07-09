import { ClipboardCheck, UserCheck, Sparkles, CheckCircle2, Camera, Check, LucideIcon } from "lucide-react";

export interface OrderStep {
  label: string;
  icon: LucideIcon;
  hint?: string;
}

const DEFAULT_STEPS: OrderStep[] = [
  { label: "Booking", icon: ClipboardCheck, hint: "Request received" },
  { label: "Assigned", icon: UserCheck, hint: "Caretaker assigned" },
  { label: "Cleaning", icon: Sparkles, hint: "Work in progress" },
  { label: "Completed", icon: CheckCircle2, hint: "Care finished" },
  { label: "Photos Delivered", icon: Camera, hint: "Report sent to you" },
];

interface OrderProgressTrackerProps {
  /** Zero-based index of the current step (steps before it are complete). */
  currentStep?: number;
  steps?: OrderStep[];
  className?: string;
}

/**
 * Premium order progress tracker.
 *  • Desktop: horizontal connected nodes with a fill rail
 *  • Mobile: vertical flow
 * States: complete (filled + check), current (ring pulse), upcoming (muted).
 * Purely presentational — pass `currentStep` from real order state when wired.
 */
export default function OrderProgressTracker({
  currentStep = 0,
  steps = DEFAULT_STEPS,
  className = "",
}: OrderProgressTrackerProps) {
  const lastIndex = steps.length - 1;
  // Fill percentage of the connecting rail (center-to-center).
  const fillPct = lastIndex > 0 ? Math.min(1, Math.max(0, currentStep / lastIndex)) * 100 : 0;

  const stateOf = (idx: number): "complete" | "current" | "upcoming" =>
    idx < currentStep ? "complete" : idx === currentStep ? "current" : "upcoming";

  return (
    <div
      className={`glass-card shadow-premium rounded-2xl p-6 sm:p-8 ${className}`}
      role="group"
      aria-label="Order progress"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
          Your Care Journey
        </h3>
        <span className="text-xs font-medium text-muted-foreground">
          Step {Math.min(currentStep + 1, steps.length)} of {steps.length}
        </span>
      </div>

      {/* ── Desktop: horizontal ── */}
      <ol className="hidden sm:block relative">
        <div className="absolute top-6 left-[10%] right-[10%] h-[3px] rounded-full bg-border" aria-hidden="true" />
        <div
          className="absolute top-6 left-[10%] h-[3px] rounded-full bg-primary transition-[width] duration-700 ease-out"
          style={{ width: `calc(${fillPct}% * 0.8)` }}
          aria-hidden="true"
        />
        <div className="relative grid" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
          {steps.map((step, idx) => {
            const state = stateOf(idx);
            const Icon = step.icon;
            return (
              <li key={step.label} className="flex flex-col items-center text-center px-1">
                <span
                  className={[
                    "relative flex h-12 w-12 items-center justify-center rounded-full ring-4 ring-background transition-colors duration-500",
                    state === "complete" && "bg-primary text-primary-foreground",
                    state === "current" && "bg-primary text-primary-foreground shadow-lg shadow-primary/30 animate-pulseGlow",
                    state === "upcoming" && "bg-secondary text-muted-foreground border border-border",
                  ].filter(Boolean).join(" ")}
                >
                  {state === "complete" ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </span>
                <span
                  className={[
                    "mt-3 text-xs font-semibold leading-tight",
                    state === "upcoming" ? "text-muted-foreground" : "text-foreground",
                  ].join(" ")}
                >
                  {step.label}
                </span>
                {step.hint && (
                  <span className="mt-0.5 text-[10px] text-muted-foreground/70 leading-tight">{step.hint}</span>
                )}
              </li>
            );
          })}
        </div>
      </ol>

      {/* ── Mobile: vertical ── */}
      <ol className="sm:hidden relative">
        <div className="absolute top-5 bottom-5 left-5 w-[3px] rounded-full bg-border" aria-hidden="true" />
        <div
          className="absolute top-5 left-5 w-[3px] rounded-full bg-primary transition-[height] duration-700 ease-out"
          style={{ height: `calc(${fillPct}% - ${fillPct > 0 ? "0px" : "0px"})` }}
          aria-hidden="true"
        />
        {steps.map((step, idx) => {
          const state = stateOf(idx);
          const Icon = step.icon;
          return (
            <li key={step.label} className="relative flex items-center gap-4 pb-6 last:pb-0">
              <span
                className={[
                  "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-4 ring-background transition-colors duration-500",
                  state === "complete" && "bg-primary text-primary-foreground",
                  state === "current" && "bg-primary text-primary-foreground shadow-lg shadow-primary/30 animate-pulseGlow",
                  state === "upcoming" && "bg-secondary text-muted-foreground border border-border",
                ].filter(Boolean).join(" ")}
              >
                {state === "complete" ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </span>
              <div>
                <p className={`text-sm font-semibold leading-tight ${state === "upcoming" ? "text-muted-foreground" : "text-foreground"}`}>
                  {step.label}
                </p>
                {step.hint && <p className="text-xs text-muted-foreground/70 mt-0.5">{step.hint}</p>}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
