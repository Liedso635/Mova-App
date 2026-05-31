import { createFileRoute } from "@tanstack/react-router";
import { CustomCursor } from "@/components/mova/CustomCursor";
import { Dashboard } from "@/components/mova/Dashboard";

export const Route = createFileRoute("/passageiro/dashboard")({
  head: () => ({ meta: [{ title: "Painel do Passageiro | Mova App" }] }),
  component: () => (
    <>
      <CustomCursor />
      <Dashboard kind="passageiro" />
    </>
  ),
});
