import React from 'react';
import { Send, CheckCheck } from 'lucide-react';

export default function BrandCreatorChatMockup() {
  return (
    <div className="w-full h-full bg-slate-50 rounded-2xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col overflow-hidden text-sm relative font-sans">
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-100 to-rose-200 flex items-center justify-center font-bold text-rose-600 border border-rose-200">
          M
        </div>
        <div>
          <div className="font-bold text-slate-800">Mia Takahashi</div>
          <div className="text-green-500 text-[10px] font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"></span> Online
          </div>
        </div>
      </div>
      
      <div className="p-4 flex flex-col gap-3 flex-1 overflow-y-auto bg-slate-50/50">
        <div className="flex gap-2 max-w-[85%]">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-rose-100 to-rose-200 flex items-center justify-center font-bold text-rose-600 text-[10px] shrink-0 mt-1">
            M
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-3 shadow-sm text-slate-700">
            Hey! I just uploaded the draft video for the Summer Launch campaign. Let me know what you think! 🎥
            <div className="text-[9px] text-slate-400 mt-1 text-right">10:42 AM</div>
          </div>
        </div>

        <div className="flex gap-2 max-w-[85%] self-end flex-row-reverse">
          <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white text-[10px] shrink-0 mt-1">
            B
          </div>
          <div className="bg-rose-500 text-white rounded-2xl rounded-tr-none p-3 shadow-sm">
            Looks amazing Mia! The lighting is perfect. Can we just trim the last 2 seconds where the product is out of focus?
            <div className="text-[9px] text-rose-100 mt-1 text-right flex justify-end items-center gap-1">
              10:55 AM <CheckCheck className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white border-t border-slate-200 p-3">
        <div className="bg-slate-50 border border-slate-200 rounded-full flex items-center px-4 py-2">
          <div className="text-slate-400 flex-1 text-xs">Type a message...</div>
          <button className="bg-rose-500 text-white p-1.5 rounded-full shadow-sm">
            <Send className="w-3 h-3 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
