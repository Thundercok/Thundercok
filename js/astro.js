// ==========================================
// js/astro.js - ASTROLOGY ENGINE
// ==========================================

const SIGNS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];
const SIGN_SYMS = [
  "♈",
  "♉",
  "♊",
  "♋",
  "♌",
  "♍",
  "♎",
  "♏",
  "♐",
  "♑",
  "♒",
  "♓",
];
const ELEMENTS = {
  Aries: "🜂",
  Taurus: "🜃",
  Gemini: "🜁",
  Cancer: "🜄",
  Leo: "🜂",
  Virgo: "🜃",
  Libra: "🜁",
  Scorpio: "🜄",
  Sagittarius: "🜂",
  Capricorn: "🜃",
  Aquarius: "🜁",
  Pisces: "🜄",
};
const ELEMENT_NAMES = {
  Aries: "Fire",
  Taurus: "Earth",
  Gemini: "Air",
  Cancer: "Water",
  Leo: "Fire",
  Virgo: "Earth",
  Libra: "Air",
  Scorpio: "Water",
  Sagittarius: "Fire",
  Capricorn: "Earth",
  Aquarius: "Air",
  Pisces: "Water",
};
const MODALITIES = {
  Aries: "Cardinal",
  Taurus: "Fixed",
  Gemini: "Mutable",
  Cancer: "Cardinal",
  Leo: "Fixed",
  Virgo: "Mutable",
  Libra: "Cardinal",
  Scorpio: "Fixed",
  Sagittarius: "Mutable",
  Capricorn: "Cardinal",
  Aquarius: "Fixed",
  Pisces: "Mutable",
};
const PLANET_SYMS = {
  Sun: "☉",
  Moon: "☽",
  Mercury: "☿",
  Venus: "♀",
  Mars: "♂",
  Jupiter: "♃",
  Saturn: "♄",
  Uranus: "♅",
  Neptune: "♆",
  Pluto: "♇",
};
const SIGN_DESCS = {
  Aries: "bold, pioneering, energetic",
  Taurus: "grounded, sensual, persistent",
  Gemini: "curious, adaptable, witty",
  Cancer: "intuitive, nurturing, emotional",
  Leo: "creative, generous, dramatic",
  Virgo: "analytical, precise, helpful",
  Libra: "balanced, charming, diplomatic",
  Scorpio: "intense, transformative, deep",
  Sagittarius: "adventurous, philosophical, free",
  Capricorn: "ambitious, disciplined, strategic",
  Aquarius: "innovative, humanitarian, eccentric",
  Pisces: "dreamy, empathetic, mystical",
};

const CITY_DATA = {
  "hà nội": { lat: 21.0285, lng: 105.8542, tz: 7 },
  "hồ chí minh": { lat: 10.8231, lng: 106.6297, tz: 7 },
  hcm: { lat: 10.8231, lng: 106.6297, tz: 7 },
  "đà nẵng": { lat: 16.0471, lng: 108.2068, tz: 7 },
  "hải phòng": { lat: 20.8449, lng: 106.6881, tz: 7 },
  "cần thơ": { lat: 10.0452, lng: 105.7469, tz: 7 },
  "nha trang": { lat: 12.2388, lng: 109.1967, tz: 7 },
  huế: { lat: 16.4637, lng: 107.5909, tz: 7 },
  "vũng tàu": { lat: 10.346, lng: 107.0843, tz: 7 },
  "đà lạt": { lat: 11.9404, lng: 108.4583, tz: 7 },
};

function getCoords(city) {
  const c = city.toLowerCase().trim();
  for (let k in CITY_DATA) {
    if (c.includes(k)) return CITY_DATA[k];
  }
  return { lat: 10.8231, lng: 106.6297, tz: 7 };
}

function toJD(year, month, day, hour = 12) {
  if (month <= 2) {
    year--;
    month += 12;
  }
  const A = Math.floor(year / 100),
    B = 2 - A + Math.floor(A / 4);
  return (
    Math.floor(365.25 * (year + 4716)) +
    Math.floor(30.6001 * (month + 1)) +
    day +
    hour / 24 +
    B -
    1524.5
  );
}

