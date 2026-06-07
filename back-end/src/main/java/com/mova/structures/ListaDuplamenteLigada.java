package com.mova.structures;

public class ListaDuplamenteLigada implements InterfaceGeral {
    private No primeiro;
    private No ultimo;
    private int tamanho;

    public ListaDuplamenteLigada() {
        this.primeiro = null;
        this.ultimo = null;
        this.tamanho = 0;
    }

    @Override
    public void adicionaInicio(Object elemento) {
        No novo = new No(null, elemento, primeiro);
        if (primeiro != null) {
            primeiro.setAnterior(novo);
        }
        primeiro = novo;
        if (ultimo == null) {
            ultimo = novo;
        }
        tamanho++;
    }

    @Override
    public void adicionaFim(Object elemento) {
        No novo = new No(ultimo, elemento, null);
        if (ultimo != null) {
            ultimo.setProximo(novo);
        }
        ultimo = novo;
        if (primeiro == null) {
            primeiro = novo;
        }
        tamanho++;
    }

    @Override
    public void adicionaPosicao(int posicao, Object elemento) {
        if (posicao < 0 || posicao > tamanho) {
            throw new IndexOutOfBoundsException("Posição inválida: " + posicao);
        }
        if (posicao == 0) {
            adicionaInicio(elemento);
            return;
        }
        if (posicao == tamanho) {
            adicionaFim(elemento);
            return;
        }
        No atual = primeiro;
        for (int i = 0; i < posicao; i++) {
            atual = atual.getProximo();
        }
        No anterior = atual.getAnterior();
        No novo = new No(anterior, elemento, atual);
        anterior.setProximo(novo);
        atual.setAnterior(novo);
        tamanho++;
    }

    @Override
    public Object pega(int posicao) {
        if (posicao < 0 || posicao >= tamanho) {
            throw new IndexOutOfBoundsException("Posição inválida: " + posicao);
        }
        No atual = primeiro;
        for (int i = 0; i < posicao; i++) {
            atual = atual.getProximo();
        }
        return atual.getElemento();
    }

    @Override
    public void removeInicio() {
        if (primeiro == null) {
            throw new IllegalStateException("Lista vazia");
        }
        if (primeiro == ultimo) {
            primeiro = null;
            ultimo = null;
        } else {
            primeiro = primeiro.getProximo();
            primeiro.setAnterior(null);
        }
        tamanho--;
    }

    @Override
    public void removeFim() {
        if (ultimo == null) {
            throw new IllegalStateException("Lista vazia");
        }
        if (primeiro == ultimo) {
            primeiro = null;
            ultimo = null;
        } else {
            ultimo = ultimo.getAnterior();
            ultimo.setProximo(null);
        }
        tamanho--;
    }

    @Override
    public void removePosicao(int posicao) {
        if (posicao < 0 || posicao >= tamanho) {
            throw new IndexOutOfBoundsException("Posição inválida: " + posicao);
        }
        if (posicao == 0) {
            removeInicio();
            return;
        }
        if (posicao == tamanho - 1) {
            removeFim();
            return;
        }
        No remover = primeiro;
        for (int i = 0; i < posicao; i++) {
            remover = remover.getProximo();
        }
        No anterior = remover.getAnterior();
        No proximo = remover.getProximo();
        anterior.setProximo(proximo);
        proximo.setAnterior(anterior);
        tamanho--;
    }

    @Override
    public boolean contem(Object elemento) {
        No atual = primeiro;
        while (atual != null) {
            if (atual.getElemento().equals(elemento)) {
                return true;
            }
            atual = atual.getProximo();
        }
        return false;
    }

    @Override
    public int tamanho() {
        return tamanho;
    }

    // Método auxiliar para impressão (não faz parte da interface, mas útil)
    public void imprimir() {
        No atual = primeiro;
        System.out.print("[");
        while (atual != null) {
            System.out.print(atual.getElemento());
            if (atual.getProximo() != null) System.out.print(", ");
            atual = atual.getProximo();
        }
        System.out.println("]");
    }

    // Impressão em ordem inversa (conforme página 11 do material)
    public void imprimirInverso() {
        No atual = ultimo;
        System.out.print("[");
        while (atual != null) {
            System.out.print(atual.getElemento());
            if (atual.getAnterior() != null) System.out.print(", ");
            atual = atual.getAnterior();
        }
        System.out.println("]");
    }

    // Método para converter para array (útil para respostas JSON)
    public Object[] toArray() {
        Object[] array = new Object[tamanho];
        No atual = primeiro;
        for (int i = 0; i < tamanho; i++) {
            array[i] = atual.getElemento();
            atual = atual.getProximo();
        }
        return array;
    }

    public boolean isEmpty() {
        return tamanho == 0;
    }
}