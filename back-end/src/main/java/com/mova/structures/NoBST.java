package com.mova.structures;

public class NoBST {
    private NoBST esq;
    private NoBST dir;
    private Comparable<?> info;

    public NoBST(Comparable<?> info) {
        this.info = info;
    }

    public NoBST getEsq() { return esq; }
    public void setEsq(NoBST esq) { this.esq = esq; }
    public NoBST getDir() { return dir; }
    public void setDir(NoBST dir) { this.dir = dir; }
    public Comparable<?> getInfo() { return info; }
    public void setInfo(Comparable<?> info) { this.info = info; }
}