"use client";

import React, { useState } from "react";
import { Occurrence } from "@/features/occurrences/occurrences.types";
import { Badge } from "../ui/badge";
import { MapPin, ImageOff, Calendar, Tag } from "lucide-react";

interface OccurrenceCardProps {
  occurrence: Occurrence;
  onClick?: () => void;
}

export const OccurrenceCard: React.FC<OccurrenceCardProps> = ({ occurrence, onClick }) => {
  const [imgError, setImgError] = useState(false);

  const getBadgeVariant = (status: Occurrence["status"]) => {
    switch (status) {
      case "pendente": return "warning";
      case "em-progresso": return "info";
      case "resolvido": return "success";
      case "rejeitado": return "error";
      default: return "default";
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-light-background dark:bg-dark-background border border-grey200 dark:border-grey800 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
    >
      {/* Imagem da denúncia */}
      {occurrence.imageUrl && !imgError ? (
        <div className="relative w-full h-40 bg-grey100 dark:bg-grey900">
          <img
            src={occurrence.imageUrl}
            alt={occurrence.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute top-2 right-2">
            <Badge variant={getBadgeVariant(occurrence.status)}>
              {occurrence.status.toUpperCase()}
            </Badge>
          </div>
        </div>
      ) : (
        <div className="w-full h-24 bg-grey100 dark:bg-grey900 flex items-center justify-center text-grey400 dark:text-grey600">
          <ImageOff className="w-6 h-6" />
        </div>
      )}

      <div className="p-4 flex flex-col gap-3">
        {(!occurrence.imageUrl || imgError) && (
          <div className="flex justify-end">
            <Badge variant={getBadgeVariant(occurrence.status)}>
              {occurrence.status.toUpperCase()}
            </Badge>
          </div>
        )}

        <div>
          <h4 className="font-bold text-grey900 dark:text-grey50 leading-snug">{occurrence.title}</h4>
          <p className="text-sm text-grey600 dark:text-grey400 mt-1 leading-relaxed">
            {occurrence.description}
          </p>
        </div>

        <div className="flex flex-col gap-1.5 text-xs text-grey600 dark:text-grey400 border-t border-grey200 dark:border-grey800 pt-3">
          <div className="flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 shrink-0 text-forestGreen dark:text-limeGreen" />
            <span className="font-medium text-forestGreen dark:text-limeGreen">{occurrence.category}</span>
          </div>
          {occurrence.bairro && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>{occurrence.bairro}</span>
              <span className="ml-auto font-mono text-[10px] text-grey400 dark:text-grey500">
                {occurrence.latitude.toFixed(4)}, {occurrence.longitude.toFixed(4)}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>{new Date(occurrence.createdAt).toLocaleDateString("pt-PT")}</span>
            {occurrence.reportedBy && (
              <span className="ml-auto truncate max-w-[55%] text-right">{occurrence.reportedBy}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
