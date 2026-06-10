import { PONTOS_DA_CIDADE, ARESTAS } from "@/components/Marcadores";

const API_BASE = 'http://localhost:8080/api';

export interface ResultadoViagem {
  rotaIds: string[];
  distancia: number;
}

export interface ResultadoDuasRotas {
  rotaPrincipal: string[];
  rotaAlternativa: string[];
  distanciaPrincipal: number;
  distanciaAlternativa: number;
}

export interface ResultadoMudancaCaminho {
  novaRota: string[];
  noTrocaId: string | null;
  arestaMudanca: [string, string] | null;
}

// ── Grafo local ──────────────────────────────────────────────────────────────

function calcularPeso(idA: string, idB: string): number {
  const a = PONTOS_DA_CIDADE.find(p => p.id === idA);
  const b = PONTOS_DA_CIDADE.find(p => p.id === idB);
  if (!a || !b) return 1;
  const [ax, , az] = a.posicao;
  const [bx, , bz] = b.posicao;
  return Math.sqrt((ax - bx) ** 2 + (az - bz) ** 2);
}

type Grafo = Map<string, Array<{ vizinho: string; peso: number }>>;

function construirGrafo(arestasIgnoradas: Set<string> = new Set()): Grafo {
  const grafo: Grafo = new Map();
  for (const p of PONTOS_DA_CIDADE) grafo.set(p.id, []);

  for (const [de, para] of ARESTAS) {
    const chaveAB = `${de}->${para}`;
    const chaveBA = `${para}->${de}`;
    const peso = calcularPeso(de, para);

    if (!arestasIgnoradas.has(chaveAB)) {
      grafo.get(de)?.push({ vizinho: para, peso });
    }
    if (!arestasIgnoradas.has(chaveBA)) {
      grafo.get(para)?.push({ vizinho: de, peso });
    }
  }
  return grafo;
}

function dijkstra(
  grafo: Grafo,
  origem: string,
  destino: string,
  nosIgnorados: Set<string> = new Set()
): { caminho: string[]; distancia: number } | null {
  const dist = new Map<string, number>();
  const prev = new Map<string, string | null>();
  const visitados = new Set<string>();

  for (const id of grafo.keys()) {
    dist.set(id, Infinity);
    prev.set(id, null);
  }
  dist.set(origem, 0);

  const fila: Array<{ id: string; custo: number }> = [{ id: origem, custo: 0 }];

  while (fila.length > 0) {
    fila.sort((a, b) => a.custo - b.custo);
    const { id: u } = fila.shift()!;

    if (visitados.has(u) || nosIgnorados.has(u)) continue;
    visitados.add(u);

    if (u === destino) break;

    for (const { vizinho, peso } of grafo.get(u) ?? []) {
      if (visitados.has(vizinho) || nosIgnorados.has(vizinho)) continue;
      const novaDist = (dist.get(u) ?? Infinity) + peso;
      if (novaDist < (dist.get(vizinho) ?? Infinity)) {
        dist.set(vizinho, novaDist);
        prev.set(vizinho, u);
        fila.push({ id: vizinho, custo: novaDist });
      }
    }
  }

  if ((dist.get(destino) ?? Infinity) === Infinity) return null;

  const caminho: string[] = [];
  let atual: string | null = destino;
  while (atual !== null) {
    caminho.unshift(atual);
    atual = prev.get(atual) ?? null;
  }

  return { caminho, distancia: dist.get(destino) ?? Infinity };
}

/**
 * Calcula rota principal (Dijkstra) e uma rota alternativa.
 */
export function calcularDuasRotas(
  origemId: string,
  destinoId: string
): ResultadoDuasRotas {
  const grafo = construirGrafo();
  const principal = dijkstra(grafo, origemId, destinoId);
  if (!principal) {
    return { rotaPrincipal: [], rotaAlternativa: [], distanciaPrincipal: 0, distanciaAlternativa: 0 };
  }

  const nosIntermedios = new Set(principal.caminho.slice(1, -1));
  let melhorAlternativa: { caminho: string[]; distancia: number } | null = null;

  if (nosIntermedios.size > 0) {
    const arr = Array.from(nosIntermedios);
    const metade = Math.max(1, Math.ceil(arr.length / 2));
    const nosParaRemover = new Set(
      arr.slice(
        Math.floor(arr.length / 2) - Math.floor(metade / 2),
        Math.floor(arr.length / 2) + Math.ceil(metade / 2)
      )
    );
    const resultado = dijkstra(grafo, origemId, destinoId, nosParaRemover);
    if (resultado && resultado.caminho.join() !== principal.caminho.join()) {
      melhorAlternativa = resultado;
    }
  }

  if (!melhorAlternativa) {
    const arestasParaRemover = new Set<string>();
    for (let i = 0; i < principal.caminho.length - 1; i++) {
      const a = principal.caminho[i];
      const b = principal.caminho[i + 1];
      arestasParaRemover.add(`${a}->${b}`);
      arestasParaRemover.add(`${b}->${a}`);
    }
    const grafoAlt = construirGrafo(arestasParaRemover);
    const resultado = dijkstra(grafoAlt, origemId, destinoId);
    if (resultado) melhorAlternativa = resultado;
  }

  return {
    rotaPrincipal: principal.caminho,
    rotaAlternativa: melhorAlternativa?.caminho ?? [],
    distanciaPrincipal: principal.distancia,
    distanciaAlternativa: melhorAlternativa?.distancia ?? 0,
  };
}

