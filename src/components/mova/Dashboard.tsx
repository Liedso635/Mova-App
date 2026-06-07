import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import {
  Car,
  Navigation,
  History,
  User,
  LogOut,
  X,
  MapPin,
} from "lucide-react";
import CityScene from "../../components/CityScene";

type Kind = "motorista" | "passageiro";
type Modal = null | "ride" | "history" | "profile";

const historyData = [
  { from: "Baixa", to: "Costa do Sol", date: "Hoje · 10:30", value: "350 MT" },
  { from: "Aeroporto", to: "Polana", date: "Ontem · 09:05", value: "480 MT" },
  { from: "Matola", to: "Maputo Centro", date: "23 Mai · 18:40", value: "620 MT" },
];

export function Dashboard({ kind }: { kind: Kind }) {
  const navigate = useNavigate();
  const [modal, setModal] = useState<Modal>(null);
  const rideLabel = kind === "motorista" ? "Aceitar Corrida" : "Pedir Corrida";
  const RideIcon = kind === "motorista" ? Car : Navigation;

  const items = [
    { id: "ride" as const, label: rideLabel, icon: RideIcon },
    { id: "history" as const, label: "Histórico", icon: History },
    { id: "profile" as const, label: "Perfil", icon: User },
  ];

  const logout = () => {
    localStorage.removeItem(`mova_${kind}`);
    navigate({ to: "/" });
  };

  const stored = (() => {
    try {
      return JSON.parse(localStorage.getItem(`mova_${kind}`) || "null");
    } catch {
      return null;
    }
  })();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar (desktop/tablet) */}
      <aside className="group/sb hidden w-20 flex-col border-r border-gray-200 bg-white transition-[width] duration-200 hover:w-60 md:sticky md:top-0 md:flex md:h-screen">
        <div className="flex h-20 items-center px-6">
          <span
            className="font-display text-xl font-bold"
            style={{ color: "#041037" }}
          >
            Mova
          </span>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3">
          {items.map((it) => (
            <button
              key={it.id}
              onClick={() => setModal(it.id)}
              className="mova-interactive flex items-center gap-4 overflow-hidden rounded-xl px-3.5 py-3 text-gray-700 transition-colors hover:bg-gray-100"
            >
              <it.icon className="h-5 w-5 min-w-5" />
              <span className="whitespace-nowrap text-sm font-medium opacity-0 transition-opacity duration-200 group-hover/sb:opacity-100">
                {it.label}
              </span>
            </button>
          ))}
        </nav>

        <button
          onClick={logout}
          className="mova-interactive m-3 flex items-center gap-4 overflow-hidden rounded-xl px-3.5 py-3 text-gray-700 transition-colors hover:bg-gray-100"
        >
          <LogOut className="h-5 w-5 min-w-5" />
          <span className="whitespace-nowrap text-sm font-medium opacity-0 transition-opacity duration-200 group-hover/sb:opacity-100">
            Sair
          </span>
        </button>
      </aside>

      {/* Map — ocupa todo o espaço disponível */}
      <main className="relative flex flex-1 pb-20 md:pb-0" style={{ minHeight: "100dvh" }}>
        {/* CityScene preenche todo o main */}
        <div className="absolute inset-0">
          <CityScene />
        </div>

        {/* Badge de localização */}
        <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 shadow backdrop-blur-sm">
          <MapPin className="h-4 w-4 text-red-500" />
          <span className="text-xs font-medium text-gray-700">Maputo, Moçambique</span>
        </div>
      </main>

      {/* Bottom nav (mobile) */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-gray-200 bg-white md:hidden">
        {items.map((it) => (
          <button
            key={it.id}
            onClick={() => setModal(it.id)}
            className="mova-interactive flex flex-1 flex-col items-center justify-center gap-1 py-3 text-xs font-medium text-gray-600"
          >
            <it.icon className="h-5 w-5" />
            {it.label}
          </button>
        ))}
        <button
          onClick={logout}
          className="mova-interactive flex flex-1 flex-col items-center justify-center gap-1 py-3 text-xs font-medium text-gray-600"
        >
          <LogOut className="h-5 w-5" /> Sair
        </button>
      </nav>

      {/* Modals */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 px-6 backdrop-blur-sm"
            onClick={() => setModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-display text-xl font-semibold text-gray-900">
                  {modal === "ride" && rideLabel}
                  {modal === "history" && "Histórico de viagens"}
                  {modal === "profile" && "Perfil"}
                </h3>
                <button
                  onClick={() => setModal(null)}
                  className="mova-interactive rounded-full p-2 text-gray-500 hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {modal === "ride" && (
                <div className="text-center">
                  <div
                    className="mx-auto mb-4 inline-flex rounded-2xl p-4 text-white"
                    style={{ backgroundColor: "#041037" }}
                  >
                    <RideIcon className="h-8 w-8" />
                  </div>
                  <p className="text-gray-600">
                    {kind === "motorista"
                      ? "Procurando corridas próximas..."
                      : "A procurar o motorista mais próximo..."}
                  </p>
                  <button
                    onClick={() => {
                      alert("Nova corrida solicitada");
                      setModal(null);
                    }}
                    className="mova-interactive mt-6 w-full rounded-xl py-3 text-sm font-semibold text-white"
                    style={{ backgroundColor: "#041037" }}
                  >
                    Confirmar
                  </button>
                </div>
              )}

              {modal === "history" && (
                <div className="space-y-3">
                  {historyData.map((h, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
                    >
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {h.from} → {h.to}
                        </div>
                        <div className="text-xs text-gray-500">{h.date}</div>
                      </div>
                      <div className="font-display text-sm font-semibold text-gray-900">
                        {h.value}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {modal === "profile" && (
                <div>
                  <div className="mb-6 flex items-center gap-4">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-full text-lg font-semibold text-white"
                      style={{ backgroundColor: "#041037" }}
                    >
                      {(stored?.nome?.[0] ?? (kind === "motorista" ? "M" : "P")).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {stored?.nome ?? (kind === "motorista" ? "Motorista Mova" : "Passageiro Mova")}
                      </div>
                      <div className="text-sm text-gray-500">
                        {stored?.email ?? "conta@mova.co.mz"}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="mova-interactive mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 py-3 text-sm font-medium text-gray-800 hover:bg-gray-100"
                  >
                    <LogOut className="h-4 w-4" /> Sair da conta
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}