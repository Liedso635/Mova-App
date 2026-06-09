package com.mova.structures;

public class NoLista {
    private NoLista proximo;
    private NoLista anterior;
    private Object elemento;

    public NoLista(NoLista anterior, Object elemento) {
        this.anterior = anterior;
        this.elemento = elemento;
    }

    public NoLista(Object elemento, NoLista proximo) {
        this.proximo = proximo;
        this.elemento = elemento;
    }

    public NoLista(NoLista anterior, Object elemento, NoLista proximo) {
        this.anterior = anterior;
        this.elemento = elemento;
        this.proximo = proximo;
    }

    public NoLista(Object elemento) {
        this.elemento = elemento;
    }

    public NoLista getProximo() { return proximo; }
    public void setProximo(NoLista proximo) { this.proximo = proximo; }
    public NoLista getAnterior() { return anterior; }
    public void setAnterior(NoLista anterior) { this.anterior = anterior; }
    public Object getElemento() { return elemento; }
    public void setElemento(Object elemento) { this.elemento = elemento; }
}