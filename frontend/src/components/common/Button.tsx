import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "border border-emerald-300/20 bg-emerald-400/[0.12] text-emerald-100 hover:bg-emerald-400/[0.18] hover:border-emerald-300/30",

  secondary:
    "border border-white/[0.08] bg-white/[0.025] text-slate-200 hover:bg-white/[0.05] hover:border-white/[0.12]",

  ghost:
    "border border-transparent text-slate-400 hover:bg-white/[0.035] hover:text-slate-200",

  danger:
    "border border-red-400/15 bg-red-400/[0.08] text-red-200 hover:bg-red-400/[0.13] hover:border-red-400/25",
};

const sizes = {
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-3.5 text-sm",
  lg: "h-10 px-4 text-sm",
};

export function Button({
  children,
  variant = "secondary",
  size = "md",
  loading = false,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={[
        "focus-ring inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      ].join(" ")}
    >
      {loading && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}

      {children}
    </button>
  );
}