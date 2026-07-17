-- Run this once in your Supabase project's SQL Editor (Dashboard → SQL Editor → New query).
-- It sets up the bio_pages table plus two SECURITY DEFINER functions that let
-- anonymous visitors create/edit their own page using a locally-stored "edit
-- key" instead of a full login system — no auth setup required.
--
-- Security model: the edit_key column is NEVER exposed to public SELECT
-- queries (enforced by column-level GRANT below). The only way to prove you
-- own a page is to already know its edit_key, which is generated client-side
-- and shown to the creator exactly once. This is good-enough security for a
-- free hobby tool with no login — not the same guarantee as real
-- authentication, and that tradeoff is intentional and documented.

create extension if not exists pgcrypto;

create table if not exists bio_pages (
  id uuid primary key default gen_random_uuid(),
  username text unique not null check (username ~ '^[a-z0-9-]{3,30}$'),
  edit_key text not null,
  display_name text not null default '',
  bio_text text not null default '',
  theme text not null default 'cream',
  links jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists bio_pages_username_idx on bio_pages (username);

alter table bio_pages enable row level security;

-- Public read policy — combined with the column-level grant below, this only
-- ever exposes the "safe" columns (never edit_key) to anonymous requests.
drop policy if exists "public safe select" on bio_pages;
create policy "public safe select" on bio_pages for select using (true);

-- Lock down direct table access for anon: no direct insert/update/delete, and
-- only the listed columns are visible on SELECT. All writes must go through
-- the SECURITY DEFINER function below, which enforces the edit_key check.
revoke all on bio_pages from anon, authenticated;
grant select (id, username, display_name, bio_text, theme, links, created_at)
  on bio_pages to anon, authenticated;

-- Fetch a page for editing — only succeeds if edit_key matches.
create or replace function get_bio_page_for_edit(p_username text, p_edit_key text)
returns setof bio_pages
language sql
security definer
set search_path = public
as $$
  select * from bio_pages
  where username = p_username and edit_key = p_edit_key;
$$;

-- Create-or-update a page. First save for a username creates it and assigns
-- p_edit_key as its permanent key. Every save after that requires the same
-- edit_key to succeed.
create or replace function save_bio_page(
  p_username text,
  p_edit_key text,
  p_display_name text,
  p_bio_text text,
  p_theme text,
  p_links jsonb
)
returns setof bio_pages
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (select 1 from bio_pages where username = p_username) then
    if not exists (select 1 from bio_pages where username = p_username and edit_key = p_edit_key) then
      raise exception 'INVALID_EDIT_KEY';
    end if;
    return query
      update bio_pages
      set display_name = p_display_name,
          bio_text = p_bio_text,
          theme = p_theme,
          links = p_links,
          updated_at = now()
      where username = p_username and edit_key = p_edit_key
      returning *;
  else
    return query
      insert into bio_pages (username, edit_key, display_name, bio_text, theme, links)
      values (p_username, p_edit_key, p_display_name, p_bio_text, p_theme, p_links)
      returning *;
  end if;
end;
$$;

revoke all on function get_bio_page_for_edit(text, text) from public;
revoke all on function save_bio_page(text, text, text, text, text, jsonb) from public;
grant execute on function get_bio_page_for_edit(text, text) to anon, authenticated;
grant execute on function save_bio_page(text, text, text, text, text, jsonb) to anon, authenticated;
