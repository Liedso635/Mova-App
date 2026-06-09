package com.mova.model;

import java.util.List;

public class SolicitacaoViagem {
    private String origemId;
    private String destinoId;
    private List<PontoPayload> pontos;
    private List<ArestaPayload> arestas;

    public String getOrigemId() { return origemId; }
    public void setOrigemId(String id) { origemId = id; }
    public String getDestinoId() { return destinoId; }
    public void setDestinoId(String id) { destinoId = id; }
    public List<PontoPayload> getPontos() { return pontos; }
    public void setPontos(List<PontoPayload> pontos) { this.pontos = pontos; }
    public List<ArestaPayload> getArestas() { return arestas; }
    public void setArestas(List<ArestaPayload> arestas) { this.arestas = arestas; }

    public static class PontoPayload {
        private String id;
        private double x, y, z;
        public String getId() { return id; }
        public double getX() { return x; }
        public double getY() { return y; }
        public double getZ() { return z; }
    }

    public static class ArestaPayload {
        private String de;
        private String para;
        private double peso;
        public String getDe() { return de; }
        public String getPara() { return para; }
        public double getPeso() { return peso; }
    }
}