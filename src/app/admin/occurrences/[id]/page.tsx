"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { occurrencesService } from "@/features/occurrences/occurrences.service";
import { Occurrence, OccurrenceStatus } from "@/features/occurrences/occurrences.types";
import {
  OCCURRENCE_STATUS_META,
  OCCURRENCE_STATUS_ORDER,
} from "@/features/occurrences/occurrence-status";
import { ConfirmDialog, ConfirmTone } from "@/components/ui/confirm-dialog";
import { ResolutionProofModal } from "@/features/occurrences/components/resolution-proof-modal";
import { ResolutionGallery } from "@/features/occurrences/components/resolution-gallery";
import { resolutionVerificationService } from "@/features/occurrences/resolution-verification.service";
import { ResolutionVerification } from "@/features/occurrences/resolution-verification.types";
import {
  ArrowLeft,
  MapPin,
  Tag,
  Calendar,
  User,
  ImageOff,
  Map as MapIcon,
  Loader2,
} from "lucide-react";

const STATUS_TONE: Record<OccurrenceStatus, ConfirmTone> = {
  pendente: "warning",
  "em-progresso": "info",
  resolvido: "success",
  rejeitado: "danger",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OccurrenceDetailPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [occurrence, setOccurrence] = useState<Occurrence | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<OccurrenceStatus | null>(null);
  const [pendingStatus, setPendingStatus] = useState<OccurrenceStatus | null>(null);
  const [imgError, setImgError] = useState(false);
  const [verifications, setVerifications] = useState<ResolutionVerification[]>([]);
  const [proofModalOpen, setProofModalOpen] = useState(false);
  const [savingProof, setSavingProof] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await occurrencesService.getById(id);
      setOccurrence(data);
      setVerifications(await resolutionVerificationService.getByOccurrence(id));
      setLoading(false);
    }
    load();
  }, [id]);

  const handleUpdateStatus = async () => {
    if (!occurrence || !pendingStatus) return;
    setUpdating(pendingStatus);
    try {
      const updated = await occurrencesService.updateStatus(occurrence.id, pendingStatus);
      setOccurrence({ ...updated });
      setPendingStatus(null);
    } finally {
      setUpdating(null);
    }
  };

  const handleConfirmProof = async (photoFiles: File[], notes: string) => {
    if (!occurrence || photoFiles.length === 0) return;
    setSavingProof(true);
    try {
      const created = await resolutionVerificationService.createMany(
        occurrence.id,
        photoFiles,
        notes || undefined
      );
      setVerifications((prev) => [...created, ...prev]);
      
      // Recarrega os dados atualizados da ocorrência para refletir a resolução ou a reabertura automática
      const fresh = await occurrencesService.getById(id);
      if (fresh) setOccurrence({ ...fresh });
      
      setPendingStatus(null);
      setProofModalOpen(false);
    } catch (err: any) {
      console.error("Erro ao submeter prova:", err);
    } finally {
      setSavingProof(false);
    }
  };

  const handleCancelProof = () => {
    setProofModalOpen(false);
    setPendingStatus(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20">
        <div className="w-8 h-8 border-2 border-limeGreen border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-grey600 dark:text-grey400">A carregar detalhes...</span>
      </div>
    );
  }

  if (!occurrence) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <p className="text-red-500">Ocorrência não encontrada.</p>
        <button
          onClick={() => router.push("/admin/occurrences")}
          className="px-4 py-2.5 rounded-xl text-sm font-bold bg-limeGreen text-forestGreen hover:bg-lightLime transition-colors"
        >
          Voltar à Lista
        </button>
      </div>
    );
  }

  const meta = OCCURRENCE_STATUS_META[occurrence.status];

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {/* Voltar */}
      <button
        onClick={() => router.push("/admin/occurrences")}
        className="inline-flex items-center gap-1.5 text-sm font-bold text-grey600 dark:text-grey400 hover:text-forestGreen dark:hover:text-limeGreen transition-colors self-start"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar à Lista
      </button>

      {/* Cabeçalho */}
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <div>
          <span className="text-xs font-mono text-grey500 dark:text-grey500">
            ID: {occurrence.id}
          </span>
          <h1 className="text-2xl font-black tracking-tight text-grey900 dark:text-grey50 mt-1">
            {occurrence.title}
          </h1>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-bold py-1.5 px-3 rounded-full border ${meta.badge}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
          {meta.label}
        </span>
      </div>

      {/* Imagem da denúncia */}
      {occurrence.imageUrl && !imgError ? (
        <img
          src={occurrence.imageUrl}
          alt={occurrence.title}
          onError={() => setImgError(true)}
          className="w-full max-h-80 object-cover rounded-2xl border border-grey200 dark:border-grey800"
        />
      ) : (
        <div className="w-full h-40 rounded-2xl border border-dashed border-grey300 dark:border-grey700 flex items-center justify-center text-grey400 dark:text-grey600 gap-2">
          <ImageOff className="w-5 h-5" />
          <span className="text-sm">Sem fotografia da denúncia</span>
        </div>
      )}

      {/* Descrição */}
      <div className="p-6 bg-light-background dark:bg-dark-background border border-grey200 dark:border-grey800 rounded-2xl">
        <h3 className="text-xs font-bold text-grey600 dark:text-grey400 uppercase tracking-wider mb-2">
          Descrição
        </h3>
        <p className="text-sm text-grey900 dark:text-grey50 leading-relaxed">{occurrence.description}</p>
      </div>

      {/* Detalhes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DetailRow icon={<Tag className="w-4 h-4" />} label="Categoria" value={occurrence.category} accent />
        <DetailRow icon={<MapPin className="w-4 h-4" />} label="Bairro" value={occurrence.bairro || "—"} />
        <DetailRow
          icon={<User className="w-4 h-4" />}
          label="Reportado por"
          value={occurrence.reportedBy || "Munícipe"}
        />
        <DetailRow
          icon={<Calendar className="w-4 h-4" />}
          label="Reportado em"
          value={new Date(occurrence.createdAt).toLocaleString("pt-PT")}
        />
      </div>

      {/* Localização */}
      <div className="p-5 bg-light-background dark:bg-dark-background border border-grey200 dark:border-grey800 rounded-2xl flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h3 className="text-xs font-bold text-grey600 dark:text-grey400 uppercase tracking-wider mb-1">
            Localização
          </h3>
          <p className="text-sm font-mono text-grey900 dark:text-grey50">
            {occurrence.latitude.toFixed(5)}, {occurrence.longitude.toFixed(5)}
          </p>
        </div>
        <Link
          href="/admin/map"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-forestGreen/5 dark:bg-limeGreen/5 border border-forestGreen/10 dark:border-limeGreen/10 text-forestGreen dark:text-limeGreen hover:bg-forestGreen/10 dark:hover:bg-limeGreen/10 transition-colors"
        >
          <MapIcon className="w-4 h-4" /> Ver no mapa
        </Link>
      </div>

      {/* Provas de resolução já registadas */}
      <ResolutionGallery verifications={verifications} />

      {/* Ações de gestão */}
      <div className="p-6 bg-light-background dark:bg-dark-background border border-grey200 dark:border-grey800 rounded-2xl">
        <h3 className="text-xs font-bold text-grey600 dark:text-grey400 uppercase tracking-wider mb-4">
          Alterar Estado
        </h3>
        <div className="flex flex-wrap gap-2">
          {OCCURRENCE_STATUS_ORDER.map((s) => {
            const m = OCCURRENCE_STATUS_META[s];
            const isCurrent = occurrence.status === s;
            return (
              <button
                key={s}
                onClick={() => {
                  setPendingStatus(s);
                  if (s === "resolvido") setProofModalOpen(true);
                }}
                disabled={isCurrent || updating !== null}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all disabled:cursor-not-allowed ${
                  isCurrent
                    ? `${m.badge} opacity-100`
                    : "bg-grey100 dark:bg-grey900 border-grey200 dark:border-grey800 text-grey700 dark:text-grey300 hover:border-grey300 dark:hover:border-grey700 disabled:opacity-50"
                }`}
              >
                {updating === s ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
                )}
                {isCurrent ? `Estado atual: ${m.label}` : m.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Confirmação de alteração de estado (exceto "Resolvido", que exige prova fotográfica) */}
      <ConfirmDialog
        open={pendingStatus !== null && pendingStatus !== "resolvido"}
        tone={pendingStatus ? STATUS_TONE[pendingStatus] : "brand"}
        title="Alterar estado da ocorrência"
        description={
          pendingStatus ? (
            <>
              Confirma a alteração do estado para{" "}
              <b className="text-grey900 dark:text-grey50">
                «{OCCURRENCE_STATUS_META[pendingStatus].label}»
              </b>
              ? O munícipe poderá ser notificado desta mudança.
            </>
          ) : null
        }
        confirmLabel="Confirmar alteração"
        loading={updating !== null}
        onConfirm={handleUpdateStatus}
        onCancel={() => setPendingStatus(null)}
      />

      {/* Prova fotográfica obrigatória para marcar como "Resolvido" */}
      <ResolutionProofModal
        open={proofModalOpen}
        loading={savingProof || updating !== null}
        onConfirm={handleConfirmProof}
        onCancel={handleCancelProof}
      />
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 p-4 bg-light-background dark:bg-dark-background border border-grey200 dark:border-grey800 rounded-2xl">
      <div className="p-2 rounded-lg bg-forestGreen/10 dark:bg-limeGreen/10 text-forestGreen dark:text-limeGreen shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-bold text-grey600 dark:text-grey400 uppercase tracking-wider">
          {label}
        </p>
        <p
          className={`text-sm font-bold truncate ${
            accent ? "text-forestGreen dark:text-limeGreen" : "text-grey900 dark:text-grey50"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
