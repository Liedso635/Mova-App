package com.mova.structures;

public class ListaDuplamenteLigada {
    private NoLista primeiro;
    private NoLista ultimo;
    private int tamanho;

    public ListaDuplamenteLigada() {
        primeiro = null;
        ultimo = null;
        tamanho = 0;
    }

    public void adicionar(Object elemento) {   // alias para adicionaFim
        adicionaFim(elemento);
    }

    public void adicionaInicio(Object elemento) {
        NoLista novo = new NoLista(null, elemento, primeiro);
        if (primeiro != null) primeiro.setAnterior(novo);
        primeiro = novo;
        if (ultimo == null) ultimo = novo;
        tamanho++;
    }

    public void adicionaFim(Object elemento) {
        NoLista novo = new NoLista(ultimo, elemento, null);
        if (ultimo != null) ultimo.setProximo(novo);
        ultimo = novo;
        if (primeiro == null) primeiro = novo;
        tamanho++;
    }

    public void adicionaPosicao(int posicao, Object elemento) {
        if (posicao < 0 || posicao > tamanho) throw new IndexOutOfBoundsException();
        if (posicao == 0) { adicionaInicio(elemento); return; }
        if (posicao == tamanho) { adicionaFim(elemento); return; }
        NoLista atual = primeiro;
        for (int i = 0; i < posicao; i++) atual = atual.getProximo();
        NoLista anterior = atual.getAnterior();
        NoLista novo = new NoLista(anterior, elemento, atual);
        anterior.setProximo(novo);
        atual.setAnterior(novo);
        tamanho++;
    }

    public Object pega(int posicao) {
        if (posicao < 0 || posicao >= tamanho) throw new IndexOutOfBoundsException();
        NoLista atual = primeiro;
        for (int i = 0; i < posicao; i++) atual = atual.getProximo();
        return atual.getElemento();
    }

    public void removeInicio() {
        if (primeiro == null) throw new IllegalStateException("Lista vazia");
        if (primeiro == ultimo) {
            primeiro = null;
            ultimo = null;
        } else {
            primeiro = primeiro.getProximo();
            primeiro.setAnterior(null);
        }
        tamanho--;
    }

    public void removeFim() {
        if (ultimo == null) throw new IllegalStateException("Lista vazia");
        if (primeiro == ultimo) {
            primeiro = null;
            ultimo = null;
        } else {
            ultimo = ultimo.getAnterior();
            ultimo.setProximo(null);
        }
        tamanho--;
    }

    public void removePosicao(int posicao) {
        if (posicao < 0 || posicao >= tamanho) throw new IndexOutOfBoundsException();
        if (posicao == 0) { removeInicio(); return; }
        if (posicao == tamanho - 1) { removeFim(); return; }
        NoLista remover = primeiro;
        for (int i = 0; i < posicao; i++) remover = remover.getProximo();
        NoLista anterior = remover.getAnterior();
        NoLista proximo = remover.getProximo();
        anterior.setProximo(proximo);
        proximo.setAnterior(anterior);
        tamanho--;
    }

    public void remover(Object elemento) {
        NoLista atual = primeiro;
        while (atual != null && !atual.getElemento().equals(elemento)) {
            atual = atual.getProximo();
        }
        if (atual == null) return;
        if (atual == primeiro) {
            removeInicio();
        } else if (atual == ultimo) {
            removeFim();
        } else {
            NoLista ant = atual.getAnterior();
            NoLista prox = atual.getProximo();
            ant.setProximo(prox);
            prox.setAnterior(ant);
            tamanho--;
        }
    }

    public boolean contem(Object elemento) {
        NoLista atual = primeiro;
        while (atual != null) {
            if (atual.getElemento().equals(elemento)) return true;
            atual = atual.getProximo();
        }
        return false;
    }

    public int size() { return tamanho; }
    public int tamanho() { return tamanho; }
    public boolean isEmpty() { return tamanho == 0; }

    public Object[] toArray() {
        Object[] arr = new Object[tamanho];
        NoLista atual = primeiro;
        for (int i = 0; i < tamanho; i++) {
            arr[i] = atual.getElemento();
            atual = atual.getProximo();
        }
        return arr;
    }

    // Para compatibilidade com código que usa ListaLigada.get(i)
    public Object get(int index) {
        return pega(index);
    }
}