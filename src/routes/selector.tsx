import { createFileRoute } from "@tanstack/react-router";
import { CustomCursor } from "@/components/mova/CustomCursor";
import { VideoBackground } from "@/components/mova/VideoBackground";
import { Header } from "@/components/mova/Header";
import { Selector } from "@/components/mova/Selector";

export const Route = createFileRoute("/selector")({
  head: () => ({
    meta: [
      { title: "Entrar — Mova App" },
      { name: "description", content: "Escolha entrar como motorista ou passageiro." },
    ],
  }),
  component: () => (
    <>
      <CustomCursor />
      <VideoBackground />
      <Header />
      <Selector />
    </>
  ),
});
