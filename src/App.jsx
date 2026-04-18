import { useState, useEffect } from "react";
import { Check, Calendar, TrendingUp, Heart, Target, Zap, Coffee, Home, Dumbbell, Wind, MapPin, Award, AlertCircle, Info, ChevronDown, ChevronUp, Clock, CalendarDays, ChevronLeft, ChevronRight, Moon, Trophy, Download, Upload } from "lucide-react";

// ===== DATA =====
const ALLURES = {
  EF: { label: "Endurance fondamentale", pace: "6:15-6:45", fc: "65-75%", color: "#2563eb" },
  EA: { label: "Endurance active", pace: "5:45-6:00", fc: "75-80%", color: "#0891b2" },
  AS: { label: "Allure spécifique semi", pace: "5:27", fc: "82-87%", color: "#d97706" },
  SEUIL: { label: "Seuil anaérobie", pace: "5:10-5:15", fc: "87-92%", color: "#ea580c" },
  VMA_L: { label: "VMA longue", pace: "4:45-5:00", fc: "92-96%", color: "#dc2626" },
  VMA_C: { label: "VMA courte", pace: "4:20-4:35", fc: "96-100%", color: "#991b1b" },
  SL: { label: "Sortie longue", pace: "6:00-6:30", fc: "70-78%", color: "#059669" },
};

const PHASE_COLORS = {
  "Foncier": { bg: "#dbeafe", text: "#1e40af", accent: "#3b82f6" },
  "Foncier - Décharge": { bg: "#bfdbfe", text: "#1e40af", accent: "#60a5fa" },
  "Spécifique": { bg: "#fed7aa", text: "#9a3412", accent: "#f97316" },
  "Spécifique - Décharge": { bg: "#fde68a", text: "#92400e", accent: "#f59e0b" },
  "Affûtage": { bg: "#fecaca", text: "#991b1b", accent: "#ef4444" },
  "Affûtage - Pré-tapering": { bg: "#fca5a5", text: "#7f1d1d", accent: "#dc2626" },
  "Tapering - Semaine course": { bg: "#bbf7d0", text: "#14532d", accent: "#10b981" },
};

const JOURS = ["mardi", "mercredi", "vendredi", "dimanche"];
const JOUR_ICONS = { mardi: Dumbbell, mercredi: Zap, vendredi: Wind, dimanche: Target };

