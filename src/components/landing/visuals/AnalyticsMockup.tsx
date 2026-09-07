import React from 'react';
import { TrendingUp, Users, Eye } from 'lucide-react';

export default function AnalyticsMockup() {
  return (
    <div className="w-full h-full bg-slate-900 rounded-2xl border border-slate-700 shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex flex-col overflow-hidden text-sm relative">
      <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
        <div>
          <div className="font-bold text-white text-lg">Campaign Analytics</div>
          <div className="text-slate-400 text-xs">Last 30 Days</div>
        </div>
        <div className="bg-[#E11D48] text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
          <TrendingUp className="w-3 h-3" /> +12.4%
        </div>
      </div>
      
      <div className="p-5 flex flex-col gap-4 flex-1">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
            <div className="text-slate-400 text-[10px] uppercase font-bold mb-1 flex items-center gap-1">
              <Eye className="w-3 h-3" /> Impressions
            </div>
            <div className="text-white font-black text-xl">4.2M</div>
          </div>
          <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
            <div className="text-slate-400 text-[10px] uppercase font-bold mb-1 flex items-center gap-1">
              <Users className="w-3 h-3" /> Engaged
            </div>
            <div className="text-white font-black text-xl">185K</div>
          </div>
        </div>
        
        <div className="bg-slate-800 flex-1 rounded-xl border border-slate-700 p-4 flex flex-col justify-end relative overflow-hidden mt-2">
          <div className="absolute top-4 left-4 text-slate-300 font-semibold text-xs">Performance Trend</div>
          
          <div className="flex items-end justify-between h-24 gap-2 mt-6">
            {[40, 25, 45, 60, 30, 75, 50, 90, 65, 100].map((height, i) => (
              <div key={i} className="w-full bg-slate-700 rounded-t-sm relative group cursor-pointer transition-all hover:bg-rose-500" style={{ height: `${height}%` }}>
                {i === 9 && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                    Peak
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
