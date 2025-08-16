import { ReactNode } from "react";

interface BaseNodeHeaderProps {
  children: ReactNode;
}

export function BaseNodeHeader({ children }: BaseNodeHeaderProps) {
  return (
    <div className="flex items-center justify-between px-3 py-2 border-b border-border">
      {children}
    </div>
  );
}

interface BaseNodeHeaderTitleProps {
  children: ReactNode;
}

export function BaseNodeHeaderTitle({ children }: BaseNodeHeaderTitleProps) {
  return (
    <h3 className="font-semibold text-base text-card-foreground">
      {children}
    </h3>
  );
}

interface BaseNodeContentProps {
  children: ReactNode;
}

export function BaseNodeContent({ children }: BaseNodeContentProps) {
  return (
    <div className="px-3 py-2">
      {children}
    </div>
  );
}

interface BaseNodeFooterProps {
  children: ReactNode;
}

export function BaseNodeFooter({ children }: BaseNodeFooterProps) {
  return (
    <div className="px-3 py-2 border-t border-border bg-muted/30">
      {children}
    </div>
  );
}