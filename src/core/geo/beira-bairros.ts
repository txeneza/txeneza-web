// beira-bairros.ts
// Lista canónica de bairros da Cidade da Beira, usada nas combo box do painel.
// Cada bairro inclui um centro aproximado [lat, lng] para pré-preencher
// coordenadas ao registar pontos de recolha.
//
// Nível de confiança das coordenadas (ver comentário em cada linha):
//   [Google] — corresponde a um "sublocality"/"neighborhood" ou POI claramente
//              identificado dentro do bairro (Google Places).
//   [aprox.] — estimado a partir de um conjunto disperso de POIs/negócios com
//              morada no bairro, ou mantido do ficheiro original; usar como
//              ponto de partida, não como fronteira exacta.
//   [incerto] — o bairro não foi encontrado de forma fiável em nenhuma fonte
//              cartográfica consultada (Google Places, OpenStreetMap/Mapcarta).
//              Alguns destes nomes também não constam da lista oficial de
//              bairros da Cidade da Beira que encontrámos nas pesquisas — pode
//              tratar-se de designações informais ou de zonas dentro de outro
//              bairro oficial. Tratar como aproximação grosseira.

export interface BairroBeira {
  nome: string;
  center?: [number, number];
}

export const BAIRROS_BEIRA: BairroBeira[] = [
  { nome: "Alto da Manga", center: [-19.7950, 34.8800] }, // [aprox.] entre Vaz e Manga Mascarenha
  { nome: "Chaimite", center: [-19.8342, 34.8362] }, // [Google] neighborhood
  { nome: "Chipangara", center: [-19.8322, 34.8445] }, // [Google]
  { nome: "Chota", center: [-19.8200, 34.8250] }, // [aprox.] mantido do original
  { nome: "Esturro", center: [-19.8250, 34.8560] }, // [aprox.] mantido do original
  { nome: "Goto", center: [-19.8312, 34.8442] }, // [Google] Mercado Goto
  { nome: "Inhamízua", center: [-19.7252, 34.8141] }, // [aprox.] único ponto identificável no bairro
  { nome: "Macúti", center: [-19.8435, 34.8928] }, // [Google] sublocality
  { nome: "Macurungo", center: [-19.8372, 34.8803] }, // [Google] sublocality
  { nome: "Mananga", center: [-19.8150, 34.8500] }, // [aprox.] entre Munhava e Matacuane
  { nome: "Manga Loforte", center: [-19.7806, 34.8821] }, // [aprox.] junto à Escola Primária Manga Loforte
  { nome: "Manga Mascarenha", center: [-19.7950, 34.8900] }, // [aprox.] centro do cluster de POIs
  { nome: "Maquinino", center: [-19.8253, 34.8528] }, // [Google] sublocality
  { nome: "Maraza", center: [-19.8080, 34.8685] }, // [aprox.] junto ao Parque Desportivo da Maraza
  { nome: "Matacuane", center: [-19.8318, 34.8583] }, // [Google] sublocality
  { nome: "Munhava Central", center: [-19.8172, 34.8486] }, // [Google] ponto identificado como "Munhava central"
  { nome: "Nhaconjo", center: [-19.7688, 34.8690] }, // [aprox.] média de pontos de saúde/culto no bairro
  { nome: "Nharuchonga", center: [-19.7750, 34.8650] }, // [incerto] não localizado com fiabilidade
  { nome: "Ntopa", center: [-19.8000, 34.8700] }, // [incerto] não localizado com fiabilidade
  { nome: "Palmeiras", center: [-19.8441, 34.8610] }, // [Google] sublocality
  { nome: "Pioneiros", center: [-19.8260, 34.8480] }, // [aprox.] centro do cluster de empresas no bairro
  { nome: "Ponta-Gêa", center: [-19.8446, 34.8472] }, // [Google] sublocality
  { nome: "Baixa / Mercado", center: [-19.8295, 34.8385] }, // [aprox.] próximo de "Beira Baixa"
  { nome: "Vaz", center: [-19.7900, 34.8710] }, // [aprox.] centro do cluster de empresas no bairro
];

export const BAIRROS_BEIRA_NOMES: string[] = BAIRROS_BEIRA.map((b) => b.nome);

export function getBairroCenter(nome: string): [number, number] | undefined {
  return BAIRROS_BEIRA.find((b) => b.nome === nome)?.center;
}

/**
 * Encontra o bairro canónico da Beira mais próximo de um par de coordenadas (lat, lng).
 */
export function findClosestBairro(lat: number, lng: number): string {
  let closestName = "Outro";
  let minSquareDist = Infinity;

  for (const b of BAIRROS_BEIRA) {
    if (!b.center) continue;
    const dLat = lat - b.center[0];
    const dLng = lng - b.center[1];
    const distSq = dLat * dLat + dLng * dLng;
    if (distSq < minSquareDist) {
      minSquareDist = distSq;
      closestName = b.nome;
    }
  }

  return closestName;
}