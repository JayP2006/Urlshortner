import { forwardRef } from "react";
import { cn } from "../utils/index.js";

const Input = forwardRef(function Input(
  { label, hint, error, icon, className, containerClassName, ...props },
  ref
) {
  return (
    <label className={cn("block", containerClassName)}>
      {label && (
        <span className="mb-1.5 block text-xs font-medium text-fg-muted">
          {label}
        </span>
      )}
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-subtle">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full h-11 rounded-xl bg-bg-elev/60 border border-border px-4 text-sm text-fg placeholder:text-fg-subtle",
            "focus:outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20 transition",
            icon && "pl-10",
            error && "border-danger/60 focus:border-danger focus:ring-danger/20",
            className
          )}
          {...props}
        />
      </div>
      {(hint || error) && (
        <span
          className={cn(
            "mt-1.5 block text-xs",
            error ? "text-danger" : "text-fg-subtle"
          )}
        >
          {error || hint}
        </span>
      )}
    </label>
  );
});

export default Input;
