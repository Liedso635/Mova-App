import { motion } from "framer-motion";
import { Car, User, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Selector() {
  const cards = [
    {
      to: "/motorista/auth" as const,
      icon: Car,
      title: "Sou Motorista",
      desc: "Aceite corridas, acompanhe os seus ganhos e mova a cidade.",
    },
    {
      to: "/passageiro/auth" as const,
      icon: User,
      title: "Sou Passageiro",
      desc: "Peça corridas seguras e chegue ao seu destino com conforto.",
    },
  ];

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-28 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <h1 className="font-display text-4xl font-bold text-gray-900 md:text-5xl">
          Como deseja entrar?
        </h1>
        <p className="mt-3 text-gray-700">Escolha o seu tipo de utilizador.</p>
      </motion.div>

      <div className="mt-12 grid w-full max-w-3xl gap-6 md:grid-cols-2">
        {cards.map((c, i) => (
          <motion.div
            key={c.to}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
          >
            <Link
              to={c.to}
              className="mova-interactive group block rounded-3xl border border-gray-200 bg-white/95 p-10 backdrop-blur transition-all hover:-translate-y-1.5 hover:shadow-xl"
            >
              <div
                className="mb-6 inline-flex rounded-2xl p-4 text-white"
                style={{ backgroundColor: "#041037" }}
              >
                <c.icon className="h-8 w-8" />
              </div>
              <h3 className="font-display text-2xl font-semibold text-gray-900">
                {c.title}
              </h3>
              <p className="mt-2 text-gray-600">{c.desc}</p>
              <span
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium"
                style={{ color: "#041037" }}
              >
                Entrar <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
