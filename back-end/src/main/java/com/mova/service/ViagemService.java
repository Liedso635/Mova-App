package com.mova.service;

import com.mova.structures.*;
import com.mova.model.*;

public class ViagemService {
    private Grafo grafo;
    private AVL arvoreViagens;
    private DicionarioPontos dicionarioPontos;   // id do ponto → Ponto
    private DicionarioPontos dicionarioViagens;  // id da viagem → Viagem (para histórico)
    private int nextId;

    public ViagemService() {
        grafo = new Grafo();
        arvoreViagens = new AVL();
        dicionarioPontos = new DicionarioPontos();
        dicionarioViagens = new DicionarioPontos();
        nextId = 1;
        carregarMapa();
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

        //Inserir ID na AVL (requisito)
       arvoreViagens.inserir(viagem.getId());


        // Guardar viagem completa no dicionário (estrutura complementar)
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

    private void carregarMapa() {
        // Pontos principais (os mesmos do front‑end)
        adicionarPonto("fonte", -22.46, 1.5, -44.97, "Fonte de Água");
        adicionarPonto("w1", -24.98, 0.41, -45.02, "");
        adicionarPonto("p1", -27.11, 3.5, -41.26, "Hotel Central");
        adicionarPonto("p2", -31.45, 3.5, -45.89, "Restaurante Baixa");
        adicionarPonto("p3", -26.63, 3.5, -52.17, "Mercado Municipal");
        adicionarPonto("p4", -45.40, 4.0, -45.71, "Hospital Mova");
        adicionarPonto("p5", -30.07, 3.5, -37.23, "Café Costa");
        // Waypoints (apenas alguns para demonstração)
        adicionarPonto("w2", -27.54, 0.41, -47.50, "");
        adicionarPonto("w3", -28.76, 0.41, -46.31, "");
        // Arestas (ligações entre pontos)
        grafo.adicionaAresta("fonte", "w1", 2.5);
        grafo.adicionaAresta("w1", "p1", 3.2);
        grafo.adicionaAresta("p1", "w2", 2.8);
        grafo.adicionaAresta("w2", "p2", 3.0);
        grafo.adicionaAresta("p1", "w3", 1.5);
        grafo.adicionaAresta("w3", "p3", 4.1);
        // Adicione mais arestas conforme necessário
    }

    private void adicionarPonto(String id, double x, double y, double z, String nome) {
        Ponto p = new Ponto(id, x, y, z, nome);
        dicionarioPontos.adicionar(id, p);
        grafo.adicionarVertice(id);
    }

    public static class ResultadoViagem {
        public ListaDuplamenteLigada rotaIds;
        public double distancia;
    }
}