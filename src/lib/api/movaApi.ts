const API_BASE = 'http://localhost:8080/api';

export interface ResultadoViagem {
  rotaIds: string[];
  distancia: number;
}

export async function solicitarViagem(origemId: string, destinoId: string): Promise<ResultadoViagem> {
  const res = await fetch(`${API_BASE}/viagens/solicitar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ origemId, destinoId })
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
    body: JSON.stringify(motorista)
  });
  return res.json();
}