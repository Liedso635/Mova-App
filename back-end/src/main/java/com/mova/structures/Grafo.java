package com.mova.structures;


public class Grafo implements InterfaceGrafo {
    private ListaDuplamenteLigada vertices;  // lista de NoGrafo

    public Grafo() {
        vertices = new ListaDuplamenteLigada();
    }

    // ---------- Métodos auxiliares privados ----------
    private NoGrafo buscarNo(Object elemento) {
        for (int i = 0; i < vertices.size(); i++) {
            NoGrafo no = (NoGrafo) vertices.pega(i);
            if (no.getElemento().equals(elemento)) return no;
        }
        return null;
    }

    // ---------- Implementação da interface ----------
    @Override
    public void adicionarVertice(Object elemento) {
        if (!existeVertice(elemento)) {
            vertices.adicionar(new NoGrafo(elemento));
        }
    }

    @Override
    public void adicionaAresta(Object elem1, Object elem2, double peso) {
        NoGrafo no1 = buscarNo(elem1);
        NoGrafo no2 = buscarNo(elem2);
        if (no1 != null && no2 != null) {
            no1.adicionaVizinho(no2, peso);
            no2.adicionaVizinho(no1, peso);  // grafo não direcionado
        }
    }

    @Override
    public void removeVertice(Object elemento) {
        NoGrafo remover = buscarNo(elemento);
        if (remover == null) return;
        // Remove todas as arestas que apontam para este vértice
        for (int i = 0; i < vertices.size(); i++) {
            NoGrafo no = (NoGrafo) vertices.pega(i);
            ListaDuplamenteLigada viz = no.getVizinhos();
            for (int j = 0; j < viz.size(); j++) {
                NoGrafo.Aresta a = (NoGrafo.Aresta) viz.pega(j);
                if (a.getDestino().equals(remover)) {
                    viz.remover(a);
                    break;
                }
            }
        }
        vertices.remover(remover);
    }

    @Override
    public void removeAresta(Object elem1, Object elem2) {
        NoGrafo no1 = buscarNo(elem1);
        NoGrafo no2 = buscarNo(elem2);
        if (no1 == null || no2 == null) return;
        // Remove de no1 a aresta para no2
        ListaDuplamenteLigada viz1 = no1.getVizinhos();
        for (int i = 0; i < viz1.size(); i++) {
            NoGrafo.Aresta a = (NoGrafo.Aresta) viz1.pega(i);
            if (a.getDestino().equals(no2)) {
                viz1.remover(a);
                break;
            }
        }
        // Remove de no2 a aresta para no1
        ListaDuplamenteLigada viz2 = no2.getVizinhos();
        for (int i = 0; i < viz2.size(); i++) {
            NoGrafo.Aresta a = (NoGrafo.Aresta) viz2.pega(i);
            if (a.getDestino().equals(no1)) {
                viz2.remover(a);
                break;
            }
        }
    }

    @Override
    public boolean existeVertice(Object elemento) {
        return buscarNo(elemento) != null;
    }

    @Override
    public boolean existeAresta(Object elem1, Object elem2) {
        NoGrafo no1 = buscarNo(elem1);
        NoGrafo no2 = buscarNo(elem2);
        if (no1 == null || no2 == null) return false;
        ListaDuplamenteLigada viz = no1.getVizinhos();
        for (int i = 0; i < viz.size(); i++) {
            NoGrafo.Aresta a = (NoGrafo.Aresta) viz.pega(i);
            if (a.getDestino().equals(no2)) return true;
        }
        return false;
    }

    @Override
    public int getGrau(Object elemento) {
        NoGrafo no = buscarNo(elemento);
        return (no == null) ? -1 : no.getVizinhos().size();
    }

    @Override
    public ListaDuplamenteLigada getVertices() {
        ListaDuplamenteLigada listaElem = new ListaDuplamenteLigada();
        for (int i = 0; i < vertices.size(); i++) {
            NoGrafo no = (NoGrafo) vertices.pega(i);
            listaElem.adicionar(no.getElemento());
        }
        return listaElem;
    }

