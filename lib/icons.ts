const BASE = "https://fesdcaexwcslmwipzzln.supabase.co/storage/v1/object/public/assets/icons";

export const ELEMENT_ICON: Record<string, string> = {
  fire:    `${BASE}/elements/Fire_Element.webp`,
  ice:     `${BASE}/elements/Ice_Icon.webp`,
  thunder: `${BASE}/elements/Thunder_Icon.webp`,
  light:   `${BASE}/elements/Light_Icon.webp`,
  dark:    `${BASE}/elements/Dark_Element.webp`,
  none:    "",
};

export const ATTACK_ICON: Record<string, string> = {
  slash:  `${BASE}/attack/Slash.webp`,
  pierce: `${BASE}/attack/Pierce.webp`,
  crush:  `${BASE}/attack/Crush.webp`,
  none:   "",
};

export const COMPANY_ARTWORK: Record<string, string> = {
  "31-A":        "https://fesdcaexwcslmwipzzln.supabase.co/storage/v1/object/public/assets/company%20artwork/kv-31-A.jpg",
  "31-B":        "https://fesdcaexwcslmwipzzln.supabase.co/storage/v1/object/public/assets/company%20artwork/kv-31-B.jpg",
  "31-C":        "https://fesdcaexwcslmwipzzln.supabase.co/storage/v1/object/public/assets/company%20artwork/kv-31-C.jpg",
  "31-D":        "https://fesdcaexwcslmwipzzln.supabase.co/storage/v1/object/public/assets/company%20artwork/kv-31-D.jpg",
  "31-E":        "https://fesdcaexwcslmwipzzln.supabase.co/storage/v1/object/public/assets/company%20artwork/kv-31-E.jpg",
  "31-F":        "https://fesdcaexwcslmwipzzln.supabase.co/storage/v1/object/public/assets/company%20artwork/kv-31-F.jpg",
  "31-X":        "https://fesdcaexwcslmwipzzln.supabase.co/storage/v1/object/public/assets/company%20artwork/kv-31-X.jpg",
  "30-G":        "https://fesdcaexwcslmwipzzln.supabase.co/storage/v1/object/public/assets/company%20artwork/kv-30-G.jpg",
  "HQ":          "https://fesdcaexwcslmwipzzln.supabase.co/storage/v1/object/public/assets/company%20artwork/kv-HQ.jpg",
  "ANGEL BEATS": "",
};

export const COMPANY_ICON: Record<string, string> = {
  "31-A":        `${BASE}/company/31A_Logo.webp`,
  "31-B":        `${BASE}/company/31B_Logo.webp`,
  "31-C":        `${BASE}/company/31C_Logo.webp`,
  "31-D":        `${BASE}/company/31D_Logo.webp`,
  "31-E":        `${BASE}/company/31E_Logo.webp`,
  "31-F":        `${BASE}/company/31F_Logo.webp`,
  "31-X":        `${BASE}/company/31F_Logo.webp`,
  "30-G":        `${BASE}/company/30G_Logo.webp`,
  "HQ":          `${BASE}/company/HQ.webp`,
  "ANGEL BEATS": `${BASE}/company/angelbeats.webp`,
};

export const RARITY_ICON: Record<string, string> = {
  SS:  `${BASE}/rarity/IconRaritySS.webp`,
  S:   `${BASE}/rarity/IconRarityS.webp`,
  A:   `${BASE}/rarity/IconRarityA.webp`,
  SSR: `${BASE}/rarity/IconRaritySSR.webp`,
};

export const ELEMENT_COLOR: Record<string, string> = {
  fire:    "#FF7755",
  ice:     "#80AAFF",
  thunder: "#FFD966",
  light:   "#FFFFAA",
  dark:    "#CC88FF",
  none:    "#888888",
};

export const RARITY_COLOR: Record<string, string> = {
  SS: "#C8A050",
  S:  "#AA88FF",
  A:  "#80AAFF",
};

export const ROLE_COLOR: Record<string, { bg: string; text: string }> = {
  attacker:  { bg: "rgba(204,34,34,0.15)",   text: "#FF8080" },
  breaker:   { bg: "rgba(204,100,34,0.15)",  text: "#FFAA66" },
  blaster:   { bg: "rgba(180,34,180,0.15)",  text: "#FF88FF" },
  defender:  { bg: "rgba(34,100,204,0.15)",  text: "#80AAFF" },
  buffer:    { bg: "rgba(200,160,80,0.15)",  text: "#C8A050" },
  debuffer:  { bg: "rgba(100,180,100,0.15)", text: "#80FF80" },
  healer:    { bg: "rgba(34,180,100,0.15)",  text: "#22CC66" },
  admiral:   { bg: "rgba(180,140,34,0.15)",  text: "#FFD966" },
  rider:     { bg: "rgba(80,160,200,0.15)",  text: "#80DDFF" },
};
