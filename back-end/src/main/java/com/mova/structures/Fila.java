package com.mova.structures.Fila;

public class Fila implements InterfaceFila {
    private ListaDuplamenteLigada lista;

    public Fila() {
        lista = new ListaDuplamenteLigada();
    }

    @Override
    public void enqueue(Object element) {
        lista.adicionaFim(element);
    }

    @Override
    public void dequeue() {
        if (isEmpty()) throw new IllegalStateException("Fila vazia");
        lista.removeInicio();
    }

    @Override
    public Object peek() {
        if (isEmpty()) return null;
        return lista.pega(0);
    }

    @Override
    public Object peekAndDequeue() {
        Object elemento = peek();
        dequeue();
        return elemento;
    }

    @Override
    public boolean isEmpty() {
        return lista.tamanho() == 0;
    }

    @Override
    public int size() {
        return lista.tamanho();
    }
}