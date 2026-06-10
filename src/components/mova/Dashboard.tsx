import { useState, useCallback, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import {
  Car,
  Navigation,
  History,
  User,
  LogOut,
  X,
  Play,
  XCircle,
  Shuffle,
} from "lucide-react";
import CityScene, { carroRef } from "../CityScene";
import { PONTOS_DA_CIDADE } from "../Marcadores";
import { RouteLine, rotaInterpolada, rotaAlternativaInterpolada } from "./RouteLine";
import { calcularDuasRotas, calcularMudancaDeCaminho } from "@/lib/api/movaApi";

type Kind   = "motorista" | "passageiro";
type Modal  = null | "ride" | "history" | "profile";

const historyData = [
  { from: "Baixa",      to: "Costa do Sol",  date: "Hoje · 10:30",   value: "350 MT" },
  { from: "Aeroporto",  to: "Polana",         date: "Ontem · 09:05",  value: "480 MT" },
  { from: "Matola",     to: "Maputo Centro",  date: "23 Mai · 18:40", value: "620 MT" },
];

export function Dashboard({ kind }: { kind: Kind }) {
  const navigate = useNavigate();
  const [modal,          setModal]          = useState<Modal>(null);
  const [origemId,       setOrigemId]       = useState<string | null>(null);
  const [destinoId,      setDestinoId]      = useState<string | null>(null);
  const [rotaIds,        setRotaIds]        = useState<string[]>([]);
  const [rotaAltIds,     setRotaAltIds]     = useState<string[]>([]);
  const [caminhoAtual,   setCaminhoAtual]   = useState<string[]>([]); // (NOVO) Caminho invisível que guia o carro
  const [isLoading,      setIsLoading]      = useState(false);
  const [animando,       setAnimando]       = useState(false);
  const [rotaConcluida,  setRotaConcluida]  = useState(false);
  const [cameraPresa,    setCameraPresa]    = useState(true);
  const [temAlternativa, setTemAlternativa] = useState(false);
  const [recalculando,   setRecalculando]   = useState(false);
  const [noTrocaId,      setNoTrocaId]      = useState<string | null>(null);
  const [arestaMudanca,  setArestaMudanca]  = useState<[string, string] | null>(null);

  const rotaPendenteRef = useRef<string[] | null>(null);

  // Guarda as duas rotas originais para alternar entre elas
  const rotaOriginalRef    = useRef<string[]>([]);
  const rotaAltOriginalRef = useRef<string[]>([]);
  // Qual rota está activa: "principal" | "alternativa"
  const rotaActivaRef = useRef<"principal" | "alternativa">("principal");
  // State espelhado para re-render do label do botão
  const [rotaActiva, setRotaActiva] = useState<"principal" | "alternativa">("principal");

  const rideLabel = kind === "motorista" ? "Aceitar Corrida" : "Pedir Corrida";
  const RideIcon  = kind === "motorista" ? Car : Navigation;

  const items = [
    { id: "ride"    as const, label: rideLabel, icon: RideIcon },
    { id: "history" as const, label: "Histórico", icon: History },
    { id: "profile" as const, label: "Perfil",    icon: User    },
  ];

  const logout = () => {
    localStorage.removeItem(`mova_${kind}`);
    navigate({ to: "/" });
  };

  const stored = (() => {
    const data = localStorage.getItem(`mova_${kind}`);
    if (!data) return null;
    try { return JSON.parse(data); } catch { return null; }
  })();

  const getPontoNome = (id: string | null) => {
    if (!id) return "";
    return PONTOS_DA_CIDADE.find(p => p.id === id)?.nome ?? id;
  };

  // ── Calcular rota ──────────────────────────────────────────────────────────
  const handleConfirmar = async () => {
    if (!origemId || !destinoId) {
      alert("Selecione a origem e o destino no mapa");
      return;
    }
    setIsLoading(true);
    try {
      const resultado = calcularDuasRotas(origemId, destinoId);
      rotaOriginalRef.current    = resultado.rotaPrincipal;
      rotaAltOriginalRef.current = resultado.rotaAlternativa;
      rotaActivaRef.current      = "principal";
      setRotaActiva("principal");
      setRotaIds(resultado.rotaPrincipal);
      setCaminhoAtual(resultado.rotaPrincipal); // Inicializar caminho invisível
      setRotaAltIds(resultado.rotaAlternativa);
      setTemAlternativa(resultado.rotaAlternativa.length > 0);
      setRecalculando(false);
      setNoTrocaId(null);
      setArestaMudanca(null);
      rotaPendenteRef.current = null;
      setAnimando(false);
      setRotaConcluida(false);
      setModal(null);
      setOrigemId(null);
      setDestinoId(null);
    } catch (error) {
      console.error(error);
      alert("Erro ao calcular rota. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPOI = (id: string) => {
    if (!origemId) {
      setOrigemId(id);
    } else if (!destinoId && id !== origemId) {
      setDestinoId(id);
    } else {
      setOrigemId(id);
      setDestinoId(null);
    }
  };

  const handleComecar = () => {
    setAnimando(true);
    setRotaConcluida(false);
  };

  const handleFimRota = () => {
    setAnimando(false);
    setRotaConcluida(true);
    setRecalculando(false);
    setNoTrocaId(null);
    setArestaMudanca(null);
    rotaPendenteRef.current = null;
  };

  // ── Cancelar viagem ────────────────────────────────────────────────────────
  const handleCancelarViagem = useCallback(() => {
    rotaInterpolada.ativa = false;
    rotaInterpolada.progresso.current = 0;
    rotaInterpolada.pontos = [];
    rotaAlternativaInterpolada.pontos = [];
    rotaOriginalRef.current    = [];
    rotaAltOriginalRef.current = [];
    rotaActivaRef.current      = "principal";
    setRotaActiva("principal");
    setRotaIds([]);
    setCaminhoAtual([]);
    setRotaAltIds([]);
    setAnimando(false);
    setRotaConcluida(false);
    setTemAlternativa(false);
    setRecalculando(false);
    setNoTrocaId(null);
    setArestaMudanca(null);
    rotaPendenteRef.current = null;
  }, []);

  // ── Recalcular Rota (SIMPLES: apenas atualiza o caminho invisível) ─────────
  const handleMudarCaminho = useCallback(() => {
    const estaEmPrincipal = rotaActivaRef.current === "principal";
    const rotaDestino = estaEmPrincipal
      ? rotaAltOriginalRef.current
      : rotaOriginalRef.current;

    if (rotaDestino.length === 0) return;

    const carroPos = carroRef.current?.position;
    const posAtual: [number, number, number] = carroPos
      ? [carroPos.x, carroPos.y, carroPos.z]
      : [0, 0, 0];

    const resultado = calcularMudancaDeCaminho(
      posAtual,
      caminhoAtual,  // Usar o caminho actual (não rotaIds)
      rotaDestino
    );

    if (!resultado.novaRota || resultado.novaRota.length === 0) return;

    // SOLUÇÃO ELEGANTE: Atualizar apenas o caminho invisível
    // O RouteLine encontrará automaticamente o ponto mais próximo!
    setCaminhoAtual(resultado.novaRota);

    // Alternar qual rota está "ativa" logicamente
    rotaActivaRef.current = rotaActivaRef.current === "principal" ? "alternativa" : "principal";
    setRotaActiva(rotaActivaRef.current);

    // Mostrar os círculos amarelos na aresta de mudança (temporariamente)
    setNoTrocaId(resultado.noTrocaId);
    setArestaMudanca(resultado.arestaMudanca);
    setRecalculando(true);

    // Limpar após 500ms (para animação visual)
    setTimeout(() => {
      setRecalculando(false);
      setNoTrocaId(null);
      setArestaMudanca(null);
    }, 500);
  }, [caminhoAtual]);

  const emViagem = rotaIds.length > 0;
  const estaEmAlternativa = rotaActiva === "alternativa";

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ── Sidebar desktop ─────────────────────────────────────────────────── */}
      <aside className="group/sb hidden w-20 flex-col border-r border-gray-200 bg-white transition-[width] duration-200 hover:w-60 md:sticky md:top-0 md:flex md:h-screen">
        <div className="flex h-20 items-center px-6">
          <span className="font-display text-xl font-bold" style={{ color: "#041037" }}>
            Mova
          </span>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {items.map(it => (
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

      {/* ── Mapa principal ──────────────────────────────────────────────────── */}
      <main className="relative flex flex-1 pb-20 md:pb-0" style={{ minHeight: "100dvh" }}>
        <div className="absolute inset-0">
          <CityScene onSelectPOI={handleSelectPOI} origemId={origemId} cameraPresa={cameraPresa}>
            <RouteLine
              rotaIds={rotaIds}
              rotaAltIds={rotaAltIds}
              caminhoCarro={caminhoAtual}
              pontos={PONTOS_DA_CIDADE}
              animando={animando}
              onFimRota={handleFimRota}
              pontoJuncaoId={noTrocaId}
            />
          </CityScene>
        </div>


        {/* Badge de seleção origem/destino */}
        <div className="absolute left-4 top-4 z-10 flex flex-col gap-2 rounded-lg bg-white/90 p-3 shadow backdrop-blur-sm text-sm">
          {origemId ? (
            <div className="flex items-center gap-2">
              <span className="font-semibold">Origem:</span>
              <span>{getPontoNome(origemId)}</span>
              <button onClick={() => setOrigemId(null)} className="text-red-500 hover:text-red-700">✕</button>
            </div>
          ) : (
            <div className="text-gray-500">Clique num ponto para origem</div>
          )}
          {destinoId ? (
            <div className="flex items-center gap-2">
              <span className="font-semibold">Destino:</span>
              <span>{getPontoNome(destinoId)}</span>
              <button onClick={() => setDestinoId(null)} className="text-red-500 hover:text-red-700">✕</button>
            </div>
          ) : origemId && (
            <div className="text-gray-500">Clique noutro ponto para destino</div>
          )}
        </div>

        {/* Legenda das rotas */}
        {emViagem && rotaAltIds.length > 0 && (
          <div className="absolute left-4 top-36 z-10 flex flex-col gap-1.5 rounded-lg bg-white/90 p-3 shadow backdrop-blur-sm text-xs">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-6 rounded-full bg-white border border-gray-300" />
              <span className="text-gray-700 font-medium">
                {estaEmAlternativa ? "Caminho alternativo (activo)" : "Caminho mais curto (activo)"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-6 rounded-full" style={{ backgroundColor: "#4488ff" }} />
              <span className="text-gray-700 font-medium">
                {estaEmAlternativa ? "Caminho mais curto" : "Caminho alternativo"}
              </span>
            </div>
            {noTrocaId && (
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-3 w-3 rounded-full"
                  style={{ backgroundColor: "#ffcc00", border: "1px solid #b8960c" }}
                />
                <span className="text-gray-700 font-medium">Ponto de junção</span>
              </div>
            )}
          </div>
        )}

        {/* ── Ações inferiores dinâmicas ──────────────────────────────────── */}
        <div className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 flex-wrap items-center justify-center gap-3 w-full max-w-lg px-4 md:bottom-8">
          <AnimatePresence>

            {/* COMEÇAR */}
            {emViagem && !animando && !rotaConcluida && !recalculando && (
              <motion.button
                key="btn-comecar"
                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                onClick={handleComecar}
                className="flex items-center gap-2 rounded-2xl px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-transform active:scale-95"
                style={{ backgroundColor: "#041037" }}
              >
                <Play className="h-4 w-4 fill-white" />
                Começar
              </motion.button>
            )}

            {/* CÂMERA */}
            {emViagem && !rotaConcluida && !recalculando && (
              <motion.button
                key="btn-trava"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setCameraPresa(!cameraPresa)}
                className="rounded-2xl px-5 py-3.5 text-sm font-semibold shadow-lg transition-transform active:scale-95"
                style={{
                  backgroundColor: cameraPresa ? "#1e293b" : "#ffffff",
                  color:           cameraPresa ? "#ffffff" : "#1e293b",
                  border:          cameraPresa ? "none"    : "1px solid #cbd5e1",
                }}
              >
                {cameraPresa ? "Desprender Câmera" : "Prender Câmera"}
              </motion.button>
            )}

            {/* RECALCULAR ROTA — nunca desaparece enquanto houver alternativa e viagem activa */}
            {emViagem && temAlternativa && !rotaConcluida && !recalculando && (
              <motion.button
                key="btn-recalcular"
                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                onClick={handleMudarCaminho}
                className="flex items-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-semibold shadow-lg transition-transform active:scale-95"
                style={{
                  backgroundColor: estaEmAlternativa ? "#041037" : "#4488ff",
                  color: "#ffffff",
                }}
              >
                <Shuffle className="h-4 w-4" />
                Recalcular Rota
              </motion.button>
            )}

            {/* CANCELAR VIAGEM */}
            {emViagem && !rotaConcluida && !recalculando && (
              <motion.button
                key="btn-cancelar"
                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                onClick={handleCancelarViagem}
                className="flex items-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-semibold shadow-lg transition-transform active:scale-95"
                style={{ backgroundColor: "#dc2626", color: "#ffffff" }}
              >
                <XCircle className="h-4 w-4" />
                Cancelar Viagem
              </motion.button>
            )}

            {/* CHEGADA */}
            {rotaConcluida && (
              <motion.div
                key="chegada"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-gray-800 shadow-lg"
              >
                Chegou ao destino!
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      {/* ── Bottom nav mobile ────────────────────────────────────────────────── */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-gray-200 bg-white md:hidden">
        {items.map(it => (
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

      {/* ── Modals ──────────────────────────────────────────────────────────── */}
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
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-display text-xl font-semibold text-gray-900">
                  {modal === "ride"    && rideLabel}
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
                  {!origemId || !destinoId ? (
                    <p className="text-gray-600">
                      Selecione a origem e o destino no mapa antes de pedir a corrida.
                    </p>
                  ) : isLoading ? (
                    <p className="text-gray-600">A calcular rotas…</p>
                  ) : (
                    <>
                      <p className="text-gray-600">
                        Origem: {getPontoNome(origemId)}
                        <br />
                        Destino: {getPontoNome(destinoId)}
                      </p>
                      <button
                        onClick={handleConfirmar}
                        className="mova-interactive mt-6 w-full rounded-xl py-3 text-sm font-semibold text-white"
                        style={{ backgroundColor: "#041037" }}
                      >
                        Confirmar
                      </button>
                    </>
                  )}
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
                      <div className="text-sm text-gray-500">{stored?.email ?? "conta@mova.co.mz"}</div>
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