"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

type ToastVariant = "default" | "destructive";

type ToastItem = {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
};

type ToastContextValue = {
  toasts: ToastItem[];
  add: (toast: Omit<ToastItem, "id">) => string;
  remove: (id: string) => void;
  clear: () => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const add = useCallback((t: Omit<ToastItem, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [{ id, ...t }, ...prev].slice(0, 3));
    // Auto-dismiss after 4s
    setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, 4000);
    return id;
  }, []);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const clear = useCallback(() => setToasts([]), []);

  const value = useMemo(() => ({ toasts, add, remove, clear }), [toasts, add, remove, clear]);

  return React.createElement(ToastContext.Provider, { value }, children as any);
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Fallback if provider is missing
    return {
      toast: (_opts: { title?: string; description?: string; variant?: ToastVariant }) => ({
        id: "",
        dismiss: () => {},
        update: () => {},
      }),
      dismiss: (_id?: string) => {},
    };
  }

  const toast = (opts: { title?: string; description?: string; variant?: ToastVariant }) => {
    const id = ctx.add(opts);
    return {
      id,
      dismiss: () => ctx.remove(id),
      update: (next: { title?: string; description?: string; variant?: ToastVariant }) => {
        ctx.remove(id);
        ctx.add({ ...opts, ...next });
      },
    };
  };

  const dismiss = (id?: string) => (id ? ctx.remove(id) : ctx.clear());

  return { toast, dismiss };
}

export function Toaster() {
  const ctx = useContext(ToastContext);
  if (!ctx) return null;
  return React.createElement(
    'div',
    { className: 'fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-[320px]' },
    ctx.toasts.map((t) =>
      React.createElement(
        'div',
        {
          key: t.id,
          className:
            'relative rounded-md border shadow p-3 bg-background text-foreground ' +
            (t.variant === 'destructive'
              ? 'border-destructive bg-destructive text-destructive-foreground'
              : ''),
        },
        [
          t.title
            ? React.createElement(
                'div',
                { key: 'title', className: 'font-semibold text-sm' },
                t.title
              )
            : null,
          t.description
            ? React.createElement(
                'div',
                { key: 'desc', className: 'text-sm opacity-90' },
                t.description
              )
            : null,
          React.createElement(
            'button',
            {
              key: 'close',
              type: 'button',
              'aria-label': 'Close',
              className: 'absolute top-1 right-1 text-foreground/60 hover:text-foreground',
              onClick: () => ctx.remove(t.id),
            },
            '×'
          ),
        ]
      )
    )
  );
}
