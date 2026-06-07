package com.mova.structures.Fila;

public interface InterfaceFila {
    void enqueue(Object element);      // insere no final
    void dequeue();                    // remove do início
    Object peek();                     // devolve o início sem remover
    Object peekAndDequeue();           // devolve e remove o início
    boolean isEmpty();
    int size();
}