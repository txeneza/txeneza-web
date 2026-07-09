"use client";

import React from "react";
import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";

interface DeleteConfirmDialogProps {
  open: boolean;
  pointName?: string;
  deleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  open,
  pointName,
  deleting,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={deleting ? undefined : onCancel} />
      <div className="relative w-full max-w-sm bg-light-background dark:bg-grey900 border border-grey200 dark:border-grey800 rounded-2xl shadow-2xl p-6 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="p-2.5 bg-red-500/10 rounded-xl text-red-600 dark:text-red-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button
            onClick={onCancel}
            disabled={deleting}
            className="p-1.5 rounded-lg text-grey500 hover:bg-grey100 dark:hover:bg-grey800 transition-colors disabled:opacity-50"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h3 className="text-lg font-bold text-grey900 dark:text-grey50">Eliminar ponto de recolha</h3>
          <p className="text-sm text-grey600 dark:text-grey400 mt-1 leading-relaxed">
            Tem a certeza de que pretende eliminar{" "}
            <b className="text-grey900 dark:text-grey50">{pointName || "este ponto"}</b>? Esta ação não pode ser
            revertida.
          </p>
        </div>

        <div className="flex gap-3 mt-1">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-grey700 dark:text-grey300 bg-grey100 dark:bg-grey800 hover:bg-grey200 dark:hover:bg-grey700 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {deleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> A eliminar...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" /> Eliminar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
