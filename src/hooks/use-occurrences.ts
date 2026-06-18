import { useEffect } from "react";
import { useOccurrencesStore } from "@/features/occurrences/occurrences.store";
import { occurrencesService } from "@/features/occurrences/occurrences.service";

export function useOccurrences() {
  const { occurrences, loading, error, fetchOccurrences, updateOccurrenceStatus } = useOccurrencesStore();

  useEffect(() => {
    // Busca inicial
    fetchOccurrences();

    // Subscrição em tempo real
    const unsubscribe = occurrencesService.subscribeToChanges((updatedData) => {
      // Sincroniza localmente
      useOccurrencesStore.setState({ occurrences: updatedData });
    });

    return () => unsubscribe();
  }, [fetchOccurrences]);

  return {
    occurrences,
    loading,
    error,
    refetch: fetchOccurrences,
    updateStatus: updateOccurrenceStatus,
  };
}
