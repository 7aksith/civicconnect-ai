import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />,
          warning: <AlertTriangle className="text-amber-500 shrink-0" size={20} />,
          error: <AlertCircle className="text-red-500 shrink-0" size={20} />,
          info: <Info className="text-blue-500 shrink-0" size={20} />,
        };

        const borders = {
          success: 'border-emerald-200 bg-white shadow-xl shadow-emerald-950/5',
          warning: 'border-amber-200 bg-white shadow-xl shadow-amber-950/5',
          error: 'border-red-200 bg-white shadow-xl shadow-red-950/5',
          info: 'border-blue-200 bg-white shadow-xl shadow-blue-950/5',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border ${borders[toast.type]} transition-all animate-in fade-in slide-in-from-bottom-3 duration-200`}
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-slate-900 leading-snug">{toast.title}</h4>
              {toast.message && (
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded-lg -mr-1"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
