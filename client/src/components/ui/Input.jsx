import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, error, icon, ...props }, ref) => {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
          {icon}
        </div>
      )}
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground ring-offset-background transition-all duration-200",
          "placeholder:text-text-muted",
          "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error 
            ? "border-danger focus:ring-danger/30 focus:border-danger" 
            : "hover:border-border-light",
          icon && "pl-10",
          className
        )}
        ref={ref}
        {...props}
      />
    </div>
  )
})
Input.displayName = "Input"

export { Input }
