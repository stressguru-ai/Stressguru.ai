import { Check, X } from "lucide-react";

interface ComparisonItem {
  without: string;
  with: string;
}

interface ComparisonSectionProps {
  guruName: string;
  items: ComparisonItem[];
}

export default function ComparisonSection({ guruName, items }: ComparisonSectionProps) {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
          {/* Without Column */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-8 border-b border-slate-200 pb-4">
              Without the {guruName}
            </h3>
            <div className="space-y-8">
              {items.map((item, index) => (
                <div key={`without-${index}`} className="flex gap-4 group">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-red-50 flex items-center justify-center mt-1 group-hover:bg-red-100 transition-colors">
                    <span className="text-red-500 font-bold text-sm">{index + 1}</span>
                  </div>
                  <p className="text-lg text-slate-600 leading-relaxed group-hover:text-slate-900 transition-colors">
                    {item.without}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* With Column */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-[#7BDDE5] mb-8 border-b border-slate-200 pb-4">
              With the {guruName}
            </h3>
            <div className="space-y-8">
              {items.map((item, index) => (
                <div key={`with-${index}`} className="flex gap-4 group">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-[#7BDDE5]/10 flex items-center justify-center mt-1 group-hover:bg-[#7BDDE5]/20 transition-colors">
                    <Check className="w-4 h-4 text-[#7BDDE5]" />
                  </div>
                  <p className="text-lg text-slate-900 font-medium leading-relaxed">
                    <span dangerouslySetInnerHTML={{ __html: item.with.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
