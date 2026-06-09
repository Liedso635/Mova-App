package com.mova.service;

import java.util.List;

import com.mova.model.Ponto;
import com.mova.model.SolicitacaoViagem.ArestaPayload;
import com.mova.model.SolicitacaoViagem.PontoPayload;
import com.mova.model.Viagem;
import com.mova.structures.AVL;
import com.mova.structures.DicionarioPontos;
import com.mova.structures.Grafo;
import com.mova.structures.ListaDuplamenteLigada;

public class ViagemService {
    private AVL arvoreViagens;
    private DicionarioPontos dicionarioViagens;
    private int nextId;

    public ViagemService() {
        arvoreViagens = new AVL();
        dicionarioViagens = new DicionarioPontos();
        nextId = 1;
    }

    public ResultadoViagem solicitarViagem(
            String origemId,
            String destinoId,
            List<PontoPayload> pontosPayload,
            List<ArestaPayload> arestasPayload) {

        // Constrói o grafo e o dicionário de pontos a partir do que o front enviou
        Grafo grafo = new Grafo();
        DicionarioPontos dicionarioPontos = new DicionarioPontos();

        for (PontoPayload p : pontosPayload) {
            Ponto ponto = new Ponto(p.getId(), p.getX(), p.getY(), p.getZ(), "");
            dicionarioPontos.adicionar(p.getId(), ponto);
            grafo.adicionarVertice(p.getId());
        }

        for (ArestaPayload a : arestasPayload) {
            grafo.adicionaAresta(a.getDe(), a.getPara(), a.getPeso());
        }

        // Calcula a rota
        ListaDuplamenteLigada rotaIds = grafo.dijkstra(origemId, destinoId);
        if (rotaIds.size() == 0) {
            ResultadoViagem res = new ResultadoViagem();
            res.rotaIds = new ListaDuplamenteLigada();
            res.distancia = -1;
            return res;
        }

        double distancia = calcularDistancia(rotaIds, dicionarioPontos);

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

    private double calcularDistancia(ListaDuplamenteLigada rotaIds, DicionarioPontos dicionarioPontos) {
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

    public static class ResultadoViagem {
        public ListaDuplamenteLigada rotaIds;
        public double distancia;
    }
}