const D2R = Math.PI / 180,
  R2D = 180 / Math.PI;
function norm360(x) {
  return ((x % 360) + 360) % 360;
}

// --- Hành tinh (Trích gọn code tính toán của bạn) ---
function sunLon(jd) {
  const T = (jd - 2451545.0) / 36525;
  const L0 = norm360(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
  const M = norm360(357.52911 + 35999.05029 * T - 0.0001537 * T * T) * D2R;
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * M) +
    0.000289 * Math.sin(3 * M);
  const sunLon = norm360(L0 + C);
  const omega = norm360(125.04 - 1934.136 * T);
  return norm360(sunLon - 0.00569 - 0.00478 * Math.sin(omega * D2R));
}
function moonLon(jd) {
  const T = (jd - 2451545.0) / 36525;
  const D = norm360(297.85036 + 445267.11148 * T - 0.0019142 * T * T) * D2R;
  const M = norm360(357.52772 + 35999.05034 * T - 0.0001603 * T * T) * D2R;
  const Mp = norm360(134.96298 + 477198.867398 * T + 0.0086972 * T * T) * D2R;
  const F = norm360(93.27191 + 483202.017538 * T - 0.0036825 * T * T) * D2R;
  const L0 = norm360(218.3165 + 481267.8813 * T);
  let lon = L0;
  lon += 6.289 * Math.sin(Mp);
  lon += 1.274 * Math.sin(2 * D - Mp);
  lon += 0.658 * Math.sin(2 * D);
  lon += 0.214 * Math.sin(2 * Mp);
  lon -= 0.186 * Math.sin(M);
  lon -= 0.114 * Math.sin(2 * F);
  lon += 0.059 * Math.sin(2 * D - 2 * Mp);
  lon += 0.057 * Math.sin(2 * D - M - Mp);
  lon += 0.053 * Math.sin(2 * D + Mp);
  lon += 0.046 * Math.sin(2 * D - M);
  lon += 0.041 * Math.sin(Mp - M);
  lon -= 0.035 * Math.sin(D);
  lon -= 0.031 * Math.sin(Mp + M);
  lon -= 0.015 * Math.sin(2 * F - 2 * D);
  lon += 0.011 * Math.sin(Mp - 4 * D);
  return norm360(lon);
}
function mercuryLon(jd) {
  const T = (jd - 2451545) / 36525;
  const L = norm360(252.250906 + 149472.6746358 * T);
  const M = norm360(357.529 + 35999.05 * T) * D2R;
  const Mp = norm360(L) * D2R;
  return norm360(
    L +
      23.44 * Math.sin(Mp) +
      2.9818 * Math.sin(2 * Mp) +
      0.5255 * Math.sin(3 * Mp) +
      0.1058 * Math.sin(4 * Mp) -
      2.0441 * Math.sin(M) +
      0.323 * Math.sin(M - Mp),
  );
}
function venusLon(jd) {
  const T = (jd - 2451545) / 36525;
  const L = norm360(181.979801 + 58517.815676 * T);
  const M = norm360(212.448 + 58517.804 * T) * D2R;
  return norm360(L + 0.7758 * Math.sin(M) + 0.0033 * Math.sin(2 * M));
}
function marsLon(jd) {
  const T = (jd - 2451545) / 36525;
  const L = norm360(355.433 + 19140.2993313 * T);
  const M = norm360(19.373 + 19140.299 * T) * D2R;
  return norm360(
    L +
      10.6912 * Math.sin(M) +
      0.6228 * Math.sin(2 * M) +
      0.0503 * Math.sin(3 * M),
  );
}
function jupiterLon(jd) {
  const T = (jd - 2451545) / 36525;
  const L = norm360(34.351519 + 3034.9056606 * T);
  const M = norm360(20.02 + 3034.906 * T) * D2R;
  return norm360(
    L +
      5.5549 * Math.sin(M) +
      0.1683 * Math.sin(2 * M) +
      0.0071 * Math.sin(3 * M),
  );
}
function saturnLon(jd) {
  const T = (jd - 2451545) / 36525;
  const L = norm360(50.077444 + 1222.1138488 * T);
  const M = norm360(317.02 + 1222.114 * T) * D2R;
  const Mp = norm360(20.02 + 3034.906 * T) * D2R;
  return norm360(
    L +
      6.3585 * Math.sin(M) -
      0.2556 * Math.sin(2 * M) +
      0.0437 * Math.sin(M + Mp) -
      0.0132 * Math.sin(M - Mp),
  );
}
function uranusLon(jd) {
  const T = (jd - 2451545) / 36525;
  const L = norm360(314.055005 + 429.8640561 * T);
  const M = norm360(141.05 + 429.864 * T) * D2R;
  return norm360(
    L +
      5.3042 * Math.sin(M) +
      0.1534 * Math.sin(2 * M) +
      0.0062 * Math.sin(3 * M),
  );
}
function neptuneLon(jd) {
  const T = (jd - 2451545) / 36525;
  const L = norm360(304.348665 + 219.8833092 * T);
  const M = norm360(256.225 + 219.883 * T) * D2R;
  return norm360(L + 1.0898 * Math.sin(M) + 0.0252 * Math.sin(2 * M));
}
function plutoLon(jd) {
  const T = (jd - 2451545) / 36525;
  const Ja = norm360(34.35 + 3034.9057 * T) * D2R;
  const Sa = norm360(50.08 + 1222.1138 * T) * D2R;
  const Pa = norm360(238.96 + 144.96 * T) * D2R;
  let L = 238.9508 + 144.96 * T;
  L +=
    -19.799 * Math.sin(Pa) +
    19.848 * Math.cos(Pa) +
    0.897 * Math.sin(2 * Pa) -
    4.956 * Math.cos(2 * Pa) +
    0.61 * Math.sin(3 * Pa) +
    1.211 * Math.cos(3 * Pa) -
    0.341 * Math.sin(4 * Pa) -
    0.19 * Math.cos(4 * Pa) +
    0.128 * Math.sin(5 * Pa) -
    0.034 * Math.cos(5 * Pa) -
    0.038 * Math.sin(Ja) +
    0.019 * Math.cos(Ja);
  return norm360(L);
}