const PLAN = [
  {semaine:1,phase:"Foncier",theme:"Reprise en douceur - Retrouver les sensations",volume_km:22,charge:"Légère",seances:{
    mardi:{type:"Pilates + Renfo bas",duree:"60 min pilates + 30 min renfo",details:"Pilates classique 18h. Après: 3 tours de (15 squats, 12 fentes/jambe, 20 mollets, 30s gainage). Récupération 1 min entre tours.",km:0},
    mercredi:{type:"Footing + Lignes droites",duree:"45 min",details:"Échauff: 10 min marche+footing très lent. Corps: 30 min EF (6:30/km). 6x80m lignes droites en accélération progressive (récup marche retour). Retour calme: 5 min.",km:6},
    vendredi:{type:"Endurance fondamentale",duree:"45 min",details:"Échauff: 5 min marche. Corps: 40 min en EF strict (6:30-6:45/km). Si elle a une montre cardio: rester entre 65-75% FCmax. Retour calme: étirements 10 min.",km:6},
    dimanche:{type:"Sortie longue",duree:"1h10",details:"Échauff: 10 min footing très lent. Corps: 1h en SL (6:15-6:30/km). Terrain plat ou légèrement vallonné. Hydratation si >1h. Retour calme: étirements complets.",km:10}}},
  {semaine:2,phase:"Foncier",theme:"Augmentation progressive du volume",volume_km:26,charge:"Modérée",seances:{
    mardi:{type:"Pilates + Renfo bas",duree:"60 min pilates + 35 min renfo",details:"Pilates. Puis: 3 tours de (20 squats, 12 fentes/jambe, 15 squats sautés légers, 30 mollets, 45s gainage). Récup 1 min.",km:0},
    mercredi:{type:"Fartlek découverte",duree:"50 min",details:"Échauff: 15 min EF. Corps: 8x (1 min allure modérée seuil 5:15/km + 1 min EF récup). Retour calme: 10 min footing lent + étirements.",km:7},
    vendredi:{type:"Endurance fondamentale",duree:"50 min",details:"45 min en EF (6:30/km) + 5 min retour calme. Objectif: aisance respiratoire, pouvoir tenir une conversation.",km:7},
    dimanche:{type:"Sortie longue",duree:"1h20",details:"Échauff: 10 min. Corps: 1h10 en SL (6:15-6:30/km). Ressentir le plaisir de courir long sans forcer. Hydratation toutes les 30 min.",km:12}}},
  {semaine:3,phase:"Foncier",theme:"🏔️ SÉJOUR À CHÂTEL - Adaptation montagne",volume_km:30,charge:"Modérée+",seances:{
    mardi:{type:"Randonnée active + étirements",duree:"1h30 rando + 20 min étirements",details:"JOUR D'ARRIVÉE/ACCLIMATATION: pas de renfo ni pilates. Randonnée active 1h30 à allure tranquille (reconnaissance du terrain + acclimatation altitude). Bien s'hydrater (2L d'eau minimum). Étirements doux au retour. Objectif: réveiller le corps en douceur à l'altitude.",km:0},
    mercredi:{type:"⛰️ Côtes courtes (montagne)",duree:"55 min",details:"Trouver une côte de 200-300m à pente modérée (5-8%). Échauff: 15 min footing très lent + gammes. Corps: 8x montée en 1min15-1min30 en effort soutenu (allure seuil, PAS sprint) + descente en trot récup. Si altitude trop gênante: réduire à 6 reps. Retour calme: 10 min.",km:8},
    vendredi:{type:"EF vallonnée (altitude)",duree:"45 min",details:"Échauff: 5 min marche. Corps: 40 min en EF vallonnée (6:45-7:00/km, allure AJUSTÉE à l'altitude, ne pas chercher à tenir 6:30). Si elle a une montre cardio: rester entre 65-75% FCmax. Profiter des paysages ! Retour calme: étirements.",km:7},
    dimanche:{type:"SL vallonnée montagne",duree:"1h30",details:"Échauff: 10 min. Corps: 1h20 en SL vallonnée (6:30-7:00/km) avec 250-300m D+ cumulé. Emporter ceinture d'hydratation (2 flasks minimum). En altitude, boire toutes les 20 min même sans soif. Retour calme: étirements complets.",km:15}}},
  {semaine:4,phase:"Foncier - Décharge",theme:"🏔️ CHÂTEL (fin séjour) - Décharge en montagne",volume_km:22,charge:"Allégée (-30%)",seances:{
    mardi:{type:"Yoga / stretching / marche",duree:"45 min",details:"Session étirements + mobilité douce, OU randonnée légère 1h. PAS de pilates, PAS de renfo. Semaine de décharge - on laisse le corps bénéficier de l'altitude sans stress supplémentaire.",km:0},
    mercredi:{type:"Footing vallonné léger",duree:"40 min",details:"Échauff: 10 min marche+trot. Corps: 25 min EF vallonné (7:00/km, très tranquille) + 4x80m lignes droites en descente (douces). Retour calme: 5 min.",km:6},
    vendredi:{type:"EF courte (vallée si possible)",duree:"40 min",details:"35 min EF (6:45/km sur terrain plat si possible dans la vallée) + 5 min retour calme. Si retour de Châtel ce jour-là: session très légère après la route.",km:6},
    dimanche:{type:"SL modérée vallonnée",duree:"1h10",details:"1h en SL vallonnée modérée (6:30-7:00/km). Terrain plat à légèrement vallonné selon où elle est (Châtel ou retour). Plaisir avant performance. Cette séance marque la fin du séjour montagne.",km:10}}},
  {semaine:5,phase:"Spécifique",theme:"Introduction VMA - Développement de la puissance",volume_km:30,charge:"Modérée+",seances:{
    mardi:{type:"Pilates + Renfo bas",duree:"60 min pilates + 35 min renfo",details:"Pilates. Renfo: 3 tours de (20 squats, 12 fentes bulgares/jambe, 15 soulevés de terre jambes tendues, 20 mollets unijambe/côté, 1 min gainage plank).",km:0},
    mercredi:{type:"VMA 30/30",duree:"50 min",details:"Échauff: 15 min EF + 5 min gammes (talons-fesses, montées de genoux, pas chassés). Corps: 2 séries de 10x(30s allure VMA 4:30/km + 30s trot récup). Récup 3 min EF entre séries. Retour calme: 10 min.",km:8},
    vendredi:{type:"Endurance fondamentale",duree:"55 min",details:"55 min en EF (6:30/km). Possibilité de finir par 5 min en EA (5:50/km) pour activer.",km:9},
    dimanche:{type:"Sortie longue progressive",duree:"1h35",details:"Échauff: 10 min. Corps: 1h05 en SL (6:15/km) + 20 min en EA (5:45-6:00/km). Retour calme: étirements.",km:13}}},
  {semaine:6,phase:"Spécifique",theme:"Travail seuil + introduction allure semi",volume_km:32,charge:"Soutenue",seances:{
    mardi:{type:"Pilates + Renfo bas",duree:"60 min pilates + 35 min renfo",details:"Pilates. Renfo: 3 tours de (20 squats jump légers, 12 fentes marchées/jambe, 15 ponts fessiers unijambe/côté, 30 mollets, 45s gainage + 30s/côté latéral).",km:0},
    mercredi:{type:"Seuil long",duree:"60 min",details:"Échauff: 15 min EF + 5 min gammes. Corps: 3x 8 min au seuil (5:10/km) avec 2 min 30 récup active EF. Retour calme: 10 min.",km:10},
    vendredi:{type:"EF + allure semi",duree:"55 min",details:"Échauff: 15 min EF. Corps: 30 min en EF + 10 min en AS (5:27/km) pour 'goûter' à l'allure cible. Retour calme: 5 min.",km:9},
    dimanche:{type:"Sortie longue avec AS",duree:"1h45",details:"Échauff: 10 min. Corps: 1h en SL (6:15/km) + 25 min en AS (5:27/km). Retour calme: 10 min. Ravito eau + gel ou fruit après 45 min.",km:13}}},
  {semaine:7,phase:"Spécifique",theme:"Charge maximale avant décharge",volume_km:35,charge:"Forte (pic charge)",seances:{
    mardi:{type:"Pilates + Renfo bas",duree:"60 min pilates + 35 min renfo",details:"Pilates. Renfo: 4 tours de (15 squats lourds, 10 fentes bulgares/jambe, 12 soulevés terre, 20 mollets, 1 min gainage + 30s/côté).",km:0},
    mercredi:{type:"VMA longue",duree:"60 min",details:"Échauff: 15 min EF + 5 min gammes + 4x80m lignes. Corps: 6x 1000m en VMA longue (4:50/km) avec 2 min 30 récup active. Retour calme: 10 min.",km:11},
    vendredi:{type:"EF longue",duree:"60 min",details:"1h en EF (6:20-6:30/km). Sortie d'entretien, pas de qualité, on reste tranquille avant le dimanche.",km:10},
    dimanche:{type:"Sortie longue spécifique",duree:"1h50",details:"Échauff: 10 min. Corps: 50 min SL (6:15/km) + 40 min en AS (5:27/km) + 10 min EF. Ravito oblig: eau + gel/fruit à 45 min et 1h15. Tester la stratégie nutrition de course.",km:14}}},
  {semaine:8,phase:"Spécifique - Décharge",theme:"Récupération - Préparer la phase d'affûtage",volume_km:25,charge:"Allégée (-30%)",seances:{
    mardi:{type:"Pilates seul",duree:"60 min",details:"Pilates classique, pas de renfo. Semaine de récupération active.",km:0},
    mercredi:{type:"VMA courte allégée",duree:"45 min",details:"Échauff: 15 min EF + gammes. Corps: 8x 200m en VMA courte (4:25/km) avec 1 min 30 récup marchée. Sensation de facilité. Retour calme: 10 min.",km:7},
    vendredi:{type:"Endurance fondamentale",duree:"45 min",details:"45 min en EF (6:30/km) tranquille. Plaisir.",km:7},
    dimanche:{type:"Sortie longue décharge",duree:"1h20",details:"1h10 en SL (6:15-6:30/km) + 10 min retour calme. On récupère pour attaquer la phase finale.",km:11}}},
  {semaine:9,phase:"Affûtage",theme:"Travail spécifique semi à haute intensité",volume_km:33,charge:"Soutenue",seances:{
    mardi:{type:"Pilates + Renfo bas léger",duree:"60 min pilates + 25 min renfo",details:"Pilates. Renfo léger: 2 tours (15 squats, 10 fentes/jambe, 20 mollets, 45s gainage). On entre dans la phase d'affûtage, on réduit le renfo lourd.",km:0},
    mercredi:{type:"Seuil + AS",duree:"60 min",details:"Échauff: 15 min EF + gammes. Corps: 2x 10 min seuil (5:10/km) avec 3 min récup EF + 3x 5 min en AS (5:27/km) avec 2 min EF. Retour calme: 10 min.",km:11},
    vendredi:{type:"EF avec AS finale",duree:"50 min",details:"Échauff: 10 min. Corps: 30 min EF + 10 min AS (5:27/km). Retour calme: 5 min.",km:8},
    dimanche:{type:"Sortie longue spécifique semi",duree:"1h45",details:"Échauff: 10 min. Corps: 45 min SL (6:15/km) + 45 min en AS (5:27/km) + 5 min retour calme. Simulation mentale: imaginer la 2e partie du semi. Ravito eau+gel à 45 min et 1h20.",km:14}}},
  {semaine:10,phase:"Affûtage",theme:"Dernier pic de qualité - Confiance",volume_km:30,charge:"Soutenue",seances:{
    mardi:{type:"Pilates + Renfo bas léger",duree:"60 min pilates + 20 min renfo",details:"Pilates. Renfo léger et fonctionnel: 2 tours (15 squats, 10 fentes/jambe, 20 mollets, 30s gainage). Pas de charge lourde.",km:0},
    mercredi:{type:"VMA mixte",duree:"55 min",details:"Échauff: 15 min EF + gammes. Corps: 1000m VMA longue (4:50/km) + 2 min récup + 3x 400m VMA courte (4:25/km) avec 1 min 30 récup + 2x 200m rapide (4:20/km) avec 1 min récup. Retour calme: 10 min.",km:9},
    vendredi:{type:"EF courte",duree:"45 min",details:"45 min EF (6:30/km). Jambes légères, pas de forcing.",km:7},
    dimanche:{type:"Course préparatoire (10 km)",duree:"1h20",details:"Option 1 (IDÉAL): faire une course 10 km officielle en visant 52-53 min (allure 5:15-5:20/km). Option 2: 1h10 en progression: 30 min SL + 30 min à 5:20/km + 10 min retour calme. Test grandeur nature mental + nutrition.",km:14}}},
  {semaine:11,phase:"Affûtage - Pré-tapering",theme:"Réduction volume - Maintien qualité",volume_km:24,charge:"Allégée",seances:{
    mardi:{type:"Pilates seul",duree:"60 min",details:"Pilates classique, plus de renfo jusqu'à la course. On préserve la fraîcheur musculaire.",km:0},
    mercredi:{type:"Seuil court + AS",duree:"50 min",details:"Échauff: 15 min EF + gammes. Corps: 2x 6 min seuil (5:10/km) récup 2 min + 2x 5 min AS (5:27/km) récup 2 min. Retour calme: 10 min.",km:9},
    vendredi:{type:"EF courte",duree:"35 min",details:"30 min EF + 5 min retour calme. Très tranquille, on stocke l'énergie.",km:5},
    dimanche:{type:"Sortie moyenne avec AS",duree:"1h15",details:"Échauff: 10 min. Corps: 35 min SL + 20 min AS (5:27/km) + 10 min retour calme. Dernière grosse sortie avant le semi.",km:10}}},
  {semaine:12,phase:"Tapering - Semaine course",theme:"Affûtage final - Jour J",volume_km:15,charge:"Très légère - Repos relatif",seances:{
    mardi:{type:"Pilates léger",duree:"45 min",details:"Pilates léger et doux, centré sur mobilité et respiration. Pas de forcing.",km:0},
    mercredi:{type:"Activation légère",duree:"30 min",details:"Échauff: 10 min EF. Corps: 5 min EF + 3x 2 min en AS (5:27/km) avec 2 min EF récup. Retour calme: 5 min.",km:5},
    vendredi:{type:"Déblocage pré-course",duree:"20 min",details:"15 min EF très tranquille + 3x 30s lignes droites accélération. Pas plus. Objectif: jambes fraîches pour dimanche.",km:3},
    dimanche:{type:"🏁 SEMI-MARATHON 🏁",duree:"~1h55",details:"JOUR J. Échauff: 15 min footing très lent + 3-4 lignes droites + étirements dynamiques. Stratégie course: partir en EXACTEMENT 5:27/km (résister à l'euphorie du départ!). Contrôle au 10km (~54:30). Si sensations OK au 15km, accélérer légèrement sur les 6 derniers km. Ravito eau à chaque stand, gel à 1h00 et 1h30. Mental: se diviser la course en 3 tiers de 7km.",km:21}}},
];

