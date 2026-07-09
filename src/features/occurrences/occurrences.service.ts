import { Occurrence, OccurrenceFilter } from "./occurrences.types";

// CRUD + subscrição Firestore/Supabase. Mocks iniciais implementados.

// Datas relativas a "hoje" para dar realismo à listagem.
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();

let mockOccurrences: Occurrence[] = [
  {
    id: "1",
    title: "Lixo acumulado junto ao Mercado Central",
    description:
      "Grande volume de resíduos domésticos e plásticos acumulado na berma, junto às bancas do mercado. Mau cheiro e risco sanitário para os vendedores.",
    category: "Resíduos sólidos",
    latitude: -19.8340,
    longitude: 34.8390,
    bairro: "Baixa / Mercado",
    status: "pendente",
    reportedBy: "Munícipe — Baixa",
    imageUrl: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=60",
    createdAt: daysAgo(1),
  },
  {
    id: "2",
    title: "Descarga ilegal de entulho na Munhava",
    description:
      "Camião despejou escombros e resíduos de construção num terreno baldio. A ocupar parte da via e a bloquear a drenagem.",
    category: "Descarga ilegal",
    latitude: -19.8090,
    longitude: 34.8470,
    bairro: "Munhava",
    status: "pendente",
    reportedBy: "Munícipe — Munhava",
    imageUrl: "https://images.unsplash.com/photo-1558624232-75ee22af7db5?auto=format&fit=crop&w=800&q=60",
    createdAt: daysAgo(2),
  },
  {
    id: "3",
    title: "Contentor danificado a transbordar",
    description:
      "Contentor sem tampa e transbordado no bairro do Goto. Resíduos espalhados pela rua e atraindo animais.",
    category: "Contentor danificado",
    latitude: -19.8170,
    longitude: 34.8360,
    bairro: "Goto",
    status: "em-progresso",
    reportedBy: "Munícipe — Goto",
    imageUrl: "https://images.unsplash.com/photo-1528190336454-13cd56b45b5a?auto=format&fit=crop&w=800&q=60",
    createdAt: daysAgo(3),
  },
  {
    id: "4",
    title: "Cheia e resíduos na vala de drenagem",
    description:
      "Água acumulada após a chuva misturada com lixo entope a vala de drenagem, impedindo a passagem de peões.",
    category: "Cheias / Drenagem",
    latitude: -19.8322,
    longitude: 34.8424,
    bairro: "Chaimite",
    status: "em-progresso",
    reportedBy: "Munícipe — Chaimite",
    imageUrl: "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=60",
    createdAt: daysAgo(4),
  },
  {
    id: "5",
    title: "Lixeira a céu aberto no Esturro",
    description:
      "Formou-se uma lixeira informal num quarteirão residencial. Queima de lixo frequente, com fumo a afetar as casas vizinhas.",
    category: "Lixo acumulado",
    latitude: -19.8250,
    longitude: 34.8560,
    bairro: "Esturro",
    status: "pendente",
    reportedBy: "Munícipe — Esturro",
    imageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=60",
    createdAt: daysAgo(5),
  },
  {
    id: "6",
    title: "Resíduos na orla do Macúti",
    description:
      "Plásticos e restos de embalagens acumulados na zona costeira do Macúti, arrastados pela maré e pelo vento.",
    category: "Resíduos sólidos",
    latitude: -19.8270,
    longitude: 34.8720,
    bairro: "Macúti",
    status: "pendente",
    reportedBy: "Munícipe — Macúti",
    imageUrl: "https://images.unsplash.com/photo-1618477462146-050d2767eac4?auto=format&fit=crop&w=800&q=60",
    createdAt: daysAgo(6),
  },
  {
    id: "7",
    title: "Entulho recolhido na Manga",
    description:
      "Acumulação de entulho junto à estrada já removida pela equipa municipal. Zona limpa e reposta.",
    category: "Entulho / Escombros",
    latitude: -19.8010,
    longitude: 34.8230,
    bairro: "Manga",
    status: "resolvido",
    reportedBy: "Munícipe — Manga",
    imageUrl: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=800&q=60",
    createdAt: daysAgo(9),
    updatedAt: daysAgo(2),
  },
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
