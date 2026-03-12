import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary-light shadow-sm hover:shadow-glow-sm",
        secondary: "bg-surface-light text-foreground border border-border hover:bg-surface-lighter hover:border-border-light",
        ghost: "text-text-secondary hover:text-foreground hover:bg-surface-light",
        destructive: "bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20",
        outline: "border border-border text-foreground hover:bg-surface-light hover:border-border-light",
        success: "bg-success text-white hover:bg-success-light",
        warning: "bg-warning text-white hover:bg-warning-light",
        info: "bg-info text-white hover:bg-info-light",
        link: "text-primary underline-offset-4 hover:underline bg-transparent",
      },
      size: {
        default: "h-10 px-4 py-2.5",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-base",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }
