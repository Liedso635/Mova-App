import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Car,
  Navigation,
  History,
  User,
  LogOut,
  X,
  MapPin,
} from "lucide-react";
import logo from "@/assets/mova-logo.png";
import { RippleButton } from "./RippleButton";

type PanelKind = "motorista" | "passageiro";
type Modal = null | "ride" | "history" | "profile";

const historyData = [
  { from: "Baixa", to: "Sommerschield", date: "Hoje · 14:20", value: "350 MT" },
  { from: "Aeroporto", to: "Polana", date: "Ontem · 09:05", value: "480 MT" },
  { from: "Matola", to: "Maputo Centro", date: "23 Mai · 18:40", value: "620 MT" },
];

export function Panel({ kind, onExit }: { kind: PanelKind; onExit: () => void }) {
  const [modal, setModal] = useState<Modal>(null);
  const rideLabel = kind === "motorista" ? "Aceitar Corrida" : "Pedir Corrida";
  const RideIcon = kind === "motorista" ? Car : Navigation;

  const items = [
    { id: "ride" as const, label: rideLabel, icon: RideIcon },
    { id: "history" as const, label: "Histórico", icon: History },
    { id: "profile" as const, label: "Perfil", icon: User },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="group/sb peer flex w-20 flex-col border-r border-gray-200 bg-card transition-[width] duration-200 hover:w-60 md:sticky md:top-0 md:h-screen">
        <div className="flex h-20 items-center gap-3 overflow-hidden px-5">
          <img src={logo} alt="Mova" className="h-8 w-8 min-w-8 object-contain object-left" />
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
          onClick={onExit}
          className="mova-interactive m-3 flex items-center gap-4 overflow-hidden rounded-xl px-3.5 py-3 text-gray-700 transition-colors hover:bg-gray-100"
        >
          <LogOut className="h-5 w-5 min-w-5" />
          <span className="whitespace-nowrap text-sm font-medium opacity-0 transition-opacity duration-200 group-hover/sb:opacity-100">
            Sair
          </span>
        </button>
      </aside>

      {/* Map area placeholder */}
      <main className="relative flex flex-1 items-center justify-center bg-white">
        <div className="flex flex-col items-center text-gray-500">
          <MapPin className="mb-3 h-8 w-8 text-gray-400" />
          <p className="text-sm">Mapa será integrado em breve</p>
        </div>
      </main>

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
              transition={{ duration: 0.25, ease: [0.2, 0.9, 0.4, 1.05] as const }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-3xl bg-card p-8 shadow-xl"
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
                  <div className="mx-auto mb-4 inline-flex rounded-2xl bg-gray-100 p-4 text-primary">
                    <RideIcon className="h-8 w-8" />
                  </div>
                  <p className="text-gray-600">
                    {kind === "motorista"
                      ? "Procurando corridas próximas... Esta é uma simulação. A integração de pedidos chega em breve."
                      : "A procurar o motorista mais próximo... Esta é uma simulação. A integração de pedidos chega em breve."}
                  </p>
                  <RippleButton onClick={() => setModal(null)} className="mt-6 w-full py-3">
                    Entendido
                  </RippleButton>
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
                  {kind === "motorista" && (
                    <div className="mt-4 flex items-center justify-between rounded-xl bg-gray-900 px-4 py-3 text-gray-50">
                      <span className="text-sm">Lucro total</span>
                      <span className="font-display font-semibold">1 450 MT</span>
                    </div>
                  )}
                </div>
              )}

              {modal === "profile" && (
                <div>
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
                      {kind === "motorista" ? "M" : "P"}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {kind === "motorista" ? "Motorista Mova" : "Passageiro Mova"}
                      </div>
                      <div className="text-sm text-gray-500">conta@mova.co.mz</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b border-gray-200 py-2">
                      <span className="text-gray-500">Telefone</span>
                      <span className="text-gray-900">+258 84 000 0000</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 py-2">
                      <span className="text-gray-500">Cidade</span>
                      <span className="text-gray-900">Maputo</span>
                    </div>
                  </div>
                  <RippleButton
                    variant="outline"
                    onClick={onExit}
                    className="mt-6 w-full py-3"
                  >
                    <LogOut className="h-4 w-4" /> Sair da conta
                  </RippleButton>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
