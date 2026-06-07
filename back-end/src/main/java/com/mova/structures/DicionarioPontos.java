package com.mova.structures;

public class DicionarioPontos {
    private ListaLigada[] tabela;

    public DicionarioPontos() {
        tabela = new ListaLigada[26];
        for (int i = 0; i < 26; i++) {
            tabela[i] = new ListaDuplamenteLigada();
        }
    }

    private int hash(String chave) {
        return Math.abs(chave.hashCode() % 26);
    }

    public void adicionar(String id, Object ponto) {
        int indice = hash(id);
        tabela[indice].adicionar(new Par(id, ponto));
    }

    public Object buscar(String id) {
        int indice = hash(id);
        for (int i = 0; i < tabela[indice].size(); i++) {
            Par par = (Par) tabela[indice].pega(i);
            if (par.chave.equals(id)) return par.valor;
        }
        return null;
    }

    private static class Par {
        String chave;
        Object valor;
        Par(String c, Object v) { chave = c; valor = v; }
    }
}