package com.mova.structures.BST;

public interface InterfaceBT {
    void inserir(Comparable<Object> info);
    void listInOrder();
    void listPreorder();
    void listPosOrder();
    boolean existe(Comparable<Object> info);
}