"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { occurrencesService } from "@/features/occurrences/occurrences.service";
import { Occurrence } from "@/features/occurrences/occurrences.types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OccurrenceDetailPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [occurrence, setOccurrence] = useState<Occurrence | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await occurrencesService.getById(id);
      setOccurrence(data);
      setLoading(false);
    }
    load();
  }, [id]);

  const handleUpdateStatus = async (status: Occurrence["status"]) => {
    if (!occurrence) return;
    const updated = await occurrencesService.updateStatus(occurrence.id, status);
    setOccurrence({ ...updated });
  };

  if (loading) {
    return <div className="text-center py-12 text-grey600 dark:text-grey400">A carregar detalhes...</div>;
  }

  if (!occurrence) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">Ocorrência não encontrada.</p>
        <Button onClick={() => router.push("/admin/occurrences")}>Voltar à Lista</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <Button variant="ghost" onClick={() => router.push("/admin/occurrences")} className="mb-4">
          ← Voltar à Lista
        </Button>
        <div className="flex justify-between items-start gap-4 flex-wrap">
          <div>
            <span className="text-xs text-grey600 dark:text-grey400">ID: {occurrence.id}</span>
            <h1 className="text-3xl font-bold tracking-tight text-grey900 dark:text-grey50 dark:text-white mt-1">
              {occurrence.title}
            </h1>
          </div>
          <Badge variant="info">{occurrence.status.toUpperCase()}</Badge>
        </div>
      </div>

      <div className="p-6 bg-light-background dark:bg-dark-background dark:bg-grey900 border border-grey200 dark:border-grey800 dark:border-grey800 rounded-2xl shadow-sm flex flex-col gap-4">
        <div>
          <h3 className="font-semibold text-grey900 dark:text-grey50 dark:text-white text-sm">Descrição</h3>
          <p className="text-grey600 dark:text-grey300 dark:text-grey300 dark:text-grey500 mt-1 leading-relaxed text-sm">
            {occurrence.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-grey900 dark:text-grey50 dark:text-white text-sm">Categoria</h3>
            <p className="text-grey600 dark:text-grey300 mt-1 text-sm">{occurrence.category}</p>
          </div>
          <div>
            <h3 className="font-semibold text-grey900 dark:text-grey50 dark:text-white text-sm">Reportado em</h3>
            <p className="text-grey600 dark:text-grey300 mt-1 text-sm">{new Date(occurrence.createdAt).toLocaleString()}</p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-grey900 dark:text-grey50 dark:text-white text-sm">Coordenadas</h3>
          <p className="text-grey600 dark:text-grey300 mt-1 text-sm">
            Latitude: {occurrence.latitude} | Longitude: {occurrence.longitude}
          </p>
        </div>
      </div>

      <div className="p-6 bg-light-background dark:bg-dark-background dark:bg-grey900 border border-grey200 dark:border-grey800 dark:border-grey800 rounded-2xl shadow-sm">
        <h3 className="font-semibold text-grey900 dark:text-grey50 dark:text-white text-sm mb-4">Ações de Gestão</h3>
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" onClick={() => handleUpdateStatus("em-progresso")} disabled={occurrence.status === "em-progresso"}>
            Mover para Em Progresso
          </Button>
          <Button variant="secondary" onClick={() => handleUpdateStatus("resolvido")} disabled={occurrence.status === "resolvido"}>
            Marcar como Resolvido
          </Button>
          <Button variant="danger" onClick={() => handleUpdateStatus("rejeitado")} disabled={occurrence.status === "rejeitado"}>
            Rejeitar
          </Button>
        </div>
      </div>
    </div>
  );
}
