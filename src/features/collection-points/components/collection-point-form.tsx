"use client";

import React from "react";
import { MapPin, Plus, Loader2, Pencil, X, CheckCircle2, XCircle } from "lucide-react";
import { Combobox } from "@/components/ui/combobox";
import { BAIRROS_BEIRA_NOMES } from "@/core/geo/beira-bairros";

interface CollectionPointFormProps {
  form: {
    nome: string;
    setNome: (v: string) => void;
    latitude: string;
    setLatitude: (v: string) => void;
    longitude: string;
    setLongitude: (v: string) => void;
    bairro: string;
    setBairro: (v: string) => void;
    horario: string;
    setHorario: (v: string) => void;
    estado: "activo" | "inactivo";
    setEstado: (v: "activo" | "inactivo") => void;
  };
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  isEditing: boolean;
  onCancel: () => void;
}

const inputClass =
  "w-full bg-grey100 dark:bg-grey950 border border-grey200 dark:border-grey800 rounded-xl py-2.5 px-3.5 text-sm text-grey900 dark:text-grey50 placeholder:text-grey400 dark:placeholder:text-grey600 focus:outline-none focus:border-limeGreen/50 focus:ring-2 focus:ring-limeGreen/10 transition-all";

const labelClass =
  "text-xs font-bold text-grey600 dark:text-grey400 uppercase tracking-wider";

export const CollectionPointForm: React.FC<CollectionPointFormProps> = ({
  form,
  onSubmit,
  submitting,
  isEditing,
  onCancel,
}) => {
  const fillBeiraCoordinates = () => {
    form.setLatitude("-19.8272");
    form.setLongitude("34.8384");
  };

  return (
    <div className="p-6 bg-light-background dark:bg-dark-background border border-grey200 dark:border-grey800 rounded-2xl shadow-sm sticky top-24">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-forestGreen/10 dark:bg-limeGreen/10 rounded-lg text-forestGreen dark:text-limeGreen">
            {isEditing ? <Pencil className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
          </div>
          <h3 className="text-lg font-bold text-grey900 dark:text-grey50">
            {isEditing ? "Editar Ponto" : "Registar Ponto"}
          </h3>
        </div>
        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-1 text-xs font-bold text-grey600 dark:text-grey400 hover:text-grey900 dark:hover:text-grey50 transition-colors"
          >
            <X className="w-3.5 h-3.5" /> Cancelar
          </button>
        )}
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        {/* Nome */}
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Nome do Local *</label>
          <input
            type="text"
            required
            placeholder="Ex: Ecoponto Praça da Beira"
            value={form.nome}
            onChange={(e) => form.setNome(e.target.value)}
            disabled={submitting}
            className={inputClass}
          />
        </div>

        {/* Bairro — Combobox */}
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Bairro *</label>
          <Combobox
            options={BAIRROS_BEIRA_NOMES}
            value={form.bairro}
            onChange={form.setBairro}
            placeholder="Selecione o bairro"
            searchPlaceholder="Pesquisar bairro..."
            emptyMessage="Bairro não encontrado."
            disabled={submitting}
          />
          <span className="text-[10px] text-grey500 dark:text-grey500">
            As coordenadas são sugeridas automaticamente ao escolher o bairro.
          </span>
        </div>

        {/* Coordenadas */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Latitude *</label>
            <input
              type="number"
              step="any"
              required
              placeholder="-19.8272"
              value={form.latitude}
              onChange={(e) => form.setLatitude(e.target.value)}
              disabled={submitting}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Longitude *</label>
            <input
              type="number"
              step="any"
              required
              placeholder="34.8384"
              value={form.longitude}
              onChange={(e) => form.setLongitude(e.target.value)}
              disabled={submitting}
              className={inputClass}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={fillBeiraCoordinates}
          className="text-left text-[11px] font-bold text-forestGreen dark:text-limeGreen hover:opacity-80 transition-opacity -mt-1 self-start"
        >
          Inserir coordenadas padrão da Beira
        </button>

        {/* Horário */}
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Horário de Recolha</label>
          <input
            type="text"
            placeholder="Ex: Seg–Sex · 06h–18h"
            value={form.horario}
            onChange={(e) => form.setHorario(e.target.value)}
            disabled={submitting}
            className={inputClass}
          />
        </div>

        {/* Estado — toggle segmentado */}
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Estado</label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-grey100 dark:bg-grey950 border border-grey200 dark:border-grey800 rounded-xl">
            <button
              type="button"
              onClick={() => form.setEstado("activo")}
              disabled={submitting}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                form.estado === "activo"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                  : "text-grey600 dark:text-grey400 border border-transparent"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Ativo
            </button>
            <button
              type="button"
              onClick={() => form.setEstado("inactivo")}
              disabled={submitting}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                form.estado === "inactivo"
                  ? "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
                  : "text-grey600 dark:text-grey400 border border-transparent"
              }`}
            >
              <XCircle className="w-3.5 h-3.5" /> Inativo
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full mt-2 py-3 rounded-xl text-sm font-bold bg-limeGreen text-forestGreen hover:bg-lightLime active:scale-[0.99] shadow-lg shadow-limeGreen/10 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              A guardar...
            </>
          ) : isEditing ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Guardar Alterações
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Cadastrar Ponto
            </>
          )}
        </button>
      </form>
    </div>
  );
};
