import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";

interface AuthViewProps {
  kind: "motorista" | "passageiro";
}

const copy = {
  motorista: {
    title: "Conduza com a Mova.",
    sub: "Aceite corridas, defina o seu horário e aumente os seus ganhos.",
    dashboard: "/motorista/dashboard" as const,
  },
  passageiro: {
    title: "Viaje com a Mova.",
    sub: "Peça uma corrida segura e chegue ao seu destino com tranquilidade.",
    dashboard: "/passageiro/dashboard" as const,
  },
};

function Field({
  label,
  type = "text",
  placeholder,
  name,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  name: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-gray-600">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required
        className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:bg-white"
        style={{ borderColor: undefined }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "#041037")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "")}
      />
    </label>
  );
}

export function AuthView({ kind }: AuthViewProps) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"entrar" | "cadastrar">("entrar");
  const c = copy[kind];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (mode === "cadastrar") {
      const user = {
        kind,
        nome: fd.get("nome"),
        email: fd.get("email"),
        telefone: fd.get("telefone"),
      };
      localStorage.setItem(`mova_${kind}`, JSON.stringify(user));
      alert("Conta criada com sucesso!");
    } else {
      alert("Login bem-sucedido");
    }
    navigate({ to: c.dashboard });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-6 py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[400px] rounded-3xl bg-white p-8 shadow-2xl"
      >
        <div className="mb-1 text-center font-display text-2xl font-bold text-gray-900">
          {c.title}
        </div>
        <p className="mb-6 text-center text-sm text-gray-600">{c.sub}</p>

        <div className="mb-6 inline-flex w-full rounded-xl bg-gray-100 p-1">
          {(["entrar", "cadastrar"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`mova-interactive flex-1 rounded-lg px-4 py-2 text-sm font-medium capitalize transition-all ${
                mode === m ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.form
            key={mode}
            initial={{ opacity: 0, x: mode === "entrar" ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: mode === "entrar" ? 20 : -20 }}
            transition={{ duration: 0.25 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {mode === "cadastrar" && (
              <>
                <Field name="nome" label="Nome completo" placeholder="O seu nome" />
                <Field name="telefone" type="tel" label="Telefone" placeholder="+258 ..." />
              </>
            )}
            <Field name="email" type="email" label="E-mail" placeholder="voce@email.com" />
            <Field name="senha" type="password" label="Senha" placeholder="••••••••" />
            {mode === "cadastrar" && (
              <Field
                name="confirmar"
                type="password"
                label="Confirmar senha"
                placeholder="••••••••"
              />
            )}

            <button
              type="submit"
              className="mova-interactive mt-2 w-full rounded-xl py-3.5 text-sm font-semibold text-white transition-all active:scale-[0.98]"
              style={{ backgroundColor: "#041037" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#062156")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#041037")}
            >
              {mode === "entrar" ? "Entrar" : "Cadastrar"}
            </button>
          </motion.form>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
