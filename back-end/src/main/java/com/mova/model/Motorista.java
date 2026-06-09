package com.mova.model;

public class Motorista implements Comparable<Motorista> {
    private int id;
    private String nome;
    private boolean disponivel;

    public Motorista(int id, String nome) {
        this.id = id;
        this.nome = nome;
        this.disponivel = true;
    }

    public int getId() { return id; }
    public String getNome() { return nome; }
    public boolean isDisponivel() { return disponivel; }
    public void setDisponivel(boolean disponivel) { this.disponivel = disponivel; }

    @Override
    public int compareTo(Motorista o) {
        return Integer.compare(this.id, o.id);
    }
}