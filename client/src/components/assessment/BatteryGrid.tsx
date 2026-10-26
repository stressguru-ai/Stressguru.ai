import React from 'react';
import { Battery, BatteryCharging, BatteryWarning, BatteryFull } from "lucide-react";
import { cn } from "@/lib/utils";

interface BatteryGridProps {
  onSelect: (optionId: string) => void;
  selectedOptionId?: string;
}

export default function BatteryGrid({ onSelect, selectedOptionId }: BatteryGridProps) {
  const options = [
    { id: "fully_charged", level: 100, label: "Fully Charged", color: "text-green-500", fill: "bg-green-500" },
    { id: "sufficient", level: 60, label: "Sufficient", color: "text-yellow-500", fill: "bg-yellow-500" },
    { id: "low_battery", level: 30, label: "Low Battery", color: "text-orange-500", fill: "bg-orange-500" },
    { id: "critically_low", level: 10, label: "Critically Low", color: "text-red-500", fill: "bg-red-500" },
  ];

  return (
    <div className="flex flex-col gap-4 w-full max-w-lg mx-auto">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onSelect(opt.id)}
          className={cn(
            "relative w-full h-16 rounded-xl border-2 overflow-hidden transition-all duration-300 flex items-center px-4",
            selectedOptionId === opt.id 
              ? "border-slate-900 dark:border-white shadow-lg scale-105" 
              : "border-slate-200 dark:border-slate-700 hover:border-slate-400"
          )}
        >
          {/* Battery Fill Background */}
          <div 
            className={cn("absolute top-0 left-0 bottom-0 transition-all duration-1000 opacity-20", opt.fill)}
            style={{ width: `${opt.level}%` }}
          />
          
          <div className="flex items-center justify-between w-full z-10">
            <div className="flex items-center gap-3">
              <Battery className={cn("w-8 h-8", opt.color)} />
              <span className="font-bold text-slate-700 dark:text-slate-200">{opt.label}</span>
            </div>
            <span className="text-sm font-mono text-slate-500">{opt.level}%</span>
          </div>
        </button>
      ))}
    </div>
  );
}
