"use client";

import React from "react";
import { CheckCircle2, XCircle, Camera } from "lucide-react";
import { ResolutionVerification } from "../resolution-verification.types";

interface ResolutionGalleryProps {
  verifications: ResolutionVerification[];
}

/**
 * Galeria de provas de resolução (fotografias do local já limpo)
 * associadas a uma ocorrência.
 */
export const ResolutionGallery: React.FC<ResolutionGalleryProps> = ({ verifications }) => {
  if (verifications.length === 0) return null;

  return (
    <div className="p-6 bg-light-background dark:bg-dark-background border border-grey200 dark:border-grey800 rounded-2xl">
      <h3 className="text-xs font-bold text-grey600 dark:text-grey400 uppercase tracking-wider mb-4 flex items-center gap-2">
        <Camera className="w-3.5 h-3.5" /> Provas de Resolução
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {verifications.map((v) => (
          <div
            key={v.id}
            className="relative rounded-xl overflow-hidden border border-grey200 dark:border-grey800 group"
          >
            <img
              src={v.photoUrl}
              alt="Prova de resolução"
              className="w-full h-28 object-cover"
            />
            <div className="absolute top-1.5 right-1.5">
              {v.result === "resolvida" ? (
                <span className="p-1 rounded-full bg-emerald-600 text-white shadow" title="Confirmado como resolvido">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </span>
              ) : (
                <span className="p-1 rounded-full bg-red-600 text-white shadow" title="Não resolvido">
                  <XCircle className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-black/60 px-2 py-1">
              <p className="text-[10px] text-white font-mono">
                {new Date(v.createdAt).toLocaleString("pt-PT")}
              </p>
            </div>
            {v.notes && (
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                <p className="text-[10px] text-white text-center leading-snug">{v.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
