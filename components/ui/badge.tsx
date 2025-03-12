import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-1 focus:ring-offset-1",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-blue-600/80 text-white hover:bg-blue-700/90 shadow-sm",
        secondary:
          "border-blue-800/50 bg-blue-900/40 text-blue-200 hover:bg-blue-800/60 hover:text-blue-100",
        destructive:
          "border-transparent bg-red-900/70 text-red-100 hover:bg-red-800/80",
        success:
          "border-transparent bg-green-900/70 text-green-100 hover:bg-green-800/80",
        warning:
          "border-transparent bg-amber-900/70 text-amber-100 hover:bg-amber-800/80",
        outline:
          "border-gray-700 bg-transparent text-gray-300 hover:bg-gray-800/60",
        ghost:
          "border-transparent bg-transparent text-gray-400 hover:bg-gray-800/60 hover:text-gray-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
