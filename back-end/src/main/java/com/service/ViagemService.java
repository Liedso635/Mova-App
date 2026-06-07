package com.mova.service;

import com.mova.structures.*;
import com.mova.model.*;

public class ViagemService {
    private Grafo grafo;
    private AVL arvoreViagens;
    private DicionarioPontos dicionarioPontos;
    private int nextId;

    public ViagemService() {
        grafo = new Grafo();
        arvoreViagens = new AVL();
        dicionarioPontos = new DicionarioPontos();
        nextId = 1;
        carregarMapa(); // popular grafo e pontos a partir de ficheiro
    }

    public ResultadoViagem solicitarViagem(String origemId, String destinoId) {
        ListaDuplamenteLigada rotaIds = grafo.dijkstra(origemId, destinoId);
        double distancia = calcularDistancia(rotaIds);
        Viagem viagem = new Viagem(nextId++, origemId, destinoId);
        viagem.setRotaIds(rotaIds);
        viagem.setDistancia(distancia);
        arvoreViagens.inserir(viagem.getId());
        ResultadoViagem res = new ResultadoViagem();
        res.rotaIds = rotaIds;
        res.distancia = distancia;
        return res;
    }

    private double calcularDistancia(ListaDuplamenteLigada rotaIds) {
        double total = 0;
        for (int i = 0; i < rotaIds.size() - 1; i++) {
            String id1 = (String) rotaIds.pega(i);
            String id2 = (String) rotaIds.pega(i+1);
            Ponto p1 = (Ponto) dicionarioPontos.buscar(id1);
            Ponto p2 = (Ponto) dicionarioPontos.buscar(id2);
            if (p1 != null && p2 != null) {
                double dx = p2.getX() - p1.getX();
                double dz = p2.getZ() - p1.getZ();
                total += Math.sqrt(dx*dx + dz*dz);
            }
        }
        return total;
    }

    private void carregarMapa() {
        // Exemplo manual (depois pode ler de JSON)
        adicionarPonto("fonte", -22.46, 1.5, -44.97, "Fonte");
        adicionarPonto("w1", -24.98, 0.41, -45.02, "");
        adicionarPonto("p1", -27.11, 3.5, -41.26, "Hotel Central");
        grafo.adicionarAresta("fonte", "w1", 2.5);
        grafo.adicionarAresta("w1", "p1", 3.2);
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