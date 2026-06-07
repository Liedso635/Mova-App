package com.mova.structures;
public class NoGrafo {
    private Object elemento;
    private boolean visitado;
    private ListaDuplamenteLigada vizinhos;  // lista de Aresta (para permitir pesos)

    public NoGrafo(Object elemento) {
        this.elemento = elemento;
        this.visitado = false;
        this.vizinhos = new ListaDuplamenteLigada();
    }

    public Object getElemento() {
        return elemento;
    }

    public ListaDuplamenteLigada getVizinhos() {
        return vizinhos;
    }

    public boolean isVisitado() {
        return visitado;
    }

    public void setVisitado(boolean visitado) {
        this.visitado = visitado;
    }

    public void adicionaVizinho(NoGrafo no, double peso) {
        // Verifica se já existe aresta para evitar duplicatas
        for (int i = 0; i < vizinhos.size(); i++) {
            Aresta a = (Aresta) vizinhos.pega(i);
            if (a.getDestino().equals(no)) {
                return; // já existe
            }
        }
        vizinhos.adicionar(new Aresta(no, peso));
    }

    @Override
    public String toString() {
        return elemento.toString();
    }

    // Classe interna para representar aresta com peso
    public static class Aresta {
        private NoGrafo destino;
        private double peso;

        public Aresta(NoGrafo destino, double peso) {
            this.destino = destino;
            this.peso = peso;
        }

        public NoGrafo getDestino() { return destino; }
        public double getPeso() { return peso; }
    }
}