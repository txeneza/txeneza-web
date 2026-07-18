"use client";

import React, { useRef, useState } from "react";
import { Camera, Loader2, Upload, X } from "lucide-react";

interface ResolutionProofModalProps {
  open: boolean;
  loading?: boolean;
  onConfirm: (photoFile: File, notes: string) => void;
  onCancel: () => void;
}

/**
 * Modal exigido antes de marcar uma ocorrência como "Resolvido":
 * o administrador tem de anexar uma fotografia do local já limpo.
 * Espelha o conceito de "verificacao" do modelo VerificacaoResolucao.
 */
export const ResolutionProofModal: React.FC<ResolutionProofModalProps> = ({
  open,
  loading = false,
  onConfirm,
  onCancel,
}) => {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const handleFileChange = (file: File | null) => {
    setPhotoFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const handleClose = () => {
    handleFileChange(null);
    setNotes("");
    onCancel();
  };

  const handleSubmit = () => {
    if (!photoFile) return;
    onConfirm(photoFile, notes.trim());
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={loading ? undefined : handleClose}
      />
      <div className="relative w-full max-w-md bg-light-background dark:bg-grey900 border border-grey200 dark:border-grey800 rounded-2xl shadow-2xl p-6 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Camera className="w-6 h-6" />
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-1.5 rounded-lg text-grey500 hover:bg-grey100 dark:hover:bg-grey800 transition-colors disabled:opacity-50"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h3 className="text-lg font-bold text-grey900 dark:text-grey50">Prova de resolução</h3>
          <p className="text-sm text-grey600 dark:text-grey400 mt-1 leading-relaxed">
            Para marcar como <b>Resolvido</b>, anexa uma fotografia do local já limpo. Esta prova
            fica associada à ocorrência para consulta futura.
          </p>
        </div>

        {/* Área de upload / pré-visualização */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
        />

        {previewUrl ? (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Pré-visualização da prova de resolução"
              className="w-full h-48 object-cover rounded-xl border border-grey200 dark:border-grey800"
            />
            <button
              onClick={() => handleFileChange(null)}
              disabled={loading}
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 transition-colors disabled:opacity-50"
              aria-label="Remover fotografia"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={loading}
            className="w-full h-40 rounded-xl border-2 border-dashed border-grey300 dark:border-grey700 flex flex-col items-center justify-center gap-2 text-grey400 dark:text-grey600 hover:border-emerald-500/50 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors disabled:opacity-50"
          >
            <Upload className="w-6 h-6" />
            <span className="text-sm font-bold">Anexar fotografia</span>
            <span className="text-xs">Local já limpo / resíduos removidos</span>
          </button>
        )}

        {/* Observações opcionais */}
        <div>
          <label className="text-xs font-bold text-grey600 dark:text-grey400 uppercase tracking-wider mb-1.5 block">
            Observações (opcional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={loading}
            rows={2}
            placeholder="Ex.: Recolha efetuada pela equipa de limpeza no dia..."
            className="w-full px-3 py-2 rounded-xl text-sm bg-grey50 dark:bg-grey800 border border-grey200 dark:border-grey700 text-grey900 dark:text-grey50 placeholder:text-grey400 dark:placeholder:text-grey600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 resize-none"
          />
        </div>

        <div className="flex gap-3 mt-1">
          <button
            onClick={handleClose}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-grey700 dark:text-grey300 bg-grey100 dark:bg-grey800 hover:bg-grey200 dark:hover:bg-grey700 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !photoFile}
            title={!photoFile ? "Anexa uma fotografia para continuar" : undefined}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-emerald-600 text-white hover:bg-emerald-700"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> A guardar...
              </>
            ) : (
              "Confirmar Resolução"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