// ===== APP =====
export default function App() {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [completed, setCompleted] = useState({});
  const [expandedWeek, setExpandedWeek] = useState(1);
  const [tab, setTab] = useState("plan");
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("2026-08-17"); // Lundi par défaut (semi le 8 nov 2026)

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("plan_semi_completed");
      if (saved) {
        setCompleted(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Erreur chargement suivi:", e);
    }
    try {
      const savedDate = localStorage.getItem("plan_semi_start_date");
      if (savedDate) {
        setStartDate(savedDate);
      }
    } catch (e) {
      console.error("Erreur chargement date:", e);
    }
    setLoading(false);
  }, []);

  // Save to localStorage
  const saveCompleted = (newCompleted) => {
    setCompleted(newCompleted);
    try {
      localStorage.setItem("plan_semi_completed", JSON.stringify(newCompleted));
    } catch (e) {
      console.error("Erreur sauvegarde:", e);
    }
  };

  const saveStartDate = (newDate) => {
    setStartDate(newDate);
    try {
      localStorage.setItem("plan_semi_start_date", newDate);
    } catch (e) {
      console.error("Erreur sauvegarde date:", e);
    }
  };

  const toggleSeance = (sem, jour) => {
    const key = `${sem}_${jour}`;
    const newCompleted = { ...completed };
    if (newCompleted[key]) {
      delete newCompleted[key];
    } else {
      newCompleted[key] = { date: new Date().toISOString() };
    }
    saveCompleted(newCompleted);
  };

  const resetAll = () => {
    if (confirm("Réinitialiser tout le suivi ? Cette action est irréversible.")) {
      saveCompleted({});
    }
  };

  // Export des données en JSON
  const exportData = () => {
    const data = {
      version: "1.0",
      exportDate: new Date().toISOString(),
      startDate: startDate,
      completed: completed,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const today = new Date().toISOString().split("T")[0];
    a.download = `semi-marathon-backup-${today}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    // Stocker la date du dernier export
    try {
      localStorage.setItem("plan_semi_last_export", new Date().toISOString());
    } catch (e) {}
  };

  // Détection de la dernière export (pour suggestion de backup)
  const [lastExport, setLastExport] = useState(null);
  useEffect(() => {
    try {
      const saved = localStorage.getItem("plan_semi_last_export");
      if (saved) setLastExport(new Date(saved));
    } catch (e) {}
  }, [completed]);

  // Import des données depuis un fichier JSON
  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.completed && typeof data.completed === "object") {
          if (confirm(`Restaurer ce backup ?\n\n• ${Object.keys(data.completed).length} séances\n• Date de début : ${data.startDate || "non définie"}\n• Exporté le : ${data.exportDate ? new Date(data.exportDate).toLocaleDateString("fr-FR") : "inconnue"}\n\nCela écrasera les données actuelles.`)) {
            saveCompleted(data.completed);
            if (data.startDate) {
              saveStartDate(data.startDate);
            }
            alert("✅ Données restaurées avec succès !");
          }
        } else {
          alert("❌ Fichier de backup invalide");
        }
      } catch (err) {
        alert("❌ Erreur de lecture : " + err.message);
      }
    };
    reader.readAsText(file);
    event.target.value = ""; // Reset l'input pour pouvoir ré-importer le même fichier
  };

  // Stats
  const totalSeances = PLAN.length * 4;
  const seancesFaites = Object.keys(completed).length;
  const progression = Math.round((seancesFaites / totalSeances) * 100);
  const kmTotal = PLAN.reduce((acc, s) => acc + s.volume_km, 0);
  const kmFaits = PLAN.reduce((acc, s) => {
    return acc + JOURS.reduce((jacc, j) => {
      const key = `${s.semaine}_${j}`;
      return jacc + (completed[key] ? s.seances[j].km : 0);
    }, 0);
  }, 0);

  // Warning backup
  const daysSinceExport = lastExport ? Math.floor((Date.now() - lastExport.getTime()) / (1000 * 60 * 60 * 24)) : null;
  const showBackupWarning = seancesFaites > 0 && (lastExport === null || daysSinceExport >= 5);

  if (loading) {
    return (
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Fraunces', serif",background:"#fafaf7"}}>
        <div style={{color:"#7c2d12"}}>Chargement...</div>
      </div>
    );
  }

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(180deg, #fafaf7 0%, #f5f1e8 100%)",fontFamily:"'Inter', system-ui, sans-serif",color:"#1c1917"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;0,700;0,900;1,400&family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
        button { cursor: pointer; font-family: inherit; }
        input, textarea, button { font-family: inherit; }
        .week-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .week-card:hover { transform: translateY(-2px); }
        .seance-check { transition: all 0.2s ease; min-width: 32px; min-height: 32px; }
        .seance-check:hover { transform: scale(1.05); }
        @keyframes slideDown {
          from { opacity: 0; max-height: 0; }
          to { opacity: 1; max-height: 2000px; }
        }
        .expanded { animation: slideDown 0.4s ease-out; overflow: hidden; }
        @keyframes checkPop {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .check-pop { animation: checkPop 0.3s ease-out; }
        /* Tap targets mobile */
        @media (max-width: 640px) {
          button { min-height: 44px; }
          h1 { font-size: 28px !important; }
          h2 { font-size: 22px !important; }
        }
        /* Scroll smooth */
        html { scroll-behavior: smooth; -webkit-overflow-scrolling: touch; }
        /* Pas de zoom sur les inputs iOS */
        input[type="date"] { font-size: 16px !important; }
      `}</style>

      {/* HEADER */}
      <header style={{background:"#1c1917",color:"#fafaf7",padding:"32px 24px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:"-50px",right:"-50px",width:"200px",height:"200px",borderRadius:"50%",background:"radial-gradient(circle, #dc2626 0%, transparent 70%)",opacity:0.3}} />
        <div style={{maxWidth:"1200px",margin:"0 auto",position:"relative",zIndex:1}}>
          <div style={{fontSize:"11px",letterSpacing:"4px",textTransform:"uppercase",color:"#a8a29e",marginBottom:"8px"}}>Plan d'entraînement personnalisé</div>
          <h1 style={{fontFamily:"'Fraunces', serif",fontSize:"clamp(32px, 5vw, 52px)",fontWeight:900,margin:"0 0 8px 0",letterSpacing:"-0.02em",lineHeight:1.05}}>
            Semi-Marathon <span style={{color:"#dc2626",fontStyle:"italic",fontWeight:400}}>1h55</span>
          </h1>
          <div style={{fontSize:"14px",color:"#d6d3d1",maxWidth:"600px",lineHeight:1.6}}>
            12 semaines · 3 séances course/semaine · Allure cible 5:27/km
          </div>
        </div>
      </header>

      {/* STATS BAR */}
      <div style={{background:"#fff",borderBottom:"1px solid #e7e5e4",padding:"20px 24px"}}>
        <div style={{maxWidth:"1200px",margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))",gap:"20px"}}>
          <StatCard icon={TrendingUp} label="Progression" value={`${progression}%`} sub={`${seancesFaites}/${totalSeances} séances`} color="#dc2626" />
          <StatCard icon={MapPin} label="Kilomètres parcourus" value={`${kmFaits} km`} sub={`sur ${kmTotal} km prévus`} color="#2563eb" />
          <StatCard icon={Calendar} label="Semaine en cours" value={`S${selectedWeek}`} sub={PLAN[selectedWeek-1].phase} color="#059669" />
          <StatCard icon={Target} label="Objectif final" value="1h55:00" sub="allure 5:27/km" color="#d97706" />
        </div>
        <div style={{maxWidth:"1200px",margin:"16px auto 0",height:"6px",background:"#f5f5f4",borderRadius:"3px",overflow:"hidden"}}>
          <div style={{height:"100%",width:`${progression}%`,background:"linear-gradient(90deg, #dc2626 0%, #f97316 100%)",transition:"width 0.5s ease",borderRadius:"3px"}} />
        </div>
      </div>

      {/* Warning backup */}
      {showBackupWarning && (
        <div style={{background:"#fef3c7",borderBottom:"1px solid #fde68a",padding:"10px 24px"}}>
          <div style={{maxWidth:"1200px",margin:"0 auto",display:"flex",alignItems:"center",gap:"12px",flexWrap:"wrap"}}>
            <AlertCircle size={18} color="#92400e" style={{flexShrink:0}} />
            <div style={{flex:1,fontSize:"13px",color:"#78350f",minWidth:"200px"}}>
              {lastExport === null ? (
                <span>💾 <b>Pense à sauvegarder tes données</b> — sur iPhone, Safari peut les effacer après 7 jours d'inactivité</span>
              ) : (
                <span>💾 <b>Dernier backup : il y a {daysSinceExport} jour{daysSinceExport > 1 ? "s" : ""}</b> — pense à refaire un export pour être safe</span>
              )}
            </div>
            <button onClick={exportData} style={{background:"#d97706",color:"#fff",border:"none",padding:"6px 12px",borderRadius:"6px",fontSize:"12px",fontWeight:600,display:"flex",alignItems:"center",gap:"4px"}}>
              <Download size={12} /> Exporter maintenant
            </button>
          </div>
        </div>
      )}

      {/* TABS */}
      <div style={{background:"#fff",borderBottom:"1px solid #e7e5e4",padding:"0 24px",position:"sticky",top:0,zIndex:10}}>
        <div style={{maxWidth:"1200px",margin:"0 auto",display:"flex",gap:"4px",overflowX:"auto"}}>
          <TabButton active={tab==="plan"} onClick={()=>setTab("plan")} icon={Calendar} label="Plan semaines" />
          <TabButton active={tab==="calendrier"} onClick={()=>setTab("calendrier")} icon={CalendarDays} label="Calendrier" />
          <TabButton active={tab==="allures"} onClick={()=>setTab("allures")} icon={Zap} label="Allures" />
          <TabButton active={tab==="cotes"} onClick={()=>setTab("cotes")} icon={TrendingUp} label="Côtes & Montagne" />
          <TabButton active={tab==="conseils"} onClick={()=>setTab("conseils")} icon={Info} label="Conseils" />
          <TabButton active={tab==="jourj"} onClick={()=>setTab("jourj")} icon={Award} label="Jour J" />
        </div>
      </div>

      {/* CONTENT */}
      <main style={{maxWidth:"1200px",margin:"0 auto",padding:"32px 24px"}}>
        {tab === "plan" && (
          <div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"24px",flexWrap:"wrap",gap:"12px"}}>
              <h2 style={{fontFamily:"'Fraunces', serif",fontSize:"28px",fontWeight:600,margin:0,color:"#1c1917"}}>
                Plan semaine par semaine
              </h2>
              <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
                <button onClick={exportData} style={{background:"#1c1917",border:"1px solid #1c1917",color:"#fff",padding:"8px 14px",borderRadius:"6px",fontSize:"13px",display:"flex",alignItems:"center",gap:"6px",fontWeight:500}} title="Télécharger un backup JSON">
                  <Download size={14} /> Export
                </button>
                <label style={{background:"#fff",border:"1px solid #1c1917",color:"#1c1917",padding:"8px 14px",borderRadius:"6px",fontSize:"13px",display:"flex",alignItems:"center",gap:"6px",fontWeight:500,cursor:"pointer"}} title="Restaurer depuis un backup">
                  <Upload size={14} /> Import
                  <input type="file" accept=".json,application/json" onChange={importData} style={{display:"none"}} />
                </label>
                <button onClick={resetAll} style={{background:"transparent",border:"1px solid #e7e5e4",color:"#78716c",padding:"8px 14px",borderRadius:"6px",fontSize:"13px"}}>
                  Réinitialiser
                </button>
              </div>
            </div>

            {/* Navigation semaines */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(70px, 1fr))",gap:"6px",marginBottom:"32px"}}>
              {PLAN.map(sem => {
                const phaseColors = PHASE_COLORS[sem.phase];
                const seancesFaitesSem = JOURS.filter(j => completed[`${sem.semaine}_${j}`]).length;
                const isActive = selectedWeek === sem.semaine;
                return (
                  <button
                    key={sem.semaine}
                    onClick={() => { setSelectedWeek(sem.semaine); setExpandedWeek(sem.semaine); }}
                    style={{
                      padding:"12px 8px",
                      background: isActive ? phaseColors.accent : phaseColors.bg,
                      color: isActive ? "#fff" : phaseColors.text,
                      border: "none",
                      borderRadius:"8px",
                      fontSize:"12px",
                      fontWeight:600,
                      transition:"all 0.2s",
                      position:"relative",
                    }}
                  >
                    <div style={{fontSize:"16px",fontWeight:700}}>S{sem.semaine}</div>
                    <div style={{fontSize:"10px",opacity:0.8,marginTop:"2px"}}>{seancesFaitesSem}/4</div>
                  </button>
                );
              })}
            </div>

            {/* Cards semaines */}
            {PLAN.map(sem => (
              <WeekCard
                key={sem.semaine}
                sem={sem}
                expanded={expandedWeek === sem.semaine}
                onToggle={() => setExpandedWeek(expandedWeek === sem.semaine ? null : sem.semaine)}
                completed={completed}
                onToggleSeance={toggleSeance}
              />
            ))}
          </div>
        )}

        {tab === "calendrier" && <CalendrierTab startDate={startDate} setStartDate={saveStartDate} completed={completed} onToggleSeance={toggleSeance} />}
        {tab === "allures" && <AlluresTab />}
        {tab === "cotes" && <CotesTab />}
        {tab === "conseils" && <ConseilsTab />}
        {tab === "jourj" && <JourJTab />}
      </main>

      <footer style={{textAlign:"center",padding:"32px 24px",color:"#a8a29e",fontSize:"12px",borderTop:"1px solid #e7e5e4",marginTop:"40px"}}>
        Plan construit sur-mesure · Objectif 1h55 au semi-marathon
      </footer>
    </div>
  );
}

