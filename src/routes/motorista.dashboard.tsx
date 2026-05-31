import { createFileRoute } from "@tanstack/react-router";
import { CustomCursor } from "@/components/mova/CustomCursor";
import { Dashboard } from "@/components/mova/Dashboard";

export const Route = createFileRoute("/motorista/dashboard")({
  head: () => ({ meta: [{ title: "Painel do Motorista | Mova App" }] }),
  component: () => (
    <>
      <CustomCursor />
      <Dashboard kind="motorista" />
    </>
  ),
});
