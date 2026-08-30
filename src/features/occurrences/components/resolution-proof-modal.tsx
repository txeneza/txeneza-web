"use client";

import React, { useRef, useState } from "react";
import { Camera, Loader2, Upload, X } from "lucide-react";

interface ResolutionProofModalProps {
  open: boolean;
  loading?: boolean;
  onConfirm: (photoFiles: File[], notes: string) => void;
  onCancel: () => void;
}

interface PreviewItem {
  file: File;
  url: string;
}

/**
 * Modal exigido antes de marcar uma ocorrência como "Resolvido":
 * o administrador tem de anexar pelo menos uma fotografia do local já
 * limpo (pode selecionar várias, da galeria ou tirando foto na hora).
 * Espelha o conceito de "verificacao" do modelo VerificacaoResolucao.
 */
export const ResolutionProofModal: React.FC<ResolutionProofModalProps> = ({
  open,
  loading = false,
  onConfirm,
  onCancel,
}) => {
  const [items, setItems] = useState<PreviewItem[]>([]);
  const [notes, setNotes] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const handleFilesSelected = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const newItems = Array.from(fileList).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setItems((prev) => [...prev, ...newItems]);
    // Permite voltar a escolher o mesmo ficheiro numa seleção seguinte.
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    setItems([]);
    setNotes("");
    onCancel();
  };

  const handleSubmit = () => {
    if (items.length === 0) return;
    onConfirm(items.map((i) => i.file), notes.trim());
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-grey950/60 backdrop-blur-md transition-opacity"
        onClick={loading ? undefined : handleClose}
      />
      <div className="relative w-full max-w-md bg-white dark:bg-grey900 border border-grey200/90 dark:border-grey800/90 rounded-2xl shadow-xl p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto animate-in fade-in-50 zoom-in-95 duration-150">
        <div className="flex items-start justify-between">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
            <Camera className="w-5 h-5" />
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-1.5 rounded-xl text-grey400 dark:text-grey500 hover:text-grey700 dark:hover:text-grey200 hover:bg-grey100 dark:hover:bg-grey800/80 transition-colors disabled:opacity-50"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h3 className="text-lg font-bold text-grey900 dark:text-grey50 tracking-tight">Prova de Resolução</h3>
          <p className="text-xs text-grey600 dark:text-grey400 mt-1.5 leading-relaxed">
            Para marcar a ocorrência como <b>Resolvido</b>, anexe pelo menos uma fotografia do local já limpo.
            Pode selecionar várias fotos da galeria ou capturar na hora.
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFilesSelected(e.target.files)}
        />

        {items.length > 0 && (
          <div className="grid grid-cols-3 gap-2.5">
            {items.map((item, index) => (
              <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-grey200/80 dark:border-grey700/80 group">
                <img
                  src={item.url}
                  alt={`Pré-visualização ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeItem(index)}
                  disabled={loading}
                  className="absolute top-1.5 right-1.5 p-1 rounded-full bg-grey950/70 text-white hover:bg-grey950 transition-colors disabled:opacity-50 shadow-sm"
                  aria-label="Remover fotografia"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-grey300/80 dark:border-grey700/80 hover:border-emerald-500 dark:hover:border-emerald-400 bg-grey50/50 dark:bg-grey900/50 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/20 flex items-center justify-center gap-2 text-grey600 dark:text-grey400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-all duration-150 disabled:opacity-50 text-xs font-semibold"
        >
          <Upload className="w-4 h-4" />
          {items.length > 0 ? "Adicionar mais fotografias" : "Selecionar fotografias da galeria"}
        </button>

        {/* Observações opcionais */}
        <div>
          <label className="text-xs font-semibold text-grey700 dark:text-grey300 uppercase tracking-wider mb-1.5 block">
            Observações (opcional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={loading}
            rows={2}
            placeholder="Ex.: Limpeza efetuada pela equipa de saneamento..."
            className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white dark:bg-grey900 border border-grey300/80 dark:border-grey700/80 text-grey900 dark:text-grey50 placeholder:text-grey400 dark:placeholder:text-grey500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:border-emerald-500 resize-none transition-all duration-150"
          />
        </div>

        <div className="flex gap-3 mt-2">
          <button
            onClick={handleClose}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-grey700 dark:text-grey300 bg-grey100/80 dark:bg-grey800/80 hover:bg-grey200/80 dark:hover:bg-grey700/80 border border-grey200/60 dark:border-grey700/60 transition-all duration-150 disabled:opacity-50 active:scale-[0.99]"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || items.length === 0}
            title={items.length === 0 ? "Anexe pelo menos uma fotografia para continuar" : undefined}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm active:scale-[0.99]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Guardando...
              </>
            ) : (
              `Confirmar Resolução${items.length > 1 ? ` (${items.length})` : ""}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

