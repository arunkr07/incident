import type { ReactNode } from "react";

type BadgeVariant =
  | "neutral"
  | "success"
  | "warning"
  | "danger"
  | "info";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
}

const variants: Record<BadgeVariant, string> = {
  neutral:
    "border-white/[0.08] bg-white/[0.035] text-slate-400",

  success:
    "border-emerald-300/10 bg-emerald-400/[0.07] text-emerald-300",

  warning:
    "border-amber-300/10 bg-amber-400/[0.07] text-amber-300",

  danger:
    "border-red-300/10 bg-red-400/[0.07] text-red-300",

  info:
    "border-teal-300/10 bg-teal-400/[0.07] text-teal-300",
};

const dots: Record<BadgeVariant, string> = {
  neutral: "bg-slate-500",
  success: "bg-emerald-400",
  warning: "bg-amber-400",
  danger: "bg-red-400",
  info: "bg-teal-400",
};

export function Badge({
  children,
  variant = "neutral",
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em]",
        variants[variant],
      ].join(" ")}
    >
      {dot && (
        <span
          className={[
            "h-1.5 w-1.5 rounded-full",
            dots[variant],
          ].join(" ")}
        />
      )}

      {children}
    </span>
  );
}