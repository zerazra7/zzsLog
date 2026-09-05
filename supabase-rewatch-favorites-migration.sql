-- How many times the whole show has been watched (for "mark all watched" / "watched twice")
alter table shows add column rewatch_count integer not null default 1;

-- Favorite shows (shown on the profile page)
alter table shows add column is_favorite boolean not null default false;

-- Track when a show's watched status last changed, so People can be sorted by recent activity
alter table shows add column updated_at timestamptz not null default now();

create or replace function public.set_shows_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_shows_updated_at
before update on shows
for each row execute procedure public.set_shows_updated_at();
