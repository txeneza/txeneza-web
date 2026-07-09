"use client";

import React from "react";
import { MapPin, Plus, Loader2 } from "lucide-react";

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
}

export const CollectionPointForm: React.FC<CollectionPointFormProps> = ({
  form,
  onSubmit,
  submitting,
}) => {
  const fillBeiraCoordinates = () => {
    // Fill default map center coordinates for Cidade da Beira to help the user input them faster
    form.setLatitude("-19.8272");
    form.setLongitude("34.8384");
  };

  return (
    <div className="p-6 bg-light-background dark:bg-dark-background dark:bg-grey900/60 backdrop-blur-md border border-grey200 dark:border-grey800 dark:border-grey800/80 rounded-2xl shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-limeGreen/10 rounded-lg text-limeGreen">
          <MapPin className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-gray-950 dark:text-white">
          Registar Ponto de Recolha
        </h3>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        {/* Nome */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-grey600 dark:text-grey400 dark:text-grey300 dark:text-grey500 uppercase tracking-wider">
            Nome do Local *
          </label>
          <input
            type="text"
            required
            placeholder="Ex: Contentor de Lixo Praça Beira"
            value={form.nome}
            onChange={(e) => form.setNome(e.target.value)}
            disabled={submitting}
            className="w-full bg-grey100 dark:bg-grey900/40 dark:bg-grey950 border border-grey200 dark:border-grey800 dark:border-grey800 rounded-xl py-2.5 px-3.5 text-sm text-grey900 dark:text-grey50 dark:text-white focus:outline-none focus:border-limeGreen/50 focus:ring-2 focus:ring-limeGreen/10 transition-all"
          />
        </div>

        {/* Bairro */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-grey600 dark:text-grey400 dark:text-grey300 dark:text-grey500 uppercase tracking-wider">
            Bairro *
          </label>
          <input
            type="text"
            required
            placeholder="Ex: Maquinino"
            value={form.bairro}
            onChange={(e) => form.setBairro(e.target.value)}
            disabled={submitting}
            className="w-full bg-grey100 dark:bg-grey900/40 dark:bg-grey950 border border-grey200 dark:border-grey800 dark:border-grey800 rounded-xl py-2.5 px-3.5 text-sm text-grey900 dark:text-grey50 dark:text-white focus:outline-none focus:border-limeGreen/50 focus:ring-2 focus:ring-limeGreen/10 transition-all"
          />
        </div>

        {/* Coordenadas (Grid) */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-grey600 dark:text-grey400 dark:text-grey300 dark:text-grey500 uppercase tracking-wider">
              Latitude *
            </label>
            <input
              type="number"
              step="any"
              required
              placeholder="Ex: -19.8272"
              value={form.latitude}
              onChange={(e) => form.setLatitude(e.target.value)}
              disabled={submitting}
              className="w-full bg-grey100 dark:bg-grey900/40 dark:bg-grey950 border border-grey200 dark:border-grey800 dark:border-grey800 rounded-xl py-2.5 px-3.5 text-sm text-grey900 dark:text-grey50 dark:text-white focus:outline-none focus:border-limeGreen/50 focus:ring-2 focus:ring-limeGreen/10 transition-all"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-grey600 dark:text-grey400 dark:text-grey300 dark:text-grey500 uppercase tracking-wider">
              Longitude *
            </label>
            <input
              type="number"
              step="any"
              required
              placeholder="Ex: 34.8384"
              value={form.longitude}
              onChange={(e) => form.setLongitude(e.target.value)}
              disabled={submitting}
              className="w-full bg-grey100 dark:bg-grey900/40 dark:bg-grey950 border border-grey200 dark:border-grey800 dark:border-grey800 rounded-xl py-2.5 px-3.5 text-sm text-grey900 dark:text-grey50 dark:text-white focus:outline-none focus:border-limeGreen/50 focus:ring-2 focus:ring-limeGreen/10 transition-all"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={fillBeiraCoordinates}
          className="text-left text-[11px] font-bold text-limeGreen hover:text-lightLime transition-colors -mt-1 self-start"
        >
          Inserir coordenadas padrão da Beira
        </button>

        {/* Horário de Recolha */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-grey600 dark:text-grey400 dark:text-grey300 dark:text-grey500 uppercase tracking-wider">
            Horário de Funcionamento / Recolha
          </label>
          <input
            type="text"
            placeholder="Ex: Seg-Sex: 06h às 18h"
            value={form.horario}
            onChange={(e) => form.setHorario(e.target.value)}
            disabled={submitting}
            className="w-full bg-grey100 dark:bg-grey900/40 dark:bg-grey950 border border-grey200 dark:border-grey800 dark:border-grey800 rounded-xl py-2.5 px-3.5 text-sm text-grey900 dark:text-grey50 dark:text-white focus:outline-none focus:border-limeGreen/50 focus:ring-2 focus:ring-limeGreen/10 transition-all"
          />
        </div>

        {/* Estado */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-grey600 dark:text-grey400 dark:text-grey300 dark:text-grey500 uppercase tracking-wider">
            Estado de Funcionamento
          </label>
          <select
            value={form.estado}
            onChange={(e) => form.setEstado(e.target.value as "activo" | "inactivo")}
            disabled={submitting}
            className="w-full bg-grey100 dark:bg-grey900/40 dark:bg-grey950 border border-grey200 dark:border-grey800 dark:border-grey800 rounded-xl py-2.5 px-3.5 text-sm text-grey900 dark:text-grey50 dark:text-white focus:outline-none focus:border-limeGreen/50 focus:ring-2 focus:ring-limeGreen/10 transition-all"
          >
            <option value="activo">Ativo / Operante</option>
            <option value="inactivo">Inativo / Fora de Serviço</option>
          </select>
        </div>

        {/* Botão de Envio */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full mt-3 py-3 rounded-xl text-sm font-bold bg-limeGreen text-forestGreen hover:bg-lightLime hover:scale-[1.01] active:scale-95 border border-limeGreen/10 shadow-lg shadow-limeGreen/10 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              A guardar ponto...
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
