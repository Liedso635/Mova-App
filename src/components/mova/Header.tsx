import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Home", href: "/" },
  { label: "Sobre", href: "/#about" },
  { label: "Serviços", href: "/#services" },
  { label: "Contacto", href: "/#contact" },
];

export function Header() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-gray-200 bg-white/85 backdrop-blur-md py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="font-display text-[20px] font-bold tracking-tight"
          style={{ color: "#041037" }}
        >
          Mova
        </Link>

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

        <div className="hidden lg:block">
          <button
            onClick={() => navigate({ to: "/selector" })}
            className="mova-interactive rounded-xl px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
            style={{ backgroundColor: "#041037" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#062156")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#041037")}
          >
            Começar
          </button>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="mova-interactive rounded-lg p-2 text-gray-800 lg:hidden"
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden">
          <div className="mx-4 mt-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-lg">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                {l.label}
              </a>
            ))}
            <button
              onClick={() => {
                setOpen(false);
                navigate({ to: "/selector" });
              }}
              className="mt-2 block w-full rounded-xl px-4 py-2.5 text-sm font-medium text-white"
              style={{ backgroundColor: "#041037" }}
            >
              Começar
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
