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
        className="absolute inset-0 bg-grey950/60 backdrop-blur-md transition-opacity"
        onClick={loading ? undefined : onCancel}
      />
      <div className="relative w-[92vw] max-w-sm bg-white dark:bg-grey900 border border-grey200/90 dark:border-grey800/90 rounded-2xl shadow-xl p-5 sm:p-6 flex flex-col gap-4 animate-in fade-in-50 zoom-in-95 duration-150">
        <div className="flex items-start justify-between">
          <div className={`p-3 rounded-xl border border-current/10 ${toneClasses.iconWrap}`}>
            {icon || <AlertTriangle className="w-5 h-5" />}
          </div>
          <button
            onClick={onCancel}
            disabled={loading}
            className="p-2 rounded-xl text-grey400 dark:text-grey500 hover:text-grey700 dark:hover:text-grey200 hover:bg-grey100 dark:hover:bg-grey800/80 transition-colors disabled:opacity-50"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h3 className="text-lg font-bold text-grey900 dark:text-grey50 tracking-tight">{title}</h3>
          {description && (
            <div className="text-sm text-grey600 dark:text-grey400 mt-1.5 leading-relaxed">{description}</div>
          )}
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3 mt-2">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-3 sm:py-2.5 min-h-[44px] rounded-xl text-sm font-semibold text-grey700 dark:text-grey300 bg-grey100/80 dark:bg-grey800/80 hover:bg-grey200/80 dark:hover:bg-grey700/80 border border-grey200/60 dark:border-grey700/60 transition-all duration-150 disabled:opacity-50 active:scale-[0.99]"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 py-3 sm:py-2.5 min-h-[44px] rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all duration-150 disabled:opacity-50 active:scale-[0.99] ${toneClasses.confirm}`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Processando...
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
