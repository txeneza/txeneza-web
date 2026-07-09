// beira-bairros.ts
// Lista canónica de bairros da Cidade da Beira, usada nas combo box do painel.
// Alguns bairros incluem um centro aproximado [lat, lng] para pré-preencher
// coordenadas ao registar pontos de recolha.

export interface BairroBeira {
  nome: string;
  center?: [number, number];
}

export const BAIRROS_BEIRA: BairroBeira[] = [
  { nome: "Alto da Manga" },
  { nome: "Chaimite", center: [-19.8380, 34.8460] },
  { nome: "Chipangara" },
  { nome: "Chota", center: [-19.8200, 34.8250] },
  { nome: "Esturro", center: [-19.8250, 34.8560] },
  { nome: "Goto", center: [-19.8170, 34.8360] },
  { nome: "Inhamízua" },
  { nome: "Macúti", center: [-19.8270, 34.8720] },
  { nome: "Macurungo" },
  { nome: "Mananga" },
  { nome: "Manga Loforte", center: [-19.8010, 34.8230] },
  { nome: "Manga Mascarenha" },
  { nome: "Maquinino" },
  { nome: "Maraza", center: [-19.7960, 34.8320] },
  { nome: "Matacuane", center: [-19.8300, 34.8520] },
  { nome: "Munhava Central", center: [-19.8090, 34.8470] },
  { nome: "Nhaconjo" },
  { nome: "Nharuchonga" },
  { nome: "Ntopa" },
  { nome: "Palmeiras", center: [-19.8150, 34.8290] },
  { nome: "Pioneiros" },
  { nome: "Ponta-Gêa", center: [-19.8430, 34.8380] },
  { nome: "Baixa / Mercado", center: [-19.8340, 34.8390] },
  { nome: "Vaz" },
];

export const BAIRROS_BEIRA_NOMES: string[] = BAIRROS_BEIRA.map((b) => b.nome);

export function getBairroCenter(nome: string): [number, number] | undefined {
  return BAIRROS_BEIRA.find((b) => b.nome === nome)?.center;
}
