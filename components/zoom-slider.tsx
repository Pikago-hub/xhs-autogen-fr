"use client";

import { useReactFlow, useStore } from "@xyflow/react";
import { Slider } from "@/components/ui/slider";
import { Focus } from "lucide-react";

export function ZoomSlider() {
  const { zoomTo, fitView } = useReactFlow();
  const zoom = useStore((s) => s.transform[2]);

  const handleZoomChange = (value: number[]) => {
    zoomTo(value[0]);
  };

  const handleReset = () => {
    fitView({ duration: 200 });
  };

  return (
    <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-card border border-border rounded-lg p-3 shadow-sm">
      <button
        onClick={() => zoomTo(Math.max(0.1, zoom - 0.1))}
        className="text-card-foreground hover:text-accent-foreground transition-colors"
      >
        −
      </button>
      <Slider
        value={[zoom]}
        onValueChange={handleZoomChange}
        min={0.1}
        max={2}
        step={0.05}
        className="w-32"
      />
      <button
        onClick={() => zoomTo(Math.min(2, zoom + 0.1))}
        className="text-card-foreground hover:text-accent-foreground transition-colors"
      >
        +
      </button>
      <span className="text-sm text-muted-foreground min-w-[3rem] text-center">
        {Math.round(zoom * 100)}%
      </span>
      <button
        onClick={handleReset}
        className="text-card-foreground hover:text-accent-foreground transition-colors"
        title="Fit view"
      >
        <Focus className="h-4 w-4" />
      </button>
    </div>
  );
}