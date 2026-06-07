package com.mova.structures.BST;

public class NoBST {
    private NoBST esq;
    private NoBST dir;
    private Comparable<Object> info;

    public NoBST(Comparable<Object> info) {
        this.info = info;
    }

    public NoBST getEsq() { return esq; }
    public void setEsq(NoBST esq) { this.esq = esq; }
    public NoBST getDir() { return dir; }
    public void setDir(NoBST dir) { this.dir = dir; }
    public Comparable<Object> getInfo() { return info; }
    public void setInfo(Comparable<Object> info) { this.info = info; }
}