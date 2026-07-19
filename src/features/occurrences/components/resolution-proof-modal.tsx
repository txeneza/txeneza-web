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
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={loading ? undefined : handleClose}
      />
      <div className="relative w-full max-w-md bg-light-background dark:bg-grey900 border border-grey200 dark:border-grey800 rounded-2xl shadow-2xl p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
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
            Para marcar como <b>Resolvido</b>, anexa pelo menos uma fotografia do local já limpo.
            Podes selecionar várias fotos da galeria ou tirar uma foto na hora.
          </p>
        </div>

        {/* Input de ficheiros — sem `capture`, para o browser mostrar a escolha
            entre galeria (multi-seleção) e câmara, em vez de forçar a câmara. */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFilesSelected(e.target.files)}
        />

        {items.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {items.map((item, index) => (
              <div key={index} className="relative aspect-square">
                <img
                  src={item.url}
                  alt={`Pré-visualização ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg border border-grey200 dark:border-grey800"
                />
                <button
                  onClick={() => removeItem(index)}
                  disabled={loading}
                  className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors disabled:opacity-50"
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
          className="w-full py-3 rounded-xl border-2 border-dashed border-grey300 dark:border-grey700 flex items-center justify-center gap-2 text-grey400 dark:text-grey600 hover:border-emerald-500/50 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors disabled:opacity-50 text-sm font-bold"
        >
          <Upload className="w-4 h-4" />
          {items.length > 0 ? "Adicionar mais fotografias" : "Selecionar fotografias"}
        </button>

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
            disabled={loading || items.length === 0}
            title={items.length === 0 ? "Anexa pelo menos uma fotografia para continuar" : undefined}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-emerald-600 text-white hover:bg-emerald-700"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> A guardar...
              </>
            ) : (
              `Confirmar Resolução${items.length > 1 ? ` (${items.length} fotos)` : ""}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

