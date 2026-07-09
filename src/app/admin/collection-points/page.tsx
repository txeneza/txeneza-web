"use client";

import React from "react";
import { useCollectionPoints } from "@/features/collection-points/hooks/use-collection-points";
import { CollectionPointForm } from "@/features/collection-points/components/collection-point-form";
import { CollectionPointsList } from "@/features/collection-points/components/collection-points-list";
import { AlertCircle } from "lucide-react";

export default function AdminCollectionPointsPage() {
  const { points, loading, submitting, error, form, handleCreatePoint } =
    useCollectionPoints();

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-grey900 dark:text-grey50 dark:text-white">
          Gestão de Pontos de Recolha
        </h1>
        <p className="text-grey600 dark:text-grey400 dark:text-grey300 dark:text-grey500 mt-2">
          Cadastre novos contentores e locais autorizados de despejo para a Cidade da Beira.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 flex gap-3 items-center text-sm text-red-650 dark:text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-550 dark:text-red-450" />
          <p>{error}</p>
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Form Container */}
        <div className="xl:col-span-1">
          <CollectionPointForm
            form={form}
            onSubmit={handleCreatePoint}
            submitting={submitting}
          />
        </div>

        {/* List Container */}
        <div className="xl:col-span-2">
          <CollectionPointsList points={points} loading={loading} />
        </div>
      </div>
    </div>
  );
}
