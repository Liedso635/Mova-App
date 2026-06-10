package com.mova.service;

import com.mova.structures.*;
import com.mova.model.*;

public class ViagemService {
    private Grafo grafo;
    private AVL arvoreViagens;
    private DicionarioPontos dicionarioPontos;
    private DicionarioPontos dicionarioViagens;
    private int nextId;

    public ViagemService() {
        grafo = new Grafo();
        arvoreViagens = new AVL();
        dicionarioPontos = new DicionarioPontos();
        dicionarioViagens = new DicionarioPontos();
        nextId = 1;
        carregarMapa();
        construirGrafoAutomatico();   // método automático que cria cadeia contínua
    }

    public ResultadoViagem solicitarViagem(String origemId, String destinoId) {
        ListaDuplamenteLigada rotaIds = grafo.dijkstra(origemId, destinoId);
        if (rotaIds.size() == 0) {
            ResultadoViagem res = new ResultadoViagem();
            res.rotaIds = new ListaDuplamenteLigada();
            res.distancia = -1;
            return res;
        }
        double distancia = calcularDistancia(rotaIds);
        Viagem viagem = new Viagem(nextId++, origemId, destinoId);
        viagem.setRotaIds(rotaIds);
        viagem.setDistancia(distancia);
        arvoreViagens.inserir(viagem.getId());
        dicionarioViagens.adicionar(String.valueOf(viagem.getId()), viagem);
        ResultadoViagem res = new ResultadoViagem();
        res.rotaIds = rotaIds;
        res.distancia = distancia;
        return res;
    }

    private double calcularDistancia(ListaDuplamenteLigada rotaIds) {
        double total = 0;
        for (int i = 0; i < rotaIds.size() - 1; i++) {
            String id1 = (String) rotaIds.pega(i);
            String id2 = (String) rotaIds.pega(i + 1);
            Ponto p1 = (Ponto) dicionarioPontos.buscar(id1);
            Ponto p2 = (Ponto) dicionarioPontos.buscar(id2);
            if (p1 != null && p2 != null) {
                double dx = p2.getX() - p1.getX();
                double dz = p2.getZ() - p1.getZ();
                total += Math.sqrt(dx * dx + dz * dz);
            }
        }
        return total;
    }

    // --------------------------------------------------------------
    // 1. Adicionar todos os pontos (POIs + waypoints)
    // --------------------------------------------------------------
    private void carregarMapa() {
        // POIs
        adicionarPonto("fonte", -22.46, 1.5, -44.97, "Fonte de Água");
        adicionarPonto("p1", -27.11, 3.5, -41.26, "Hotel Central");
        adicionarPonto("p2", -31.45, 3.5, -45.89, "Restaurante Baixa");
        adicionarPonto("p3", -26.63, 3.5, -52.17, "Mercado Municipal");
        adicionarPonto("p4", -45.40, 4.0, -45.71, "Hospital Mova");
        adicionarPonto("p5", -30.07, 3.5, -37.23, "Café Costa");

        // Waypoints (todos)
        adicionarPonto("w1", -24.98, 0.41, -45.02, "");
        adicionarPonto("w2", -27.54, 0.41, -47.50, "");
        adicionarPonto("w3", -28.76, 0.41, -46.31, "");
        adicionarPonto("w4", -26.31, 0.41, -43.77, "");
        adicionarPonto("w5", -25.02, 0.41, -49.87, "");
        adicionarPonto("w6", -22.52, 0.41, -47.52, "");
        adicionarPonto("w7", -23.42, 0.41, -45.07, "");
        adicionarPonto("w8", -23.71, 0.41, -43.84, "");
        adicionarPonto("w9", -25.10, 0.41, -42.39, "");
        adicionarPonto("w10", -26.28, 0.41, -41.17, "");
        adicionarPonto("w11", -27.52, 0.41, -42.65, "");
        adicionarPonto("w12", -22.48, 0.41, -52.58, "");
        adicionarPonto("w13", -23.85, 0.41, -53.82, "");
        adicionarPonto("w14", -26.25, 0.41, -51.14, "");
        adicionarPonto("w15", -28.72, 0.41, -48.74, "");
        adicionarPonto("w16", -29.82, 0.41, -47.46, "");
        adicionarPonto("w17", -28.64, 0.41, -46.28, "");
        adicionarPonto("w18", -30.05, 0.41, -44.88, "");
        adicionarPonto("w19", -31.10, 0.41, -45.98, "");
        adicionarPonto("w20", -27.48, 0.41, -39.93, "");
        adicionarPonto("w21", -27.32, 0.41, -38.01, "");
        adicionarPonto("w22", -25.04, 0.41, -39.98, "");
        adicionarPonto("w23", -27.50, 0.41, -35.88, "");
        adicionarPonto("w24", -24.19, 0.41, -41.26, "");
        adicionarPonto("w25", -29.74, 0.41, -37.23, "");
        adicionarPonto("w26", -28.80, 0.41, -41.33, "");
        adicionarPonto("w27", -30.26, 0.41, -42.57, "");
        adicionarPonto("w28", -34.22, 0.41, -42.25, "");
        adicionarPonto("w29", -32.61, 0.41, -39.95, "");
        adicionarPonto("w30", -34.18, 0.41, -37.58, "");
        adicionarPonto("w31", -31.30, 0.41, -37.45, "");
    }

