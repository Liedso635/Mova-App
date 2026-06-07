package com.mova;

import static spark.Spark.*;
import com.mova.controller.ApiRoutes;

public class MovaServer {
    public static void main(String[] args) {
        port(8080);
        enableCORS();
        ApiRoutes.init();
        System.out.println("Servidor Mova rodando em http://localhost:8080");
    }

    private static void enableCORS() {
        options("/*", (req, res) -> {
            String accessControlRequestHeaders = req.headers("Access-Control-Request-Headers");
            if (accessControlRequestHeaders != null)
                res.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
            String accessControlRequestMethod = req.headers("Access-Control-Request-Method");
            if (accessControlRequestMethod != null)
                res.header("Access-Control-Allow-Methods", accessControlRequestMethod);
            return "OK";
        });
        before((req, res) -> {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            res.header("Access-Control-Allow-Headers", "*");
        });
    }
}