package com.mova.structures;

public interface InterfaceGrafo {
    void adicionarVertice(Object elemento);
    void adicionaAresta(Object elem1, Object elem2, double peso);
    void removeVertice(Object elemento);
    void removeAresta(Object elem1, Object elem2);
    boolean existeVertice(Object elemento);
    boolean existeAresta(Object elem1, Object elem2);
    int getGrau(Object elemento);
    ListaDuplamenteLigada getVertices();  // retorna lista de elementos
    ListaDuplamenteLigada getArestas();   // retorna lista de strings "(v1,v2)"
    boolean estaConexo();
    void imprimir();
}