package com.mova.model;

public class Ponto {
    private String id;
    private double x, y, z;
    private String nome;

    public Ponto() {}

    public Ponto(String id, double x, double y, double z, String nome) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.z = z;
        this.nome = nome;
    }

    // Getters e setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public double getX() { return x; }
    public void setX(double x) { this.x = x; }
    public double getY() { return y; }
    public void setY(double y) { this.y = y; }
    public double getZ() { return z; }
    public void setZ(double z) { this.z = z; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
}