"use client";

import { useState, useEffect, useMemo } from "react";
import { getBairroCenter } from "@/core/geo/beira-bairros";

export interface PontoRecolhaData {
  id: string;
  nome: string;
  latitude: number;
  longitude: number;
  bairro: string;
  horario: string | null;
  estado: "activo" | "inactivo";
}

export type EstadoFiltro = "todos" | "activo" | "inactivo";

export function useCollectionPoints() {
  const [points, setPoints] = useState<PontoRecolhaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Estado de edição — null significa "modo de criação".
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filtros da lista
  const [search, setSearch] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoFiltro>("todos");

  // Estado do formulário
  const [nome, setNome] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [bairro, setBairro] = useState("");
  const [horario, setHorario] = useState("");
  const [estado, setEstado] = useState<"activo" | "inactivo">("activo");

  const flashSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3500);
  };

  const fetchPoints = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/pontos-recolha");
      if (!res.ok) throw new Error(`Erro do servidor (Status ${res.status})`);

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("O servidor não retornou um formato JSON válido.");
      }

      const data = await res.json();
      setPoints(Array.isArray(data) ? data : []);
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
    setEditingId(null);
  };

  // Ao escolher um bairro, pré-preenche coordenadas se ainda estiverem vazias.
  const handleSelectBairro = (value: string) => {
    setBairro(value);
    if (!latitude && !longitude) {
      const center = getBairroCenter(value);
      if (center) {
        setLatitude(String(center[0]));
        setLongitude(String(center[1]));
      }
    }
  };

  const startEdit = (point: PontoRecolhaData) => {
    setEditingId(point.id);
    setNome(point.nome);
    setLatitude(String(point.latitude));
    setLongitude(String(point.longitude));
    setBairro(point.bairro);
    setHorario(point.horario || "");
    setEstado(point.estado);
    setError(null);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => resetForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !latitude || !longitude || !bairro) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const payload = {
      nome,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      bairro,
      horario: horario || null,
      estado,
    };

    const isEditing = Boolean(editingId);
    const url = isEditing ? `/api/pontos-recolha/${editingId}` : "/api/pontos-recolha";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const contentType = res.headers.get("content-type");
      const isJson = contentType && contentType.includes("application/json");

      if (!res.ok) {
        let errMsg = `Erro ao guardar (Status ${res.status})`;
        if (isJson) {
          try {
            const errorData = await res.json();
            errMsg = errorData.error || errMsg;
          } catch {}
        }
        throw new Error(errMsg);
      }

      if (!isJson) throw new Error("Resposta inválida recebida do servidor.");

      const savedPoint = await res.json();
      setPoints((prev) =>
        isEditing
          ? prev.map((p) => (p.id === savedPoint.id ? savedPoint : p))
          : [savedPoint, ...prev]
      );
      resetForm();
      flashSuccess(isEditing ? "Ponto actualizado com sucesso." : "Ponto registado com sucesso.");
    } catch (err: any) {
      setError(err.message || "Erro de rede.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/pontos-recolha/${id}`, { method: "DELETE" });
      if (!res.ok) {
        let errMsg = `Erro ao eliminar (Status ${res.status})`;
        try {
          const data = await res.json();
          errMsg = data.error || errMsg;
        } catch {}
        throw new Error(errMsg);
      }
      setPoints((prev) => prev.filter((p) => p.id !== id));
      if (editingId === id) resetForm();
      flashSuccess("Ponto eliminado com sucesso.");
    } catch (err: any) {
      setError(err.message || "Erro de rede.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredPoints = useMemo(() => {
    const q = search.trim().toLowerCase();
    return points.filter((p) => {
      const matchesSearch =
        !q || p.nome.toLowerCase().includes(q) || p.bairro.toLowerCase().includes(q);
      const matchesEstado = estadoFiltro === "todos" || p.estado === estadoFiltro;
      return matchesSearch && matchesEstado;
    });
  }, [points, search, estadoFiltro]);

  const stats = useMemo(() => {
    const activos = points.filter((p) => p.estado === "activo").length;
    return {
      total: points.length,
      activos,
      inactivos: points.length - activos,
      bairros: new Set(points.map((p) => p.bairro)).size,
    };
  }, [points]);

  useEffect(() => {
    fetchPoints();
  }, []);

  return {
    points,
    filteredPoints,
    stats,
    loading,
    submitting,
    deletingId,
    error,
    success,
    setError,
    editingId,
    isEditing: Boolean(editingId),
    search,
    setSearch,
    estadoFiltro,
    setEstadoFiltro,
    form: {
      nome,
      setNome,
      latitude,
      setLatitude,
      longitude,
      setLongitude,
      bairro,
      setBairro: handleSelectBairro,
      horario,
      setHorario,
      estado,
      setEstado,
      resetForm,
    },
    startEdit,
    cancelEdit,
    handleSubmit,
    handleDelete,
    refreshPoints: fetchPoints,
  };
}
