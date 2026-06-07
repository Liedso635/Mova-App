package com.mova.structures;

public class BST implements InterfaceBT {
    private NoBST raiz;

    @Override
    public void inserir(Comparable<Object> info) {
        raiz = inserirRec(raiz, info);
    }

    private NoBST inserirRec(NoBST no, Comparable<Object> info) {
        if (no == null) return new NoBST(info);
        if (info.compareTo(no.getInfo()) < 0)
            no.setEsq(inserirRec(no.getEsq(), info));
        else if (info.compareTo(no.getInfo()) > 0)
            no.setDir(inserirRec(no.getDir(), info));
        return no;
    }

    @Override
    public void listInOrder() {
        inOrderRec(raiz);
        System.out.println();
    }

    private void inOrderRec(NoBST no) {
        if (no != null) {
            inOrderRec(no.getEsq());
            System.out.print(no.getInfo() + " ");
            inOrderRec(no.getDir());
        }
    }

    @Override
    public void listPreorder() {
        preOrderRec(raiz);
        System.out.println();
    }

    private void preOrderRec(NoBST no) {
        if (no != null) {
            System.out.print(no.getInfo() + " ");
            preOrderRec(no.getEsq());
            preOrderRec(no.getDir());
        }
    }

    @Override
    public void listPosOrder() {
        posOrderRec(raiz);
        System.out.println();
    }

    private void posOrderRec(NoBST no) {
        if (no != null) {
            posOrderRec(no.getEsq());
            posOrderRec(no.getDir());
            System.out.print(no.getInfo() + " ");
        }
    }

    @Override
    public boolean existe(Comparable<Object> info) {
        return existeRec(raiz, info);
    }

    private boolean existeRec(NoBST no, Comparable<Object> info) {
        if (no == null) return false;
        if (info.compareTo(no.getInfo()) == 0) return true;
        if (info.compareTo(no.getInfo()) < 0)
            return existeRec(no.getEsq(), info);
        else
            return existeRec(no.getDir(), info);
    }

    // ---------- Métodos auxiliares para o projecto ----------
    public ListaDuplamenteLigada listarInOrder() {
        ListaDuplamenteLigada lista = new ListaDuplamenteLigada();
        inOrderListaRec(raiz, lista);
        return lista;
    }

    private void inOrderListaRec(NoBST no, ListaDuplamenteLigada lista) {
        if (no != null) {
            inOrderListaRec(no.getEsq(), lista);
            lista.adicionar(no.getInfo());
            inOrderListaRec(no.getDir(), lista);
        }
    }

    public NoBST getRaiz() {
        return raiz;
    }
}