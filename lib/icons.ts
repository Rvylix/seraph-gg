// ─── Icon URLs from Supabase Storage ─────────────────────────
const BASE = "https://fesdcaexwcslmwipzzln.supabase.co/storage/v1/object/public/assets/icons";

export const ELEMENT_ICON: Record<string, string> = {
  fire:    `${BASE}/elements/Fire_Elements.webp`,
  ice:     `${BASE}/elements/ice.png`,
  thunder: `${BASE}/elements/thunder.png`,
  light:   `${BASE}/elements/light.png`,
  dark:    `${BASE}/elements/dark.png`,
  none:    "",
};

export const ATTACK_ICON: Record<string, string> = {
  slash:  `${BASE}/attack/Slash.webp`,
  pierce: `${BASE}/attack/pierce.png`,
  crush:  `${BASE}/attack/crush.png`,
  none:   "",
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
