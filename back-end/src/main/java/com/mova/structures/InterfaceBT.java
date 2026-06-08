package com.mova.structures;

public interface InterfaceBT {
    void inserir(Comparable<?> info);
    void listInOrder();
    void listPreorder();
    void listPosOrder();
    boolean existe(Comparable<?> info);
}