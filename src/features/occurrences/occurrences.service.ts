import { Occurrence, OccurrenceFilter } from "./occurrences.types";

// CRUD + subscrição Firestore/Supabase. Mocks iniciais implementados.

let mockOccurrences: Occurrence[] = [
  {
    id: "1",
    title: "Buraco na Estrada Principal",
    description: "Um buraco enorme está a causar acidentes perto do cruzamento da Beira.",
    category: "Saneamento / Infraestrutura",
    latitude: -19.8272,
    longitude: 34.8384,
    status: "pendente",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Inundação na Avenida",
    description: "Água acumulada após a última chuva impede a passagem de peões.",
    category: "Cheias / Drenagem",
    latitude: -19.8322,
    longitude: 34.8424,
    status: "em-progresso",
    createdAt: new Date().toISOString(),
  }
];

export const occurrencesService = {
  async getAll(filters?: OccurrenceFilter): Promise<Occurrence[]> {
    let result = [...mockOccurrences];
    if (filters?.status) {
      result = result.filter(o => o.status === filters.status);
    }
    if (filters?.category) {
      result = result.filter(o => o.category === filters.category);
    }
    return result;
  },

  async getById(id: string): Promise<Occurrence | null> {
    return mockOccurrences.find(o => o.id === id) || null;
  },

  async create(data: Omit<Occurrence, "id" | "createdAt">): Promise<Occurrence> {
    const newOccurrence: Occurrence = {
      ...data,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString(),
    };
    mockOccurrences.push(newOccurrence);
    return newOccurrence;
  },

  async updateStatus(id: string, status: Occurrence["status"]): Promise<Occurrence> {
    const occ = mockOccurrences.find(o => o.id === id);
    if (!occ) throw new Error("Ocorrência não encontrada");
    occ.status = status;
    occ.updatedAt = new Date().toISOString();
    return occ;
  },

  subscribeToChanges(callback: (occurrences: Occurrence[]) => void) {
    // Retorna um unsubscriber simulado
    callback(mockOccurrences);
    const interval = setInterval(() => {
      callback(mockOccurrences);
    }, 5000);
    return () => clearInterval(interval);
  }
};
