import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8"
};

export function Loading({ className, size = "md", text }: LoadingProps) {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <Loader2 className={cn("animate-spin", sizeClasses[size])} />
      {text && <span className="text-sm text-gray-600">{text}</span>}
    </div>
  );
}

export function LoadingPage({ text = "加载中..." }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loading size="lg" />
        <p className="text-lg text-gray-600">{text}</p>
      </div>
    </div>
  );
}

export function LoadingCard({ text = "加载中..." }: { text?: string }) {
  return (
    <div className="border rounded-lg p-8">
      <Loading text={text} className="justify-center" />
    </div>
  );
}