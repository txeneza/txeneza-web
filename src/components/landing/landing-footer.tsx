"use client";

import React from "react";
import Link from "next/link";
import { Download, Landmark, ArrowRight, Shield } from "lucide-react";

export const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-forestGreen border-t border-forestGreen/20 text-slate-300 py-16 px-4 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute bottom-0 right-0 w-[20%] aspect-square rounded-full bg-limeGreen/10 filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start mb-12">
          
          {/* Brand Left Column */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5 w-fit group">
              <div className="w-9 h-9 flex items-center justify-center shrink-0">
                <img src="/image/TXENEZA.png" alt="Txeneza Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Txeneza
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed max-w-sm">
              Saneamento colaborativo digital para a Cidade da Beira. Mapeando e reportando focos de lixo urbano para um ambiente mais sustentável and saudável.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <h4 className="text-xs font-black uppercase text-white tracking-widest mb-1">Navegação</h4>
            <a href="#problema" className="text-xs text-slate-300 hover:text-limeGreen transition-colors">O Problema</a>
            <a href="#funcionamento" className="text-xs text-slate-300 hover:text-limeGreen transition-colors">Como Funciona</a>
            <a href="#mapa-preview" className="text-xs text-slate-300 hover:text-limeGreen transition-colors">O Mapa Público</a>
            <a href="#para-quem-e" className="text-xs text-slate-300 hover:text-limeGreen transition-colors">Público Beneficiário</a>
            <a href="#ods" className="text-xs text-slate-300 hover:text-limeGreen transition-colors font-semibold">Objetivos ODS</a>
          </div>

          {/* Download Column */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <h4 className="text-xs font-black uppercase text-white tracking-widest mb-1">Aplicativo Móvel</h4>
            <p className="text-xs text-slate-300/95 max-w-xs leading-relaxed">
              Reporte lixo diretamente da rua usando o GPS e câmera do seu smartphone. Compatível com Android 8.0 ou superior.
            </p>
            
            {/* APK Download Button */}
            <div className="flex flex-wrap gap-3">
              <a
                href="/downloads/txeneza.apk"
                download
                className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-950 text-white hover:bg-slate-900 border border-slate-800 shadow-lg text-xs font-bold transition-all hover:scale-[1.02] active:scale-95"
              >
                <Download className="w-5 h-5 text-limeGreen shrink-0" />
                <div className="text-left">
                  <span className="block text-[8px] text-limeGreen uppercase font-bold tracking-widest leading-none mb-0.5">Baixar APK</span>
                  <span className="text-xs font-extrabold text-white">Android 8.0+ (Estático)</span>
                </div>
              </a>
            </div>
          </div>

        </div>

        {/* Footer Divider */}
        <div className="h-[1px] bg-white/10 w-full my-8" />

        {/* Bottom Bar: Copyright and Discrete Admin Link */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} Txeneza. Trabalho Acadêmico de Conclusão de Curso (Monografia) — Beira, Moçambique.
          </div>

          {/* Discrete Admin Link (Login / W2) */}
          <div className="flex items-center gap-5">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 text-[11px] font-bold text-slate-300 transition-all"
            >
              <Shield className="w-3.5 h-3.5 text-limeGreen" />
              Portal CMB (Administração)
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
