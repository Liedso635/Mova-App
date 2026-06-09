import { PONTOS_DA_CIDADE, ARESTAS } from "@/components/Marcadores";
import * as THREE from "three";

const API_BASE = 'http://localhost:8080/api';

export interface ResultadoViagem {
  rotaIds: string[];
  distancia: number;
}

function calcularPeso(idA: string, idB: string): number {
  const a = PONTOS_DA_CIDADE.find(p => p.id === idA);
  const b = PONTOS_DA_CIDADE.find(p => p.id === idB);
  if (!a || !b) return 1;
  const [ax, , az] = a.posicao;
  const [bx, , bz] = b.posicao;
  return Math.sqrt((ax - bx) ** 2 + (az - bz) ** 2);
}

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