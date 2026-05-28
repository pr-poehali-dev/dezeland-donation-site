import { useState, useEffect } from "react";
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

// Тип аккаунта
type Account = { login: string; email: string; password: string; skin: string; via: "email" | "google"; createdAt: string };

const LS_KEY = "dezeland_accounts";
const LS_SESSION = "dezeland_session";

function loadAccounts(): Account[] {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); } catch { return []; }
}
function saveAccounts(list: Account[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(list));
}

export default function Index() {
  const [activeSection, setActiveSection] = useState<Section>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ── Auth ──────────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState<Account | null>(() => {
    const s = localStorage.getItem(LS_SESSION);
    if (!s) return null;
    const accs = loadAccounts();
    return accs.find(a => a.login === s) || null;
  });

  const logout = () => { localStorage.removeItem(LS_SESSION); setCurrentUser(null); setCabinetTab("login"); };

  // ── Cabinet ───────────────────────────────────────────
  const [cabinetTab, setCabinetTab] = useState<"login" | "profile">(currentUser ? "profile" : "login");
  const [loginForm, setLoginForm] = useState({ login: "", password: "" });
  const [loginError, setLoginError] = useState("");

  const handleLogin = () => {
    setLoginError("");
    const accs = loadAccounts();
    const found = accs.find(
      a => (a.login === loginForm.login || a.email === loginForm.login) && a.password === loginForm.password
    );
    if (!found) { setLoginError("Неверный никнейм/email или пароль"); return; }
    localStorage.setItem(LS_SESSION, found.login);
    setCurrentUser(found);
    setCabinetTab("profile");
  };

  // ── Registration ──────────────────────────────────────
  type RegStep = "choose" | "email-form" | "google-setup";
  const [regStep, setRegStep] = useState<RegStep>("choose");

  const [regForm, setRegForm] = useState({ login: "", email: "", password: "", confirm: "" });
  const [regErrors, setRegErrors] = useState<Record<string, string>>({});
  const [regSuccess, setRegSuccess] = useState(false);

  const [googleForm, setGoogleForm] = useState({ nick: "", password: "", confirm: "" });
  const [googleErrors, setGoogleErrors] = useState<Record<string, string>>({});
  const [googleSuccess, setGoogleSuccess] = useState(false);

  const SKIN_PRESETS = [
    { id: "steve",   label: "Стив",     emoji: "🧑" },
    { id: "alex",    label: "Алекс",    emoji: "👩" },
    { id: "warrior", label: "Воин",     emoji: "⚔️" },
    { id: "mage",    label: "Маг",      emoji: "🔮" },
    { id: "ranger",  label: "Рейнджер", emoji: "🏹" },
    { id: "pirate",  label: "Пират",    emoji: "🏴‍☠️" },
  ];
  const [selectedSkin, setSelectedSkin] = useState("steve");
  const [skinGenerating, setSkinGenerating] = useState(false);
  const [generatedSkin, setGeneratedSkin] = useState<string | null>(null);

  const handleGenerateSkin = () => {
    setSkinGenerating(true);
    setGeneratedSkin(null);
    setTimeout(() => {
      const randomSkins = ["🧟", "🧙", "🥷", "🧝", "🦸", "🤴"];
      setGeneratedSkin(randomSkins[Math.floor(Math.random() * randomSkins.length)]);
      setSkinGenerating(false);
    }, 1800);
  };

  const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleEmailRegister = () => {
    const errs: Record<string, string> = {};
    const accs = loadAccounts();
    if (!regForm.login.trim() || regForm.login.length < 3) errs.login = "Никнейм: минимум 3 символа";
    else if (!/^[a-zA-Z0-9_]+$/.test(regForm.login)) errs.login = "Только латиница, цифры, _";
    else if (accs.find(a => a.login === regForm.login)) errs.login = "Никнейм уже занят";
    if (!validateEmail(regForm.email)) errs.email = "Введите корректный email";
    else if (accs.find(a => a.email === regForm.email)) errs.email = "Email уже зарегистрирован";
    if (regForm.password.length < 6) errs.password = "Пароль: минимум 6 символов";
    if (regForm.password !== regForm.confirm) errs.confirm = "Пароли не совпадают";
    if (Object.keys(errs).length) { setRegErrors(errs); return; }
    const newAcc: Account = { login: regForm.login, email: regForm.email, password: regForm.password, skin: selectedSkin, via: "email", createdAt: new Date().toLocaleDateString("ru") };
    saveAccounts([...accs, newAcc]);
    setRegErrors({});
    setRegSuccess(true);
  };

  const handleGoogleRegister = () => {
    const errs: Record<string, string> = {};
    const accs = loadAccounts();
    if (!googleForm.nick.trim() || googleForm.nick.length < 3) errs.nick = "Никнейм: минимум 3 символа";
    else if (!/^[a-zA-Z0-9_]+$/.test(googleForm.nick)) errs.nick = "Только латиница, цифры, _";
    else if (accs.find(a => a.login === googleForm.nick)) errs.nick = "Никнейм уже занят";
    if (googleForm.password.length < 6) errs.password = "Пароль: минимум 6 символов";
    if (googleForm.password !== googleForm.confirm) errs.confirm = "Пароли не совпадают";
    if (Object.keys(errs).length) { setGoogleErrors(errs); return; }
    const skinId = generatedSkin || selectedSkin;
    const newAcc: Account = { login: googleForm.nick, email: "google@" + googleForm.nick, password: googleForm.password, skin: skinId, via: "google", createdAt: new Date().toLocaleDateString("ru") };
    saveAccounts([...accs, newAcc]);
    setGoogleErrors({});
    setGoogleSuccess(true);
  };

  // Sync cabinetTab when user logs in from register success screen
  useEffect(() => {
    if (currentUser) setCabinetTab("profile");
  }, [currentUser]);

  const navigate = (s: Section) => {
    setActiveSection(s);
    setMobileMenuOpen(false);
    if (s === "register") {
      setRegStep("choose");
      setRegSuccess(false);
      setGoogleSuccess(false);
      setRegForm({ login: "", email: "", password: "", confirm: "" });
      setGoogleForm({ nick: "", password: "", confirm: "" });
      setRegErrors({});
      setGoogleErrors({});
    }
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

              {/* STEP 1 — выбор способа */}
              {regStep === "choose" && (
                <div className="bg-[#111827] border border-white/10 rounded-2xl p-8 animate-fade-in">
                  <p className="text-center text-gray-400 text-sm mb-6">Выбери способ регистрации</p>

                  {/* Google */}
                  <button
                    onClick={() => setRegStep("google-setup")}
                    className="w-full flex items-center gap-3 bg-white text-gray-900 font-bold py-3.5 px-5 rounded-xl hover:bg-gray-100 transition-all hover:scale-105 mb-3"
                  >
                    <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
                      <path d="M47.5 24.6c0-1.6-.1-3.1-.4-4.6H24v8.7h13.1c-.6 3-2.3 5.5-4.9 7.2v6h7.9c4.6-4.2 7.4-10.5 7.4-17.3z" fill="#4285F4"/>
                      <path d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.9-6c-2.1 1.4-4.9 2.3-8 2.3-6.1 0-11.3-4.1-13.2-9.7H2.7v6.2C6.7 42.8 14.8 48 24 48z" fill="#34A853"/>
                      <path d="M10.8 28.8A14.6 14.6 0 0 1 10 24c0-1.7.3-3.3.8-4.8v-6.2H2.7A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.7 10.8l8.1-6z" fill="#FBBC04"/>
                      <path d="M24 9.5c3.4 0 6.5 1.2 8.9 3.5l6.6-6.6C35.9 2.5 30.5 0 24 0 14.8 0 6.7 5.2 2.7 13.2l8.1 6.2C12.7 13.6 17.9 9.5 24 9.5z" fill="#EA4335"/>
                    </svg>
                    Войти через Google
                  </button>

                  <div className="flex items-center gap-3 my-5">
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-gray-600 text-xs">или</span>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>

                  {/* Email */}
                  <button
                    onClick={() => setRegStep("email-form")}
                    className="w-full flex items-center justify-center gap-2 bg-mc-green text-mc-dark font-pixel py-3.5 px-5 rounded-xl glow-green hover:bg-green-300 transition-all hover:scale-105"
                  >
                    <Icon name="Mail" size={18} />
                    Регистрация по Email
                  </button>

                  <div className="mt-6 text-center">
                    <span className="text-gray-500 text-sm">Уже есть аккаунт? </span>
                    <button onClick={() => navigate("cabinet")} className="text-mc-green text-sm font-semibold hover:text-green-300 transition-colors">
                      Войти
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2A — обычная форма */}
              {regStep === "email-form" && !regSuccess && (
                <div className="bg-[#111827] border border-white/10 rounded-2xl p-8 animate-fade-in">
                  <button onClick={() => { setRegStep("choose"); setRegErrors({}); }} className="flex items-center gap-1 text-gray-500 hover:text-white text-sm mb-5 transition-colors">
                    <Icon name="ArrowLeft" size={14} /> Назад
                  </button>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-1.5">Никнейм</label>
                      <input
                        type="text"
                        placeholder="CoolPlayer2025"
                        value={regForm.login}
                        onChange={(e) => { setRegForm({ ...regForm, login: e.target.value }); setRegErrors(p => ({ ...p, login: "" })); }}
                        className={`w-full bg-mc-dark border rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none transition-colors ${regErrors.login ? "border-red-500/60" : "border-white/10 focus:border-mc-green/60"}`}
                      />
                      {regErrors.login && <p className="text-red-400 text-xs mt-1">{regErrors.login}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-1.5">Email</label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={regForm.email}
                        onChange={(e) => { setRegForm({ ...regForm, email: e.target.value }); setRegErrors(p => ({ ...p, email: "" })); }}
                        className={`w-full bg-mc-dark border rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none transition-colors ${regErrors.email ? "border-red-500/60" : "border-white/10 focus:border-mc-green/60"}`}
                      />
                      {regErrors.email && <p className="text-red-400 text-xs mt-1">{regErrors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-1.5">Пароль</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={regForm.password}
                        onChange={(e) => { setRegForm({ ...regForm, password: e.target.value }); setRegErrors(p => ({ ...p, password: "" })); }}
                        className={`w-full bg-mc-dark border rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none transition-colors ${regErrors.password ? "border-red-500/60" : "border-white/10 focus:border-mc-green/60"}`}
                      />
                      {regErrors.password && <p className="text-red-400 text-xs mt-1">{regErrors.password}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-1.5">Повтор пароля</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={regForm.confirm}
                        onChange={(e) => { setRegForm({ ...regForm, confirm: e.target.value }); setRegErrors(p => ({ ...p, confirm: "" })); }}
                        className={`w-full bg-mc-dark border rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none transition-colors ${regErrors.confirm ? "border-red-500/60" : "border-white/10 focus:border-mc-green/60"}`}
                      />
                      {regErrors.confirm && <p className="text-red-400 text-xs mt-1">{regErrors.confirm}</p>}
                    </div>
                    <button
                      onClick={handleEmailRegister}
                      className="w-full bg-mc-green text-mc-dark font-pixel py-4 rounded-lg glow-green hover:bg-green-300 transition-all flex items-center justify-center gap-2 hover:scale-105"
                    >
                      <Icon name="UserPlus" size={18} />
                      СОЗДАТЬ АККАУНТ
                    </button>
                  </div>
                  <div className="mt-5 p-3 bg-mc-green/5 border border-mc-green/20 rounded-lg text-center">
                    <p className="text-xs text-gray-500">
                      После регистрации{" "}
                      <button onClick={() => navigate("download")} className="text-mc-green hover:underline">скачай лаунчер →</button>
                    </p>
                  </div>
                </div>
              )}

              {/* Успех email-регистрации */}
              {regStep === "email-form" && regSuccess && (
                <div className="bg-[#111827] border border-mc-green/30 rounded-2xl p-8 text-center animate-fade-in glow-green">
                  <div className="text-5xl mb-4">🎉</div>
                  <h2 className="font-pixel text-2xl text-white mb-2">Аккаунт создан!</h2>
                  <p className="text-gray-400 mb-1">Добро пожаловать, <span className="text-mc-green font-bold">{regForm.login}</span>!</p>
                  <p className="text-gray-500 text-sm mb-6">Теперь скачай лаунчер и войди в игру.</p>
                  <button
                    onClick={() => navigate("download")}
                    className="w-full bg-mc-green text-mc-dark font-pixel py-3.5 rounded-lg glow-green hover:bg-green-300 transition-all flex items-center justify-center gap-2 hover:scale-105"
                  >
                    <Icon name="Download" size={18} />
                    СКАЧАТЬ ЛАУНЧЕР
                  </button>
                  <button
                    onClick={() => navigate("cabinet")}
                    className="w-full mt-3 border border-white/10 text-gray-400 font-semibold py-3 rounded-lg hover:bg-white/5 transition-all text-sm"
                  >
                    Перейти в кабинет
                  </button>
                </div>
              )}

              {/* STEP 2B — Google setup: ник + скин */}
              {regStep === "google-setup" && !googleSuccess && (
                <div className="bg-[#111827] border border-white/10 rounded-2xl p-8 animate-fade-in">
                  <button onClick={() => { setRegStep("choose"); setGoogleErrors({}); }} className="flex items-center gap-1 text-gray-500 hover:text-white text-sm mb-5 transition-colors">
                    <Icon name="ArrowLeft" size={14} /> Назад
                  </button>

                  {/* Fake Google connected badge */}
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 mb-6">
                    <svg width="16" height="16" viewBox="0 0 48 48" fill="none">
                      <path d="M47.5 24.6c0-1.6-.1-3.1-.4-4.6H24v8.7h13.1c-.6 3-2.3 5.5-4.9 7.2v6h7.9c4.6-4.2 7.4-10.5 7.4-17.3z" fill="#4285F4"/>
                      <path d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.9-6c-2.1 1.4-4.9 2.3-8 2.3-6.1 0-11.3-4.1-13.2-9.7H2.7v6.2C6.7 42.8 14.8 48 24 48z" fill="#34A853"/>
                      <path d="M10.8 28.8A14.6 14.6 0 0 1 10 24c0-1.7.3-3.3.8-4.8v-6.2H2.7A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.7 10.8l8.1-6z" fill="#FBBC04"/>
                      <path d="M24 9.5c3.4 0 6.5 1.2 8.9 3.5l6.6-6.6C35.9 2.5 30.5 0 24 0 14.8 0 6.7 5.2 2.7 13.2l8.1 6.2C12.7 13.6 17.9 9.5 24 9.5z" fill="#EA4335"/>
                    </svg>
                    <span className="text-gray-400 text-xs">Google аккаунт подключён</span>
                    <Icon name="Check" size={14} className="text-mc-green ml-auto" />
                  </div>

                  <div className="space-y-4">
                    {/* Ник */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-1.5">
                        Никнейм в игре
                      </label>
                      <input
                        type="text"
                        placeholder="CoolPlayer2025"
                        value={googleForm.nick}
                        onChange={(e) => { setGoogleForm({ ...googleForm, nick: e.target.value }); setGoogleErrors(p => ({ ...p, nick: "" })); }}
                        className={`w-full bg-mc-dark border rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none transition-colors ${googleErrors.nick ? "border-red-500/60" : "border-white/10 focus:border-mc-green/60"}`}
                      />
                      {googleErrors.nick
                        ? <p className="text-red-400 text-xs mt-1">{googleErrors.nick}</p>
                        : <p className="text-gray-600 text-xs mt-1">Латиница, цифры, подчёркивание. 3–16 символов.</p>
                      }
                    </div>

                    {/* Скин */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-semibold text-gray-400">Скин персонажа</label>
                        <button
                          onClick={handleGenerateSkin}
                          disabled={skinGenerating}
                          className="flex items-center gap-1.5 bg-mc-purple/20 border border-mc-purple/40 text-mc-purple text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-mc-purple/30 transition-all disabled:opacity-60"
                        >
                          {skinGenerating ? (
                            <>
                              <Icon name="Loader" size={12} className="animate-spin" />
                              Генерирую...
                            </>
                          ) : (
                            <>
                              <Icon name="Wand2" size={12} />
                              Сгенерировать
                            </>
                          )}
                        </button>
                      </div>

                      {/* Generated skin result */}
                      {generatedSkin && (
                        <div className="mb-3 p-3 bg-mc-purple/10 border border-mc-purple/30 rounded-xl flex items-center gap-3 animate-fade-in">
                          <div className="w-14 h-14 bg-mc-dark rounded-lg flex items-center justify-center text-3xl border border-mc-purple/30">
                            {generatedSkin}
                          </div>
                          <div>
                            <p className="text-white text-sm font-semibold">Скин сгенерирован!</p>
                            <p className="text-gray-500 text-xs">Уникальный скин для твоего аккаунта</p>
                          </div>
                          <button
                            onClick={() => setGeneratedSkin(null)}
                            className="ml-auto text-gray-600 hover:text-gray-400"
                          >
                            <Icon name="X" size={14} />
                          </button>
                        </div>
                      )}

                      {/* Preset skins */}
                      {!generatedSkin && (
                        <div className="grid grid-cols-3 gap-2">
                          {SKIN_PRESETS.map((skin) => (
                            <button
                              key={skin.id}
                              onClick={() => setSelectedSkin(skin.id)}
                              className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all hover:scale-105 ${
                                selectedSkin === skin.id
                                  ? "border-mc-green bg-mc-green/10"
                                  : "border-white/10 bg-mc-dark/60 hover:border-white/20"
                              }`}
                            >
                              <span className="text-2xl">{skin.emoji}</span>
                              <span className={`text-xs font-semibold ${selectedSkin === skin.id ? "text-mc-green" : "text-gray-400"}`}>
                                {skin.label}
                              </span>
                              {selectedSkin === skin.id && (
                                <Icon name="Check" size={12} className="text-mc-green" />
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Пароль для Google-аккаунта */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-1.5">Придумай пароль</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={googleForm.password}
                        onChange={(e) => { setGoogleForm({ ...googleForm, password: e.target.value }); setGoogleErrors(p => ({ ...p, password: "" })); }}
                        className={`w-full bg-mc-dark border rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none transition-colors ${googleErrors.password ? "border-red-500/60" : "border-white/10 focus:border-mc-green/60"}`}
                      />
                      {googleErrors.password && <p className="text-red-400 text-xs mt-1">{googleErrors.password}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-1.5">Повтор пароля</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={googleForm.confirm}
                        onChange={(e) => { setGoogleForm({ ...googleForm, confirm: e.target.value }); setGoogleErrors(p => ({ ...p, confirm: "" })); }}
                        className={`w-full bg-mc-dark border rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none transition-colors ${googleErrors.confirm ? "border-red-500/60" : "border-white/10 focus:border-mc-green/60"}`}
                      />
                      {googleErrors.confirm && <p className="text-red-400 text-xs mt-1">{googleErrors.confirm}</p>}
                    </div>

                    <button
                      onClick={handleGoogleRegister}
                      className="w-full bg-mc-green text-mc-dark font-pixel py-4 rounded-lg glow-green hover:bg-green-300 transition-all flex items-center justify-center gap-2 hover:scale-105"
                    >
                      <Icon name="LogIn" size={18} />
                      СОЗДАТЬ АККАУНТ
                    </button>
                  </div>
                </div>
              )}

              {/* Успех Google-регистрации */}
              {regStep === "google-setup" && googleSuccess && (
                <div className="bg-[#111827] border border-mc-green/30 rounded-2xl p-8 text-center animate-fade-in glow-green">
                  <div className="text-5xl mb-4">🎉</div>
                  <h2 className="font-pixel text-2xl text-white mb-2">Аккаунт создан!</h2>
                  <p className="text-gray-400 mb-1">Добро пожаловать, <span className="text-mc-green font-bold">{googleForm.nick}</span>!</p>
                  <p className="text-gray-500 text-sm mb-6">Теперь скачай лаунчер и войди в игру.</p>
                  <button
                    onClick={() => navigate("download")}
                    className="w-full bg-mc-green text-mc-dark font-pixel py-3.5 rounded-lg glow-green hover:bg-green-300 transition-all flex items-center justify-center gap-2 hover:scale-105"
                  >
                    <Icon name="Download" size={18} />
                    СКАЧАТЬ ЛАУНЧЕР
                  </button>
                  <button
                    onClick={() => navigate("cabinet")}
                    className="w-full mt-3 border border-white/10 text-gray-400 font-semibold py-3 rounded-lg hover:bg-white/5 transition-all text-sm"
                  >
                    Перейти в кабинет
                  </button>
                </div>
              )}
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
                    <a
                      href="https://drive.google.com/drive/folders/1sOsWE_eanlAEHtSm6s73ryn6YaCnbXGz?usp=sharing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-mc-blue text-mc-dark font-pixel px-6 py-3 rounded-lg hover:bg-blue-300 transition-all glow-blue hover:scale-105"
                    >
                      <Icon name="Monitor" size={18} />
                      Windows
                    </a>
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
                        onChange={(e) => { setLoginForm({ ...loginForm, login: e.target.value }); setLoginError(""); }}
                        className={`w-full bg-mc-dark border rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none transition-colors ${loginError ? "border-red-500/60" : "border-white/10 focus:border-mc-gold/60"}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-1.5">Пароль</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={loginForm.password}
                        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                        onChange={(e) => { setLoginForm({ ...loginForm, password: e.target.value }); setLoginError(""); }}
                        className={`w-full bg-mc-dark border rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none transition-colors ${loginError ? "border-red-500/60" : "border-white/10 focus:border-mc-gold/60"}`}
                      />
                      {loginError && <p className="text-red-400 text-xs mt-1">{loginError}</p>}
                    </div>
                    <button
                      onClick={handleLogin}
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
            ) : currentUser ? (
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-[#111827] border border-mc-gold/30 rounded-2xl p-6 glow-gold">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-mc-green to-mc-blue rounded-xl mx-auto mb-3 flex items-center justify-center text-4xl">
                      {SKIN_PRESETS.find(s => s.id === currentUser.skin)?.emoji ?? currentUser.skin}
                    </div>
                    <h3 className="font-pixel text-xl text-white">{currentUser.login}</h3>
                    <div className="inline-flex items-center gap-1 bg-mc-green/10 border border-mc-green/30 rounded-full px-3 py-1 mt-2">
                      <span className="text-mc-green text-xs font-bold">
                        {currentUser.via === "google" ? "🌐 Google" : "✉️ Email"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-gray-400">
                      <span>Email</span>
                      <span className="text-white font-semibold text-xs truncate max-w-[120px]">{currentUser.email}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Скин</span>
                      <span className="text-white font-semibold">{SKIN_PRESETS.find(s => s.id === currentUser.skin)?.label ?? currentUser.skin}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Дата регистрации</span>
                      <span className="text-white font-semibold">{currentUser.createdAt}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Монет</span>
                      <span className="text-mc-gold font-bold">0 💰</span>
                    </div>
                  </div>
                  <button
                    onClick={logout}
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
            ) : (
              <div className="max-w-md mx-auto">
                <div className="bg-[#111827] border border-red-500/20 rounded-2xl p-8 text-center">
                  <Icon name="AlertCircle" size={36} className="text-red-400 mx-auto mb-3" />
                  <h2 className="font-pixel text-xl text-white mb-2">Нет доступа</h2>
                  <p className="text-gray-500 text-sm mb-6">Войди в аккаунт чтобы открыть кабинет.</p>
                  <button onClick={() => setCabinetTab("login")} className="bg-mc-gold text-mc-dark font-pixel px-6 py-3 rounded-lg hover:bg-yellow-300 transition-all">
                    ВОЙТИ
                  </button>
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