// ===== COMPONENTS =====

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:"14px"}}>
      <div style={{width:"44px",height:"44px",background:`${color}15`,borderRadius:"10px",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        <Icon size={20} color={color} strokeWidth={2.2} />
      </div>
      <div>
        <div style={{fontSize:"11px",textTransform:"uppercase",letterSpacing:"1px",color:"#78716c",fontWeight:500}}>{label}</div>
        <div style={{fontFamily:"'Fraunces', serif",fontSize:"22px",fontWeight:700,color:"#1c1917",lineHeight:1.1,marginTop:"2px"}}>{value}</div>
        <div style={{fontSize:"12px",color:"#78716c",marginTop:"2px"}}>{sub}</div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding:"14px 18px",
        background:"transparent",
        border:"none",
        borderBottom: active ? "2px solid #dc2626" : "2px solid transparent",
        color: active ? "#dc2626" : "#78716c",
        fontWeight: active ? 600 : 500,
        fontSize:"14px",
        display:"flex",
        alignItems:"center",
        gap:"8px",
        transition:"all 0.2s",
      }}
    >
      <Icon size={16} strokeWidth={2.2} />
      {label}
    </button>
  );
}

function WeekCard({ sem, expanded, onToggle, completed, onToggleSeance }) {
  const phaseColors = PHASE_COLORS[sem.phase];
  const seancesFaites = JOURS.filter(j => completed[`${sem.semaine}_${j}`]).length;
  const progress = (seancesFaites / 4) * 100;

  return (
    <div className="week-card" style={{
      background:"#fff",
      borderRadius:"12px",
      marginBottom:"16px",
      border:`1px solid ${expanded ? phaseColors.accent : '#e7e5e4'}`,
      overflow:"hidden",
      boxShadow: expanded ? "0 10px 40px rgba(0,0,0,0.08)" : "0 1px 3px rgba(0,0,0,0.03)",
    }}>
      <button onClick={onToggle} style={{
        width:"100%",
        padding:"20px 24px",
        background: expanded ? phaseColors.bg : "#fff",
        border:"none",
        textAlign:"left",
        display:"flex",
        alignItems:"center",
        justifyContent:"space-between",
        gap:"16px",
      }}>
        <div style={{display:"flex",alignItems:"center",gap:"16px",flex:1,minWidth:0}}>
          <div style={{
            width:"48px",
            height:"48px",
            borderRadius:"10px",
            background: phaseColors.accent,
            color:"#fff",
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            fontFamily:"'Fraunces', serif",
            fontSize:"20px",
            fontWeight:700,
            flexShrink:0,
          }}>
            {sem.semaine}
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"4px",flexWrap:"wrap"}}>
              <span style={{
                fontSize:"10px",
                textTransform:"uppercase",
                letterSpacing:"1.5px",
                fontWeight:600,
                color: phaseColors.text,
                background: expanded ? "#fff" : phaseColors.bg,
                padding:"3px 8px",
                borderRadius:"4px",
              }}>{sem.phase}</span>
              <span style={{fontSize:"12px",color:"#78716c"}}>{sem.volume_km} km · {sem.charge}</span>
            </div>
            <div style={{fontFamily:"'Fraunces', serif",fontSize:"18px",fontWeight:600,color:"#1c1917"}}>
              {sem.theme}
            </div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"12px",flexShrink:0}}>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:"13px",fontWeight:600,color:"#1c1917"}}>{seancesFaites}/4</div>
            <div style={{width:"60px",height:"4px",background:"#f5f5f4",borderRadius:"2px",marginTop:"4px",overflow:"hidden"}}>
              <div style={{height:"100%",width:`${progress}%`,background: phaseColors.accent,transition:"width 0.3s"}} />
            </div>
          </div>
          {expanded ? <ChevronUp size={20} color="#78716c" /> : <ChevronDown size={20} color="#78716c" />}
        </div>
      </button>

      {expanded && (
        <div className="expanded" style={{padding:"0 24px 24px"}}>
          <div style={{display:"grid",gap:"12px",marginTop:"8px"}}>
            {JOURS.map(jour => {
              const seance = sem.seances[jour];
              const key = `${sem.semaine}_${jour}`;
              const done = !!completed[key];
              const Icon = JOUR_ICONS[jour];
              return (
                <div key={jour} style={{
                  background: done ? "#f0fdf4" : "#fafaf7",
                  border: `1px solid ${done ? "#86efac" : "#e7e5e4"}`,
                  borderRadius:"10px",
                  padding:"16px",
                  display:"flex",
                  gap:"16px",
                  alignItems:"flex-start",
                  transition:"all 0.2s",
                }}>
                  <button
                    className="seance-check"
                    onClick={() => onToggleSeance(sem.semaine, jour)}
                    style={{
                      width:"32px",
                      height:"32px",
                      borderRadius:"8px",
                      border: done ? "none" : "2px solid #d6d3d1",
                      background: done ? "#10b981" : "#fff",
                      display:"flex",
                      alignItems:"center",
                      justifyContent:"center",
                      flexShrink:0,
                      marginTop:"2px",
                    }}
                  >
                    {done && <Check size={18} color="#fff" strokeWidth={3} className="check-pop" />}
                  </button>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"6px",flexWrap:"wrap"}}>
                      <Icon size={16} color={phaseColors.accent} />
                      <span style={{fontWeight:700,fontSize:"13px",textTransform:"capitalize",color:"#1c1917"}}>{jour}</span>
                      <span style={{fontSize:"12px",color:"#78716c"}}>·</span>
                      <span style={{fontWeight:600,fontSize:"14px",color:"#1c1917"}}>{seance.type}</span>
                      <span style={{fontSize:"11px",color:"#fff",background:"#1c1917",padding:"2px 6px",borderRadius:"4px",display:"inline-flex",alignItems:"center",gap:"4px"}}>
                        <Clock size={10} /> {seance.duree}
                      </span>
                      {seance.km > 0 && (
                        <span style={{fontSize:"11px",color:phaseColors.text,background:phaseColors.bg,padding:"2px 6px",borderRadius:"4px"}}>
                          ~{seance.km} km
                        </span>
                      )}
                    </div>
                    <div style={{fontSize:"13px",color:"#44403c",lineHeight:1.6}}>{seance.details}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function AlluresTab() {
  return (
    <div>
      <h2 style={{fontFamily:"'Fraunces', serif",fontSize:"28px",fontWeight:600,margin:"0 0 8px 0",color:"#1c1917"}}>
        Allures cibles
      </h2>
      <p style={{color:"#78716c",marginBottom:"32px",maxWidth:"700px",lineHeight:1.6}}>
        Allures calibrées sur l'objectif 1h55. La sensation reste le juge principal, ces valeurs sont des repères à adapter selon la fatigue, la chaleur ou le dénivelé.
      </p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))",gap:"16px"}}>
        {Object.entries(ALLURES).map(([code, a]) => (
          <div key={code} style={{
            background:"#fff",
            borderRadius:"12px",
            padding:"20px",
            border:"1px solid #e7e5e4",
            borderLeft:`4px solid ${a.color}`,
          }}>
            <div style={{fontSize:"11px",letterSpacing:"2px",textTransform:"uppercase",color:"#78716c",fontWeight:600,marginBottom:"4px"}}>{code}</div>
            <div style={{fontFamily:"'Fraunces', serif",fontSize:"20px",fontWeight:600,color:"#1c1917",marginBottom:"12px"}}>{a.label}</div>
            <div style={{display:"flex",gap:"16px"}}>
              <div>
                <div style={{fontSize:"10px",color:"#78716c",textTransform:"uppercase",letterSpacing:"1px"}}>Allure</div>
                <div style={{fontFamily:"'Fraunces', serif",fontSize:"20px",fontWeight:700,color:a.color}}>{a.pace}</div>
                <div style={{fontSize:"11px",color:"#78716c"}}>min/km</div>
              </div>
              <div>
                <div style={{fontSize:"10px",color:"#78716c",textTransform:"uppercase",letterSpacing:"1px"}}>FC max</div>
                <div style={{fontFamily:"'Fraunces', serif",fontSize:"20px",fontWeight:700,color:a.color}}>{a.fc}</div>
                <div style={{fontSize:"11px",color:"#78716c"}}>zone</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConseilsTab() {
  const sections = [
    {
      icon: Heart,
      title: "Santé à 48 ans",
      color: "#dc2626",
      items: [
        "Certificat médical de non-contre-indication à la course en compétition : OBLIGATOIRE pour s'inscrire au semi",
        "Bilan sanguin recommandé en début de prépa : fer/ferritine, vitamine D, TSH, calcémie",
        "Test d'effort chez un cardiologue conseillé si non fait récemment",
        "Péri-ménopause : surveiller sommeil, hydratation, thermorégulation",
        "Le renforcement musculaire n'est pas optionnel : prévention des blessures + densité osseuse",
      ]
    },
    {
      icon: Dumbbell,
      title: "Matériel",
      color: "#2563eb",
      items: [
        "Chaussures de running avec 500-800 km max au compteur le jour J",
        "Si chaussures à changer : le faire avant la semaine 8 (4 semaines d'adaptation)",
        "Tester les vêtements de course sur la sortie longue semaine 10 (jamais de nouveauté le jour J)",
        "Ceinture d'hydratation ou flasks à partir des sorties > 1h15",
        "Montre GPS/cardio : bien calibrer la FCmax (test d'effort ou formule adaptée)",
      ]
    },
    {
      icon: Coffee,
      title: "Nutrition générale",
      color: "#059669",
      items: [
        "Protéines : 1.2-1.6 g/kg/jour (préserver la masse musculaire à 48 ans)",
        "Glucides complexes : riz complet, quinoa, patate douce, flocons d'avoine",
        "Hydratation : minimum 1.5-2L d'eau par jour",
        "Oméga 3 : poissons gras 2x/semaine (récupération + inflammation)",
        "Calcium + vitamine D : produits laitiers, sardines, exposition soleil régulière",
        "Fer : viande rouge, lentilles, épinards (carence fréquente chez les coureuses)",
      ]
    },
    {
      icon: AlertCircle,
      title: "Signaux d'alerte",
      color: "#ea580c",
      items: [
        "Fatigue persistante > 3 jours après une séance dure = signe de surentraînement",
        "Douleur articulaire aiguë = STOP, consulter (jamais « en courant ça passera »)",
        "Sommeil dégradé sur plusieurs nuits = réduire l'intensité",
        "FC au repos élevée (+5-10 bpm) le matin = récupération insuffisante",
        "Blessure = adapter. Mieux vaut rater 1 semaine que 2 mois.",
      ]
    },
  ];

  return (
    <div>
      <h2 style={{fontFamily:"'Fraunces', serif",fontSize:"28px",fontWeight:600,margin:"0 0 32px 0",color:"#1c1917"}}>
        Conseils & rappels
      </h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(400px, 1fr))",gap:"20px"}}>
        {sections.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} style={{background:"#fff",borderRadius:"12px",padding:"24px",border:"1px solid #e7e5e4"}}>
              <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"16px"}}>
                <div style={{width:"40px",height:"40px",background:`${s.color}15`,borderRadius:"10px",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <Icon size={20} color={s.color} strokeWidth={2.2} />
                </div>
                <h3 style={{fontFamily:"'Fraunces', serif",fontSize:"20px",fontWeight:600,margin:0,color:"#1c1917"}}>{s.title}</h3>
              </div>
              <ul style={{listStyle:"none",padding:0,margin:0}}>
                {s.items.map((item, j) => (
                  <li key={j} style={{display:"flex",gap:"10px",marginBottom:"10px",fontSize:"13px",lineHeight:1.6,color:"#44403c"}}>
                    <span style={{color:s.color,fontWeight:700,flexShrink:0}}>→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function JourJTab() {
  return (
    <div>
      <h2 style={{fontFamily:"'Fraunces', serif",fontSize:"28px",fontWeight:600,margin:"0 0 8px 0",color:"#1c1917"}}>
        Stratégie du Jour J
      </h2>
      <p style={{color:"#78716c",marginBottom:"32px",maxWidth:"700px",lineHeight:1.6}}>
        Objectif 1h55 — allure constante 5:27/km. La clé du succès : ne pas partir trop vite.
      </p>

      {/* Passages clés */}
      <div style={{background:"#1c1917",color:"#fafaf7",borderRadius:"12px",padding:"32px",marginBottom:"24px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:"-30px",right:"-30px",width:"150px",height:"150px",borderRadius:"50%",background:"radial-gradient(circle, #dc2626 0%, transparent 70%)",opacity:0.4}} />
        <h3 style={{fontFamily:"'Fraunces', serif",fontSize:"20px",margin:"0 0 20px 0",position:"relative"}}>⏱️ Passages clés</h3>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(140px, 1fr))",gap:"16px",position:"relative"}}>
          {[
            {dist:"5 km",time:"27:15"},
            {dist:"10 km",time:"54:30"},
            {dist:"15 km",time:"1h21:45"},
            {dist:"21.1 km",time:"1h55:00"},
          ].map((p,i) => (
            <div key={i} style={{background:"rgba(255,255,255,0.05)",padding:"16px",borderRadius:"8px",border:"1px solid rgba(255,255,255,0.1)"}}>
              <div style={{fontSize:"11px",color:"#a8a29e",textTransform:"uppercase",letterSpacing:"2px",marginBottom:"4px"}}>{p.dist}</div>
              <div style={{fontFamily:"'Fraunces', serif",fontSize:"24px",fontWeight:700,color:"#dc2626"}}>{p.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Phase de course */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))",gap:"16px",marginBottom:"24px"}}>
        {[
          {tiers:"Premier tiers (km 1-7)",couleur:"#059669",conseils:["Contrôle absolu de l'allure","Ne pas se laisser griser par le départ","Respiration ample et régulière","5:27/km STRICT"]},
          {tiers:"Deuxième tiers (km 8-14)",couleur:"#d97706",conseils:["Installation dans l'effort","Hydratation à chaque ravito","Gel énergétique à 1h","Concentration sur la foulée"]},
          {tiers:"Dernier tiers (km 15-21)",couleur:"#dc2626",conseils:["Puiser dans la réserve mentale","Si sensations OK : accélérer à 5:20/km","Deuxième gel à 1h30","Focus sur l'objectif : 1h55"]},
        ].map((t,i) => (
          <div key={i} style={{background:"#fff",borderRadius:"12px",padding:"24px",border:"1px solid #e7e5e4",borderTop:`4px solid ${t.couleur}`}}>
            <h4 style={{fontFamily:"'Fraunces', serif",fontSize:"16px",fontWeight:600,margin:"0 0 12px 0",color:"#1c1917"}}>{t.tiers}</h4>
            <ul style={{listStyle:"none",padding:0,margin:0}}>
              {t.conseils.map((c,j) => (
                <li key={j} style={{fontSize:"13px",lineHeight:1.6,color:"#44403c",marginBottom:"6px",display:"flex",gap:"8px"}}>
                  <span style={{color:t.couleur,fontWeight:700}}>•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Veille et matin */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))",gap:"16px"}}>
        <div style={{background:"#fef3c7",borderRadius:"12px",padding:"24px",borderLeft:"4px solid #d97706"}}>
          <h4 style={{fontFamily:"'Fraunces', serif",fontSize:"18px",margin:"0 0 12px 0",color:"#92400e"}}>🌙 La veille</h4>
          <ul style={{listStyle:"none",padding:0,margin:0,fontSize:"13px",lineHeight:1.7,color:"#78350f"}}>
            <li>→ Dîner tôt (19h-20h) riche en glucides</li>
            <li>→ Pâtes, riz ou patate douce + protéine maigre</li>
            <li>→ Éviter légumineuses, fibres++, graisses</li>
            <li>→ Pas d'alcool, hydratation régulière</li>
            <li>→ Préparer sac, dossard, vêtements la veille</li>
            <li>→ Coucher 22h-22h30 max</li>
          </ul>
        </div>
        <div style={{background:"#dbeafe",borderRadius:"12px",padding:"24px",borderLeft:"4px solid #2563eb"}}>
          <h4 style={{fontFamily:"'Fraunces', serif",fontSize:"18px",margin:"0 0 12px 0",color:"#1e40af"}}>☀️ Le matin (3h avant)</h4>
          <ul style={{listStyle:"none",padding:0,margin:0,fontSize:"13px",lineHeight:1.7,color:"#1e3a8a"}}>
            <li>→ Porridge flocons d'avoine + banane + miel</li>
            <li>→ OU pain + confiture + fromage blanc</li>
            <li>→ Café possible si habitude</li>
            <li>→ 500 ml eau + pincée de sel 1h avant</li>
            <li>→ Échauffement 15 min + gammes + 3 lignes droites</li>
            <li>→ Respiration : focus sur le plaisir, pas le stress</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ===== CÔTES TAB =====

function CotesTab() {
  return (
    <div>
      <h2 style={{fontFamily:"'Fraunces', serif",fontSize:"28px",fontWeight:600,margin:"0 0 8px 0",color:"#1c1917"}}>
        Côtes & Montagne
      </h2>
      <p style={{color:"#78716c",marginBottom:"32px",maxWidth:"700px",lineHeight:1.6}}>
        Adaptation pour le séjour à Châtel (S3-S4) et stratégie pour gérer les côtes le jour J.
      </p>

      {/* Bloc séjour Châtel */}
      <div style={{background:"linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",borderRadius:"12px",padding:"32px",marginBottom:"24px",border:"1px solid #93c5fd",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:"-20px",right:"20px",fontSize:"80px",opacity:0.15}}>🏔️</div>
        <div style={{fontSize:"11px",letterSpacing:"2px",textTransform:"uppercase",color:"#1e40af",fontWeight:700,marginBottom:"6px"}}>
          Séjour montagne · 31 août → 13 septembre 2026
        </div>
        <h3 style={{fontFamily:"'Fraunces', serif",fontSize:"24px",margin:"0 0 12px 0",color:"#1e3a8a"}}>
          Châtel (~1200m) — Semaines 3 & 4
        </h3>
        <p style={{fontSize:"14px",lineHeight:1.6,color:"#1e3a8a",margin:0,maxWidth:"700px"}}>
          Timing parfait : S3 (foncier) + S4 (décharge) coïncident avec le séjour. L'altitude légère et le terrain vallonné vont <b>booster naturellement la caisse aérobie</b> et renforcer les jambes sans effort spécifique supplémentaire.
        </p>
      </div>

      {/* Règles altitude */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))",gap:"16px",marginBottom:"32px"}}>
        <InfoCard icon="🫁" titre="Acclimatation" desc="Les 2-3 premiers jours, ressentir un léger essoufflement est NORMAL. Réduire l'intensité de 5-10% au début. Allure ajustée : 6:45-7:00/km au lieu de 6:30." />
        <InfoCard icon="💧" titre="Hydratation +++" desc="En altitude on se déshydrate plus vite sans le ressentir. Objectif : 2-2,5L d'eau par jour minimum. Boire TOUTES LES 20 MIN pendant les sorties, même sans soif." />
        <InfoCard icon="😴" titre="Récupération" desc="Le premier jour d'arrivée : PAS de sport intense. Marche + hydratation uniquement. Les bienfaits de l'altitude viennent si le corps est reposé." />
        <InfoCard icon="🌡️" titre="Température" desc="Il peut faire frais le matin à 1200m. Prévoir couches chaudes pour l'échauffement. Vêtements techniques respirants conseillés." />
      </div>

      {/* Séance côtes montagne */}
      <h3 style={{fontFamily:"'Fraunces', serif",fontSize:"22px",margin:"32px 0 16px 0",color:"#1c1917"}}>
        ⛰️ Séance de côtes (S3 - mercredi à Châtel)
      </h3>
      <div style={{background:"#fff",borderRadius:"12px",padding:"24px",border:"1px solid #e7e5e4",marginBottom:"32px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:"16px",marginBottom:"16px"}}>
          <Metric label="Pente" value="5-8%" color="#dc2626" />
          <Metric label="Longueur montée" value="200-300m" color="#ea580c" />
          <Metric label="Durée montée" value="1'15 - 1'30" color="#d97706" />
          <Metric label="Répétitions" value="8 fois" color="#059669" />
        </div>
        <div style={{background:"#fef3c7",padding:"16px",borderRadius:"8px",borderLeft:"4px solid #d97706"}}>
          <div style={{fontWeight:700,fontSize:"13px",color:"#78350f",marginBottom:"8px"}}>📋 Déroulé séance</div>
          <ol style={{margin:0,paddingLeft:"20px",fontSize:"13px",lineHeight:1.7,color:"#78350f"}}>
            <li><b>Échauffement</b> : 15 min footing très lent + gammes (talons-fesses, montées de genoux)</li>
            <li><b>Corps</b> : 8 montées de 1'15 à 1'30 en effort soutenu (allure seuil, PAS sprint)</li>
            <li><b>Récup entre reps</b> : descente en trot tranquille</li>
            <li><b>Si altitude gênante</b> : réduire à 6 reps (pas de honte !)</li>
            <li><b>Retour calme</b> : 10 min footing lent + étirements</li>
          </ol>
        </div>
        <div style={{marginTop:"12px",padding:"12px",background:"#f0fdf4",borderRadius:"8px",borderLeft:"4px solid #10b981",fontSize:"13px",color:"#14532d",lineHeight:1.6}}>
          ✅ <b>Sensation visée :</b> "costaud mais pas à fond". Elle doit pouvoir finir proprement les 8 reps. Si ça devient trop dur dès la rep 4-5, c'est qu'elle est partie trop vite.
        </div>
      </div>

      {/* Stratégie course jour J */}
      <h3 style={{fontFamily:"'Fraunces', serif",fontSize:"22px",margin:"32px 0 16px 0",color:"#1c1917"}}>
        🏁 Stratégie course avec côtes (Jour J)
      </h3>
      <p style={{color:"#78716c",marginBottom:"16px",fontSize:"14px",lineHeight:1.6}}>
        Profil du semi : léger (moins de 100m D+ total, 1-2 petites bosses). C'est très gérable si on applique les bonnes règles.
      </p>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))",gap:"16px",marginBottom:"24px"}}>
        <RegleBox num="1" titre="Repérer les côtes à l'avance" desc="Consulter le plan du parcours sur le site officiel de la course. Localiser à quel km sont les bosses (début, milieu, fin) pour préparer mentalement." couleur="#059669" />
        <RegleBox num="2" titre="Ne JAMAIS attaquer une côte" desc="Même si les sensations sont bonnes au km 5. Une côte prise trop vite = dette d'oxygène qui se paie 2 km plus tard en perte d'allure." couleur="#d97706" />
        <RegleBox num="3" titre="Effort constant, pas allure constante" desc="Accepter de perdre 10-15s/km en côte. Maintenir l'EFFORT CARDIAQUE, pas l'allure. C'est le secret." couleur="#dc2626" />
        <RegleBox num="4" titre="Relance progressive au sommet" desc="50-100m en EA (5:50/km) avant de reprendre l'allure cible 5:27/km. Ne JAMAIS attaquer au sommet de la côte." couleur="#7c3aed" />
        <RegleBox num="5" titre="Descentes = secondes gratuites" desc="Foulée relâchée, laisser la gravité faire. Gagner 5-10s/km sans effort supplémentaire. C'est compensatoire avec la côte." couleur="#0891b2" />
        <RegleBox num="6" titre="Bilan positif possible" desc="Une côte de 30m bien gérée + une descente de 30m bien prise = temps équivalent au plat. Ne pas paniquer, c'est mathématique." couleur="#10b981" />
      </div>

      {/* Exemple concret */}
      <div style={{background:"#1c1917",color:"#fafaf7",borderRadius:"12px",padding:"28px",marginBottom:"24px"}}>
        <h4 style={{fontFamily:"'Fraunces', serif",fontSize:"20px",margin:"0 0 16px 0",color:"#fef3c7"}}>
          💡 Exemple concret : côte au km 8
        </h4>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))",gap:"16px"}}>
          <div style={{background:"rgba(255,255,255,0.05)",padding:"14px",borderRadius:"8px",border:"1px solid rgba(255,255,255,0.1)"}}>
            <div style={{fontSize:"10px",textTransform:"uppercase",letterSpacing:"2px",color:"#a8a29e",marginBottom:"4px"}}>Pendant la côte</div>
            <div style={{fontSize:"14px",lineHeight:1.6}}>
              Passer de <b style={{color:"#10b981"}}>5:27/km</b> à <b style={{color:"#f59e0b"}}>5:40-5:45/km</b><br/>
              Respiration ample, foulée compacte, bras qui poussent.
            </div>
          </div>
          <div style={{background:"rgba(255,255,255,0.05)",padding:"14px",borderRadius:"8px",border:"1px solid rgba(255,255,255,0.1)"}}>
            <div style={{fontSize:"10px",textTransform:"uppercase",letterSpacing:"2px",color:"#a8a29e",marginBottom:"4px"}}>Au sommet (100m)</div>
            <div style={{fontSize:"14px",lineHeight:1.6}}>
              Revenir progressivement à <b style={{color:"#f59e0b"}}>5:40</b> puis <b style={{color:"#10b981"}}>5:27/km</b><br/>
              Surtout PAS d'accélération brusque.
            </div>
          </div>
          <div style={{background:"rgba(255,255,255,0.05)",padding:"14px",borderRadius:"8px",border:"1px solid rgba(255,255,255,0.1)"}}>
            <div style={{fontSize:"10px",textTransform:"uppercase",letterSpacing:"2px",color:"#a8a29e",marginBottom:"4px"}}>En descente</div>
            <div style={{fontSize:"14px",lineHeight:1.6}}>
              Laisser filer à <b style={{color:"#10b981"}}>5:15-5:20/km</b><br/>
              Foulée longue, corps légèrement penché.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, titre, desc }) {
  return (
    <div style={{background:"#fff",borderRadius:"12px",padding:"20px",border:"1px solid #e7e5e4"}}>
      <div style={{fontSize:"32px",marginBottom:"8px"}}>{icon}</div>
      <div style={{fontFamily:"'Fraunces', serif",fontSize:"16px",fontWeight:700,color:"#1c1917",marginBottom:"6px"}}>{titre}</div>
      <div style={{fontSize:"13px",color:"#44403c",lineHeight:1.6}}>{desc}</div>
    </div>
  );
}

function Metric({ label, value, color }) {
  return (
    <div style={{textAlign:"center",padding:"12px",background:"#fafaf7",borderRadius:"8px"}}>
      <div style={{fontSize:"10px",textTransform:"uppercase",letterSpacing:"1.5px",color:"#78716c",fontWeight:600,marginBottom:"4px"}}>{label}</div>
      <div style={{fontFamily:"'Fraunces', serif",fontSize:"22px",fontWeight:700,color:color}}>{value}</div>
    </div>
  );
}

function RegleBox({ num, titre, desc, couleur }) {
  return (
    <div style={{background:"#fff",borderRadius:"12px",padding:"20px",border:"1px solid #e7e5e4",borderLeft:`4px solid ${couleur}`,display:"flex",gap:"14px",alignItems:"flex-start"}}>
      <div style={{width:"36px",height:"36px",borderRadius:"50%",background:couleur,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Fraunces', serif",fontSize:"18px",fontWeight:700,flexShrink:0}}>
        {num}
      </div>
      <div>
        <div style={{fontFamily:"'Fraunces', serif",fontSize:"15px",fontWeight:700,color:"#1c1917",marginBottom:"4px"}}>{titre}</div>
        <div style={{fontSize:"13px",color:"#44403c",lineHeight:1.6}}>{desc}</div>
      </div>
    </div>
  );
}

// ===== CALENDRIER TAB =====

function CalendrierTab({ startDate, setStartDate, completed, onToggleSeance }) {
  // Conversion date string YYYY-MM-DD en Date object (sans décalage timezone)
  const parseDate = (str) => {
    const [y, m, d] = str.split("-").map(Number);
    return new Date(y, m - 1, d);
  };

  const start = parseDate(startDate);
  // S'assurer qu'on part bien d'un lundi
  const dayOfWeek = start.getDay(); // 0 = dimanche, 1 = lundi
  const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const trueStart = new Date(start);
  trueStart.setDate(trueStart.getDate() + daysToMonday);

  // Date de la course (dimanche semaine 12 = lundi + 7*11 + 6)
  const raceDate = new Date(trueStart);
  raceDate.setDate(raceDate.getDate() + 7 * 11 + 6);

  // Générer toutes les dates du plan (84 jours = 12 semaines)
  const allDates = [];
  for (let i = 0; i < 84; i++) {
    const d = new Date(trueStart);
    d.setDate(d.getDate() + i);
    allDates.push(d);
  }

  // Grouper par mois
  const months = {};
  allDates.forEach((d, i) => {
    const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
    if (!months[key]) {
      months[key] = { year: d.getFullYear(), month: d.getMonth(), label: "", days: [] };
      months[key].label = d.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
    }
    const weekNum = Math.floor(i / 7) + 1;
    const dayNum = i % 7; // 0=lundi, 6=dimanche
    const jourNames = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
    const jourName = jourNames[dayNum];
    const semaine = PLAN[weekNum - 1];
    const seance = semaine.seances[jourName] || null;
    months[key].days.push({ date: d, weekNum, dayNum, jourName, seance, semaine });
  });

  // Navigation mois
  const monthKeys = Object.keys(months).sort();
  const [currentMonthIdx, setCurrentMonthIdx] = useState(0);
  const currentMonth = months[monthKeys[currentMonthIdx]];

  const JOUR_LABELS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calculer les cases vides avant le 1er jour du mois
  const firstDay = currentMonth.days[0].date;
  const firstDayOfWeek = firstDay.getDay(); // 0 = dim, 1 = lun
  const leadingBlanks = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  // Dernier jour du mois + cases vides après
  const lastDay = currentMonth.days[currentMonth.days.length - 1].date;
  const lastDayOfWeek = lastDay.getDay();
  const trailingBlanks = lastDayOfWeek === 0 ? 0 : 7 - lastDayOfWeek;

  // Construire la grille complète avec cases vides
  const gridDays = [
    ...Array(leadingBlanks).fill(null),
    ...currentMonth.days,
    ...Array(trailingBlanks).fill(null),
  ];

  const formatRaceDate = raceDate.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:"8px",flexWrap:"wrap",gap:"16px"}}>
        <div>
          <h2 style={{fontFamily:"'Fraunces', serif",fontSize:"28px",fontWeight:600,margin:"0 0 8px 0",color:"#1c1917"}}>
            Vue calendrier
          </h2>
          <p style={{color:"#78716c",margin:0,maxWidth:"600px",lineHeight:1.6}}>
            Visualise ton plan sur 12 semaines. Les jours de repos sont en gris, les séances en couleur selon la phase.
          </p>
        </div>
      </div>

      {/* Sélecteur date de début */}
      <div style={{background:"#fff",borderRadius:"12px",padding:"20px",border:"1px solid #e7e5e4",marginTop:"24px",marginBottom:"24px",display:"flex",gap:"20px",alignItems:"center",flexWrap:"wrap"}}>
        <div style={{flex:"1 1 250px"}}>
          <label style={{fontSize:"11px",textTransform:"uppercase",letterSpacing:"1.5px",color:"#78716c",fontWeight:600,display:"block",marginBottom:"6px"}}>
            Date de début du plan (lundi)
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{
              border:"1px solid #e7e5e4",
              borderRadius:"8px",
              padding:"10px 12px",
              fontSize:"14px",
              fontFamily:"'Inter', sans-serif",
              width:"100%",
              maxWidth:"280px",
              color:"#1c1917",
              background:"#fafaf7",
            }}
          />
          <div style={{fontSize:"11px",color:"#a8a29e",marginTop:"6px",fontStyle:"italic"}}>
            Si tu choisis un autre jour que lundi, le plan commencera automatiquement le lundi le plus proche.
          </div>
        </div>
        <div style={{background:"linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",color:"#fff",padding:"16px 20px",borderRadius:"10px",flex:"1 1 260px"}}>
          <div style={{fontSize:"11px",letterSpacing:"2px",textTransform:"uppercase",opacity:0.85,marginBottom:"4px",display:"flex",alignItems:"center",gap:"6px"}}>
            <Trophy size={12} /> Date du semi-marathon
          </div>
          <div style={{fontFamily:"'Fraunces', serif",fontSize:"18px",fontWeight:700,lineHeight:1.3,textTransform:"capitalize"}}>
            {formatRaceDate}
          </div>
        </div>
      </div>

      {/* Navigation mois */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"20px",gap:"16px"}}>
        <button
          onClick={() => setCurrentMonthIdx(Math.max(0, currentMonthIdx - 1))}
          disabled={currentMonthIdx === 0}
          style={{
            display:"flex",alignItems:"center",gap:"6px",
            padding:"10px 14px",
            background: currentMonthIdx === 0 ? "#f5f5f4" : "#fff",
            border:"1px solid #e7e5e4",
            borderRadius:"8px",
            color: currentMonthIdx === 0 ? "#a8a29e" : "#1c1917",
            fontSize:"13px",
            fontWeight:500,
            cursor: currentMonthIdx === 0 ? "not-allowed" : "pointer",
          }}
        >
          <ChevronLeft size={16} /> Précédent
        </button>
        <h3 style={{fontFamily:"'Fraunces', serif",fontSize:"24px",fontWeight:600,margin:0,color:"#1c1917",textTransform:"capitalize",textAlign:"center",flex:1}}>
          {currentMonth.label}
        </h3>
        <button
          onClick={() => setCurrentMonthIdx(Math.min(monthKeys.length - 1, currentMonthIdx + 1))}
          disabled={currentMonthIdx === monthKeys.length - 1}
          style={{
            display:"flex",alignItems:"center",gap:"6px",
            padding:"10px 14px",
            background: currentMonthIdx === monthKeys.length - 1 ? "#f5f5f4" : "#fff",
            border:"1px solid #e7e5e4",
            borderRadius:"8px",
            color: currentMonthIdx === monthKeys.length - 1 ? "#a8a29e" : "#1c1917",
            fontSize:"13px",
            fontWeight:500,
            cursor: currentMonthIdx === monthKeys.length - 1 ? "not-allowed" : "pointer",
          }}
        >
          Suivant <ChevronRight size={16} />
        </button>
      </div>

      {/* Légende */}
      <div style={{display:"flex",gap:"16px",flexWrap:"wrap",marginBottom:"16px",fontSize:"12px",color:"#44403c"}}>
        <LegendItem color="#e7e5e4" label="Repos" />
        <LegendItem color="#dbeafe" label="Foncier" />
        <LegendItem color="#fed7aa" label="Spécifique" />
        <LegendItem color="#fecaca" label="Affûtage" />
        <LegendItem color="#bbf7d0" label="Tapering / Course" />
        <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
          <div style={{width:"14px",height:"14px",borderRadius:"3px",background:"#10b981",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Check size={10} color="#fff" strokeWidth={3} />
          </div>
          <span>Séance cochée</span>
        </div>
      </div>

      {/* Grille calendrier */}
      <div style={{background:"#fff",borderRadius:"12px",border:"1px solid #e7e5e4",overflow:"hidden"}}>
        {/* Headers jours */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(7, 1fr)",background:"#1c1917"}}>
          {JOUR_LABELS.map((j) => (
            <div key={j} style={{padding:"12px 8px",textAlign:"center",color:"#fafaf7",fontSize:"12px",fontWeight:600,letterSpacing:"1px",textTransform:"uppercase"}}>
              {j}
            </div>
          ))}
        </div>

        {/* Grille jours */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(7, 1fr)"}}>
          {gridDays.map((day, idx) => {
            if (!day) {
              return <div key={`blank-${idx}`} style={{minHeight:"90px",background:"#fafaf7",borderRight:"1px solid #f5f5f4",borderBottom:"1px solid #f5f5f4"}} />;
            }

            const isTrainingDay = ["mardi", "mercredi", "vendredi", "dimanche"].includes(day.jourName);
            const isRestDay = !isTrainingDay;
            const isRaceDay = day.weekNum === 12 && day.jourName === "dimanche";
            const isToday = day.date.getTime() === today.getTime();
            const isPast = day.date < today;
            const key = `${day.weekNum}_${day.jourName}`;
            const isCompleted = !!completed[key];

            let phaseColors = PHASE_COLORS[day.semaine.phase];
            let bgColor = "#fafaf7";
            let accentColor = "#a8a29e";

            if (isRaceDay) {
              bgColor = "linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)";
              accentColor = "#dc2626";
            } else if (isTrainingDay) {
              bgColor = phaseColors.bg;
              accentColor = phaseColors.accent;
            }

            return (
              <div
                key={idx}
                onClick={() => isTrainingDay && onToggleSeance(day.weekNum, day.jourName)}
                style={{
                  minHeight:"90px",
                  padding:"8px",
                  background: bgColor,
                  borderRight:"1px solid #f5f5f4",
                  borderBottom:"1px solid #f5f5f4",
                  cursor: isTrainingDay ? "pointer" : "default",
                  position:"relative",
                  transition:"all 0.15s",
                  opacity: isPast && !isCompleted && isTrainingDay ? 0.7 : 1,
                  ...(isToday ? {outline:"3px solid #1c1917",outlineOffset:"-3px",zIndex:1} : {}),
                }}
                onMouseEnter={(e) => {
                  if (isTrainingDay) {
                    e.currentTarget.style.transform = "scale(1.02)";
                    e.currentTarget.style.zIndex = 2;
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.zIndex = isToday ? 1 : 0;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Date + numéro semaine */}
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"4px"}}>
                  <div style={{fontSize:"14px",fontWeight:700,color: isToday ? "#dc2626" : "#1c1917"}}>
                    {day.date.getDate()}
                  </div>
                  {day.jourName === "lundi" && (
                    <div style={{fontSize:"9px",color:"#78716c",fontWeight:600,background:"#fff",padding:"2px 5px",borderRadius:"3px",letterSpacing:"0.5px"}}>
                      S{day.weekNum}
                    </div>
                  )}
                </div>

                {/* Contenu selon type de jour */}
                {isRaceDay ? (
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"4px",marginTop:"4px"}}>
                    <Trophy size={22} color="#dc2626" strokeWidth={2.2} />
                    <div style={{fontSize:"10px",fontWeight:700,color:"#991b1b",textAlign:"center",lineHeight:1.2}}>
                      SEMI<br/>MARATHON
                    </div>
                    {isCompleted && (
                      <div style={{position:"absolute",top:"6px",right:"6px",background:"#10b981",borderRadius:"50%",width:"18px",height:"18px",display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <Check size={12} color="#fff" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                ) : isRestDay ? (
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"4px",marginTop:"10px",opacity:0.5}}>
                    <Moon size={14} color="#78716c" />
                    <div style={{fontSize:"10px",color:"#78716c",fontWeight:500,textTransform:"uppercase",letterSpacing:"1px"}}>
                      Repos
                    </div>
                  </div>
                ) : (
                  <div style={{position:"relative"}}>
                    <div style={{
                      fontSize:"10px",
                      fontWeight:600,
                      color: phaseColors.text,
                      marginBottom:"2px",
                      lineHeight:1.2,
                      display:"-webkit-box",
                      WebkitLineClamp:2,
                      WebkitBoxOrient:"vertical",
                      overflow:"hidden",
                    }}>
                      {day.seance.type}
                    </div>
                    <div style={{fontSize:"9px",color:phaseColors.text,opacity:0.8}}>
                      {day.seance.duree}
                    </div>
                    {isCompleted && (
                      <div style={{position:"absolute",top:"-2px",right:"-2px",background:"#10b981",borderRadius:"50%",width:"20px",height:"20px",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 4px rgba(0,0,0,0.1)"}}>
                        <Check size={12} color="#fff" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Info pratique */}
      <div style={{marginTop:"20px",padding:"16px 20px",background:"#fef3c7",borderRadius:"10px",borderLeft:"4px solid #d97706",fontSize:"13px",color:"#78350f",lineHeight:1.6}}>
        💡 <b>Astuce</b> : clique sur une case de séance pour la cocher/décocher directement depuis le calendrier. Le jour d'aujourd'hui est entouré en noir.
      </div>
    </div>
  );
}

function LegendItem({ color, label }) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
      <div style={{width:"14px",height:"14px",borderRadius:"3px",background:color,border:"1px solid rgba(0,0,0,0.05)"}} />
      <span>{label}</span>
    </div>
  );
}
