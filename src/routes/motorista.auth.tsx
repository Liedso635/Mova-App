import { createFileRoute } from "@tanstack/react-router";
import { CustomCursor } from "@/components/mova/CustomCursor";
import { VideoBackground } from "@/components/mova/VideoBackground";
import { Header } from "@/components/mova/Header";
import { AuthView } from "@/components/mova/AuthView";

export const Route = createFileRoute("/motorista/auth")({
  head: () => ({ meta: [{ title: "Motorista — Entrar | Mova App" }] }),
  component: () => (
    <>
      <CustomCursor />
      <VideoBackground />
      <Header />
      <AuthView kind="motorista" />
    </>
  ),
});
