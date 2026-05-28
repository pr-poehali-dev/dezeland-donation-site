import { useState } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/3c8ce224-7168-4b45-b274-eeb9a4e07598/files/b1a5b102-bdb6-42c7-9dcf-2903bc74fa55.jpg";

type Section = "home" | "register" | "download" | "donate" | "rules" | "cabinet";

const NAV_ITEMS = [
  { id: "home", label: "Главная", icon: "Home" },
  { id: "register", label: "Регистрация", icon: "UserPlus" },
  { id: "download", label: "Лаунчер", icon: "Download" },
  { id: "donate", label: "Донат", icon: "Crown" },
  { id: "rules", label: "Правила", icon: "ScrollText" },
  { id: "cabinet", label: "Кабинет", icon: "User" },
] as const;

const DONATE_PACKS = [
  {
    name: "Шахтёр",
    price: "149 ₽",
    color: "#9ca3af",
    glow: "",
    border: "border-gray-600",
    icon: "⛏️",
    perks: ["Приставка [Шахтёр]", "x1.5 к добыче ресурсов", "Доступ к /fly в шахте", "5 000 игровых монет"],
    popular: false,
  },
  {
    name: "Рыцарь",
    price: "349 ₽",
    color: "#38bdf8",
    glow: "glow-blue",
    border: "border-mc-blue",
    icon: "⚔️",
    perks: ["Приставка [Рыцарь]", "x2 к опыту в бою", "Уникальный скин брони", "Доступ к /fly везде", "15 000 игровых монет", "Личный питомец"],
    popular: true,
  },
  {
    name: "Король",
    price: "699 ₽",
    color: "#fbbf24",
    glow: "glow-gold",
    border: "border-mc-gold",
    icon: "👑",
    perks: ["Приставка [Король]", "x3 ко всему", "Своя частная земля", "Команда /god временно", "50 000 игровых монет", "VIP-зал для встреч", "Приоритет в очереди"],
    popular: false,
  },
  {
    name: "Легенда",
    price: "1 499 ₽",
    color: "#a78bfa",
    glow: "glow-purple",
    border: "border-mc-purple",
    icon: "🔮",
    perks: ["Приставка [Легенда]", "x5 ко всему", "Собственный регион", "Все команды открыты", "150 000 игровых монет", "Личный помощник ГМ", "Уникальный плащ", "Имя в топ-списке"],
    popular: false,
  },
];

const RULES = [
  { num: "01", title: "Уважение к игрокам", text: "Запрещено оскорблять, унижать и провоцировать других игроков. Играем дружно и с уважением." },
  { num: "02", title: "Запрет читов", text: "Использование чит-клиентов, макросов и сторонних программ запрещено. Нарушение — вечный бан." },
  { num: "03", title: "Гриферство", text: "Уничтожение чужих построек без разрешения строго запрещено. Защити свои земли через /claim." },
  { num: "04", title: "Реклама", text: "Реклама других серверов и проектов в чате запрещена. Пишем о DezeLand!" },
  { num: "05", title: "Дюп и баги", text: "Использование багов для получения выгоды запрещено. Найди баг — сообщи администрации." },
  { num: "06", title: "Торговля", text: "Реальная торговля аккаунтами и игровыми ценностями за реальные деньги запрещена." },
];

const STATS = [
  { value: "12 847", label: "Игроков", icon: "Users" },
  { value: "3 года", label: "Онлайн", icon: "Calendar" },
  { value: "99.9%", label: "Аптайм", icon: "Wifi" },
  { value: "24/7", label: "Поддержка", icon: "Headphones" },
];

