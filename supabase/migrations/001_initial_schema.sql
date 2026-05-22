-- ============================================================
-- SERAPH.GG — Initial Schema
-- Run in Supabase SQL editor or via: supabase db push
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- ─── Enums ───────────────────────────────────────────────────
create type element_type   as enum ('fire','water','wind','thunder','none');
create type role_type      as enum ('atk','def','sup','heal');
create type rarity_type    as enum ('SS','S','A');
create type company_type   as enum ('31st','32nd','33rd','35th','38th','other');
create type event_status   as enum ('live','upcoming','ended');
create type recommend_tier as enum ('best','good','situational');
create type position_type  as enum ('front','mid','back');

-- ─── Units ───────────────────────────────────────────────────
create table units (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  name_jp     text,
  cv          text,
  company     company_type not null,
  element     element_type not null default 'none',
  role        role_type    not null,
  rarity      rarity_type  not null,
  position    position_type not null default 'front',
  description text,
  image_url   text,
  is_limited  boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ─── Memorias ────────────────────────────────────────────────
create table memorias (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  rarity      rarity_type not null,
  skill_desc  text not null,
  tags        text[] not null default '{}',
  unit_id     uuid references units(id) on delete set null,
  is_limited  boolean not null default false,
  image_url   text,
  created_at  timestamptz not null default now()
);

-- ─── Unit ↔ Memoria recommendations ─────────────────────────
create table unit_memorias (
  unit_id     uuid references units(id) on delete cascade,
  memoria_id  uuid references memorias(id) on delete cascade,
  tier        recommend_tier not null default 'good',
  note        text,
  primary key (unit_id, memoria_id)
);

-- ─── Socialization ────────────────────────────────────────────
create table socializations (
  id                uuid primary key default uuid_generate_v4(),
  unit_id           uuid references units(id) on delete cascade not null,
  episode_group     text not null,
  order_index       int  not null,
  title             text not null,
  unlock_condition  text not null
);

-- ─── Recollections ────────────────────────────────────────────
create table recollections (
  id                uuid primary key default uuid_generate_v4(),
  unit_id           uuid references units(id) on delete cascade not null,
  order_index       int  not null,
  title             text not null,
  unlock_condition  text not null
);

-- ─── Events ──────────────────────────────────────────────────
create table events (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  status      event_status not null default 'upcoming',
  element     element_type,
  starts_at   timestamptz not null,
  ends_at     timestamptz not null,
  rewards     text[] not null default '{}',
  description text,
  image_url   text,
  created_at  timestamptz not null default now()
);

-- ─── Squads ──────────────────────────────────────────────────
create table squads (
  id             uuid primary key default uuid_generate_v4(),
  name           text not null,
  purpose        text not null,
  element        element_type,
  tags           text[] not null default '{}',
  strategy_note  text not null,
  author_name    text not null default 'Anonymous',
  upvotes        int  not null default 0,
  created_at     timestamptz not null default now()
);

create table squad_slots (
  squad_id    uuid references squads(id) on delete cascade,
  slot_index  int  not null check (slot_index between 1 and 5),
  unit_id     uuid references units(id) on delete cascade not null,
  memoria_id  uuid references memorias(id) on delete set null,
  primary key (squad_id, slot_index)
);

-- ─── Guides ──────────────────────────────────────────────────
create table guides (
  id          uuid primary key default uuid_generate_v4(),
  order_index int  not null,
  title       text not null,
  subtitle    text,
  slug        text not null unique,
  content_mdx text not null default '',
  tags        text[] not null default '{}',
  is_beginner boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ─── Row Level Security ──────────────────────────────────────
-- All tables: public read, no public write (admin writes via service key)
alter table units          enable row level security;
alter table memorias       enable row level security;
alter table unit_memorias  enable row level security;
alter table socializations enable row level security;
alter table recollections  enable row level security;
alter table events         enable row level security;
alter table squads         enable row level security;
alter table squad_slots    enable row level security;
alter table guides         enable row level security;

-- Public read policies
create policy "public read units"          on units          for select using (true);
create policy "public read memorias"       on memorias       for select using (true);
create policy "public read unit_memorias"  on unit_memorias  for select using (true);
create policy "public read socializations" on socializations for select using (true);
create policy "public read recollections"  on recollections  for select using (true);
create policy "public read events"         on events         for select using (true);
create policy "public read squads"         on squads         for select using (true);
create policy "public read squad_slots"    on squad_slots    for select using (true);
create policy "public read guides"         on guides         for select using (true);

-- Squads: anyone can INSERT (no login required per spec)
create policy "public insert squads"       on squads       for insert with check (true);
create policy "public insert squad_slots"  on squad_slots  for insert with check (true);

-- Squads: anyone can upvote (increment only, handled via RPC)
create or replace function increment_upvote(squad_id uuid)
returns void language sql security definer as $$
  update squads set upvotes = upvotes + 1 where id = squad_id;
$$;

-- ─── Indexes ─────────────────────────────────────────────────
create index idx_units_company   on units(company);
create index idx_units_element   on units(element);
create index idx_units_role      on units(role);
create index idx_memorias_unit   on memorias(unit_id);
create index idx_events_status   on events(status);
create index idx_events_ends_at  on events(ends_at);
create index idx_squads_upvotes  on squads(upvotes desc);
create index idx_squads_created  on squads(created_at desc);
create index idx_squad_slots     on squad_slots(squad_id);
create index idx_social_unit     on socializations(unit_id, order_index);
create index idx_recoll_unit     on recollections(unit_id, order_index);
