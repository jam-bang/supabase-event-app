-- 이벤트 관리 앱 초기 스키마
-- profiles: 사용자 프로필 (auth.users 1:1)
-- events: 이벤트 (주최자 = host_id)
-- event_participants: 이벤트 참여 (사용자당 1회)

-- 1) profiles -------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "프로필은 누구나 조회" on public.profiles
  for select using (true);

create policy "본인 프로필만 수정" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- 회원가입 시 프로필 자동 생성
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2) events ---------------------------------------------------------------
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references public.profiles (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 100),
  description text not null default '',
  location text not null default '',
  starts_at timestamptz not null,
  capacity integer check (capacity is null or capacity > 0),
  created_at timestamptz not null default now()
);

create index if not exists events_starts_at_idx on public.events (starts_at);
create index if not exists events_host_id_idx on public.events (host_id);

alter table public.events enable row level security;

create policy "이벤트는 누구나 조회" on public.events
  for select using (true);

create policy "로그인 사용자는 본인 명의로 이벤트 생성" on public.events
  for insert to authenticated
  with check ((select auth.uid()) = host_id);

create policy "주최자만 이벤트 수정" on public.events
  for update to authenticated
  using ((select auth.uid()) = host_id)
  with check ((select auth.uid()) = host_id);

create policy "주최자만 이벤트 삭제" on public.events
  for delete to authenticated
  using ((select auth.uid()) = host_id);

-- 3) event_participants ---------------------------------------------------
create table if not exists public.event_participants (
  event_id uuid not null references public.events (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (event_id, user_id)
);

create index if not exists event_participants_user_id_idx on public.event_participants (user_id);

alter table public.event_participants enable row level security;

create policy "참여 현황은 누구나 조회" on public.event_participants
  for select using (true);

create policy "본인만 참여 신청" on public.event_participants
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "본인만 참여 취소" on public.event_participants
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- 정원 초과 방지
create or replace function public.check_event_capacity()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  max_capacity integer;
  current_count integer;
begin
  select capacity into max_capacity from public.events where id = new.event_id for update;
  if max_capacity is not null then
    select count(*) into current_count from public.event_participants where event_id = new.event_id;
    if current_count >= max_capacity then
      raise exception '정원이 마감된 이벤트입니다.' using errcode = 'P0001';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists before_participant_insert on public.event_participants;
create trigger before_participant_insert
  before insert on public.event_participants
  for each row execute function public.check_event_capacity();
