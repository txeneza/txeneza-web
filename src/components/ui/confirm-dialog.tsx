"use client";

import React from "react";
import { Loader2, X, AlertTriangle } from "lucide-react";

export type ConfirmTone = "brand" | "danger" | "warning" | "info" | "success";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: ConfirmTone;
  loading?: boolean;
  icon?: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

const TONES: Record<ConfirmTone, { iconWrap: string; confirm: string }> = {
  brand: {
    iconWrap: "bg-forestGreen/10 dark:bg-limeGreen/10 text-forestGreen dark:text-limeGreen",
    confirm: "bg-limeGreen text-forestGreen hover:bg-lightLime",
  },
  danger: {
    iconWrap: "bg-red-500/10 text-red-600 dark:text-red-400",
    confirm: "bg-red-600 text-white hover:bg-red-700",
  },
  warning: {
    iconWrap: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    confirm: "bg-amber-500 text-white hover:bg-amber-600",
  },
  info: {
    iconWrap: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    confirm: "bg-blue-600 text-white hover:bg-blue-700",
  },
  success: {
    iconWrap: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    confirm: "bg-emerald-600 text-white hover:bg-emerald-700",
  },
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  tone = "brand",
  loading = false,
  icon,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;
  const toneClasses = TONES[tone];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={loading ? undefined : onCancel}
      />
      <div className="relative w-full max-w-sm bg-light-background dark:bg-grey900 border border-grey200 dark:border-grey800 rounded-2xl shadow-2xl p-6 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className={`p-2.5 rounded-xl ${toneClasses.iconWrap}`}>
            {icon || <AlertTriangle className="w-6 h-6" />}
          </div>
          <button
            onClick={onCancel}
            disabled={loading}
            className="p-1.5 rounded-lg text-grey500 hover:bg-grey100 dark:hover:bg-grey800 transition-colors disabled:opacity-50"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h3 className="text-lg font-bold text-grey900 dark:text-grey50">{title}</h3>
          {description && (
            <div className="text-sm text-grey600 dark:text-grey400 mt-1 leading-relaxed">{description}</div>
          )}
        </div>

        <div className="flex gap-3 mt-1">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-grey700 dark:text-grey300 bg-grey100 dark:bg-grey800 hover:bg-grey200 dark:hover:bg-grey700 transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 ${toneClasses.confirm}`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> A guardar...
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
