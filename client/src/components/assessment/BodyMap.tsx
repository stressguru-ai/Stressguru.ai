import React from 'react';
import { cn } from "@/lib/utils";

interface BodyMapProps {
  onSelect: (parts: string[]) => void;
  selectedParts?: string[];
}

export default function BodyMap({ onSelect, selectedParts = [] }: BodyMapProps) {
  const togglePart = (part: string) => {
    if (selectedParts.includes(part)) {
      onSelect(selectedParts.filter(p => p !== part));
    } else {
      onSelect([...selectedParts, part]);
    }
  };
  return (
    <div className="w-full max-w-md mx-auto aspect-[3/4] relative">
      <svg viewBox="0 0 200 300" className="w-full h-full drop-shadow-xl">
        <defs>
          <radialGradient id="glow-red" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(220, 38, 38, 0.6)" />
            <stop offset="100%" stopColor="rgba(220, 38, 38, 0)" />
          </radialGradient>
          <radialGradient id="glow-yellow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(234, 179, 8, 0.6)" />
            <stop offset="100%" stopColor="rgba(234, 179, 8, 0)" />
          </radialGradient>
        </defs>

        {/* Base Silhouette */}
        <path
          d="M100,20 C85,20 75,35 75,50 C75,65 80,75 85,80 C70,85 50,95 40,110 L30,180 L45,180 L50,140 L50,220 L40,290 L80,290 L85,220 L115,220 L120,290 L160,290 L150,220 L150,140 L155,180 L170,180 L160,110 C150,95 130,85 115,80 C120,75 125,65 125,50 C125,35 115,20 100,20 Z"
          fill="#e2e8f0"
          className={cn(
            "transition-all duration-500 cursor-pointer hover:fill-slate-300",
            selectedParts.includes('whole-body') && "fill-red-100 stroke-red-500 stroke-2"
          )}
          onClick={() => togglePart('whole-body')}
        />

        {/* Option 4: Rigid/Stuck (Whole Body Overlay) */}
        <path
          d="M100,20 C85,20 75,35 75,50 C75,65 80,75 85,80 C70,85 50,95 40,110 L30,180 L45,180 L50,140 L50,220 L40,290 L80,290 L85,220 L115,220 L120,290 L160,290 L150,220 L150,140 L155,180 L170,180 L160,110 C150,95 130,85 115,80 C120,75 125,65 125,50 C125,35 115,20 100,20 Z"
          fill="url(#glow-red)"
          className={cn(
            "opacity-0 transition-opacity duration-500 pointer-events-none",
            selectedParts.includes('whole-body') && "opacity-100"
          )}
        />

        {/* Option 3: Head, Jaw & Shoulders Hotspots (Score 12) */}
        {/* Head Zone - Added for headaches */}
        <circle cx="100" cy="40" r="18" className={cn("fill-red-500/10 stroke-red-500/20 stroke-1 cursor-pointer hover:fill-red-500/30 transition-colors", selectedParts.includes('head') && "fill-red-500/60")} onClick={(e) => { e.stopPropagation(); togglePart('head'); }} />
        
        {/* Jaw Left */}
        <circle cx="85" cy="60" r="10" className={cn("fill-red-500/10 stroke-red-500/20 stroke-1 cursor-pointer hover:fill-red-500/30 transition-colors", selectedParts.includes('jaw-left') && "fill-red-500/60")} onClick={(e) => { e.stopPropagation(); togglePart('jaw-left'); }} />
        {/* Jaw Right */}
        <circle cx="115" cy="60" r="10" className={cn("fill-red-500/10 stroke-red-500/20 stroke-1 cursor-pointer hover:fill-red-500/30 transition-colors", selectedParts.includes('jaw-right') && "fill-red-500/60")} onClick={(e) => { e.stopPropagation(); togglePart('jaw-right'); }} />
        {/* Shoulder Left */}
        <circle cx="60" cy="95" r="15" className={cn("fill-red-500/10 stroke-red-500/20 stroke-1 cursor-pointer hover:fill-red-500/30 transition-colors", selectedParts.includes('shoulder-left') && "fill-red-500/60")} onClick={(e) => { e.stopPropagation(); togglePart('shoulder-left'); }} />
        {/* Shoulder Right */}
        <circle cx="140" cy="95" r="15" className={cn("fill-red-500/10 stroke-red-500/20 stroke-1 cursor-pointer hover:fill-red-500/30 transition-colors", selectedParts.includes('shoulder-right') && "fill-red-500/60")} onClick={(e) => { e.stopPropagation(); togglePart('shoulder-right'); }} />

        {/* Option 2: Random Knots (Score 6) */}
        <circle cx="100" cy="130" r="12" className={cn("fill-yellow-500/10 stroke-yellow-500/20 stroke-1 cursor-pointer hover:fill-yellow-500/30 transition-colors", selectedParts.includes('chest') && "fill-yellow-500/60")} onClick={(e) => { e.stopPropagation(); togglePart('chest'); }} />
        <circle cx="100" cy="180" r="12" className={cn("fill-yellow-500/10 stroke-yellow-500/20 stroke-1 cursor-pointer hover:fill-yellow-500/30 transition-colors", selectedParts.includes('stomach') && "fill-yellow-500/60")} onClick={(e) => { e.stopPropagation(); togglePart('stomach'); }} />
        
        {/* Labels/Tooltips (Optional, simplified for now) */}
      </svg>
      
      {/* Helper Text Overlay */}
      <div className="absolute bottom-0 left-0 right-0 text-center text-sm text-slate-500 pointer-events-none">
        Click on the body to identify tension
      </div>
    </div>
  );
}