    @Override
    public ListaDuplamenteLigada getArestas() {
        ListaDuplamenteLigada arestas = new ListaDuplamenteLigada();
        for (int i = 0; i < vertices.size(); i++) {
            NoGrafo no = (NoGrafo) vertices.pega(i);
            for (int j = 0; j < no.getVizinhos().size(); j++) {
                NoGrafo.Aresta a = (NoGrafo.Aresta) no.getVizinhos().pega(j);
                // Evita duplicar (grafo não direcionado)
                if (no.getElemento().toString().compareTo(a.getDestino().getElemento().toString()) < 0) {
                    arestas.adicionar("(" + no.getElemento() + "," + a.getDestino().getElemento() + ")");
                }
            }
        }
        return arestas;
    }

    @Override
    public boolean estaConexo() {
        if (vertices.size() == 0) return true;
        Object primeiro = ((NoGrafo) vertices.pega(0)).getElemento();
        int alcancaveis = contarVerticesAlcancaveis(primeiro);
        return alcancaveis == vertices.size();
    }

    @Override
    public void imprimir() {
        for (int i = 0; i < vertices.size(); i++) {
            NoGrafo no = (NoGrafo) vertices.pega(i);
            System.out.print(no.getElemento() + ": ");
            for (int j = 0; j < no.getVizinhos().size(); j++) {
                NoGrafo.Aresta a = (NoGrafo.Aresta) no.getVizinhos().pega(j);
                System.out.print(a.getDestino().getElemento() + "(" + a.getPeso() + ") ");
            }
            System.out.println();
        }
    }

    // ---------- BFS (busca em largura) ----------
    public void bfs(Object inicio) {
        NoGrafo noInicio = buscarNo(inicio);
        if (noInicio == null) return;

        // Reset visitados
        for (int i = 0; i < vertices.size(); i++) {
            ((NoGrafo) vertices.pega(i)).setVisitado(false);
        }

        Fila fila = new Fila();
        noInicio.setVisitado(true);
        fila.enqueue(noInicio);

        while (!fila.isEmpty()) {
            NoGrafo atual = (NoGrafo) fila.dequeue();
            System.out.print(atual.getElemento() + " ");

            for (int i = 0; i < atual.getVizinhos().tamanho(); i++) {
                NoGrafo.Aresta a = (NoGrafo.Aresta) atual.getVizinhos().pega(i);
                NoGrafo viz = a.getDestino();
                if (!viz.isVisitado()) {
                    viz.setVisitado(true);
                    fila.enqueue(viz);
                }
            }
        }
        System.out.println();
    }

    // ---------- DFS (busca em profundidade) usando pilha ----------
    public void dfs(Object inicio) {
        NoGrafo noInicio = buscarNo(inicio);
        if (noInicio == null) return;

        for (int i = 0; i < vertices.size(); i++) {
            ((NoGrafo) vertices.pega(i)).setVisitado(false);
        }

        Pilha pilha = new Pilha();
        pilha.push(noInicio);

        while (!pilha.isEmpty()) {
            NoGrafo atual = (NoGrafo) pilha.pop();
            if (!atual.isVisitado()) {
                atual.setVisitado(true);
                System.out.print(atual.getElemento() + " ");
                // Empilha vizinhos (ordem inversa para manter ordem do material)
                for (int i = atual.getVizinhos().size() - 1; i >= 0; i--) {
                    NoGrafo.Aresta a = (NoGrafo.Aresta) atual.getVizinhos().pega(i);
                    NoGrafo viz = a.getDestino();
                    if (!viz.isVisitado()) {
                        pilha.push(viz);
                    }
                }
            }
        }
        System.out.println();
    }