/**
 * Dado a posição actual do carro, calcula a ligação sem teleporte entre
 * a rota actual (principal) e a rota de destino (alternativa ou vice-versa).
 *
 * Assinatura:
 *   posicaoAtual      – posição 3D actual do carro
 *   rotaPrincipalAtual – IDs da rota que o carro está a seguir agora
 *   rotaAlternativa    – IDs da rota para onde se quer mudar
 *
 * Retorna:
 *   novaRota       – caminho completo: ligação + resto da rota destino
 *   pontoJuncaoId  – nó onde as duas rotas se encontram (círculos amarelos)
 */
/**
 * Dado a posição atual do carro, calcula a ligação sem teleporte entre
 * a rota atual (principal) e a rota de destino (alternativa ou vice-versa).
 * Garante comportamento real de GPS (carro continua em frente até a próxima interseção).
 */
export function calcularMudancaDeCaminho(
  posicaoAtual: [number, number, number],
  rotaPrincipalAtual: string[],
  rotaAlternativa: string[]
): ResultadoMudancaCaminho {

  if (rotaAlternativa.length === 0) {
    return {
      novaRota: [],
      noTrocaId: null,
      arestaMudanca: null,
    };
  }

  if (rotaPrincipalAtual.length < 2) {
    return {
      novaRota: rotaAlternativa,
      noTrocaId: rotaAlternativa[0] ?? null,
      arestaMudanca: null,
    };
  }

  let indiceSegmento = 0;
  let menorDistanciaAoSegmento = Infinity;

  for (let i = 0; i < rotaPrincipalAtual.length - 1; i++) {

    const a = PONTOS_DA_CIDADE.find(
      p => p.id === rotaPrincipalAtual[i]
    );

    const b = PONTOS_DA_CIDADE.find(
      p => p.id === rotaPrincipalAtual[i + 1]
    );

    if (!a || !b) continue;

    const ax = a.posicao[0];
    const az = a.posicao[2];

    const bx = b.posicao[0];
    const bz = b.posicao[2];

    const px = posicaoAtual[0];
    const pz = posicaoAtual[2];

    const abx = bx - ax;
    const abz = bz - az;

    const apx = px - ax;
    const apz = pz - az;

    const lenSq = abx * abx + abz * abz;

    let t =
      lenSq === 0
        ? 0
        : (apx * abx + apz * abz) / lenSq;

    t = Math.max(0, Math.min(1, t));

    const projx = ax + abx * t;
    const projz = az + abz * t;

    const dx = px - projx;
    const dz = pz - projz;

    const distSq = dx * dx + dz * dz;

    if (distSq < menorDistanciaAoSegmento) {
      menorDistanciaAoSegmento = distSq;
      indiceSegmento = i;
    }
  }

  const proximoIndice = Math.min(
    indiceSegmento + 1,
    rotaPrincipalAtual.length - 1
  );

  const noTroca = rotaPrincipalAtual[proximoIndice];
  const noAtual = rotaPrincipalAtual[indiceSegmento]; // Nó onde o carro está AGORA

  const grafo = construirGrafo();

  let melhorNoAlternativo: string | null = null;
  let melhorDistancia = Infinity;
  let melhorLigacao: string[] | null = null;

  for (const noAlt of rotaAlternativa) {

    const resultado = dijkstra(
      grafo,
      noTroca,
      noAlt
    );

    if (!resultado) continue;

    if (resultado.distancia < melhorDistancia) {
      melhorDistancia = resultado.distancia;
      melhorNoAlternativo = noAlt;
      melhorLigacao = resultado.caminho;
    }
  }

  if (
    !melhorLigacao ||
    !melhorNoAlternativo
  ) {
    return {
      novaRota: rotaAlternativa,
      noTrocaId: noTroca,
      arestaMudanca: null,
    };
  }

  const idxEntrada =
    rotaAlternativa.indexOf(
      melhorNoAlternativo
    );

  const restoAlternativa =
    idxEntrada >= 0
      ? rotaAlternativa.slice(idxEntrada + 1)
      : [];

  const novaRota = [
    noAtual,           // Adicionar o nó onde o carro está AGORA
    ...melhorLigacao,
    ...restoAlternativa,
  ];

  let arestaMudanca: [string, string] | null = null;

  if (melhorLigacao.length >= 2) {

    arestaMudanca = [
      melhorLigacao[0],
      melhorLigacao[1],
    ];
  }

  return {
    novaRota,
    noTrocaId: noTroca,
    arestaMudanca,
  };
}

// ── API remota (mantida para compatibilidade) ─────────────────────────────────

export async function solicitarViagem(origemId: string, destinoId: string): Promise<ResultadoViagem> {
  const pontos = PONTOS_DA_CIDADE.map(p => ({
    id: p.id,
    x: p.posicao[0],
    y: p.posicao[1],
    z: p.posicao[2],
  }));

  const arestas = ARESTAS.map(([de, para]) => ({
    de,
    para,
    peso: calcularPeso(de, para),
  }));

  const res = await fetch(`${API_BASE}/viagens/solicitar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ origemId, destinoId, pontos, arestas }),
  });
  if (!res.ok) throw new Error('Erro ao solicitar viagem');
  return res.json();
}

export async function listarMotoristas() {
  const res = await fetch(`${API_BASE}/motoristas`);
  return res.json();
}

export async function cadastrarMotorista(motorista: any) {
  const res = await fetch(`${API_BASE}/motoristas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(motorista),
  });
  return res.json();
}