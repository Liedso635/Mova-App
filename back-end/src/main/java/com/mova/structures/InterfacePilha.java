package com.mova.structures.Pilha;

public interface InterfacePilha {
    void push(Object element);         // insere no topo
    void pop();                        // remove do topo
    Object peek();                     // devolve o topo sem remover
    Object peekAndPop();               // devolve e remove o topo
    boolean isEmpty();
    int size();
}