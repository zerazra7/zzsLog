-- Public profile table so every signed-up user can be listed/found
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null
);

alter table profiles enable row level security;

create policy "Profiles are viewable by authenticated users"
on profiles for select
using (auth.role() = 'authenticated');

create policy "Users can insert their own profile"
on profiles for insert
with check (auth.uid() = id);

-- Backfill profiles for existing users
insert into public.profiles (id, email)
select id, email from auth.users
on conflict (id) do nothing;

-- Auto-create a profile row whenever someone signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Everyone signed in can see everyone else's shows (small trusted friend group)
create policy "Authenticated users can view all shows"
on shows for select
using (auth.role() = 'authenticated');

-- Public message wall on each profile
create table wall_messages (
  id bigint generated always as identity primary key,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  text text not null,
  created_at timestamptz not null default now()
);

alter table wall_messages enable row level security;

create policy "Anyone authenticated can read wall messages"
on wall_messages for select
using (auth.role() = 'authenticated');

create policy "Users can post messages as themselves"
on wall_messages for insert
with check (auth.uid() = author_id);

create policy "Users can delete their own messages"
on wall_messages for delete
using (auth.uid() = author_id);
