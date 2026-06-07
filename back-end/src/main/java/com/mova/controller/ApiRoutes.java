package com.mova.controller;

import static spark.Spark.*;
import com.google.gson.Gson;
import com.mova.model.SolicitacaoViagem;
import com.mova.model.Motorista;
import com.mova.service.ViagemService;
import com.mova.service.MotoristaService;

public class ApiRoutes {
    private static Gson gson = new Gson();
    private static ViagemService viagemService = new ViagemService();
    private static MotoristaService motoristaService = new MotoristaService();

    public static void init() {
        post("/api/viagens/solicitar", (req, res) -> {
            SolicitacaoViagem sol = gson.fromJson(req.body(), SolicitacaoViagem.class);
            var resultado = viagemService.solicitarViagem(sol.getOrigemId(), sol.getDestinoId());
            res.type("application/json");
            return gson.toJson(resultado);
        });

        get("/api/motoristas", (req, res) -> {
            var lista = motoristaService.listarMotoristas();
            res.type("application/json");
            return gson.toJson(lista.toArray());
        });

        post("/api/motoristas", (req, res) -> {
            Motorista m = gson.fromJson(req.body(), Motorista.class);
            motoristaService.cadastrarMotorista(m);
            res.type("application/json");
            return "{\"status\":\"ok\"}";
        });
    }
}