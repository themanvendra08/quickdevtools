"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface InfoBoxProps {
  title: string;
  children: React.ReactNode;
  variant?: "info" | "warning";
  defaultExpanded?: boolean;
}

export function InfoBox({
  title,
  children,
  variant = "info",
  defaultExpanded = false,
}: InfoBoxProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const variantStyles = {
    info: {
      container: "border-blue-500/50 bg-blue-950/30",
      title: "text-blue-400",
      icon: "text-blue-400 hover:text-blue-300",
    },
    warning: {
      container: "border-yellow-500/50 bg-yellow-950/30",
      title: "text-yellow-400",
      icon: "text-yellow-400 hover:text-yellow-300",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className={`border rounded-lg ${styles.container}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left transition-colors"
      >
        <span className={`font-medium ${styles.title}`}>{title}</span>
        <span className={`transition-transform ${styles.icon}`}>
          {isExpanded ? (
            <Minus className="h-5 w-5" />
          ) : (
            <Plus className="h-5 w-5" />
          )}
        </span>
      </button>
      {isExpanded && (
        <div className="px-4 pb-4 text-sm text-muted-foreground">
          {children}
        </div>
      )}
    </div>
  );
}
