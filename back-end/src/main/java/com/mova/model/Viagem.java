package com.mova.model;

import com.mova.structures.ListaDuplamenteLigada;

public class Viagem implements Comparable<Viagem> {
    private int id;
    private String origemId;
    private String destinoId;
    private ListaDuplamenteLigada rotaIds;
    private double distancia;

    public Viagem(int id, String origemId, String destinoId) {
        this.id = id;
        this.origemId = origemId;
        this.destinoId = destinoId;
        this.rotaIds = new ListaDuplamenteLigada();
    }

    public int getId() { return id; }
    public String getOrigemId() { return origemId; }
    public String getDestinoId() { return destinoId; }
    public ListaDuplamenteLigada getRotaIds() { return rotaIds; }
    public void setRotaIds(ListaDuplamenteLigada rotaIds) { this.rotaIds = rotaIds; }
    public double getDistancia() { return distancia; }
    public void setDistancia(double distancia) { this.distancia = distancia; }

    @Override
    public int compareTo(Viagem o) {
        return Integer.compare(this.id, o.id);
    }
}