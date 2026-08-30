"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, X } from "lucide-react";
import { cookiesManager } from "@/lib/cookies";
import { BrandName } from "@/components/brand/brand-name";

export const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Verifica se o utilizador já deu o consentimento
    const consent = cookiesManager.get("txeneza_cookie_consent");
    if (!consent) {
      // Exibe o banner com um pequeno delay para suavidade
      const timer = setTimeout(() => {
        setVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    cookiesManager.set("txeneza_cookie_consent", "accepted", 365); // Expira em 1 ano
    setVisible(false);
  };

  const handleDecline = () => {
    cookiesManager.set("txeneza_cookie_consent", "declined", 30); // Lembrar por 30 dias
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
          className="fixed bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 md:left-auto md:max-w-md z-50 bg-grey900/95 backdrop-blur-xl border border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 text-white"
        >
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2 text-limeGreen">
              <ShieldCheck className="w-5 h-5" />
              <span className="font-extrabold text-xs sm:text-sm uppercase tracking-wider">
                Privacidade & Cookies
              </span>
            </div>
            <button
              onClick={() => setVisible(false)}
              className="p-1 text-slate-500 hover:text-white transition-colors"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-300 leading-relaxed">
            Utilizamos cookies para melhorar a sua experiência, guardar preferências do utilizador, analisar tráfego e garantir o correto funcionamento do mapa do <BrandName variant="onDark" />. Ao continuar a navegar, aceita a nossa política de privacidade.
          </p>

          {/* Action Buttons */}
          <div className="flex gap-2.5">
            <button
              onClick={handleDecline}
              className="flex-1 py-3 sm:py-2.5 min-h-[44px] rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
            >
              Recusar
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 py-3 sm:py-2.5 min-h-[44px] rounded-xl text-xs font-bold bg-limeGreen text-forestGreen hover:bg-lightLime active:scale-95 transition-all"
            >
              Aceitar Todos
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
