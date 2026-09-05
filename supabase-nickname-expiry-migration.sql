-- Optional nickname per user
alter table profiles add column nickname text;

create policy "Users can update their own profile"
on profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- Allow anyone to clean up wall messages older than a day (self-expiring wall)
create policy "Anyone can delete expired wall messages"
on wall_messages for delete
using (created_at < now() - interval '1 day');
