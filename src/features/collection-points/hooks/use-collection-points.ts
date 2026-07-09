"use client";

import { useState, useEffect } from "react";

export interface PontoRecolhaData {
  id: string;
  nome: string;
  latitude: number;
  longitude: number;
  bairro: string;
  horario: string | null;
  estado: "activo" | "inactivo";
}

export function useCollectionPoints() {
  const [points, setPoints] = useState<PontoRecolhaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [nome, setNome] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [bairro, setBairro] = useState("");
  const [horario, setHorario] = useState("");
  const [estado, setEstado] = useState<"activo" | "inactivo">("activo");

  const fetchPoints = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/pontos-recolha");
      if (!res.ok) {
        throw new Error(`Erro do servidor (Status ${res.status})`);
      }
      
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("O servidor não retornou um formato JSON válido.");
      }

      const data = await res.json();
      setPoints(data);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNome("");
    setLatitude("");
    setLongitude("");
    setBairro("");
    setHorario("");
    setEstado("activo");
  };

  const handleCreatePoint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !latitude || !longitude || !bairro) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/pontos-recolha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          bairro,
          horario: horario || null,
          estado,
        }),
      });

      const contentType = res.headers.get("content-type");
      const isJson = contentType && contentType.includes("application/json");

      if (!res.ok) {
        let errMsg = `Erro ao cadastrar (Status ${res.status})`;
        if (isJson) {
          try {
            const errorData = await res.json();
            errMsg = errorData.error || errMsg;
          } catch {}
        }
        throw new Error(errMsg);
      }

      if (!isJson) {
        throw new Error("Resposta inválida recebida do servidor.");
      }

      const newPoint = await res.json();
      setPoints((prev) => [newPoint, ...prev]);
      resetForm();
    } catch (err: any) {
      setError(err.message || "Erro de rede.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchPoints();
  }, []);

  return {
    points,
    loading,
    submitting,
    error,
    setError,
    form: {
      nome,
      setNome,
      latitude,
      setLatitude,
      longitude,
      setLongitude,
      bairro,
      setBairro,
      horario,
      setHorario,
      estado,
      setEstado,
      resetForm,
    },
    handleCreatePoint,
    refreshPoints: fetchPoints,
  };
}
