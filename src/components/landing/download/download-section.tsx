"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Smartphone, ShieldCheck, WifiOff, Cpu, QrCode, CheckCircle2, ChevronRight, Sparkles } from "lucide-react";
import { BrandName } from "@/components/brand/brand-name";
import { DownloadQrModal } from "./download-qr-modal";

export const DownloadSection: React.FC = () => {
  const [selectedArch, setSelectedArch] = useState<string>("arm64");
  const [showQrCode, setShowQrCode] = useState(false);

  // Tamanhos estimados iniciais
  const [fileSizes, setFileSizes] = useState<Record<string, string>>({
    arm64: "~18.4 MB",
    v7a: "~16.2 MB",
    x86: "~20.1 MB",
  });

  const downloadLinks = {
    arm64: {
      label: "Android ARM64-v8a (Dispositivos Modernos)",
      tag: "Recomendado",
      size: fileSizes.arm64,
      url: "https://github.com/txeneza/txeneza-mobile/releases/download/latest/txeneza-arm64-v8a.apk",
    },
    v7a: {
      label: "Android ARMeabi-v7a (Dispositivos Antigos)",
      tag: "Compatibilidade",
      size: fileSizes.v7a,
      url: "https://github.com/txeneza/txeneza-mobile/releases/download/latest/txeneza-armeabi-v7a.apk",
    },
    x86: {
      label: "Android x86_64 (Emulador PC)",
      tag: "Desenvolvimento",
      size: fileSizes.x86,
      url: "https://github.com/txeneza/txeneza-mobile/releases/download/latest/txeneza-x86_64.apk",
    },
  };

  // Obtenção automática do tamanho real calculado pelo servidor Next.js (/api/apk-size)
  useEffect(() => {
    fetch("/api/apk-size")
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data === "object") {
          setFileSizes((prev) => ({
            ...prev,
            ...data,
          }));
        }
      })
      .catch((err) => {
        console.warn("Erro ao carregar tamanhos reais do servidor:", err);
      });
  }, []);

  const handleDownload = () => {
    const link = downloadLinks[selectedArch as keyof typeof downloadLinks];
    if (link) {
      window.open(link.url, "_blank");
    }
  };

  const selectedLink = downloadLinks[selectedArch as keyof typeof downloadLinks];

  return (
    <section id="download" className="py-20 md:py-28 bg-transparent text-foreground dark:text-grey50 relative overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Outer Premium Container */}
        <div className="relative rounded-3xl bg-white/80 dark:bg-slate-900 border border-forestGreen/15 dark:border-grey800 p-8 sm:p-12 md:p-16 shadow-2xl overflow-hidden text-foreground dark:text-white backdrop-blur-xl transition-colors duration-300">
          
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-limeGreen/20 dark:bg-limeGreen/10 filter blur-3xl pointer-events-none rounded-full" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-forestGreen/10 dark:bg-forestGreen/30 filter blur-3xl pointer-events-none rounded-full" />
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-limeGreen to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">

            {/* Left Content Column */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forestGreen/10 dark:bg-limeGreen/15 border border-forestGreen/20 dark:border-limeGreen/30 text-forestGreen dark:text-limeGreen text-xs font-bold w-fit">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Aplicação Móvel Android • Gratuita</span>
              </div>

              {/* Heading */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-foreground dark:text-white">
                Descarregue a app <BrandName /> no seu Smartphone
              </h2>

              {/* Subtitle */}
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                Reporte focos de lixo urbano diretamente na Cidade da Beira. Capture fotografias com geolocalização automática GPS, classificação inteligente por IA e funcionamento 100% offline.
              </p>

              {/* Key Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-2">
                <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-white/5 border border-forestGreen/15 dark:border-white/10 flex items-center gap-3">
                  <WifiOff className="w-4 h-4 text-forestGreen dark:text-limeGreen shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-foreground dark:text-white">Offline-First</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Guarda sem internet</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-white/5 border border-forestGreen/15 dark:border-white/10 flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-forestGreen dark:text-limeGreen shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-foreground dark:text-white">GPS + IA Gemini</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Georreferenciado</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-white/5 border border-forestGreen/15 dark:border-white/10 flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-forestGreen dark:text-limeGreen shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-foreground dark:text-white">Verificação</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Fotos antes/depois</span>
                  </div>
                </div>
              </div>

              {/* Architecture Selector Card */}
              <div className="p-5 rounded-2xl bg-white/60 dark:bg-white/5 border border-forestGreen/15 dark:border-white/10 flex flex-col gap-3">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-forestGreen dark:text-limeGreen" />
                  Selecione a Versão para o seu Dispositivo
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {(Object.keys(downloadLinks) as Array<keyof typeof downloadLinks>).map((key) => {
                    const item = downloadLinks[key];
                    const isSelected = selectedArch === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedArch(key)}
                        className={`p-3 rounded-xl text-left border transition-all duration-150 flex flex-col justify-between ${
                          isSelected
                            ? "bg-limeGreen/20 border-forestGreen dark:border-limeGreen text-forestGreen dark:text-limeGreen shadow-sm font-bold"
                            : "bg-white/40 dark:bg-black/30 border-forestGreen/10 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-forestGreen/30 dark:hover:border-white/20"
                        }`}
                      >
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-forestGreen dark:text-limeGreen">
                          {item.tag}
                        </span>
                        <span className="text-xs font-bold mt-1 text-foreground dark:text-white truncate">{key === "arm64" ? "ARM64 (Atual)" : key === "v7a" ? "ARMv7 (Antigos)" : "x86 (PC)"}</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{item.size}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                  <button
                    onClick={handleDownload}
                    className="flex-1 py-3.5 px-6 rounded-xl bg-limeGreen text-forestGreen hover:bg-lightLime font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all duration-150 active:scale-[0.99]"
                  >
                    <Download className="w-4.5 h-4.5" />
                    <span>Descarregar APK ({selectedLink.size})</span>
                  </button>

                  <button
                    onClick={() => setShowQrCode(true)}
                    className="py-3.5 px-5 rounded-xl bg-forestGreen/10 dark:bg-white/10 hover:bg-forestGreen/15 dark:hover:bg-white/15 border border-forestGreen/20 dark:border-white/15 text-forestGreen dark:text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.99]"
                  >
                    <QrCode className="w-4 h-4 text-forestGreen dark:text-limeGreen" />
                    <span>Abrir QR Code</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Clean Right Column: Minimalist Tech Card */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="w-full p-8 rounded-3xl bg-white/60 dark:bg-white/5 border border-forestGreen/15 dark:border-white/10 flex flex-col gap-6 backdrop-blur-xl shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-forestGreen/10 dark:bg-limeGreen/15 border border-forestGreen/20 dark:border-limeGreen/30 flex items-center justify-center text-forestGreen dark:text-limeGreen shrink-0">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground dark:text-white">Txeneza Mobile APK</h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Versão 1.0.0 • Android</span>
                  </div>
                </div>

                <div className="h-px bg-forestGreen/10 dark:bg-white/10" />

                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Requisitos mínimos:</span>
                    <span className="font-semibold text-foreground dark:text-white">Android 8.0+</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Licença de utilização:</span>
                    <span className="font-semibold text-forestGreen dark:text-limeGreen">Gratuita</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Sincronização:</span>
                    <span className="font-semibold text-foreground dark:text-white">Automática / Offline</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* QR Code Modal Separado com next-qrcode */}
      <DownloadQrModal
        open={showQrCode}
        onClose={() => setShowQrCode(false)}
        url={selectedLink.url}
        label={selectedLink.label}
        size={selectedLink.size}
      />
    </section>
  );
};
