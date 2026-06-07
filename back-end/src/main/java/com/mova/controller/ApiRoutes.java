package com.mova.controller;

import static spark.Spark.*;
import com.google.gson.Gson;

public class ApiRoutes {
    private static Gson gson = new Gson();

    public static void init() {
        post("/api/viagens/solicitar", (req, res) -> {
            // Mock - depois substituímos pela lógica real
            res.type("application/json");
            return "{\"rotaIds\":[\"fonte\",\"w1\",\"p1\"], \"distancia\":2.5}";
        });
    }
}