export default function Index() {
  const [activeSection, setActiveSection] = useState<Section>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [regForm, setRegForm] = useState({ login: "", email: "", password: "", confirm: "" });
  const [loginForm, setLoginForm] = useState({ login: "", password: "" });
  const [cabinetTab, setCabinetTab] = useState<"login" | "profile">("login");

  const navigate = (s: Section) => {
    setActiveSection(s);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-mc-dark font-body pixel-bg relative overflow-x-hidden">
      {/* Ambient glow blobs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-mc-green/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/3 right-0 w-80 h-80 bg-mc-blue/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-80 h-80 bg-mc-purple/5 rounded-full blur-3xl pointer-events-none" />

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-mc-dark/90 backdrop-blur-md border-b border-mc-green/20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => navigate("home")} className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-mc-green rounded-sm flex items-center justify-center glow-green text-mc-dark font-pixel text-xs">
              DZ
            </div>
            <span className="font-pixel text-xl text-white group-hover:text-mc-green transition-colors">
              Deze<span className="text-mc-green">Land</span>
            </span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.id as Section)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                  activeSection === item.id
                    ? "text-mc-green bg-mc-green/10 nav-active"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon name={item.icon} size={14} />
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2 bg-mc-green/10 border border-mc-green/30 rounded-full px-3 py-1.5">
            <div className="w-2 h-2 bg-mc-green rounded-full animate-pulse" />
            <span className="text-mc-green text-xs font-bold">2 341 онлайн</span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-400 hover:text-white p-2"
          >
            <Icon name={mobileMenuOpen ? "X" : "Menu"} size={22} />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-mc-dark border-t border-mc-green/20 px-4 py-3 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.id as Section)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-semibold transition-all ${
                  activeSection === item.id
                    ? "text-mc-green bg-mc-green/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon name={item.icon} size={16} />
                {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      <main className="pt-16">

        {/* ═══ HOME ═══ */}
        {activeSection === "home" && (
          <div>
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${HERO_IMAGE})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-mc-dark/60 via-mc-dark/40 to-mc-dark" />
              <div className="absolute inset-0 pixel-bg opacity-30" />

              <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
                <div className="inline-flex items-center gap-2 bg-mc-green/10 border border-mc-green/40 rounded-full px-4 py-1.5 mb-6 animate-fade-in-up">
                  <div className="w-2 h-2 bg-mc-green rounded-full animate-pulse" />
                  <span className="text-mc-green text-sm font-bold">СЕРВЕР ОНЛАЙН • Java & Bedrock</span>
                </div>

                <h1 className="font-pixel text-6xl md:text-8xl text-white mb-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                  Deze<span className="text-glow-green" style={{ color: "#4ade80" }}>Land</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 mb-3 font-semibold animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                  Легендарный Minecraft сервер
                </p>
                <p className="text-gray-400 mb-10 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
                  Выживание, экономика, PvP-арены и уникальные ивенты. Построй свою империю вместе с тысячами игроков!
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
                  <button
                    onClick={() => navigate("register")}
                    className="flex items-center justify-center gap-2 bg-mc-green text-mc-dark font-pixel px-8 py-4 rounded-lg glow-green hover:bg-green-300 transition-all duration-200 text-lg hover:scale-105"
                  >
                    <Icon name="UserPlus" size={20} />
                    НАЧАТЬ ИГРАТЬ
                  </button>
                  <button
                    onClick={() => navigate("download")}
                    className="flex items-center justify-center gap-2 bg-transparent border-2 border-mc-blue text-mc-blue font-pixel px-8 py-4 rounded-lg hover:bg-mc-blue/10 transition-all duration-200 text-lg hover:scale-105"
                  >
                    <Icon name="Download" size={20} />
                    СКАЧАТЬ ЛАУНЧЕР
                  </button>
                </div>

                <div className="mt-10 inline-flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl px-6 py-3 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
                  <Icon name="Server" size={16} className="text-gray-500" />
                  <span className="text-gray-400 text-sm">IP сервера:</span>
                  <span className="font-pixel text-white text-sm">play.dezeland.ru</span>
                  <button
                    className="text-mc-green hover:text-green-300 transition-colors"
                    onClick={() => navigator.clipboard?.writeText("play.dezeland.ru")}
                    title="Копировать"
                  >
                    <Icon name="Copy" size={14} />
                  </button>
                </div>
              </div>
            </section>

            <section className="py-16 px-4 max-w-7xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {STATS.map((stat) => (
                  <div key={stat.label} className="bg-[#111827] border border-white/5 rounded-xl p-6 text-center card-hover">
                    <div className="w-10 h-10 bg-mc-green/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Icon name={stat.icon} size={20} className="text-mc-green" />
                    </div>
                    <div className="font-pixel text-2xl text-white mb-1">{stat.value}</div>
                    <div className="text-gray-500 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="py-16 px-4 max-w-7xl mx-auto">
              <h2 className="font-pixel text-3xl md:text-4xl text-center text-white mb-3">
                Почему <span style={{ color: "#4ade80" }}>DezeLand</span>?
              </h2>
              <p className="text-gray-500 text-center mb-12">Уникальные возможности только у нас</p>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { icon: "Swords", color: "#f87171", title: "PvP-арены", desc: "Еженедельные турниры с призовым фондом. Докажи что ты лучший боец на сервере!" },
                  { icon: "Building2", color: "#fbbf24", title: "Экономика", desc: "Полноценная игровая экономика с магазинами, аукционом и биржей ресурсов." },
                  { icon: "Sparkles", color: "#a78bfa", title: "Уникальные ивенты", desc: "Сезонные события, боссы и квесты каждую неделю. Скучать не придётся!" },
                  { icon: "Shield", color: "#38bdf8", title: "Защита земель", desc: "Застолбите свой участок командой /claim и стройте без страха грифа." },
                  { icon: "Users", color: "#4ade80", title: "Сообщество", desc: "Дружное комьюнити с активным Discord и регулярными встречами в игре." },
                  { icon: "Zap", color: "#fb923c", title: "Мощные серверы", desc: "Сервер работает на выделенных машинах с минимальным пингом по России." },
                ].map((f) => (
                  <div key={f.title} className="bg-[#111827] border border-white/5 rounded-xl p-6 card-hover group">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: f.color + "20", border: `1px solid ${f.color}40` }}>
                      <Icon name={f.icon} size={24} style={{ color: f.color }} />
                    </div>
                    <h3 className="font-pixel text-lg text-white mb-2">{f.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="py-20 px-4">
              <div className="max-w-3xl mx-auto bg-gradient-to-r from-mc-green/10 via-mc-blue/5 to-mc-purple/10 border border-mc-green/20 rounded-2xl p-12 text-center relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-mc-green to-transparent" />
                <h2 className="font-pixel text-3xl text-white mb-4">Готов к приключениям?</h2>
                <p className="text-gray-400 mb-8">Присоединяйся к тысячам игроков прямо сейчас!</p>
                <button
                  onClick={() => navigate("register")}
                  className="bg-mc-green text-mc-dark font-pixel px-10 py-4 rounded-lg glow-green hover:bg-green-300 transition-all text-lg hover:scale-105 inline-flex items-center gap-2"
                >
                  <Icon name="LogIn" size={20} />
                  ЗАРЕГИСТРИРОВАТЬСЯ
                </button>
              </div>
            </section>
          </div>
        )}

        {/* ═══ REGISTER ═══ */}
        {activeSection === "register" && (
          <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-20">
            <div className="w-full max-w-md">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-mc-green/10 border border-mc-green/30 rounded-xl flex items-center justify-center mx-auto mb-4 glow-green">
                  <Icon name="UserPlus" size={28} className="text-mc-green" />
                </div>
                <h1 className="font-pixel text-3xl text-white mb-2">Регистрация</h1>
                <p className="text-gray-500">Создай аккаунт на DezeLand</p>
              </div>

              <div className="bg-[#111827] border border-white/10 rounded-2xl p-8">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-1.5">Никнейм</label>
                    <input
                      type="text"
                      placeholder="CoolPlayer2025"
                      value={regForm.login}
                      onChange={(e) => setRegForm({ ...regForm, login: e.target.value })}
                      className="w-full bg-mc-dark border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-mc-green/60 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-1.5">Email</label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={regForm.email}
                      onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                      className="w-full bg-mc-dark border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-mc-green/60 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-1.5">Пароль</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={regForm.password}
                      onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                      className="w-full bg-mc-dark border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-mc-green/60 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-1.5">Повтор пароля</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={regForm.confirm}
                      onChange={(e) => setRegForm({ ...regForm, confirm: e.target.value })}
                      className="w-full bg-mc-dark border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-mc-green/60 transition-colors"
                    />
                  </div>

                  <button className="w-full bg-mc-green text-mc-dark font-pixel py-4 rounded-lg glow-green hover:bg-green-300 transition-all text-base mt-2 flex items-center justify-center gap-2 hover:scale-105">
                    <Icon name="UserPlus" size={18} />
                    СОЗДАТЬ АККАУНТ
                  </button>
                </div>

                <div className="mt-6 text-center">
                  <span className="text-gray-500 text-sm">Уже есть аккаунт? </span>
                  <button onClick={() => navigate("cabinet")} className="text-mc-green text-sm font-semibold hover:text-green-300 transition-colors">
                    Войти
                  </button>
                </div>

                <div className="mt-6 p-4 bg-mc-green/5 border border-mc-green/20 rounded-lg">
                  <p className="text-xs text-gray-500 text-center">
                    После регистрации скачай лаунчер и войди в игру.{" "}
                    <button onClick={() => navigate("download")} className="text-mc-green hover:underline">
                      Скачать лаунчер →
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ DOWNLOAD ═══ */}
        {activeSection === "download" && (
          <div className="min-h-[calc(100vh-64px)] px-4 py-20 max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-mc-blue/10 border border-mc-blue/30 rounded-xl flex items-center justify-center mx-auto mb-4 glow-blue">
                <Icon name="Download" size={28} className="text-mc-blue" />
              </div>
              <h1 className="font-pixel text-4xl text-white mb-3">Лаунчер DezeLand</h1>
              <p className="text-gray-400 max-w-xl mx-auto">Официальный лаунчер с автообновлением. Одна кнопка — и ты в игре!</p>
            </div>

            <div className="bg-[#111827] border border-mc-blue/30 rounded-2xl p-8 mb-8 relative overflow-hidden glow-blue">
              <div className="absolute top-0 right-0 w-64 h-64 bg-mc-blue/5 rounded-full blur-3xl" />
              <div className="relative flex flex-col md:flex-row items-center gap-8">
                <div className="w-24 h-24 bg-mc-blue/10 rounded-2xl flex items-center justify-center text-5xl flex-shrink-0">
                  🚀
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 bg-mc-blue/10 border border-mc-blue/30 rounded-full px-3 py-1 mb-3">
                    <span className="text-mc-blue text-xs font-bold">ВЕРСИЯ 3.2.1 • ПОСЛЕДНЯЯ</span>
                  </div>
                  <h2 className="font-pixel text-2xl text-white mb-2">DezeLand Launcher</h2>
                  <p className="text-gray-400 mb-4">Поддержка Java & Bedrock · Автообновление · 1.20.4</p>
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <button className="flex items-center gap-2 bg-mc-blue text-mc-dark font-pixel px-6 py-3 rounded-lg hover:bg-blue-300 transition-all glow-blue hover:scale-105">
                      <Icon name="Monitor" size={18} />
                      Windows
                    </button>
                    <button className="flex items-center gap-2 bg-white/5 border border-white/10 text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition-all">
                      <Icon name="Apple" size={18} />
                      macOS
                    </button>
                    <button className="flex items-center gap-2 bg-white/5 border border-white/10 text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition-all">
                      <Icon name="Terminal" size={18} />
                      Linux
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="font-pixel text-2xl text-white mb-6 text-center">Как начать играть?</h2>
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              {[
                { step: "1", icon: "UserPlus", color: "#4ade80", title: "Регистрация", desc: "Создай аккаунт на сайте" },
                { step: "2", icon: "Download", color: "#38bdf8", title: "Скачай лаунчер", desc: "Выбери свою ОС и скачай" },
                { step: "3", icon: "LogIn", color: "#fbbf24", title: "Войди в лаунчер", desc: "Введи логин и пароль" },
                { step: "4", icon: "Play", color: "#a78bfa", title: "Играй!", desc: "Нажми «Играть» и вперёд" },
              ].map((s) => (
                <div key={s.step} className="bg-[#111827] border border-white/5 rounded-xl p-5 text-center card-hover">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 font-pixel text-mc-dark text-sm" style={{ backgroundColor: s.color }}>
                    {s.step}
                  </div>
                  <div className="mb-2">
                    <Icon name={s.icon} size={24} style={{ color: s.color }} className="mx-auto" />
                  </div>
                  <h3 className="font-semibold text-white mb-1">{s.title}</h3>
                  <p className="text-gray-500 text-xs">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#111827] border border-white/5 rounded-xl p-6">
              <h3 className="font-pixel text-lg text-white mb-4">Системные требования</h3>
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div>
                  <p className="text-mc-green font-bold mb-2">Минимальные</p>
                  <ul className="space-y-1 text-gray-400">
                    <li>• Java 17+</li>
                    <li>• RAM: 4 GB</li>
                    <li>• Windows 8 / macOS 10.14 / Ubuntu 18.04</li>
                    <li>• Видеокарта: OpenGL 3.3</li>
                  </ul>
                </div>
                <div>
                  <p className="text-mc-gold font-bold mb-2">Рекомендуемые</p>
                  <ul className="space-y-1 text-gray-400">
                    <li>• Java 21</li>
                    <li>• RAM: 8 GB</li>
                    <li>• SSD накопитель</li>
                    <li>• Видеокарта: GTX 1060+</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ DONATE ═══ */}
        {activeSection === "donate" && (
          <div className="min-h-[calc(100vh-64px)] px-4 py-20 max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-mc-gold/10 border border-mc-gold/30 rounded-xl flex items-center justify-center mx-auto mb-4 glow-gold">
                <Icon name="Crown" size={28} className="text-mc-gold" />
              </div>
              <h1 className="font-pixel text-4xl text-white mb-3">Донат-магазин</h1>
              <p className="text-gray-400 max-w-xl mx-auto">Поддержи сервер и получи уникальные привилегии. Все преимущества — без pay-to-win!</p>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
              {DONATE_PACKS.map((pack) => (
                <div
                  key={pack.name}
                  className={`relative bg-[#111827] border ${pack.border} rounded-2xl p-6 card-hover flex flex-col ${pack.popular ? pack.glow : ""}`}
                >
                  {pack.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-mc-blue text-mc-dark font-pixel text-xs px-4 py-1 rounded-full whitespace-nowrap">
                      ПОПУЛЯРНОЕ
                    </div>
                  )}
                  <div className="text-4xl mb-4 text-center">{pack.icon}</div>
                  <h3 className="font-pixel text-xl text-white text-center mb-1">{pack.name}</h3>
                  <div className="text-center mb-5">
                    <span className="font-pixel text-3xl" style={{ color: pack.color }}>{pack.price}</span>
                    <span className="text-gray-500 text-sm"> / навсегда</span>
                  </div>
                  <ul className="space-y-2 mb-6 flex-1">
                    {pack.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-2 text-sm text-gray-300">
                        <Icon name="Check" size={14} className="mt-0.5 flex-shrink-0" style={{ color: pack.color }} />
                        {perk}
                      </li>
                    ))}
                  </ul>
                  <button
                    className="w-full font-pixel py-3 rounded-lg transition-all hover:scale-105 text-mc-dark"
                    style={{ backgroundColor: pack.color }}
                  >
                    КУПИТЬ
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-10 bg-[#111827] border border-white/5 rounded-xl p-6 text-center">
              <p className="text-gray-400 text-sm">
                💳 Оплата: карты РФ, СБП, ЮMoney, QIWI • Активация в течение 5 минут<br />
                <span className="text-gray-600">При проблемах с оплатой обращайтесь в поддержку на Discord</span>
              </p>
            </div>
          </div>
        )}

        {/* ═══ RULES ═══ */}
        {activeSection === "rules" && (
          <div className="min-h-[calc(100vh-64px)] px-4 py-20 max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-mc-purple/10 border border-mc-purple/30 rounded-xl flex items-center justify-center mx-auto mb-4 glow-purple">
                <Icon name="ScrollText" size={28} className="text-mc-purple" />
              </div>
              <h1 className="font-pixel text-4xl text-white mb-3">Правила сервера</h1>
              <p className="text-gray-400">Соблюдение правил — залог комфортной игры для всех</p>
            </div>

            <div className="space-y-4">
              {RULES.map((rule, i) => (
                <div
                  key={rule.num}
                  className="bg-[#111827] border border-white/5 rounded-xl p-6 flex gap-5 card-hover"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="font-pixel text-4xl text-mc-purple/30 flex-shrink-0 w-12 text-right leading-none">
                    {rule.num}
                  </div>
                  <div>
                    <h3 className="font-pixel text-lg text-white mb-2">{rule.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{rule.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-red-500/5 border border-red-500/20 rounded-xl p-6 text-center">
              <Icon name="AlertTriangle" size={28} className="text-red-400 mx-auto mb-3" />
              <h3 className="font-pixel text-lg text-red-400 mb-2">Важно!</h3>
              <p className="text-gray-400 text-sm">
                Незнание правил не освобождает от ответственности. Администрация оставляет за собой право
                блокировать аккаунты без предупреждения при грубых нарушениях.
              </p>
            </div>
          </div>
        )}

        {/* ═══ CABINET ═══ */}
        {activeSection === "cabinet" && (
          <div className="min-h-[calc(100vh-64px)] px-4 py-20 max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-mc-gold/10 border border-mc-gold/30 rounded-xl flex items-center justify-center mx-auto mb-4 glow-gold">
                <Icon name="User" size={28} className="text-mc-gold" />
              </div>
              <h1 className="font-pixel text-4xl text-white mb-3">Личный кабинет</h1>
              <p className="text-gray-400">Управляй своим аккаунтом и покупками</p>
            </div>

            {cabinetTab === "login" ? (
              <div className="max-w-md mx-auto">
                <div className="bg-[#111827] border border-white/10 rounded-2xl p-8">
                  <h2 className="font-pixel text-xl text-white mb-6 text-center">Вход в аккаунт</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-1.5">Никнейм или Email</label>
                      <input
                        type="text"
                        placeholder="CoolPlayer2025"
                        value={loginForm.login}
                        onChange={(e) => setLoginForm({ ...loginForm, login: e.target.value })}
                        className="w-full bg-mc-dark border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-mc-gold/60 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-1.5">Пароль</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        className="w-full bg-mc-dark border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-mc-gold/60 transition-colors"
                      />
                    </div>
                    <button
                      onClick={() => setCabinetTab("profile")}
                      className="w-full bg-mc-gold text-mc-dark font-pixel py-4 rounded-lg hover:bg-yellow-300 transition-all glow-gold hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <Icon name="LogIn" size={18} />
                      ВОЙТИ
                    </button>
                  </div>
                  <div className="mt-6 text-center">
                    <span className="text-gray-500 text-sm">Нет аккаунта? </span>
                    <button onClick={() => navigate("register")} className="text-mc-green text-sm font-semibold hover:text-green-300 transition-colors">
                      Зарегистрироваться
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-[#111827] border border-mc-gold/30 rounded-2xl p-6 glow-gold">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-mc-green to-mc-blue rounded-xl mx-auto mb-3 flex items-center justify-center font-pixel text-3xl text-mc-dark">
                      CP
                    </div>
                    <h3 className="font-pixel text-xl text-white">CoolPlayer</h3>
                    <div className="inline-flex items-center gap-1 bg-mc-blue/10 border border-mc-blue/30 rounded-full px-3 py-1 mt-2">
                      <span className="text-mc-blue text-xs font-bold">⚔️ РЫЦАРЬ</span>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-gray-400">
                      <span>Монет</span>
                      <span className="text-mc-gold font-bold">15 230 💰</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Наигранных часов</span>
                      <span className="text-white font-semibold">847 ч</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Рейтинг PvP</span>
                      <span className="text-mc-green font-bold">#143</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>На сервере с</span>
                      <span className="text-white font-semibold">Янв 2024</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setCabinetTab("login")}
                    className="w-full mt-6 border border-red-500/30 text-red-400 font-semibold py-2.5 rounded-lg hover:bg-red-500/10 transition-all text-sm flex items-center justify-center gap-2"
                  >
                    <Icon name="LogOut" size={14} />
                    Выйти
                  </button>
                </div>

                <div className="md:col-span-2 space-y-6">
                  <div className="bg-[#111827] border border-white/5 rounded-2xl p-6">
                    <h3 className="font-pixel text-lg text-white mb-4 flex items-center gap-2">
                      <Icon name="Trophy" size={18} className="text-mc-gold" />
                      Достижения
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { icon: "⚔️", name: "Боец", desc: "100 побед" },
                        { icon: "🏗️", name: "Строитель", desc: "1000 блоков" },
                        { icon: "💎", name: "Шахтёр", desc: "Алмаз найден" },
                        { icon: "🌟", name: "Ветеран", desc: "1 год на сервере" },
                        { icon: "🤝", name: "Дипломат", desc: "5 союзов" },
                        { icon: "🔥", name: "Легенда", desc: "Топ-100" },
                      ].map((a) => (
                        <div key={a.name} className="bg-mc-dark/60 border border-white/5 rounded-lg p-3 text-center">
                          <div className="text-2xl mb-1">{a.icon}</div>
                          <div className="text-white text-xs font-semibold">{a.name}</div>
                          <div className="text-gray-600 text-xs">{a.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#111827] border border-white/5 rounded-2xl p-6">
                    <h3 className="font-pixel text-lg text-white mb-4 flex items-center gap-2">
                      <Icon name="ShoppingBag" size={18} className="text-mc-blue" />
                      История покупок
                    </h3>
                    <div className="space-y-3">
                      {[
                        { name: "Привилегия «Рыцарь»", date: "15 Мар 2024", price: "349 ₽", status: "active" },
                        { name: "1000 монет", date: "02 Фев 2024", price: "99 ₽", status: "done" },
                        { name: "Личный питомец", date: "18 Янв 2024", price: "199 ₽", status: "done" },
                      ].map((p) => (
                        <div key={p.name} className="flex items-center justify-between bg-mc-dark/60 border border-white/5 rounded-lg px-4 py-3">
                          <div>
                            <div className="text-white text-sm font-semibold">{p.name}</div>
                            <div className="text-gray-500 text-xs">{p.date}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-mc-gold font-bold text-sm">{p.price}</div>
                            <div className={`text-xs ${p.status === "active" ? "text-mc-green" : "text-gray-500"}`}>
                              {p.status === "active" ? "Активно" : "Выполнено"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-[#0a0f16] px-4 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-mc-green rounded-sm flex items-center justify-center text-mc-dark font-pixel text-xs">DZ</div>
              <span className="font-pixel text-lg text-white">Deze<span style={{ color: "#4ade80" }}>Land</span></span>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-gray-500 justify-center">
              {NAV_ITEMS.map((item) => (
                <button key={item.id} onClick={() => navigate(item.id as Section)} className="hover:text-white transition-colors">
                  {item.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center hover:bg-mc-blue/20 transition-colors">
                <Icon name="MessageCircle" size={16} className="text-gray-400" />
              </button>
              <button className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center hover:bg-mc-blue/20 transition-colors">
                <Icon name="Globe" size={16} className="text-gray-400" />
              </button>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-700 text-xs">
            © 2024 DezeLand. Не является официальным продуктом Mojang Studios.
          </div>
        </div>
      </footer>
    </div>
  );
}
