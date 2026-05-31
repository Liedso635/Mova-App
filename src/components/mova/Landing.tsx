import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  Car,
  Shield,
  CreditCard,
  Headphones,
  Star,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Linkedin,
  ArrowRight,
} from "lucide-react";

const reveal = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.2, 0.9, 0.4, 1.05] as const },
  }),
};

const services = [
  { icon: Car, title: "Corridas Urbanas", desc: "Viagens rápidas e seguras pela cidade." },
  { icon: Shield, title: "Motoristas Verificados", desc: "Todos os condutores passam por validação." },
  { icon: CreditCard, title: "Pagamento Móvel", desc: "Dinheiro, cartão ou M-Pesa." },
  { icon: Headphones, title: "Suporte 24/7", desc: "Atendimento sempre disponível." },
];

const steps = [
  { n: "01", title: "Crie sua conta", desc: "Registe-se em poucos segundos e prepare-se para mover." },
  { n: "02", title: "Solicite uma corrida", desc: "Indique o destino e encontre o motorista mais próximo." },
  { n: "03", title: "Aproveite a viagem", desc: "Acompanhe o trajeto em tempo real até ao seu destino." },
];

const reviews = [
  { name: "Tânia M.", role: "Passageira · Maputo", text: "Finalmente um serviço confiável em Moçambique. Chego sempre a horas." },
  { name: "Carlos N.", role: "Motorista · Matola", text: "A Mova mudou a minha vida. Ganho mais e a app é simples de usar." },
  { name: "Inês V.", role: "Passageira · Beira", text: "O design é lindo e o suporte é rápido. Recomendo a todos." },
];

function Section({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="relative mx-auto max-w-7xl px-6 py-24 md:py-28">
      {children}
    </section>
  );
}

export function Landing() {
  return (
    <div className="relative">
      {/* HERO — text aligned to bottom-left */}
      <section className="relative flex min-h-screen items-end">
        <div className="w-full" style={{ padding: "0 0 8% 8%" }}>
          <motion.div
            initial="hidden"
            animate="show"
            variants={reveal}
            className="max-w-3xl"
          >
            <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-gray-900 md:text-7xl">
              Mova Moçambique.
              <br />
              <span className="text-gray-700">O futuro nas suas mãos.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-gray-800 md:text-xl">
              Transporte seguro, confortável e tecnológico para todos os moçambicanos.
            </p>
            <Link
              to="/selector"
              className="mova-interactive mt-10 inline-flex items-center gap-2 rounded-xl px-7 py-4 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg active:scale-[0.98]"
              style={{ backgroundColor: "#041037" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#062156")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#041037")}
            >
              Começar Agora <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Solid background for rest of page */}
      <div className="relative bg-background">
        {/* ABOUT */}
        <Section id="about">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <motion.div
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
            >
              <h2 className="font-display text-4xl font-bold text-gray-900 md:text-5xl">
                Construído para Moçambique.
              </h2>
              <p className="mt-6 text-lg text-gray-600">
                A Mova App nasce para revolucionar a mobilidade urbana com um serviço
                confiável, transparente e tecnologicamente avançado. Acreditamos numa
                cidade que se move melhor — com confiança, modernidade e segurança em
                cada viagem.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {["100% Verificado", "24/7 Disponível", "5★ Experiência"].map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
            <motion.div
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="flex items-center justify-center"
            >
              <img
                src="/images/export.svg"
                alt="Mapa estilizado da Baía de Maputo"
                className="mx-auto w-full max-w-md"
              />
            </motion.div>
          </div>
        </Section>

        {/* SERVICES */}
        <Section id="services">
          <div className="mb-12 max-w-2xl">
            <h2 className="font-display text-4xl font-bold text-gray-900 md:text-5xl">
              Serviços
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Tudo o que precisa para se mover com tranquilidade.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                custom={i}
                variants={reveal}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                className="mova-interactive group rounded-2xl border border-gray-200 bg-card p-7 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className="mb-5 inline-flex rounded-xl p-3 text-white transition-transform group-hover:scale-105"
                  style={{ backgroundColor: "#041037" }}
                >
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-semibold text-gray-900">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* HOW IT WORKS */}
        <Section id="how">
          <div className="mb-12 max-w-2xl">
            <h2 className="font-display text-4xl font-bold text-gray-900 md:text-5xl">
              Como Funciona
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Três passos simples até ao seu destino.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                custom={i}
                variants={reveal}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                className="rounded-2xl border border-gray-200 bg-card p-8"
              >
                <div
                  className="font-display text-5xl font-bold"
                  style={{ color: "#041037" }}
                >
                  {s.n}
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold text-gray-900">
                  {s.title}
                </h3>
                <p className="mt-2 text-gray-600">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* REVIEWS */}
        <Section id="reviews">
          <div className="mb-12 max-w-2xl">
            <h2 className="font-display text-4xl font-bold text-gray-900 md:text-5xl">
              O que dizem
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Histórias reais de quem já se move com a Mova.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {reviews.map((r, i) => (
              <motion.div
                key={r.name}
                custom={i}
                variants={reveal}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                className="rounded-2xl border border-gray-200 bg-card p-7"
              >
                <div className="mb-4 flex gap-1" style={{ color: "#041037" }}>
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700">“{r.text}”</p>
                <div className="mt-6">
                  <div className="font-semibold text-gray-900">{r.name}</div>
                  <div className="text-sm text-gray-500">{r.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* CONTACT */}
        <Section id="contact">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="font-display text-4xl font-bold text-gray-900 md:text-5xl">
                Contacto
              </h2>
              <p className="mt-4 text-lg text-gray-600">Vamos mover Moçambique juntos.</p>
              <ul className="mt-8 space-y-4 text-gray-700">
                <li className="flex items-center gap-3">
                  <MapPin className="h-5 w-5" style={{ color: "#041037" }} />
                  Maputo, Moçambique
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5" style={{ color: "#041037" }} />
                  +258 84 000 0000
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5" style={{ color: "#041037" }} />
                  ola@mova.co.mz
                </li>
              </ul>
              <div className="mt-8 flex gap-3">
                {[Facebook, Instagram, Linkedin].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="mova-interactive flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-gray-700 transition-colors hover:bg-gray-100"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-center rounded-3xl p-10 text-white" style={{ backgroundColor: "#041037" }}>
              <div className="font-display text-4xl font-bold">Mova App</div>
              <p className="mt-4 text-lg text-gray-200">
                Mova Moçambique. O futuro nas suas mãos.
              </p>
            </div>
          </div>
        </Section>

        {/* FOOTER */}
        <footer className="border-t border-gray-200 bg-background">
          <div className="mx-auto max-w-7xl px-6 py-8 text-center text-sm text-gray-500">
            © 2025 Mova App. Todos os direitos reservados.
          </div>
        </footer>
      </div>
    </div>
  );
}
