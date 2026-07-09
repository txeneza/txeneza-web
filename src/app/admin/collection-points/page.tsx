"use client";

import React, { useState } from "react";
import { useCollectionPoints, PontoRecolhaData } from "@/features/collection-points/hooks/use-collection-points";
import { CollectionPointForm } from "@/features/collection-points/components/collection-point-form";
import { CollectionPointsList } from "@/features/collection-points/components/collection-points-list";
import { DeleteConfirmDialog } from "@/features/collection-points/components/delete-confirm-dialog";
import { AlertCircle, CheckCircle2, MapPin, MapPinCheck, MapPinX, Building2 } from "lucide-react";

export default function AdminCollectionPointsPage() {
  const {
    filteredPoints,
    stats,
    loading,
    submitting,
    deletingId,
    error,
    success,
    isEditing,
    editingId,
    search,
    setSearch,
    estadoFiltro,
    setEstadoFiltro,
    form,
    startEdit,
    cancelEdit,
    handleSubmit,
    handleDelete,
  } = useCollectionPoints();

  const [pointToDelete, setPointToDelete] = useState<PontoRecolhaData | null>(null);

  const confirmDelete = async () => {
    if (!pointToDelete) return;
    await handleDelete(pointToDelete.id);
    setPointToDelete(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-forestGreen/10 dark:bg-limeGreen/10 rounded-xl">
          <MapPin className="w-6 h-6 text-forestGreen dark:text-limeGreen" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-grey900 dark:text-grey50">
            Pontos de Recolha
          </h1>
          <p className="text-grey600 dark:text-grey400 text-sm mt-0.5">
            Faça a gestão dos contentores e locais oficiais de recolha da Cidade da Beira.
          </p>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<MapPin className="w-4 h-4" />} label="Total" value={stats.total} />
        <StatCard icon={<MapPinCheck className="w-4 h-4" />} label="Ativos" value={stats.activos} tone="emerald" />
        <StatCard icon={<MapPinX className="w-4 h-4" />} label="Inativos" value={stats.inactivos} tone="red" />
        <StatCard icon={<Building2 className="w-4 h-4" />} label="Bairros" value={stats.bairros} />
      </div>

      {/* Feedback */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 flex gap-3 items-center text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}
      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 flex gap-3 items-center text-sm text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <p>{success}</p>
        </div>
      )}

      {/* Grid principal */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <div className="xl:col-span-1">
          <CollectionPointForm
            form={form}
            onSubmit={handleSubmit}
            submitting={submitting}
            isEditing={isEditing}
            onCancel={cancelEdit}
          />
        </div>

        <div className="xl:col-span-2">
          <CollectionPointsList
            points={filteredPoints}
            totalCount={stats.total}
            loading={loading}
            search={search}
            setSearch={setSearch}
            estadoFiltro={estadoFiltro}
            setEstadoFiltro={setEstadoFiltro}
            editingId={editingId}
            onEdit={startEdit}
            onDelete={setPointToDelete}
          />
        </div>
      </div>

      <DeleteConfirmDialog
        open={Boolean(pointToDelete)}
        pointName={pointToDelete?.nome}
        deleting={Boolean(deletingId)}
        onConfirm={confirmDelete}
        onCancel={() => setPointToDelete(null)}
      />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone?: "emerald" | "red";
}) {
  const toneClass =
    tone === "emerald"
      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      : tone === "red"
      ? "bg-red-500/10 text-red-600 dark:text-red-400"
      : "bg-forestGreen/10 dark:bg-limeGreen/10 text-forestGreen dark:text-limeGreen";

  return (
    <div className="flex items-center gap-3 p-4 rounded-2xl border border-grey200 dark:border-grey800 bg-light-background dark:bg-dark-background">
      <div className={`p-2 rounded-lg ${toneClass}`}>{icon}</div>
      <div>
        <p className="text-[11px] font-bold text-grey600 dark:text-grey400 uppercase tracking-wider">{label}</p>
        <p className="text-xl font-black text-grey900 dark:text-grey50">{value}</p>
      </div>
    </div>
  );
}