function calcAscendant(jd, latDeg, lngDeg) {
  const T = (jd - 2451545) / 36525;
  let GMST =
    280.46061837 +
    360.98564736629 * (jd - 2451545) +
    0.000387933 * T * T -
    (T * T * T) / 38710000;
  GMST = norm360(GMST);
  const LST = norm360(GMST + lngDeg);
  const lat = latDeg * D2R,
    e = 23.4393 * D2R;
  const RAMC = LST * D2R;
  const y = -Math.cos(RAMC);
  const x = Math.sin(RAMC) * Math.cos(e) + Math.tan(lat) * Math.sin(e);
  return norm360(Math.atan2(y, x) * R2D);
}
function calcHouses(asc) {
  const ascSign = Math.floor(asc / 30);
  const cusps = [];
  for (let i = 0; i < 12; i++) cusps.push(norm360((ascSign + i) * 30));
  return cusps;
}
function lonToSign(lon) {
  const sign = SIGNS[Math.floor(lon / 30)];
  const deg = lon % 30;
  return {
    sign,
    deg,
    full: `${Math.floor(deg)}°${Math.floor((deg % 1) * 60)}'`,
  };
}

const ASPECT_DEFS = [
  { name: "Conjunction", sym: "☌", angle: 0, orb: 8, type: "major" },
  { name: "Opposition", sym: "☍", angle: 180, orb: 8, type: "major" },
  { name: "Trine", sym: "△", angle: 120, orb: 6, type: "major" },
  { name: "Square", sym: "□", angle: 90, orb: 6, type: "major" },
  { name: "Sextile", sym: "⚹", angle: 60, orb: 4, type: "major" },
  { name: "Quincunx", sym: "⚻", angle: 150, orb: 3, type: "minor" },
];
function findAspects(planets) {
  const aspects = [];
  const names = Object.keys(planets);
  for (let i = 0; i < names.length; i++) {
    for (let j = i + 1; j < names.length; j++) {
      const diff = Math.abs(planets[names[i]] - planets[names[j]]);
      const angle = diff > 180 ? 360 - diff : diff;
      ASPECT_DEFS.forEach((a) => {
        const orb = Math.abs(angle - a.angle);
        if (orb <= a.orb)
          aspects.push({
            p1: names[i],
            p2: names[j],
            asp: a,
            orb: orb.toFixed(1),
          });
      });
    }
  }
  return aspects;
}

