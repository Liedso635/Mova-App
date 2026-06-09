package com.mova.structures;

public class Pilha implements InterfacePilha {
    private ListaDuplamenteLigada lista;

    public Pilha() {
        lista = new ListaDuplamenteLigada();
    }

    @Override
    public void push(Object element) {
        lista.adicionaInicio(element);
    }

    @Override
    public Object pop() {
        if (isEmpty()) return null;
        Object topo = lista.pega(0);
        lista.removeInicio();
        return topo;
    }

    @Override
    public Object peek() {
        if (isEmpty()) return null;
        return lista.pega(0);
    }

    @Override
    public Object peekAndPop() {
        Object element = peek();
        pop();
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