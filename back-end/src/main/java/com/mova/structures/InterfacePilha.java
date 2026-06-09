package com.mova.structures;

public interface InterfacePilha {
    void push(Object element);
    Object pop();       // agora retorna Object
    Object peek();
    Object peekAndPop();
    boolean isEmpty();
    int size();
}