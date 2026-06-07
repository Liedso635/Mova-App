package com.mova.structures.AVL;
import com.mova.structures.ListaDuplamenteLigada.ListaDuplamenteLigada;
public class AVL {
    private NoAVL raiz;

    private int altura(NoAVL no) {
        return no == null ? 0 : no.getAltura();
    }

    private int fatorBalanceamento(NoAVL no) {
        return no == null ? 0 : altura(no.getEsq()) - altura(no.getDir());
    }

    private NoAVL rotacaoDireita(NoAVL y) {
        NoAVL x = y.getEsq();
        NoAVL T2 = x.getDir();
        x.setDir(y);
        y.setEsq(T2);
        y.setAltura(Math.max(altura(y.getEsq()), altura(y.getDir())) + 1);
        x.setAltura(Math.max(altura(x.getEsq()), altura(x.getDir())) + 1);
        return x;
    }

    private NoAVL rotacaoEsquerda(NoAVL x) {
        NoAVL y = x.getDir();
        NoAVL T2 = y.getEsq();
        y.setEsq(x);
        x.setDir(T2);
        x.setAltura(Math.max(altura(x.getEsq()), altura(x.getDir())) + 1);
        y.setAltura(Math.max(altura(y.getEsq()), altura(y.getDir())) + 1);
        return y;
    }

    public void inserir(Comparable<Object> info) {
        raiz = inserirRec(raiz, info);
    }

    private NoAVL inserirRec(NoAVL no, Comparable<Object> info) {
        if (no == null) return new NoAVL(info);
        if (info.compareTo(no.getInfo()) < 0)
            no.setEsq(inserirRec(no.getEsq(), info));
        else if (info.compareTo(no.getInfo()) > 0)
            no.setDir(inserirRec(no.getDir(), info));
        else
            return no; // duplicado

        no.setAltura(1 + Math.max(altura(no.getEsq()), altura(no.getDir())));
        int balance = fatorBalanceamento(no);

        // LL
        if (balance > 1 && info.compareTo(no.getEsq().getInfo()) < 0)
            return rotacaoDireita(no);
        // RR
        if (balance < -1 && info.compareTo(no.getDir().getInfo()) > 0)
            return rotacaoEsquerda(no);
        // LR
        if (balance > 1 && info.compareTo(no.getEsq().getInfo()) > 0) {
            no.setEsq(rotacaoEsquerda(no.getEsq()));
            return rotacaoDireita(no);
        }
        // RL
        if (balance < -1 && info.compareTo(no.getDir().getInfo()) < 0) {
            no.setDir(rotacaoDireita(no.getDir()));
            return rotacaoEsquerda(no);
        }
        return no;
    }

    public void remover(Comparable<Object> info) {
        raiz = removerRec(raiz, info);
    }

    private NoAVL removerRec(NoAVL no, Comparable<Object> info) {
        if (no == null) return null;
        if (info.compareTo(no.getInfo()) < 0)
            no.setEsq(removerRec(no.getEsq(), info));
        else if (info.compareTo(no.getInfo()) > 0)
            no.setDir(removerRec(no.getDir(), info));
        else {
            if (no.getEsq() == null || no.getDir() == null) {
                NoAVL temp = (no.getEsq() != null) ? no.getEsq() : no.getDir();
                if (temp == null) return null;
                else return temp;
            } else {
                NoAVL temp = minValorNo(no.getDir());
                no.setInfo(temp.getInfo());
                no.setDir(removerRec(no.getDir(), temp.getInfo()));
            }
        }
        if (no == null) return null;
        no.setAltura(1 + Math.max(altura(no.getEsq()), altura(no.getDir())));
        int balance = fatorBalanceamento(no);
        // LL
        if (balance > 1 && fatorBalanceamento(no.getEsq()) >= 0)
            return rotacaoDireita(no);
        // LR
        if (balance > 1 && fatorBalanceamento(no.getEsq()) < 0) {
            no.setEsq(rotacaoEsquerda(no.getEsq()));
            return rotacaoDireita(no);
        }
        // RR
        if (balance < -1 && fatorBalanceamento(no.getDir()) <= 0)
            return rotacaoEsquerda(no);
        // RL
        if (balance < -1 && fatorBalanceamento(no.getDir()) > 0) {
            no.setDir(rotacaoDireita(no.getDir()));
            return rotacaoEsquerda(no);
        }
        return no;
    }

    private NoAVL minValorNo(NoAVL no) {
        NoAVL atual = no;
        while (atual.getEsq() != null) atual = atual.getEsq();
        return atual;
    }

    public void listInOrder() {
        inOrderRec(raiz);
        System.out.println();
    }

    private void inOrderRec(NoAVL no) {
        if (no != null) {
            inOrderRec(no.getEsq());
            System.out.print(no.getInfo() + " ");
            inOrderRec(no.getDir());
        }
    }

    public boolean existe(Comparable<Object> info) {
        return existeRec(raiz, info);
    }

    private boolean existeRec(NoAVL no, Comparable<Object> info) {
        if (no == null) return false;
        if (info.compareTo(no.getInfo()) == 0) return true;
        if (info.compareTo(no.getInfo()) < 0)
            return existeRec(no.getEsq(), info);
        else
            return existeRec(no.getDir(), info);
    }

    // Método auxiliar para obter a raiz (caso necessário)
    public NoAVL getRaiz() {
        return raiz;
    }

    // Método para listar em ordem retornando ListaDuplamenteLigada (útil para viagens)
    public ListaDuplamenteLigada listarInOrder() {
        ListaDuplamenteLigada lista = new ListaDuplamenteLigada();
        inOrderListaRec(raiz, lista);
        return lista;
    }

    private void inOrderListaRec(NoAVL no, ListaDuplamenteLigada lista) {
        if (no != null) {
            inOrderListaRec(no.getEsq(), lista);
            lista.adicionar(no.getInfo());
            inOrderListaRec(no.getDir(), lista);
        }
    }
}