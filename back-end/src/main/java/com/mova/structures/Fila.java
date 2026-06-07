package com.mova.structures;

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
    public Object dequeue() {
        if (isEmpty()) return null;
        Object front = lista.pega(0);
        lista.removeInicio();
        return front;
    }

    @Override
    public Object peek() {
        if (isEmpty()) return null;
        return lista.pega(0);
    }

    @Override
    public Object peekAndDequeue() {
        Object element = peek();
        dequeue();
        return element;
    }

    @Override
    public boolean isEmpty() {
        return lista.isEmpty();
    }

    @Override
    public int size() {
        return lista.size();
    }
}