function calcChart() {
  const dob = document.getElementById("a-dob").value,
    tob = document.getElementById("a-tob").value,
    pob = document.getElementById("a-pob").value;
  if (!dob || !tob) {
    alert("Please fill in date and time of birth.");
    return;
  }
  const coords = getCoords(pob),
    lat = coords.lat,
    lng = coords.lng,
    tz = coords.tz;
  const [y, mo, d] = dob.split("-").map(Number),
    [h, m] = tob.split(":").map(Number);
  const utcHour = h + m / 60 - tz;
  const jd = toJD(y, mo, d, utcHour);
  const planets = {
    Sun: sunLon(jd),
    Moon: moonLon(jd),
    Mercury: mercuryLon(jd),
    Venus: venusLon(jd),
    Mars: marsLon(jd),
    Jupiter: jupiterLon(jd),
    Saturn: saturnLon(jd),
    Uranus: uranusLon(jd),
    Neptune: neptuneLon(jd),
    Pluto: plutoLon(jd),
  };
  const asc = calcAscendant(jd, lat, lng),
    houses = calcHouses(asc);
  renderBigThree(planets, asc);
  renderPlanetGrid(planets, asc);
  renderChartWheel(planets, asc, houses);
  renderAspects(planets);
  document.getElementById("big-three-wrap").style.display = "block";
  document.getElementById("planet-wrap").style.display = "block";
  document.getElementById("astro-placeholder").style.display = "none";
  document.getElementById("birth-chart-svg").style.display = "block";
  document.getElementById("aspect-list").style.display = "block";
}

const PLANET_COLORS = {
  Sun: "#d4944a",
  Moon: "#c8d4c0",
  Mercury: "#6aacb8",
  Venus: "#c47a7a",
  Mars: "#c47a7a",
  Jupiter: "#d4b44a",
  Saturn: "#a8c4aa",
  Uranus: "#9a8ec4",
  Neptune: "#7aa4c4",
  Pluto: "#8a6a8a",
};
function renderBigThree(planets, asc) {
  const sun = lonToSign(planets.Sun),
    moon = lonToSign(planets.Moon),
    rising = lonToSign(asc);
  document.getElementById("big-three-cards").innerHTML = [
    { label: "☉ sun", data: sun, col: PLANET_COLORS.Sun },
    { label: "☽ moon", data: moon, col: PLANET_COLORS.Moon },
    { label: "↑ rising", data: rising, col: PLANET_COLORS.Uranus },
  ]
    .map(
      ({ label, data, col }) => `
    <div class="big-three-card">
      <div class="btc-label">${label}</div>
      <div class="btc-sign" style="color:${col}">${data.sign} <span style="font-size:14px">${SIGN_SYMS[SIGNS.indexOf(data.sign)]}</span></div>
      <div class="btc-degree">${data.full} ${data.sign} · ${ELEMENT_NAMES[data.sign]} · ${MODALITIES[data.sign]}</div>
      <div class="btc-element">${ELEMENTS[data.sign]}</div>
      <div class="btc-desc">${SIGN_DESCS[data.sign]}</div>
    </div>`,
    )
    .join("");
}

