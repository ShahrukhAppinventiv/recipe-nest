import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "outline" | "ghost";

interface RecipeButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary-dark shadow-soft disabled:hover:bg-primary",
  outline:
    "border border-border bg-card text-foreground hover:bg-muted/40 shadow-soft disabled:hover:bg-card",
  ghost:
    "text-muted-foreground hover:text-foreground hover:bg-muted/40 disabled:hover:bg-transparent disabled:hover:text-muted-foreground",
};

export function RecipeButton({
  variant = "primary",
  fullWidth = false,
  className = "",
  type = "button",
  disabled = false,
  children,
  ...props
}: RecipeButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2",
        disabled
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer",
        variantStyles[variant],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
