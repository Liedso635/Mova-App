package com.mova.structures;

public class NoAVL {
    private Comparable<?> info;
    private NoAVL esq;
    private NoAVL dir;
    private int altura;

    public NoAVL(Comparable<?> info) {
        this.info = info;
        this.altura = 1;
    }

    public Comparable<?> getInfo() { return info; }
    public void setInfo(Comparable<?> info) { this.info = info; }
    public NoAVL getEsq() { return esq; }
    public void setEsq(NoAVL esq) { this.esq = esq; }
    public NoAVL getDir() { return dir; }
    public void setDir(NoAVL dir) { this.dir = dir; }
    public int getAltura() { return altura; }
    public void setAltura(int altura) { this.altura = altura; }
}