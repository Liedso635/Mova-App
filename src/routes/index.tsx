import { createFileRoute } from "@tanstack/react-router";
import { CustomCursor } from "@/components/mova/CustomCursor";
import { VideoBackground } from "@/components/mova/VideoBackground";
import { Header } from "@/components/mova/Header";
import { Landing } from "@/components/mova/Landing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mova App – Mobilidade urbana em Moçambique" },
      {
        name: "description",
        content:
          "Mova Moçambique. Transporte seguro, confortável e tecnológico para todos os moçambicanos.",
      },
      { property: "og:title", content: "Mova App – Mobilidade em Moçambique" },
      { property: "og:description", content: "O futuro da mobilidade nas suas mãos." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <CustomCursor />
      <VideoBackground />
      <Header />
      <Landing />
    </>
  );
}
