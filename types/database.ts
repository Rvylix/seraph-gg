// ─── Auto-generated shape for Supabase tables ────────────────────────────────
// Update this file whenever you run: supabase gen types typescript

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Element   = "fire" | "water" | "wind" | "thunder" | "none";
export type Role      = "atk" | "def" | "sup" | "heal";
export type Rarity    = "SS" | "S" | "A";
export type Company   = "31st" | "32nd" | "33rd" | "35th" | "38th" | "other";
export type EventStatus = "live" | "upcoming" | "ended";
export type MemTag    = "ATK" | "DEF" | "SPD" | "HEAL" | "SUP" | "FIRE" | "WATER" | "WIND" | "THUNDER" | "CRIT";

// ─── Units ────────────────────────────────────────────────────────────────────
export interface Unit {
  id:          string;           // uuid
  name:        string;
  name_jp:     string | null;
  cv:          string | null;    // voice actor
  company:     Company;
  element:     Element;
  role:        Role;
  rarity:      Rarity;
  position:    "front" | "mid" | "back";
  description: string | null;
  image_url:   string | null;
  is_limited:  boolean;
  created_at:  string;
}

// ─── Memorias ─────────────────────────────────────────────────────────────────
export interface Memoria {
  id:           string;
  name:         string;
  rarity:       Rarity;
  skill_desc:   string;
  tags:         MemTag[];
  unit_id:      string | null;   // null = generic / not unit-specific
  is_limited:   boolean;
  image_url:    string | null;
  created_at:   string;
}

// Unit ↔ Memoria join (recommendation tier)
export type RecommendTier = "best" | "good" | "situational";

export interface UnitMemoria {
  unit_id:     string;
  memoria_id:  string;
  tier:        RecommendTier;
  note:        string | null;
  memoria?:    Memoria;          // joined
}

// ─── Socialization ────────────────────────────────────────────────────────────
export interface Socialization {
  id:            string;
  unit_id:       string;
  episode_group: string;         // e.g. "Episode 1 — First Meetings"
  order_index:   number;
  title:         string;
  unlock_condition: string;
}

// ─── Recollections ────────────────────────────────────────────────────────────
export interface Recollection {
  id:            string;
  unit_id:       string;
  order_index:   number;
  title:         string;
  unlock_condition: string;
}

// ─── Events ───────────────────────────────────────────────────────────────────
export interface GameEvent {
  id:          string;
  name:        string;
  status:      EventStatus;
  element:     Element | null;
  starts_at:   string;           // ISO datetime
  ends_at:     string;
  rewards:     string[];         // e.g. ["SS Memoria", "Quartz ×3000"]
  description: string | null;
  image_url:   string | null;
  created_at:  string;
}

// ─── Squads ───────────────────────────────────────────────────────────────────
export type SquadTag = "Boss Clear" | "Event Farming" | "F2P" | "No SS" | "Mixed";

export interface Squad {
  id:            string;
  name:          string;
  purpose:       string;
  element:       Element | null;
  tags:          SquadTag[];
  strategy_note: string;
  author_name:   string;         // no login — free text nickname
  upvotes:       number;
  created_at:    string;
}

// Squad → unit slots (5 slots per squad)
export interface SquadSlot {
  squad_id:   string;
  slot_index: number;            // 1–5
  unit_id:    string;
  memoria_id: string | null;
  unit?:      Unit;              // joined
  memoria?:   Memoria;           // joined
}

// ─── Guides ───────────────────────────────────────────────────────────────────
export interface Guide {
  id:          string;
  order_index: number;
  title:       string;
  subtitle:    string | null;
  slug:        string;
  content_mdx: string;           // raw MDX stored in DB
  tags:        string[];
  is_beginner: boolean;
  created_at:  string;
  updated_at:  string;
}

// ─── Database shape (for Supabase client generic) ─────────────────────────────
export interface Database {
  public: {
    Tables: {
      units:          { Row: Unit;          Insert: Omit<Unit, "id"|"created_at">;          Update: Partial<Unit> };
      memorias:       { Row: Memoria;       Insert: Omit<Memoria, "id"|"created_at">;       Update: Partial<Memoria> };
      unit_memorias:  { Row: UnitMemoria;   Insert: UnitMemoria;                             Update: Partial<UnitMemoria> };
      socializations: { Row: Socialization; Insert: Omit<Socialization, "id">;               Update: Partial<Socialization> };
      recollections:  { Row: Recollection;  Insert: Omit<Recollection, "id">;                Update: Partial<Recollection> };
      events:         { Row: GameEvent;     Insert: Omit<GameEvent, "id"|"created_at">;      Update: Partial<GameEvent> };
      squads:         { Row: Squad;         Insert: Omit<Squad, "id"|"created_at"|"upvotes">; Update: Partial<Squad> };
      squad_slots:    { Row: SquadSlot;     Insert: SquadSlot;                               Update: Partial<SquadSlot> };
      guides:         { Row: Guide;         Insert: Omit<Guide, "id"|"created_at"|"updated_at">; Update: Partial<Guide> };
    };
  };
}
