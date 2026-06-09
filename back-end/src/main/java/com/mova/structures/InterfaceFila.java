package com.mova.structures;

public interface InterfaceFila {
    void enqueue(Object element);
    Object dequeue();      // agora retorna Object
    Object peek();
    Object peekAndDequeue();
    boolean isEmpty();
    int size();
}