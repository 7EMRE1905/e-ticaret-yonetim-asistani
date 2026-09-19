import { cn } from "@/lib/utils";

export function Button({ className, variant = "default", size = "default", ...props }) {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    default: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg",
    destructive: "bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white",
    outline: "border border-white/10 bg-transparent text-slate-300 hover:bg-white/5 hover:text-white",
    ghost: "bg-transparent text-slate-300 hover:bg-white/5 hover:text-white",
    success: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white",
  };

  const sizes = {
    default: "h-10 py-2 px-4 text-sm",
    sm: "h-9 px-3 text-xs",
    lg: "h-11 px-8 text-base",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}
