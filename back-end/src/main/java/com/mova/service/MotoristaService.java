package com.mova.service;

import com.mova.structures.*;
import com.mova.model.Motorista;

public class MotoristaService {
    private BST arvoreMotoristas;

    public MotoristaService() {
        arvoreMotoristas = new BST();
    }

    public void cadastrarMotorista(Motorista m) {
        arvoreMotoristas.inserir(m);
    }

    public ListaDuplamenteLigada listarMotoristas() {
        return arvoreMotoristas.listarInOrder();
    }
}