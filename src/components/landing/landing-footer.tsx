"use client";

import React from "react";
import Link from "next/link";
import { Download, Shield } from "lucide-react";
import { BrandName } from "@/components/brand/brand-name";

export const LandingFooter: React.FC = () => {
  return (
    <footer id="download-app" className="relative overflow-hidden bg-forestGreen border-t border-white/10 text-slate-300 py-16 px-4">
      {/* Fusão suave vindo da secção anterior (evita o corte abrupto de cor) */}
      <div className="absolute inset-x-0 top-0 h-28 sm:h-40 bg-gradient-to-b from-background dark:from-grey900 to-forestGreen pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start mb-12">

          {/* Brand Left Column */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5 w-fit">
              <div className="w-8 h-8 flex items-center justify-center shrink-0">
                <img src="/image/TXENEZA.png" alt="Txeneza Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-lg font-semibold tracking-tight">
                <BrandName variant="onDark" />
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Saneamento colaborativo digital para a Cidade da Beira. Mapeando e reportando focos de lixo urbano para um ambiente mais sustentável e saudável.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <h4 className="font-mono text-[11px] uppercase text-slate-400 tracking-widest mb-1">Navegação</h4>
            <a href="#problema" className="text-xs text-slate-300 hover:text-limeGreen transition-colors">O Problema</a>
            <a href="#funcionamento" className="text-xs text-slate-300 hover:text-limeGreen transition-colors">Como Funciona</a>
            <a href="#mapa-preview" className="text-xs text-slate-300 hover:text-limeGreen transition-colors">O Mapa Público</a>
            <a href="#para-quem-e" className="text-xs text-slate-300 hover:text-limeGreen transition-colors">Público Beneficiário</a>
            <a href="#ods" className="text-xs text-slate-300 hover:text-limeGreen transition-colors">Objectivos ODS</a>
          </div>

          {/* Download Column */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <h4 className="font-mono text-[11px] uppercase text-slate-400 tracking-widest mb-1">Aplicação Móvel</h4>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              Reporte lixo directamente da rua usando o GPS e câmara do seu smartphone. Compatível com Android 8.0 ou superior.
            </p>

            {/* APK Download with Select */}
            <div className="flex flex-col gap-2 w-full max-w-sm">
              <div className="relative flex items-center bg-grey950 border border-white/15 px-4 py-3 hover:border-limeGreen/40 transition-colors">
                <Download className="w-4 h-4 text-limeGreen shrink-0 mr-3" />
                <div className="flex-1">
                  <span className="block font-mono text-[9px] text-limeGreen uppercase tracking-widest leading-none mb-1">Descarregar Aplicação</span>
                  <select
                    onChange={(e) => {
                      const url = e.target.value;
                      if (url) {
                        window.open(url, "_blank");
                        e.target.value = "";
                      }
                    }}
                    className="w-full bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer pr-6 appearance-none"
                    defaultValue=""
                  >
                    <option value="" disabled className="bg-grey950 text-slate-400">Seleccionar versão...</option>
                    <option value="https://github.com/txeneza/txeneza-mobile/releases/download/latest/txeneza-arm64-v8a.apk" className="bg-grey950 text-white">
                      Android ARM64-v8a (Celulares modernos)
                    </option>
                    <option value="https://github.com/txeneza/txeneza-mobile/releases/download/latest/txeneza-armeabi-v7a.apk" className="bg-grey950 text-white">
                      Android ARMeabi-v7a (Celulares antigos)
                    </option>
                    <option value="https://github.com/txeneza/txeneza-mobile/releases/download/latest/txeneza-x86_64.apk" className="bg-grey950 text-white">
                      Android Emulador x86_64 (PC)
                    </option>
                  </select>
                </div>
                <div className="absolute right-4 pointer-events-none text-slate-500 text-[10px]">▼</div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Divider */}
        <div className="h-px bg-white/10 w-full my-8" />

        {/* Bottom Bar: Copyright and Discrete Admin Link */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} <BrandName variant="onDark" />. Beira, Moçambique.
          </div>

          {/* Discrete Admin Link (Login / W2) */}
          <div className="flex items-center gap-5">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-white/15 hover:border-white/30 hover:bg-white/5 text-[11px] font-medium text-slate-300 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-limeGreen" />
              Painel de Gestão (Proposta CMB)
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
