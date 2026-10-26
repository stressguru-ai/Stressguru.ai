import React from 'react';
import { Sun, Cloud, Zap, CloudFog } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeatherGridProps {
  onSelect: (optionId: string) => void;
  selectedOptionId?: string;
}

export default function WeatherGrid({ onSelect, selectedOptionId }: WeatherGridProps) {
  const options = [
    { id: "clear_skies", icon: Sun, label: "Clear Skies", color: "text-yellow-500", bg: "bg-yellow-50 hover:bg-yellow-100 border-yellow-200" },
    { id: "partly_cloudy", icon: Cloud, label: "Partly Cloudy", color: "text-blue-400", bg: "bg-blue-50 hover:bg-blue-100 border-blue-200" },
    { id: "thunderstorms", icon: Zap, label: "Thunderstorms", color: "text-purple-500", bg: "bg-purple-50 hover:bg-purple-100 border-purple-200" },
    { id: "dense_fog", icon: CloudFog, label: "Dense Fog", color: "text-gray-500", bg: "bg-gray-50 hover:bg-gray-100 border-gray-200" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-lg mx-auto">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onSelect(opt.id)}
          className={cn(
            "flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 aspect-square",
            selectedOptionId === opt.id 
              ? `ring-4 ring-offset-2 ring-${opt.color.split('-')[1]}-400 ${opt.bg} scale-105` 
              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:scale-105"
          )}
        >
          <opt.icon className={cn("w-16 h-16 mb-4 transition-transform duration-500", opt.color, selectedOptionId === opt.id && "animate-pulse")} />
          <span className="font-medium text-slate-700 dark:text-slate-200">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}
