"use client";

import React from "react";
import { useQRCode } from "next-qrcode";
import { QrCode, Download, X } from "lucide-react";

interface DownloadQrModalProps {
  open: boolean;
  onClose: () => void;
  url: string;
  label: string;
  size: string;
}

export const DownloadQrModal: React.FC<DownloadQrModalProps> = ({
  open,
  onClose,
  url,
  label,
  size,
}) => {
  const { SVG } = useQRCode();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/60 dark:bg-grey950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-[92vw] max-w-sm bg-white dark:bg-slate-900 border border-forestGreen/15 dark:border-grey700 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl text-foreground dark:text-white flex flex-col items-center gap-4 sm:gap-5 text-center animate-in fade-in-50 zoom-in-95 duration-150 transition-colors">
        
        {/* Header */}
        <div className="w-full flex items-center justify-between border-b border-forestGreen/10 dark:border-white/10 pb-3 sm:pb-4">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-forestGreen dark:text-limeGreen" />
            <span className="text-xs sm:text-sm font-bold text-foreground dark:text-white uppercase tracking-wider">
              Digitalizar QR Code
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-foreground dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real QR Code Rendered by next-qrcode */}
        <div className="w-48 h-48 sm:w-52 sm:h-52 bg-white p-3 rounded-2xl shadow-xl flex items-center justify-center border border-forestGreen/15 dark:border-white/20 overflow-hidden">
          <SVG
            text={url}
            options={{
              margin: 1,
              width: 175,
              color: {
                dark: "#051A10",
                light: "#FFFFFF",
              },
            }}
          />
        </div>

        {/* Details */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-forestGreen dark:text-limeGreen uppercase tracking-wider">
            {label}
          </span>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
            Aponte a câmara do seu smartphone para descarregar o APK ({size}) diretamente no telemóvel.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex gap-2.5 sm:gap-3 mt-1">
          <button
            onClick={onClose}
            className="flex-1 py-3 sm:py-2.5 min-h-[44px] rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-xs font-semibold text-slate-700 dark:text-white transition-colors"
          >
            Fechar
          </button>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 sm:py-2.5 min-h-[44px] rounded-xl bg-limeGreen text-forestGreen font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-lightLime transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Descarregar
          </a>
        </div>
      </div>
    </div>
  );
};
