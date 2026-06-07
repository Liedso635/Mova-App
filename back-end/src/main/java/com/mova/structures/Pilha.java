package com.mova.structures;
public class Pilha implements InterfacePilha {
    private ListaDuplamenteLigada lista;

    public Pilha() {
        lista = new ListaDuplamenteLigada();
    }

    @Override
    public void push(Object element) {
        lista.adicionaInicio(element);   // topo = início
    }

    @Override
    public void pop() {
        if (isEmpty()) throw new IllegalStateException("Pilha vazia");
        lista.removeInicio();
    }

    @Override
    public Object peek() {
        if (isEmpty()) return null;
        return lista.pega(0);
    }

    @Override
    public Object peekAndPop() {
        Object elemento = peek();
        pop();
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