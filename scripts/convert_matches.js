const fs = require('fs');
const path = require('path');

const inPath = path.join(__dirname, '..', 'src', 'matches_init_data.json');
const outPath = path.join(__dirname, '..', 'src', 'matches.json');

const data = JSON.parse(fs.readFileSync(inPath, 'utf8'));

const TRANSLATIONS = {
    "Mexico": "Meksyk",
    "South Africa": "RPA",
    "South Korea": "Korea Południowa",
    "Czech Republic": "Czechy",
    "Canada": "Kanada",
    "Bosnia & Herzegovina": "Bośnia i Hercegowina",
    "Qatar": "Katar",
    "Switzerland": "Szwajcaria",
    "Brazil": "Brazylia",
    "Morocco": "Maroko",
    "Haiti": "Haiti",
    "Scotland": "Szkocja",
    "USA": "USA",
    "Paraguay": "Paragwaj",
    "Australia": "Australia",
    "Turkey": "Turcja",
    "Germany": "Niemcy",
    "Curaçao": "Curaçao",
    "Ivory Coast": "Wybrzeże Kości Słoniowej",
    "Ecuador": "Ekwador",
    "Netherlands": "Holandia",
    "Japan": "Japonia",
    "Sweden": "Szwecja",
    "Tunisia": "Tunezja",
    "Belgium": "Belgia",
    "Egypt": "Egipt",
    "Iran": "Iran",
    "New Zealand": "Nowa Zelandia",
    "Spain": "Hiszpania",
    "Cape Verde": "Wyspy Zielonego Przylądka",
    "Saudi Arabia": "Arabia Saudyjska",
    "Uruguay": "Urugwaj",
    "France": "Francja",
    "Senegal": "Senegal",
    "Iraq": "Irak",
    "Norway": "Norwegia",
    "Argentina": "Argentyna",
    "Algeria": "Algieria",
    "Austria": "Austria",
    "Jordan": "Jordania",
    "Portugal": "Portugalia",
    "DR Congo": "DR Kongo",
    "Uzbekistan": "Uzbekistan",
    "Colombia": "Kolumbia",
    "England": "Anglia",
    "Croatia": "Chorwacja",
    "Ghana": "Ghana",
    "Panama": "Panama",
    "Bosnia and Herzegovina": "Bośnia i Hercegowina",
    "Czechia": "Czechy"
};

function translate(name) {
    return TRANSLATIONS[name] || name;
}

function toUTCISO(dateStr, timeStr) {
    // timeStr examples: "13:00 UTC-6", "20:30 UTC-4"
    const m = timeStr.match(/^(\d{1,2}:\d{2})\s+UTC([+-]?\d+)$/);
    if (!m) return null;
    const hhmm = m[1];
    const offsetNum = Number(m[2]);
    const tzSign = offsetNum < 0 ? '-' : '+';
    const abs = Math.abs(offsetNum);
    const tzPart = `${tzSign}${String(abs).padStart(2, '0')}:00`;
    const iso = `${dateStr}T${hhmm}:00${tzPart}`;
    const d = new Date(iso);
    return d.toISOString();
}

function mapStage(round) {
    if (!round) return 'finals';
    if (round.startsWith('Matchday')) return 'group';
    if (round.includes('Quarter')) return 'quater-final';
    if (round.includes('Semi')) return 'semi-final';
    if (round === 'Final') return 'final';
    // Round of 32 / Round of 16 / Match for third place -> use generic 'finals'
    return 'finals';
}

const out = data.map(item => {
    const stage = mapStage(item.round);
    const date = toUTCISO(item.date, item.time);
    return {
        teamA: translate(item.team1),
        teamB: translate(item.team2),
        date,
        stage
    };
});

fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
console.log('Wrote', outPath);