function renderPlanetGrid(planets, asc) {
  document.getElementById("planet-grid").innerHTML = Object.entries(planets)
    .map(([name, lon]) => {
      const s = lonToSign(lon);
      return `<div class="planet-item"><div class="planet-sym" style="color:${PLANET_COLORS[name] || "var(--soft)"}">${PLANET_SYMS[name] || "●"}</div>
        <div class="planet-info"><div class="planet-name">${name}</div><div class="planet-sign">${s.sign}</div><div class="planet-deg">${s.full}</div></div></div>`;
    })
    .join("");
}

function renderChartWheel(planets, asc, houses) {
  const svg = document.getElementById("birth-chart-svg"),
    cx = 250,
    cy = 250,
    R = 220;
  const rings = { outer: R, inner: R - 25, mid: R - 50, core: R - 90 };
  let s = `<circle cx="${cx}" cy="${cy}" r="${R}" fill="rgba(26,31,26,0.9)" stroke="var(--border)" stroke-width="0.5"/>`;
  const elemColors = {
    Fire: "rgba(212,148,74,0.06)",
    Earth: "rgba(122,158,126,0.06)",
    Air: "rgba(106,172,184,0.06)",
    Water: "rgba(154,142,196,0.06)",
  };
  houses.forEach((cusp, i) => {
    const next = houses[(i + 1) % 12],
      elem = ELEMENT_NAMES[SIGNS[Math.floor(cusp / 30)]];
    const a1 = (cusp - asc - 90) * D2R,
      a2 = (next - asc - 90) * D2R;
    const x1 = cx + rings.mid * Math.cos(a1),
      y1 = cy + rings.mid * Math.sin(a1),
      x2 = cx + rings.mid * Math.cos(a2),
      y2 = cy + rings.mid * Math.sin(a2);
    const xi1 = cx + rings.core * Math.cos(a1),
      yi1 = cy + rings.core * Math.sin(a1),
      xi2 = cx + rings.core * Math.cos(a2),
      yi2 = cy + rings.core * Math.sin(a2);
    s += `<path d="M${xi1},${yi1} L${x1},${y1} A${rings.mid},${rings.mid} 0 0,1 ${x2},${y2} L${xi2},${yi2} A${rings.core},${rings.core} 0 0,0 ${xi1},${yi1}" fill="${elemColors[elem] || "none"}"/>`;
  });
  [rings.outer, rings.inner, rings.mid, rings.core, rings.core - 10].forEach(
    (r) => {
      s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--border)" stroke-width="0.5"/>`;
    },
  );
  houses.forEach((cusp, i) => {
    const ang = (cusp - asc - 90) * D2R,
      x1 = cx + rings.inner * Math.cos(ang),
      y1 = cy + rings.inner * Math.sin(ang),
      x2 = cx + (rings.core - 12) * Math.cos(ang),
      y2 = cy + (rings.core - 12) * Math.sin(ang);
    const isMajor = [0, 3, 6, 9].includes(i);
    s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${isMajor ? "var(--sage2)" : "var(--border)"}" stroke-width="${isMajor ? 1 : 0.5}"/>`;
    const h2ang = (houses[(i + 1) % 12] - asc - 90) * D2R,
      midAng = (ang + h2ang) / 2,
      nr = rings.core - 18;
    s += `<text x="${cx + nr * Math.cos(midAng)}" y="${cy + nr * Math.sin(midAng)}" fill="var(--muted)" font-size="7" text-anchor="middle" dominant-baseline="middle" style="font-family:'DM Mono',monospace">${i + 1}</text>`;
  });
  for (let i = 0; i < 12; i++) {
    const signStart = (i * 30 - asc - 90) * D2R,
      signMid = (i * 30 + 15 - asc - 90) * D2R,
      sr = rings.outer - 12;
    s += `<text x="${cx + sr * Math.cos(signMid)}" y="${cy + sr * Math.sin(signMid)}" fill="var(--muted)" font-size="10" text-anchor="middle" dominant-baseline="middle">${SIGN_SYMS[i]}</text>`;
    const x1 = cx + rings.outer * Math.cos(signStart),
      y1 = cy + rings.outer * Math.sin(signStart),
      x2 = cx + rings.inner * Math.cos(signStart),
      y2 = cy + rings.inner * Math.sin(signStart);
    s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--border)" stroke-width="0.5"/>`;
  }
  const aspects = findAspects(planets);
  const aspColors = {
    Conjunction: "var(--sage)",
    Opposition: "var(--rose)",
    Trine: "var(--sky)",
    Square: "var(--rose)",
    Sextile: "var(--amber)",
    Quincunx: "var(--lavender)",
  };
  aspects.slice(0, 20).forEach((asp) => {
    const a1 = (planets[asp.p1] - asc - 90) * D2R,
      a2 = (planets[asp.p2] - asc - 90) * D2R,
      r = rings.core - 22;
    const x1 = cx + r * Math.cos(a1),
      y1 = cy + r * Math.sin(a1),
      x2 = cx + r * Math.cos(a2),
      y2 = cy + r * Math.sin(a2);
    s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${aspColors[asp.asp.name] || "var(--muted)"}" stroke-width="0.5" opacity="0.35"/>`;
  });
  Object.entries(planets).forEach(([name, lon]) => {
    const ang = (lon - asc - 90) * D2R,
      pr = rings.mid - 12,
      px2 = cx + pr * Math.cos(ang),
      py2 = cy + pr * Math.sin(ang);
    const ti1 = cx + rings.inner * Math.cos(ang),
      ti1y = cy + rings.inner * Math.sin(ang),
      ti2 = cx + (rings.inner + 8) * Math.cos(ang),
      ti2y = cy + (rings.inner + 8) * Math.sin(ang);
    s += `<line x1="${ti1}" y1="${ti1y}" x2="${ti2}" y2="${ti2y}" stroke="${PLANET_COLORS[name]}" stroke-width="1.5"/>`;
    s += `<circle cx="${px2}" cy="${py2}" r="9" fill="rgba(26,31,26,0.9)" stroke="${PLANET_COLORS[name]}" stroke-width="1"/>`;
    s += `<text x="${px2}" y="${py2}" fill="${PLANET_COLORS[name]}" font-size="10" text-anchor="middle" dominant-baseline="middle">${PLANET_SYMS[name]}</text>`;
  });
  s += `<line x1="${cx}" y1="${cy}" x2="${cx + rings.mid * Math.cos(-90 * D2R)}" y2="${cy + rings.mid * Math.sin(-90 * D2R)}" stroke="var(--sage)" stroke-width="1.5" opacity="0.7"/>`;
  s += `<text x="${cx + 2}" y="${cy - rings.mid + 16}" fill="var(--sage)" font-size="9" text-anchor="middle" style="font-family:'DM Mono',monospace">ASC</text>`;
  s += `<circle cx="${cx}" cy="${cy}" r="6" fill="var(--sage2)" opacity="0.4"/>`;
  svg.innerHTML = s;
}

function renderAspects(planets) {
  const aspects = findAspects(planets);
  const aspColors = {
    Conjunction: "var(--sage)",
    Opposition: "var(--rose)",
    Trine: "var(--sky)",
    Square: "var(--rose)",
    Sextile: "var(--amber)",
    Quincunx: "var(--lavender)",
  };
  const el = document.getElementById("aspect-rows");
  if (!aspects.length) {
    el.innerHTML =
      '<div style="color:var(--muted);font-size:10px">no major aspects found</div>';
    return;
  }
  el.innerHTML = aspects
    .slice(0, 15)
    .map(
      (a) => `
    <div class="aspect-row">
      <span class="asp-planets">${PLANET_SYMS[a.p1] || a.p1} ${a.p1} — ${PLANET_SYMS[a.p2] || a.p2} ${a.p2}</span>
      <span class="asp-type">${a.asp.sym} ${a.asp.name}</span>
      <span class="asp-badge" style="color:${aspColors[a.asp.name] || "var(--muted)"};border-color:${aspColors[a.asp.name] || "var(--border)"}">±${a.orb}°</span>
    </div>`,
    )
    .join("");
}
