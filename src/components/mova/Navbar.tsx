import { useEffect, useState } from "react";
import logo from "@/assets/mova-logo.png";
import { RippleButton } from "./RippleButton";

const links = [
  { label: "Sobre", href: "#about" },
  { label: "Serviços", href: "#services" },
  { label: "Como Funciona", href: "#how" },
  { label: "Avaliações", href: "#reviews" },
  { label: "Contacto", href: "#contact" },
];

export function Navbar({ onStart }: { onStart: () => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.7);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-gray-200 bg-white/80 backdrop-blur-md py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <img src={logo} alt="Mova App" className="logo h-9 w-auto md:h-10" />

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <RippleButton onClick={onStart} className="px-5 py-2.5">
          Começar Agora
        </RippleButton>
      </div>
    </header>
  );
}
