import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Info, AlertTriangle, X, Loader2 } from 'lucide-react';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'loading';
  duration?: number;
}

export default function ToastNotification() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleShowToast = (event: Event) => {
      const customEvent = event as CustomEvent<Omit<ToastMessage, 'id'>>;
      const { title, message, type, duration = 6000 } = customEvent.detail;
      const id = Math.random().toString(36).substring(2, 9);
      
      const newToast: ToastMessage = { id, title, message, type, duration };
      setToasts((prev) => [...prev, newToast]);

      // Auto dismiss
      if (type !== 'loading') {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    };

    window.addEventListener('show-toast', handleShowToast);
    return () => {
      window.removeEventListener('show-toast', handleShowToast);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div
      id="toast-notifications-root"
      className="fixed bottom-24 md:bottom-6 left-4 md:left-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          let bgColor = 'bg-white dark:bg-slate-900';
          let borderColor = 'border-slate-200 dark:border-slate-800';
          let textColor = 'text-slate-900 dark:text-slate-100';
          let iconColor = 'text-emerald-500';
          let Icon = CheckCircle2;

          if (toast.type === 'info') {
            Icon = Info;
            iconColor = 'text-blue-500';
          } else if (toast.type === 'warning') {
            Icon = AlertTriangle;
            iconColor = 'text-amber-500';
          } else if (toast.type === 'loading') {
            Icon = Loader2;
            iconColor = 'text-blue-500 animate-spin';
          }

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: -100, scale: 0.9, transition: { duration: 0.2 } }}
              className={`p-4 rounded-2xl border ${borderColor} ${bgColor} ${textColor} shadow-xl flex gap-3 items-start pointer-events-auto relative overflow-hidden`}
              role="alert"
            >
              {/* Progress Bar for Auto-dismiss */}
              {toast.type !== 'loading' && (
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: (toast.duration || 6000) / 1000, ease: 'linear' }}
                  className={`absolute bottom-0 left-0 h-1 ${
                    toast.type === 'success' ? 'bg-emerald-500' : toast.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                  }`}
                />
              )}

              {/* Toast Icon */}
              <div className={`${iconColor} shrink-0 mt-0.5`}>
                <Icon className="w-5 h-5" />
              </div>

              {/* Toast Message */}
              <div className="flex-1 space-y-1">
                <h5 className="text-xs font-extrabold tracking-wide text-slate-900 dark:text-white">
                  {toast.title}
                </h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {toast.message}
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shrink-0 p-0.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                aria-label="Tutup notifikasi"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

// Utility function to easily trigger a toast from anywhere in the codebase
export function showToast(title: string, message: string, type: ToastMessage['type'] = 'success', duration?: number) {
  const event = new CustomEvent('show-toast', {
    detail: { title, message, type, duration }
  });
  window.dispatchEvent(event);
}
