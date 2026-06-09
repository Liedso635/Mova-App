package com.mova.structures;

public class MinHeap {
    private static class NoHeap {
        int verticeId;
        double distancia;
        NoHeap(int v, double d) { verticeId = v; distancia = d; }
    }
    private NoHeap[] heap;
    private int size;
    private int capacity;

    public MinHeap(int capacidadeInicial) {
        this.capacity = capacidadeInicial;
        heap = new NoHeap[capacity];
        size = 0;
    }

    public void inserir(int verticeId, double distancia) {
        if (size == capacity) {
            capacity *= 2;
            NoHeap[] novo = new NoHeap[capacity];
            for (int i = 0; i < size; i++) novo[i] = heap[i];
            heap = novo;
        }
        heap[size] = new NoHeap(verticeId, distancia);
        int atual = size;
        size++;
        while (atual > 0 && heap[atual].distancia < heap[parent(atual)].distancia) {
            trocar(atual, parent(atual));
            atual = parent(atual);
        }
    }

    public int extrairMin() {
        if (size == 0) return -1;
        int minId = heap[0].verticeId;
        heap[0] = heap[size-1];
        size--;
        heapify(0);
        return minId;
    }

    public boolean isEmpty() { return size == 0; }

    private void heapify(int i) {
        int menor = i;
        int esq = 2*i+1;
        int dir = 2*i+2;
        if (esq < size && heap[esq].distancia < heap[menor].distancia) menor = esq;
        if (dir < size && heap[dir].distancia < heap[menor].distancia) menor = dir;
        if (menor != i) {
            trocar(i, menor);
            heapify(menor);
        }
    }

    private int parent(int i) { return (i-1)/2; }
    private void trocar(int i, int j) { NoHeap tmp = heap[i]; heap[i] = heap[j]; heap[j] = tmp; }
}