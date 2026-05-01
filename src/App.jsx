import React, { useState, useEffect, useRef } from "react";
import {
  Camera, Check, ChevronLeft, ChevronRight, Flame, Moon, Plus, X, Zap,
  Loader2, AlertCircle, Trash2, Play, Sparkles, Droplet, Heart,
  Activity, BarChart3, User, Download, Upload
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

const T = {
  bone: "#F1EADC", boneDark: "#E8DFCB", forest: "#2C3A28", forestSoft: "#3F5239",
  terra: "#B8542F", terraSoft: "#D88864", ink: "#1A1A16", muted: "#6B6657",
  line: "#C9BFA8", bg: "#DDD3BC"
};

const SETTINGS = {
  weightKg: 55,
  proteinTarget: 110,
  proteinPerMealMin: 25,
  startDate: "2026-05-01"
};

const yt = (q) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q + " form tutorial")}`;

const SESSIONS = {
  1: { type: "strength", name: "Lower — Quad & Hip Flexor", duration: 60, focus: "quad + hip flexor", emoji: "🦵",
    exercises: [
      { id: "back-squat", name: "Back Squat", target: "4 × 6–8", weighted: true, progressive: true, vid: yt("back squat") },
      { id: "bulgarian-split", name: "Bulgarian Split Squat", target: "3 × 8/leg", weighted: true, vid: yt("bulgarian split squat") },
      { id: "leg-press", name: "Leg Press", target: "3 × 10", weighted: true, vid: yt("leg press") },
      { id: "hanging-knee-raise", name: "Hanging Knee Raise", target: "3 × 10", vid: yt("hanging knee raise") },
      { id: "cable-hip-flexor", name: "Cable Hip-Flexor Pull", target: "3 × 12/leg", weighted: true, vid: yt("standing cable hip flexor") },
      { id: "calf-raise", name: "Standing Calf Raise", target: "4 × 12", weighted: true, vid: yt("standing calf raise") }
    ] },
  2: { type: "push", name: "Push + Handstand", duration: 50, focus: "shoulders + wrists", emoji: "🤸", wristPrehab: true,
    exercises: [
      { id: "ohp", name: "Overhead Press (BB)", target: "4 × 6–8", weighted: true, progressive: true, vid: yt("overhead press barbell") },
      { id: "incline-db", name: "Incline DB Press", target: "3 × 10", weighted: true, vid: yt("incline dumbbell press") },
      { id: "pike-pushup", name: "Pike Push-Up / HSPU Negative", target: "3 × 6–8", vid: yt("pike pushup") },
      { id: "lateral-raise", name: "Lateral Raise", target: "3 × 12", weighted: true, vid: yt("lateral raise") },
      { id: "wall-walk", name: "Wall Walk", target: "3 × 3–5", vid: yt("wall walk handstand") },
      { id: "wall-handstand", name: "Wall Handstand (chest-to-wall)", target: "4 × 30–45s", vid: yt("chest to wall handstand") },
      { id: "hollow-hold", name: "Hollow Body Hold", target: "3 × 40s", vid: yt("hollow body hold") }
    ] },
  3: { type: "mobility", name: "Yoga + Dance", duration: 45, focus: "flow", emoji: "🧘",
    exercises: [
      { id: "yoga", name: "Yoga Flow (vinyasa or yin)", target: "30–45 min", vid: yt("vinyasa yoga 30 minute flow") },
      { id: "dance", name: "Dance Cardio", target: "15 min", vid: yt("dance cardio workout") }
    ] },
  4: { type: "pull", name: "Pull + Core", duration: 60, focus: "back + core", emoji: "💪",
    exercises: [
      { id: "pullup", name: "Pull-Up (banded as needed)", target: "4 × AMRAP", vid: yt("banded pull up") },
      { id: "barbell-row", name: "Barbell Row", target: "4 × 8", weighted: true, progressive: true, vid: yt("barbell row") },
      { id: "lat-pulldown", name: "Lat Pulldown", target: "3 × 10", weighted: true, vid: yt("lat pulldown") },
      { id: "cable-row", name: "Seated Cable Row", target: "3 × 12", weighted: true, vid: yt("seated cable row") },
      { id: "face-pull", name: "Face Pull", target: "3 × 15", weighted: true, vid: yt("face pull") },
      { id: "hollow-rocks", name: "Hollow Rocks", target: "3 × 12", vid: yt("hollow rocks") },
      { id: "pallof", name: "Pallof Press", target: "3 × 12/side", weighted: true, vid: yt("pallof press") },
      { id: "toes-to-bar", name: "Toes-to-Bar Progression", target: "3 × 8", vid: yt("toes to bar progression") }
    ] },
  5: { type: "strength", name: "Lower — Posterior & Glutes", duration: 60, focus: "glutes + hamstrings", emoji: "🍑",
    exercises: [
      { id: "deadlift", name: "Conventional Deadlift", target: "4 × 5–6", weighted: true, progressive: true, vid: yt("conventional deadlift") },
      { id: "hip-thrust", name: "Hip Thrust", target: "4 × 10", weighted: true, progressive: true, vid: yt("barbell hip thrust") },
      { id: "walking-lunge", name: "Walking Lunges", target: "3 × 12/leg", weighted: true, vid: yt("walking lunges dumbbell") },
      { id: "ham-curl", name: "Hamstring Curl", target: "3 × 12", weighted: true, vid: yt("hamstring curl machine") },
      { id: "adductor", name: "Adductor Machine", target: "3 × 12", weighted: true, vid: yt("adductor machine") },
      { id: "copenhagen", name: "Copenhagen Plank", target: "3 × 30s/side", vid: yt("copenhagen plank") }
    ] },
  6: { type: "cardio", name: "Cardio + Mobility", duration: 45, focus: "easy effort", emoji: "🏃",
    exercises: [
      { id: "cardio", name: "Run or Dance (easy)", target: "30–40 min", vid: yt("easy run pace zone 2") },
      { id: "mobility", name: "Mobility Flow", target: "15 min — 90/90s, t-spine", vid: yt("hip mobility flow 15 min") }
    ] },
  0: { type: "rest", name: "Rest + Sunday Photo", duration: 0, focus: "recovery", emoji: "🌿",
    exercises: [
      { id: "sunday-photo", name: "Body Photo (a.m., same lighting)", target: "snap one" },
      { id: "review", name: "Review week & plan ahead", target: "5 min" },
      { id: "long-stretch", name: "Long stretch (optional)", target: "20 min" }
    ] }
};

const QUICK_FOODS = [
  { name: "Greek yogurt + granola", p: 30 }, { name: "4 eggs", p: 24 },
  { name: "150g chicken", p: 35 }, { name: "Whey scoop", p: 25 },
  { name: "Cottage cheese (200g)", p: 22 }, { name: "Protein bar", p: 20 },
  { name: "100g tofu", p: 12 }, { name: "Salmon fillet", p: 30 }
];

const MOVEMENT_TYPES = [
  { id: "strength", label: "Strength", emoji: "🏋️" },
  { id: "yoga", label: "Yoga", emoji: "🧘" },
  { id: "dance", label: "Dance", emoji: "💃" },
  { id: "run", label: "Run", emoji: "🏃" },
  { id: "mobility", label: "Mobility", emoji: "🌀" },
  { id: "handstand", label: "Skill / Handstand", emoji: "🤸" },
  { id: "rest", label: "Rest day", emoji: "🌿" }
];

const dKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const today = () => new Date();
const dayName = (d) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()];
const longDate = (d) => d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

const phaseFromDate = (d) => {
  const start = new Date(SETTINGS.startDate);
  const week = Math.floor((d - start) / (7 * 86400000)) + 1;
  if (week < 1) return { num: 0, name: "Pre-start", week: 0 };
  if (week <= 2) return { num: 1, name: "Foundation", week };
  if (week <= 8) return { num: 2, name: "Build", week };
  if (week <= 12) return { num: 3, name: "Peak", week };
  return { num: 4, name: "Post-program", week };
};

const compressImage = (file, maxW = 800, q = 0.85) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const ratio = Math.min(maxW / img.width, maxW / img.height, 1);
      const c = document.createElement("canvas");
      c.width = img.width * ratio; c.height = img.height * ratio;
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      resolve(c.toDataURL("image/jpeg", q));
    };
    img.onerror = reject;
    img.src = e.target.result;
  };
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

const Card = ({ children, dark, accent, style, ...rest }) => (
  <div {...rest} style={{
    background: dark ? T.forest : accent ? T.terra : "rgba(255,255,255,0.5)",
    color: dark || accent ? T.bone : T.ink,
    border: `1px solid ${dark ? T.forest : accent ? T.terra : T.line}`,
    borderRadius: 6, padding: 16, ...style
  }}>{children}</div>
);

const Btn = ({ children, onClick, variant = "primary", small, disabled, style }) => {
  const variants = {
    primary: { bg: T.forest, fg: T.bone, br: T.forest },
    accent: { bg: T.terra, fg: T.bone, br: T.terra },
    ghost: { bg: "transparent", fg: T.forest, br: T.forest },
    soft: { bg: "rgba(255,255,255,0.6)", fg: T.forest, br: T.line }
  };
  const v = variants[variant];
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: v.bg, color: v.fg, border: `1px solid ${v.br}`,
      padding: small ? "6px 12px" : "10px 16px", borderRadius: 100,
      fontSize: small ? 12 : 13, fontWeight: 500, cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1, fontFamily: "inherit", whiteSpace: "nowrap", ...style
    }}>{children}</button>
  );
};

const Eyebrow = ({ children, color }) => (
  <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: color || T.terra }}>{children}</div>
);

const Serif = ({ children, size = 24, color, italic, style }) => (
  <div style={{
    fontFamily: "'Fraunces', serif", fontSize: size, color: color || T.forest,
    fontStyle: italic ? "italic" : "normal", fontWeight: italic ? 300 : 500,
    letterSpacing: "-0.01em", lineHeight: 1.05, ...style
  }}>{children}</div>
);

// === LOCAL STORAGE ===
const lsGet = (k) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { console.error("storage full?", e); return false; } };

const blankDay = () => ({
  workout: { type: null, exercises: {}, completed: false, notes: "" },
  handstand: false, stretch: false, meditation: false, wristPrehab: false,
  meals: [], hydration: 0,
  energy: null, mood: null, sleep: null,
  bodySignal: { pain: false, location: "", notes: "" },
  cycle: { period: false }
});

const useTrackerData = () => {
  const [data, setData] = useState(null);
  const [photos, setPhotos] = useState({});
  const [loaded, setLoaded] = useState(false);
  const saveTimer = useRef(null);

  useEffect(() => {
    const d = lsGet("tracker-main") || { days: {}, exerciseHistory: {} };
    const p = lsGet("body-photos") || {};
    setData(d); setPhotos(p); setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded || !data) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => lsSet("tracker-main", data), 600);
  }, [data, loaded]);

  const updateDay = (key, fn) => setData((prev) => {
    const day = prev.days[key] || blankDay();
    return { ...prev, days: { ...prev.days, [key]: fn(day) } };
  });

  const recordSet = (exId, set, dateKey) => setData((prev) => {
    const hist = prev.exerciseHistory[exId] || [];
    const filtered = hist.filter((h) => h.date !== dateKey);
    return {
      ...prev,
      exerciseHistory: {
        ...prev.exerciseHistory,
        [exId]: [...filtered, { date: dateKey, ...set }].sort((a, b) => a.date.localeCompare(b.date))
      }
    };
  });

  const setPhoto = (key, dataUrl) => {
    const next = { ...photos, [key]: dataUrl };
    setPhotos(next);
    lsSet("body-photos", next);
  };

  const removePhoto = (key) => {
    const next = { ...photos };
    delete next[key];
    setPhotos(next);
    lsSet("body-photos", next);
  };

  return { data, photos, loaded, updateDay, recordSet, setPhoto, removePhoto, setData, setPhotos };
};

const calcStreak = (days) => {
  let streak = 0;
  const cur = new Date();
  for (let i = 0; i < 365; i++) {
    const k = dKey(cur);
    const d = days[k];
    const moved = d && (d.workout?.completed || d.handstand || d.stretch || (d.workout?.type && d.workout.type !== "rest"));
    if (moved) streak++;
    else if (i > 0) break;
    cur.setDate(cur.getDate() - 1);
  }
  return streak;
};

// === MEAL ANALYSIS — calls our own serverless function ===
const analyzeMealPhoto = async (b64) => {
  try {
    const cleanB64 = b64.split(",")[1];
    const res = await fetch("/api/analyze-meal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: cleanB64 })
    });
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch (e) {
    console.error("AI estimate failed:", e);
    return { proteinG: 0, sufficient: false, foods: "couldn't read photo", note: "Tap to enter protein manually." };
  }
};

export default function App() {
  const [tab, setTab] = useState("today");
  const [date, setDate] = useState(today());
  const tracker = useTrackerData();

  if (!tracker.loaded || !tracker.data) {
    return (
      <div style={{ background: T.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 size={28} style={{ color: T.forest, animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  const dk = dKey(date);
  const day = tracker.data.days[dk] || blankDay();
  const isToday = dk === dKey(today());
  const phase = phaseFromDate(date);
  const streak = calcStreak(tracker.data.days);

  return (
    <div style={{ background: T.bg, minHeight: "100vh", color: T.ink, fontSize: 14, paddingBottom: 90 }}>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "max(16px, env(safe-area-inset-top)) 14px 0" }}>
        <Header date={date} setDate={setDate} isToday={isToday} phase={phase} streak={streak} />
        <div className="tracker-page" key={tab + dk}>
          {tab === "today" && <TodayTab date={date} dk={dk} day={day} tracker={tracker} phase={phase} />}
          {tab === "food" && <FoodTab dk={dk} day={day} tracker={tracker} />}
          {tab === "progress" && <ProgressTab tracker={tracker} streak={streak} phase={phase} />}
          {tab === "body" && <BodyTab dk={dk} day={day} tracker={tracker} />}
        </div>
      </div>
      <BottomNav tab={tab} setTab={setTab} />
    </div>
  );
}

function Header({ date, setDate, isToday, phase, streak }) {
  const shift = (n) => { const d = new Date(date); d.setDate(d.getDate() + n); setDate(d); };
  return (
    <div style={{ paddingBottom: 12, borderBottom: `1px solid ${T.forest}`, marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <Eyebrow>The Week · Phase {phase.num}</Eyebrow>
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: T.terra, fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: 14 }}>
          <Flame size={14} fill={T.terra} /> <span style={{ fontWeight: 500 }}>{streak}</span>
          <span style={{ fontSize: 11, color: T.muted, fontStyle: "normal" }}>day{streak === 1 ? "" : "s"}</span>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={() => shift(-1)} style={{ background: "none", border: "none", padding: 4, cursor: "pointer", color: T.forest }}>
          <ChevronLeft size={22} />
        </button>
        <div style={{ textAlign: "center" }}>
          <Serif size={28} italic={!isToday} style={{ fontWeight: 400 }}>
            {isToday ? "Today" : longDate(date)}
          </Serif>
          {isToday && <div style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: 12, color: T.muted, marginTop: 2 }}>{longDate(date)}</div>}
        </div>
        <button onClick={() => shift(1)} style={{ background: "none", border: "none", padding: 4, cursor: "pointer", color: T.forest }}>
          <ChevronRight size={22} />
        </button>
      </div>
    </div>
  );
}

function TodayTab({ date, dk, day, tracker, phase }) {
  const dow = date.getDay();
  const session = SESSIONS[dow];
  const setHabit = (key, val) => tracker.updateDay(dk, (d) => ({ ...d, [key]: val }));
  const setMovementType = (type) => tracker.updateDay(dk, (d) => ({ ...d, workout: { ...d.workout, type } }));

  return (
    <div>
      <div style={{ marginBottom: 12, padding: "8px 12px", background: "rgba(255,255,255,0.4)", borderRadius: 6, border: `1px solid ${T.line}`, fontSize: 11, color: T.muted, fontFamily: "'Fraunces', serif", fontStyle: "italic" }}>
        Week {phase.week} · {phase.name} phase
      </div>

      <div style={{ marginBottom: 14 }}>
        <Eyebrow>Today's Movement</Eyebrow>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
          {MOVEMENT_TYPES.map((m) => (
            <button key={m.id} onClick={() => setMovementType(m.id)} style={{
              padding: "6px 10px", borderRadius: 100,
              border: `1px solid ${day.workout?.type === m.id ? T.forest : T.line}`,
              background: day.workout?.type === m.id ? T.forest : "rgba(255,255,255,0.5)",
              color: day.workout?.type === m.id ? T.bone : T.forest,
              fontSize: 11, cursor: "pointer", fontWeight: 500
            }}>{m.emoji} {m.label}</button>
          ))}
        </div>
      </div>

      <Card style={{ marginBottom: 14 }}>
        <Eyebrow>Daily Habits · 80% rule</Eyebrow>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8, marginTop: 10 }}>
          <HabitTick label="Morning meditation" sub="even 5 minutes counts" icon="☀️" checked={day.meditation} onChange={(v) => setHabit("meditation", v)} />
          <HabitTick label="Daily handstand hold" sub="30s, even on rest days — frequency > volume" icon="🤸" checked={day.handstand} onChange={(v) => setHabit("handstand", v)} />
          <HabitTick label="Nightly stretch" sub="12 min sequence — autopilot is the goal" icon="🌙" checked={day.stretch} onChange={(v) => setHabit("stretch", v)} />
          {session.wristPrehab && (
            <HabitTick label="Wrist prehab" sub="5 min before push session" icon="🖐️" checked={day.wristPrehab} onChange={(v) => setHabit("wristPrehab", v)} />
          )}
        </div>
      </Card>

      <SessionCard session={session} dk={dk} day={day} tracker={tracker} />
      <DayEndCard dk={dk} day={day} tracker={tracker} />
    </div>
  );
}

function HabitTick({ label, sub, icon, checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)} style={{
      display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "10px 12px", borderRadius: 6,
      background: checked ? T.forest : "rgba(255,255,255,0.6)",
      border: `1px solid ${checked ? T.forest : T.line}`,
      color: checked ? T.bone : T.ink, cursor: "pointer", textAlign: "left", transition: "all 0.18s ease"
    }}>
      <div style={{
        width: 26, height: 26, borderRadius: "50%",
        background: checked ? T.terra : "transparent",
        border: `1.5px solid ${checked ? T.terra : T.muted}`,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
      }}>
        {checked ? <Check size={14} color={T.bone} strokeWidth={3} /> : <span style={{ fontSize: 14 }}>{icon}</span>}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 11, opacity: 0.7, marginTop: 1 }}>{sub}</div>
      </div>
    </button>
  );
}

function SessionCard({ session, dk, day, tracker }) {
  const isRest = session.type === "rest";
  return (
    <Card dark={!isRest} accent={isRest} style={{ marginBottom: 14 }}>
      <div style={{ marginBottom: 10 }}>
        <Eyebrow color={isRest ? T.bone : T.terraSoft}>{dayName(new Date(dk + "T12:00:00"))} · {session.duration ? session.duration + " min" : "rest"}</Eyebrow>
        <Serif size={22} color={T.bone} style={{ marginTop: 2 }}>{session.emoji} {session.name}</Serif>
        <div style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 300, fontSize: 12, color: isRest ? T.bone : T.terraSoft, marginTop: 1, opacity: 0.85 }}>
          {session.focus}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {session.exercises.map((ex) => <ExerciseRow key={ex.id} ex={ex} dk={dk} day={day} tracker={tracker} />)}
      </div>
    </Card>
  );
}

function ExerciseRow({ ex, dk, day, tracker }) {
  const [open, setOpen] = useState(false);
  const exState = day.workout?.exercises?.[ex.id] || {};
  const done = !!exState.done;
  const hist = tracker.data.exerciseHistory[ex.id] || [];
  const lastEntry = hist.filter((h) => h.date < dk).slice(-1)[0];
  const suggestedWeight = lastEntry ? (ex.progressive ? +(lastEntry.weight + 2.5).toFixed(1) : lastEntry.weight) : null;

  const toggle = () => tracker.updateDay(dk, (d) => ({
    ...d,
    workout: { ...d.workout, exercises: { ...d.workout.exercises, [ex.id]: { ...exState, done: !done } }, completed: true }
  }));

  const saveSet = (weight, reps) => {
    if (ex.weighted && weight) tracker.recordSet(ex.id, { weight: +weight, reps: +reps || 0 }, dk);
    tracker.updateDay(dk, (d) => ({
      ...d,
      workout: { ...d.workout, exercises: { ...d.workout.exercises, [ex.id]: { ...exState, done: true, weight: +weight, reps: +reps } }, completed: true }
    }));
    setOpen(false);
  };

  return (
    <div style={{ background: "rgba(255,255,255,0.08)", border: `1px solid rgba(241, 234, 220, 0.15)`, borderRadius: 6, padding: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={toggle} style={{
          width: 22, height: 22, borderRadius: "50%",
          background: done ? T.terra : "transparent",
          border: `1.5px solid ${done ? T.terra : T.terraSoft}`,
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
        }}>
          {done && <Check size={12} color={T.bone} strokeWidth={3} />}
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: T.bone, textDecoration: done ? "line-through" : "none", opacity: done ? 0.6 : 1 }}>{ex.name}</div>
          <div style={{ fontSize: 11, color: T.terraSoft, marginTop: 1 }}>
            {ex.target}
            {ex.weighted && lastEntry && (
              <span style={{ color: "rgba(241, 234, 220, 0.55)", marginLeft: 6 }}>
                · last: {lastEntry.weight}kg
                {ex.progressive && <span style={{ color: T.terraSoft }}> → try {suggestedWeight}kg</span>}
              </span>
            )}
          </div>
        </div>
        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
          {ex.weighted && (
            <button onClick={() => setOpen(!open)} style={{
              background: "rgba(216, 136, 100, 0.2)", color: T.terraSoft,
              border: `1px solid ${T.terraSoft}`, borderRadius: 100, padding: "4px 10px", fontSize: 11, cursor: "pointer"
            }}>log</button>
          )}
          {ex.vid && (
            <a href={ex.vid} target="_blank" rel="noreferrer" style={{
              background: "rgba(241, 234, 220, 0.1)", color: T.bone,
              border: `1px solid rgba(241, 234, 220, 0.3)`, borderRadius: 100, padding: "4px 8px",
              fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 3, textDecoration: "none"
            }}><Play size={10} fill={T.bone} /></a>
          )}
        </div>
      </div>
      {open && ex.weighted && (
        <SetLogger suggested={suggestedWeight} currentWeight={exState.weight} currentReps={exState.reps}
          onSave={saveSet} onCancel={() => setOpen(false)} />
      )}
    </div>
  );
}

function SetLogger({ suggested, currentWeight, currentReps, onSave, onCancel }) {
  const [weight, setWeight] = useState(currentWeight ?? suggested ?? "");
  const [reps, setReps] = useState(currentReps ?? "");
  return (
    <div style={{ marginTop: 10, padding: 10, background: "rgba(241, 234, 220, 0.08)", borderRadius: 4, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
      <div style={{ flex: 1, minWidth: 100 }}>
        <div style={{ fontSize: 9, color: T.terraSoft, letterSpacing: "0.15em", marginBottom: 3 }}>WEIGHT (KG)</div>
        <input type="number" inputMode="decimal" step="0.5" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder={suggested?.toString() || "—"}
          style={{ width: "100%", padding: "6px 8px", border: `1px solid ${T.terraSoft}`, borderRadius: 4, background: "rgba(241, 234, 220, 0.1)", color: T.bone, fontSize: 14 }} />
      </div>
      <div style={{ flex: 1, minWidth: 80 }}>
        <div style={{ fontSize: 9, color: T.terraSoft, letterSpacing: "0.15em", marginBottom: 3 }}>TOP-SET REPS</div>
        <input type="number" inputMode="numeric" value={reps} onChange={(e) => setReps(e.target.value)} placeholder="8"
          style={{ width: "100%", padding: "6px 8px", border: `1px solid ${T.terraSoft}`, borderRadius: 4, background: "rgba(241, 234, 220, 0.1)", color: T.bone, fontSize: 14 }} />
      </div>
      <div style={{ display: "flex", gap: 4, marginTop: 14 }}>
        <button onClick={() => onSave(weight, reps)} disabled={!weight} style={{
          background: T.terra, color: T.bone, border: "none", borderRadius: 100,
          padding: "6px 14px", fontSize: 12, fontWeight: 500, cursor: weight ? "pointer" : "not-allowed", opacity: weight ? 1 : 0.5
        }}>save</button>
        <button onClick={onCancel} style={{
          background: "transparent", color: T.terraSoft, border: `1px solid ${T.terraSoft}`,
          borderRadius: 100, padding: "6px 12px", fontSize: 12, cursor: "pointer"
        }}>cancel</button>
      </div>
    </div>
  );
}

function DayEndCard({ dk, day, tracker }) {
  const setVal = (k, v) => tracker.updateDay(dk, (d) => ({ ...d, [k]: v }));
  return (
    <Card style={{ marginBottom: 14 }}>
      <Eyebrow>End of Day</Eyebrow>
      <div style={{ marginTop: 10 }}>
        <Slider label="Energy" icon={<Zap size={14} color={T.terra} />} value={day.energy} onChange={(v) => setVal("energy", v)} />
        <Slider label="Mood" icon={<Heart size={14} color={T.terra} />} value={day.mood} onChange={(v) => setVal("mood", v)} />
        <Slider label="Sleep last night (hrs)" icon={<Moon size={14} color={T.terra} />} value={day.sleep} onChange={(v) => setVal("sleep", v)} max={12} unit="h" />
      </div>
    </Card>
  );
}

function Slider({ label, icon, value, onChange, max = 10, unit = "" }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: T.forest, fontWeight: 500 }}>{icon} {label}</div>
        <div style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", color: value ? T.terra : T.muted, fontSize: 14 }}>
          {value != null ? `${value}${unit}` : "—"}
        </div>
      </div>
      <input type="range" min="0" max={max} step={max === 12 ? "0.5" : "1"} value={value || 0} onChange={(e) => onChange(+e.target.value)} style={{ width: "100%", accentColor: T.terra }} />
    </div>
  );
}

function FoodTab({ dk, day, tracker }) {
  const [adding, setAdding] = useState(false);
  const meals = day.meals || [];
  const totalProtein = meals.reduce((s, m) => s + (m.proteinG || 0), 0);
  const target = SETTINGS.proteinTarget;
  const pct = Math.min(100, (totalProtein / target) * 100);

  return (
    <div>
      <Card style={{ marginBottom: 14 }}>
        <Eyebrow>Daily Protein · target {target}g</Eyebrow>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 6 }}>
          <Serif size={36}><span style={{ color: totalProtein >= target ? T.forest : T.terra }}>{totalProtein}</span><span style={{ color: T.muted, fontSize: 18 }}>g</span></Serif>
          <div style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", color: T.muted, fontSize: 12 }}>
            {totalProtein < target ? `${target - totalProtein}g to go` : "🎯 hit it"}
          </div>
        </div>
        <div style={{ background: T.boneDark, height: 8, borderRadius: 4, overflow: "hidden", marginTop: 8 }}>
          <div style={{ background: totalProtein >= target ? T.forest : T.terra, height: "100%", width: `${pct}%`, transition: "width 0.4s ease" }} />
        </div>
        {totalProtein > 0 && totalProtein < 80 && (
          <div style={{ marginTop: 10, padding: 8, background: "rgba(184, 84, 47, 0.1)", borderRadius: 4, fontSize: 11, color: T.terra, display: "flex", gap: 6, alignItems: "flex-start" }}>
            <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>Low day so far — under-fueling is your bigger risk than over-eating. Add a snack.</span>
          </div>
        )}
      </Card>

      <Card style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <Eyebrow>Today's Meals</Eyebrow>
          {!adding && <Btn variant="accent" small onClick={() => setAdding(true)}><Plus size={14} style={{ marginRight: 2, verticalAlign: "middle" }} /> Add meal</Btn>}
        </div>
        {adding && <AddMealForm dk={dk} tracker={tracker} onClose={() => setAdding(false)} />}
        {meals.length === 0 && !adding && (
          <div style={{ textAlign: "center", padding: 20, color: T.muted, fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: 13 }}>
            no meals logged yet · snap one to start
          </div>
        )}
        {meals.map((m) => <MealRow key={m.id} meal={m} onDelete={() => {
          tracker.updateDay(dk, (d) => ({ ...d, meals: d.meals.filter((x) => x.id !== m.id) }));
        }} />)}
      </Card>

      <Card style={{ marginBottom: 14 }}>
        <Eyebrow>Hydration</Eyebrow>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
          <Btn variant="soft" small onClick={() => tracker.updateDay(dk, (d) => ({ ...d, hydration: Math.max(0, (d.hydration || 0) - 1) }))}>−</Btn>
          <div style={{ flex: 1, display: "flex", gap: 4 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ flex: 1, height: 22, borderRadius: 3, background: i < day.hydration ? T.forest : T.boneDark, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {i < day.hydration && <Droplet size={11} color={T.bone} fill={T.bone} />}
              </div>
            ))}
          </div>
          <Btn variant="primary" small onClick={() => tracker.updateDay(dk, (d) => ({ ...d, hydration: Math.min(12, (d.hydration || 0) + 1) }))}>+</Btn>
        </div>
        <div style={{ fontSize: 11, color: T.muted, marginTop: 6, textAlign: "center", fontFamily: "'Fraunces', serif", fontStyle: "italic" }}>
          {day.hydration || 0} glasses · clear pee = win
        </div>
      </Card>
    </div>
  );
}

function AddMealForm({ dk, tracker, onClose }) {
  const [photo, setPhoto] = useState(null);
  const [proteinG, setProteinG] = useState("");
  const [foods, setFoods] = useState("");
  const [aiNote, setAiNote] = useState("");
  const [aiSuff, setAiSuff] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const fileRef = useRef(null);

  const handlePhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAnalyzing(true);
    try {
      const b64 = await compressImage(file);
      setPhoto(b64);
      const result = await analyzeMealPhoto(b64);
      setProteinG(result.proteinG?.toString() || "");
      setFoods(result.foods || "");
      setAiNote(result.note || "");
      setAiSuff(result.sufficient);
    } catch (err) { console.error(err); }
    setAnalyzing(false);
  };

  const addQuick = (food) => {
    setFoods(foods ? `${foods}, ${food.name}` : food.name);
    setProteinG((p) => ((+p || 0) + food.p).toString());
  };

  const save = () => {
    const meal = {
      id: Date.now().toString(),
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      foods: foods || "meal", proteinG: +proteinG || 0,
      aiNote, aiSuff, hadPhoto: !!photo
    };
    tracker.updateDay(dk, (d) => ({ ...d, meals: [...(d.meals || []), meal] }));
    onClose();
  };

  return (
    <div style={{ padding: 12, border: `1px solid ${T.line}`, borderRadius: 6, background: "rgba(255,255,255,0.4)" }}>
      {!photo && !analyzing && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button onClick={() => fileRef.current?.click()} style={{
            border: `2px dashed ${T.terra}`, background: "rgba(184, 84, 47, 0.05)",
            padding: 18, borderRadius: 6, cursor: "pointer", color: T.terra,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 6
          }}>
            <Camera size={22} />
            <div style={{ fontSize: 13, fontWeight: 500 }}>Snap meal photo</div>
            <div style={{ fontSize: 10, color: T.muted, fontFamily: "'Fraunces', serif", fontStyle: "italic" }}>AI estimates protein</div>
          </button>
          <div style={{ textAlign: "center", color: T.muted, fontSize: 11, fontFamily: "'Fraunces', serif", fontStyle: "italic" }}>or skip photo, log directly below</div>
        </div>
      )}

      {analyzing && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 20, gap: 8 }}>
          <Loader2 size={18} style={{ color: T.terra, animation: "spin 1s linear infinite" }} />
          <span style={{ fontSize: 12, color: T.muted, fontFamily: "'Fraunces', serif", fontStyle: "italic" }}>analyzing your plate…</span>
        </div>
      )}

      {photo && (
        <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
          <img src={photo} alt="meal" style={{ width: 80, height: 80, borderRadius: 6, objectFit: "cover" }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, letterSpacing: "0.2em", color: T.terra, fontWeight: 600, marginBottom: 4 }}>AI ESTIMATE</div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, color: aiSuff ? T.forest : T.terra }}>~{proteinG}g protein</div>
            <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{aiNote}</div>
          </div>
        </div>
      )}

      <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handlePhoto} style={{ display: "none" }} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 100px", gap: 8, marginBottom: 10 }}>
        <input value={foods} onChange={(e) => setFoods(e.target.value)} placeholder="What did you eat?" style={{
          padding: "8px 10px", border: `1px solid ${T.line}`, borderRadius: 4, background: T.bone, fontSize: 13
        }} />
        <input type="number" inputMode="numeric" value={proteinG} onChange={(e) => setProteinG(e.target.value)} placeholder="g protein" style={{
          padding: "8px 10px", border: `1px solid ${T.line}`, borderRadius: 4, background: T.bone, fontSize: 13
        }} />
      </div>

      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 10, color: T.muted, marginBottom: 4 }}>quick add:</div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {QUICK_FOODS.map((f) => (
            <button key={f.name} onClick={() => addQuick(f)} style={{
              padding: "4px 10px", borderRadius: 100, fontSize: 11,
              border: `1px solid ${T.line}`, background: T.bone, color: T.forest, cursor: "pointer"
            }}>{f.name} <span style={{ color: T.terra }}>+{f.p}</span></button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <Btn variant="primary" onClick={save} small>Save meal</Btn>
        <Btn variant="ghost" onClick={onClose} small>Cancel</Btn>
      </div>
    </div>
  );
}

function MealRow({ meal, onDelete }) {
  return (
    <div style={{ padding: "10px 0", borderTop: `1px solid ${T.line}`, display: "flex", gap: 10, alignItems: "flex-start" }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: T.ink }}>{meal.foods}</div>
          <div style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", color: T.muted, fontSize: 11 }}>{meal.time}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3 }}>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: 18, color: meal.aiSuff !== false ? T.forest : T.terra }}>{meal.proteinG}g</span>
          {meal.hadPhoto && <Sparkles size={11} color={T.terra} />}
          {meal.aiNote && <div style={{ fontSize: 10, color: T.muted, fontStyle: "italic", flex: 1 }}>{meal.aiNote}</div>}
        </div>
      </div>
      <button onClick={onDelete} style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", padding: 2 }}>
        <X size={14} />
      </button>
    </div>
  );
}

function ProgressTab({ tracker, streak, phase }) {
  const days = tracker.data.days;
  const last7 = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return { date: d, key: dKey(d), data: days[dKey(d)] };
  });
  const workoutsThisWeek = last7.filter((d) => d.data?.workout?.completed && d.data?.workout?.type !== "rest").length;
  const handstandsThisWeek = last7.filter((d) => d.data?.handstand).length;
  const stretchesThisWeek = last7.filter((d) => d.data?.stretch).length;
  const meditationsThisWeek = last7.filter((d) => d.data?.meditation).length;
  const showDeload = phase.week === 6 || phase.week === 10;

  return (
    <div>
      {showDeload && (
        <Card accent style={{ marginBottom: 14 }}>
          <Eyebrow color={T.bone}>Week {phase.week} · Deload Check</Eyebrow>
          <Serif size={18} color={T.bone} style={{ marginTop: 4 }}>Feeling fried?</Serif>
          <div style={{ fontSize: 12, color: T.bone, marginTop: 6, opacity: 0.9 }}>
            If yes, drop volume to 60% for 4–5 days. You'll come back stronger.
          </div>
        </Card>
      )}

      <Card dark style={{ marginBottom: 14, textAlign: "center" }}>
        <Eyebrow color={T.terraSoft}>Movement Streak</Eyebrow>
        <Serif size={56} color={T.bone} style={{ marginTop: 4 }}><span style={{ color: T.terra }}>{streak}</span></Serif>
        <div style={{ color: T.terraSoft, fontSize: 12, fontFamily: "'Fraunces', serif", fontStyle: "italic" }}>consecutive day{streak === 1 ? "" : "s"}</div>
      </Card>

      <Card style={{ marginBottom: 14 }}>
        <Eyebrow>This Week</Eyebrow>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginTop: 10 }}>
          {last7.map((d) => {
            const moved = d.data?.workout?.completed || d.data?.handstand || d.data?.stretch;
            return (
              <div key={d.key} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 9, color: T.muted, marginBottom: 4 }}>{dayName(d.date)}</div>
                <div style={{
                  height: 32, borderRadius: 4, background: moved ? T.forest : T.boneDark,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: moved ? T.bone : T.muted, fontSize: 12, fontWeight: 600
                }}>{d.date.getDate()}</div>
              </div>
            );
          })}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginTop: 14 }}>
          <Stat label="Workouts" value={workoutsThisWeek} target={5} />
          <Stat label="Handstands" value={handstandsThisWeek} target={7} />
          <Stat label="Stretch" value={stretchesThisWeek} target={7} />
          <Stat label="Meditation" value={meditationsThisWeek} target={7} />
        </div>
      </Card>

      <PRsCard tracker={tracker} />
    </div>
  );
}

function Stat({ label, value, target }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.5)", padding: 10, borderRadius: 4, border: `1px solid ${T.line}` }}>
      <div style={{ fontSize: 9, color: T.muted, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 3, marginTop: 2 }}>
        <span style={{ fontFamily: "'Fraunces', serif", fontSize: 22, color: value >= target ? T.forest : T.terra }}>{value}</span>
        <span style={{ fontSize: 11, color: T.muted }}>/ {target}</span>
      </div>
    </div>
  );
}

function PRsCard({ tracker }) {
  const tracked = ["back-squat", "deadlift", "ohp", "barbell-row", "hip-thrust"];
  const exNames = { "back-squat": "Squat", "deadlift": "Deadlift", "ohp": "OHP", "barbell-row": "Row", "hip-thrust": "Hip Thrust" };
  const data = tracked.map((id) => {
    const hist = tracker.data.exerciseHistory[id] || [];
    if (!hist.length) return null;
    const top = Math.max(...hist.map((h) => h.weight || 0));
    return { id, name: exNames[id], top, hist };
  }).filter(Boolean);
  const chartEx = data.find((d) => d.hist.length >= 2);
  const chartData = chartEx ? chartEx.hist.map((h) => ({ date: h.date.slice(5), weight: h.weight })) : null;

  return (
    <Card style={{ marginBottom: 14 }}>
      <Eyebrow>Top Sets</Eyebrow>
      {data.length === 0 ? (
        <div style={{ textAlign: "center", padding: 20, color: T.muted, fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: 12 }}>
          log a working set to start tracking
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 6, marginTop: 10, marginBottom: chartData ? 14 : 0 }}>
            {data.map((d) => (
              <div key={d.id} style={{ background: T.bone, padding: 8, borderRadius: 4, border: `1px solid ${T.line}` }}>
                <div style={{ fontSize: 10, color: T.muted }}>{d.name}</div>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, color: T.forest, marginTop: 2 }}>
                  {d.top}<span style={{ color: T.muted, fontSize: 12 }}>kg</span>
                </div>
              </div>
            ))}
          </div>
          {chartData && (
            <div style={{ height: 140, marginTop: 8 }}>
              <div style={{ fontSize: 10, color: T.muted, marginBottom: 4 }}>{chartEx.name} progression</div>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke={T.line} strokeDasharray="2 2" />
                  <XAxis dataKey="date" stroke={T.muted} fontSize={10} />
                  <YAxis stroke={T.muted} fontSize={10} />
                  <Tooltip contentStyle={{ background: T.bone, border: `1px solid ${T.forest}`, borderRadius: 4, fontSize: 11 }} />
                  <Line type="monotone" dataKey="weight" stroke={T.terra} strokeWidth={2} dot={{ fill: T.terra, r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </Card>
  );
}

function BodyTab({ dk, day, tracker }) {
  const fileRef = useRef(null);
  const importRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const setSig = (k, v) => tracker.updateDay(dk, (d) => ({ ...d, bodySignal: { ...d.bodySignal, [k]: v } }));
  const setCycle = (k, v) => tracker.updateDay(dk, (d) => ({ ...d, cycle: { ...d.cycle, [k]: v } }));

  const handlePhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const b64 = await compressImage(file, 350, 0.7);
      tracker.setPhoto(dk, b64);
    } catch (err) { console.error(err); }
    setUploading(false);
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify({
      main: lsGet("tracker-main"),
      photos: lsGet("body-photos"),
      exportedAt: new Date().toISOString()
    }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `training-backup-${dKey(today())}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!confirm("This will replace all your current data. Continue?")) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const d = JSON.parse(ev.target.result);
        if (d.main) lsSet("tracker-main", d.main);
        if (d.photos) lsSet("body-photos", d.photos);
        window.location.reload();
      } catch (err) {
        alert("Could not import: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  const photoEntries = Object.entries(tracker.photos).sort(([a], [b]) => b.localeCompare(a)).slice(0, 8);
  const todayPhoto = tracker.photos[dk];

  return (
    <div>
      <Card style={{ marginBottom: 14 }}>
        <Eyebrow>Body Signals · {dk === dKey(today()) ? "today" : "this day"}</Eyebrow>
        <div style={{ marginTop: 10 }}>
          <button onClick={() => setSig("pain", !day.bodySignal?.pain)} style={{
            width: "100%", padding: 12, borderRadius: 6,
            background: day.bodySignal?.pain ? T.terra : "rgba(255,255,255,0.6)",
            color: day.bodySignal?.pain ? T.bone : T.ink,
            border: `1px solid ${day.bodySignal?.pain ? T.terra : T.line}`,
            cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 10
          }}>
            <AlertCircle size={18} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{day.bodySignal?.pain ? "Pain logged today" : "Any pain or twinges?"}</div>
              <div style={{ fontSize: 10, opacity: 0.85, marginTop: 1 }}>tap if anything sharp · femur or shins → rest 48h</div>
            </div>
          </button>
          {day.bodySignal?.pain && (
            <div style={{ marginTop: 8, padding: 10, background: "rgba(184, 84, 47, 0.08)", borderRadius: 4 }}>
              <input value={day.bodySignal.location || ""} onChange={(e) => setSig("location", e.target.value)} placeholder="Where? (e.g., right hip, shin)"
                style={{ width: "100%", padding: "6px 8px", border: `1px solid ${T.line}`, borderRadius: 4, background: T.bone, fontSize: 12, marginBottom: 6 }} />
              <textarea value={day.bodySignal.notes || ""} onChange={(e) => setSig("notes", e.target.value)} placeholder="Notes" rows={2}
                style={{ width: "100%", padding: "6px 8px", border: `1px solid ${T.line}`, borderRadius: 4, background: T.bone, fontSize: 12, resize: "vertical", fontFamily: "inherit" }} />
            </div>
          )}
        </div>
      </Card>

      <Card style={{ marginBottom: 14 }}>
        <Eyebrow>Cycle</Eyebrow>
        <div style={{ marginTop: 10 }}>
          <button onClick={() => setCycle("period", !day.cycle?.period)} style={{
            width: "100%", padding: 10, borderRadius: 6,
            background: day.cycle?.period ? T.forest : "rgba(255,255,255,0.6)",
            color: day.cycle?.period ? T.bone : T.ink,
            border: `1px solid ${day.cycle?.period ? T.forest : T.line}`,
            cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 10
          }}>
            <Heart size={16} fill={day.cycle?.period ? T.terra : "none"} color={day.cycle?.period ? T.terra : T.muted} />
            <span style={{ fontSize: 13, fontWeight: 500 }}>{day.cycle?.period ? "Period day logged" : "Period day"}</span>
          </button>
        </div>
      </Card>

      <Card style={{ marginBottom: 14 }}>
        <Eyebrow>Sunday Photo Reel</Eyebrow>
        <div style={{ marginTop: 10 }}>
          {todayPhoto ? (
            <div style={{ position: "relative", marginBottom: 10 }}>
              <img src={todayPhoto} alt="today" style={{ width: "100%", borderRadius: 6 }} />
              <button onClick={() => tracker.removePhoto(dk)} style={{
                position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.5)",
                border: "none", borderRadius: "50%", width: 28, height: 28, color: "white",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
              }}><Trash2 size={14} /></button>
            </div>
          ) : (
            <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{
              width: "100%", padding: 16, border: `2px dashed ${T.terra}`, borderRadius: 6,
              background: "rgba(184, 84, 47, 0.05)", color: T.terra, cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 6
            }}>
              {uploading ? <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} /> : <Camera size={20} />}
              <div style={{ fontSize: 12, fontWeight: 500 }}>{uploading ? "saving…" : "Add photo for this day"}</div>
              <div style={{ fontSize: 10, color: T.muted, fontFamily: "'Fraunces', serif", fontStyle: "italic" }}>same lighting, same spot</div>
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display: "none" }} />
        </div>
        {photoEntries.length > 0 && (
          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 10, color: T.muted, marginBottom: 6 }}>Recent</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4 }}>
              {photoEntries.map(([k, src]) => (
                <div key={k} style={{ aspectRatio: "1", position: "relative", borderRadius: 4, overflow: "hidden" }}>
                  <img src={src} alt={k} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0,
                    background: "linear-gradient(transparent, rgba(0,0,0,0.7))", color: "white",
                    fontSize: 9, padding: "12px 4px 4px", textAlign: "center" }}>{k.slice(5)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      <Card style={{ marginBottom: 14 }}>
        <Eyebrow>Backup &amp; Restore</Eyebrow>
        <div style={{ fontSize: 11, color: T.muted, marginTop: 6, marginBottom: 10, fontFamily: "'Fraunces', serif", fontStyle: "italic" }}>
          iOS Safari can clear app data after long inactivity. Export monthly to be safe.
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn variant="primary" small onClick={exportData}><Download size={12} style={{ verticalAlign: "middle", marginRight: 4 }} />Export</Btn>
          <Btn variant="soft" small onClick={() => importRef.current?.click()}><Upload size={12} style={{ verticalAlign: "middle", marginRight: 4 }} />Restore</Btn>
        </div>
        <input ref={importRef} type="file" accept="application/json" onChange={importData} style={{ display: "none" }} />
      </Card>
    </div>
  );
}

function BottomNav({ tab, setTab }) {
  const tabs = [
    { id: "today", label: "Today", icon: Activity },
    { id: "food", label: "Food", icon: Coffee },
    { id: "progress", label: "Progress", icon: BarChart3 },
    { id: "body", label: "Body", icon: User }
  ];
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: T.bone, borderTop: `1px solid ${T.forest}`,
      padding: "10px 0 max(10px, env(safe-area-inset-bottom))",
      display: "flex", justifyContent: "center", zIndex: 50
    }}>
      <div style={{ display: "flex", justifyContent: "space-around", maxWidth: 480, width: "100%" }}>
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              background: "none", border: "none", padding: 4, cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
              flex: 1, color: active ? T.terra : T.muted
            }}>
              <Icon size={20} strokeWidth={active ? 2 : 1.5} />
              <span style={{ fontSize: 10, fontWeight: active ? 600 : 500, letterSpacing: "0.08em", textTransform: "uppercase" }}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Coffee(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
      <line x1="6" x2="6" y1="2" y2="4" />
      <line x1="10" x2="10" y1="2" y2="4" />
      <line x1="14" x2="14" y1="2" y2="4" />
    </svg>
  );
}
