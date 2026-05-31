import {
  forwardRef,
  type ButtonHTMLAttributes,
  type MouseEvent,
  useState,
} from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "outline";

interface RippleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:brightness-95 shadow-sm hover:shadow-md",
  ghost: "bg-transparent text-gray-800 hover:bg-gray-200",
  outline:
    "border border-gray-300 bg-white/70 text-gray-800 hover:bg-gray-100 hover:border-gray-400",
};

let rippleId = 0;

export const RippleButton = forwardRef<HTMLButtonElement, RippleButtonProps>(
  ({ className, variant = "primary", children, onClick, ...props }, ref) => {
    const [ripples, setRipples] = useState<
      { id: number; x: number; y: number; size: number }[]
    >([]);

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const id = rippleId++;
      setRipples((r) => [
        ...r,
        { id, x: e.clientX - rect.left - size / 2, y: e.clientY - rect.top - size / 2, size },
      ]);
      setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 600);
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        onClick={handleClick}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl px-6 py-3 text-sm font-medium transition-all duration-150 active:scale-[0.98]",
          variants[variant],
          className,
        )}
        {...props}
      >
        {ripples.map((r) => (
          <span
            key={r.id}
            className="ripple"
            style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
          />
        ))}
        <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      </button>
    );
  },
);
RippleButton.displayName = "RippleButton";
