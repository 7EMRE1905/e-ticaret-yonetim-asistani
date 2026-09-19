"use client";

import { useStore } from "@/store/useStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { CheckCircle2, Circle } from "lucide-react";

export default function GuidePage() {
  const { checklist, toggleChecklist } = useStore();

  const completed = checklist.filter((c) => c.done).length;
  const progress = Math.round((completed / checklist.length) * 100);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-100">E-Ticaret Başlangıç Rehberi</h1>
        <p className="text-slate-400">İlk satışınızı yapana kadar izlemeniz gereken adımlar.</p>
      </div>

      <Card>
        <CardHeader className="bg-white/5 border-b border-white/10">
          <div className="flex items-center justify-between">
            <CardTitle>Hazırlık Süreci</CardTitle>
            <span className="text-sm font-medium text-indigo-400">
              {completed} / {checklist.length} Tamamlandı
            </span>
          </div>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-black/40">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-white/10">
            {checklist.map((item) => (
              <label 
                key={item.id} 
                className="flex cursor-pointer items-center gap-4 p-4 transition-colors hover:bg-white/5"
              >
                <input 
                  type="checkbox" 
                  className="peer sr-only"
                  checked={item.done}
                  onChange={() => toggleChecklist(item.id)}
                />
                <div className="text-slate-400 peer-checked:text-emerald-500 transition-colors">
                  {item.done ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </div>
                <span className={`flex-1 text-sm md:text-base font-medium transition-all ${item.done ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                  {item.text}
                </span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