    // ---------- Existe caminho entre origem e destino (usa BFS) ----------
    public boolean existeCaminho(Object origem, Object destino) {
        NoGrafo noOrigem = buscarNo(origem);
        NoGrafo noDestino = buscarNo(destino);
        if (noOrigem == null || noDestino == null) return false;

        for (int i = 0; i < vertices.size(); i++) {
            ((NoGrafo) vertices.pega(i)).setVisitado(false);
        }

        Fila fila = new Fila();
        noOrigem.setVisitado(true);
        fila.enqueue(noOrigem);

        while (!fila.isEmpty()) {
            NoGrafo atual = (NoGrafo) fila.dequeue();
            if (atual == noDestino) return true;
            for (int i = 0; i < atual.getVizinhos().size(); i++) {
                NoGrafo.Aresta a = (NoGrafo.Aresta) atual.getVizinhos().pega(i);
                NoGrafo viz = a.getDestino();
                if (!viz.isVisitado()) {
                    viz.setVisitado(true);
                    fila.enqueue(viz);
                }
            }
        }
        return false;
    }

    // ---------- Conta vértices alcançáveis a partir de um vértice ----------
    public int contarVerticesAlcancaveis(Object inicio) {
        NoGrafo noInicio = buscarNo(inicio);
        if (noInicio == null) return 0;

        for (int i = 0; i < vertices.size(); i++) {
            ((NoGrafo) vertices.pega(i)).setVisitado(false);
        }

        Fila fila = new Fila();
        noInicio.setVisitado(true);
        fila.enqueue(noInicio);
        int contador = 1;

        while (!fila.isEmpty()) {
            NoGrafo atual = (NoGrafo) fila.dequeue();
            for (int i = 0; i < atual.getVizinhos().size(); i++) {
                NoGrafo.Aresta a = (NoGrafo.Aresta) atual.getVizinhos().pega(i);
                NoGrafo viz = a.getDestino();
                if (!viz.isVisitado()) {
                    viz.setVisitado(true);
                    fila.enqueue(viz);
                    contador++;
                }
            }
        }
        return contador;
    }

    // ---------- DIJKSTRA (caminho mínimo com pesos) ----------
    public ListaDuplamenteLigada dijkstra(Object origemId, Object destinoId) {
        NoGrafo origem = buscarNo(origemId);
        NoGrafo destino = buscarNo(destinoId);
        if (origem == null || destino == null) return new ListaDuplamenteLigada();

        int n = vertices.size();
        double[] dist = new double[n];
        int[] prev = new int[n];
        boolean[] processado = new boolean[n];
        for (int i = 0; i < n; i++) dist[i] = Double.POSITIVE_INFINITY;
        int idxOrigem = indiceDoNo(origem);
        int idxDestino = indiceDoNo(destino);
        dist[idxOrigem] = 0;

        MinHeap heap = new MinHeap(n);
        heap.inserir(idxOrigem, 0);

        while (!heap.isEmpty()) {
            int u = heap.extrairMin();
            if (processado[u]) continue;
            processado[u] = true;
            if (u == idxDestino) break;

            NoGrafo noU = (NoGrafo) vertices.pega(u);
            for (int i = 0; i < noU.getVizinhos().size(); i++) {
                NoGrafo.Aresta a = (NoGrafo.Aresta) noU.getVizinhos().pega(i);
                int v = indiceDoNo(a.getDestino());
                if (!processado[v]) {
                    double novaDist = dist[u] + a.getPeso();
                    if (novaDist < dist[v]) {
                        dist[v] = novaDist;
                        prev[v] = u;
                        heap.inserir(v, novaDist);
                    }
                }
            }
        }

        // Reconstrói caminho
        ListaDuplamenteLigada caminho = new ListaDuplamenteLigada();
        if (dist[idxDestino] == Double.POSITIVE_INFINITY) return caminho;
        int atual = idxDestino;
        while (atual != idxOrigem) {
            caminho.adicionarInicio(((NoGrafo) vertices.pega(atual)).getElemento());
            atual = prev[atual];
        }
        caminho.adicionarInicio(origemId);
        return caminho;
    }

    private int indiceDoNo(NoGrafo no) {
        for (int i = 0; i < vertices.size(); i++) {
            if (vertices.pega(i) == no) return i;
        }
        return -1;
    }
}