    private void adicionarPonto(String id, double x, double y, double z, String nome) {
        Ponto p = new Ponto(id, x, y, z, nome);
        dicionarioPontos.adicionar(id, p);
        grafo.adicionarVertice(id);
    }

    // --------------------------------------------------------------
    // 2. Construção automática do grafo (cadeia do vizinho mais próximo)
    // --------------------------------------------------------------
    private void construirGrafoAutomatico() {
        // Lista de todos os IDs
        String[] todosIds = {
            "fonte", "p1", "p2", "p3", "p4", "p5",
            "w1","w2","w3","w4","w5","w6","w7","w8","w9","w10","w11","w12","w13","w14","w15","w16","w17","w18","w19",
            "w20","w21","w22","w23","w24","w25","w26","w27","w28","w29","w30","w31"
        };
        
        int n = todosIds.length;
        boolean[] visitado = new boolean[n];
        String[] ordem = new String[n];
        
        // Escolhe um ponto inicial (pode ser o primeiro da lista, não importa)
        ordem[0] = todosIds[0];
        visitado[0] = true;
        
        for (int i = 1; i < n; i++) {
            String ultimo = ordem[i-1];
            double menorDist = Double.MAX_VALUE;
            int idxMenor = -1;
            for (int j = 0; j < n; j++) {
                if (!visitado[j]) {
                    double d = distanciaEntre(ultimo, todosIds[j]);
                    if (d < menorDist) {
                        menorDist = d;
                        idxMenor = j;
                    }
                }
            }
            if (idxMenor != -1) {
                ordem[i] = todosIds[idxMenor];
                visitado[idxMenor] = true;
            }
        }
        
        // Conecta cada ponto ao seu sucessor na ordem (cria a cadeia)
        for (int i = 0; i < n - 1; i++) {
            String a = ordem[i];
            String b = ordem[i+1];
            double d = distanciaEntre(a, b);
            if (d > 0) {
                grafo.adicionaAresta(a, b, d);
            }
        }
    }

    private double distanciaEntre(String id1, String id2) {
        Ponto a = (Ponto) dicionarioPontos.buscar(id1);
        Ponto b = (Ponto) dicionarioPontos.buscar(id2);
        if (a == null || b == null) return -1;
        double dx = a.getX() - b.getX();
        double dz = a.getZ() - b.getZ();
        return Math.sqrt(dx * dx + dz * dz);
    }

    public static class ResultadoViagem {
        public ListaDuplamenteLigada rotaIds;
        public double distancia;
    }
}