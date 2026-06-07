package com.mova.structures;

public class NoGrafo {
    private Object elemento;
    private boolean visitado;
    private ListaDuplamenteLigada vizinhos;

    public NoGrafo(Object elemento) {
        this.elemento = elemento;
        this.visitado = false;
        this.vizinhos = new ListaDuplamenteLigada();
    }

    public Object getElemento() { return elemento; }
    public boolean isVisitado() { return visitado; }
    public void setVisitado(boolean visitado) { this.visitado = visitado; }
    public ListaDuplamenteLigada getVizinhos() { return vizinhos; }

    public void adicionaVizinho(NoGrafo no, double peso) {
        for (int i = 0; i < vizinhos.tamanho(); i++) {
            Aresta a = (Aresta) vizinhos.pega(i);
            if (a.getDestino().equals(no)) return;
        }
        vizinhos.adicionar(new Aresta(no, peso));
    }

    @Override
    public String toString() { return elemento.toString(); }

    public static class Aresta {
        private NoGrafo destino;
        private double peso;
        public Aresta(NoGrafo destino, double peso) { this.destino = destino; this.peso = peso; }
        public NoGrafo getDestino() { return destino; }
        public double getPeso() { return peso; }
    }
}