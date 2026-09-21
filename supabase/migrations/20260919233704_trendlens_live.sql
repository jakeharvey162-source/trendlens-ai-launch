create table public.trendlens_reports (
 id uuid primary key, user_id uuid not null references auth.users(id) on delete cascade,
 payload jsonb not null, saved boolean not null default false, created_at timestamptz not null default now()
);
create index trendlens_reports_owner_date on public.trendlens_reports(user_id,created_at desc);
alter table public.trendlens_reports enable row level security;
revoke all on public.trendlens_reports from anon, authenticated;
grant select, delete on public.trendlens_reports to authenticated;
grant update(saved) on public.trendlens_reports to authenticated;
grant all on public.trendlens_reports to service_role;
create policy owner_read on public.trendlens_reports for select to authenticated using ((select auth.uid())=user_id);
create policy owner_delete on public.trendlens_reports for delete to authenticated using ((select auth.uid())=user_id);
create policy owner_save on public.trendlens_reports for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create table public.trendlens_usage(scope text not null, day date not null, count integer not null default 0, primary key(scope,day));
create table public.trendlens_jobs(id uuid primary key,user_id uuid not null references auth.users(id) on delete cascade,query text not null,kind text not null,status text not null default 'pending',created_at timestamptz not null default now());
create index trendlens_jobs_owner on public.trendlens_jobs(user_id);
alter table public.trendlens_usage enable row level security;
alter table public.trendlens_jobs enable row level security;
revoke all on public.trendlens_usage, public.trendlens_jobs from anon, authenticated;
grant all on public.trendlens_usage, public.trendlens_jobs to service_role;
create function public.trendlens_reserve_research(p_user uuid,p_request uuid,p_query text,p_kind text)
returns boolean language plpgsql security invoker set search_path='' as $$
declare n integer; d date := (now() at time zone 'UTC')::date;
begin
 insert into public.trendlens_jobs(id,user_id,query,kind) values(p_request,p_user,p_query,p_kind) on conflict do nothing;
 if not found then return false; end if;
 insert into public.trendlens_usage(scope,day,count) values('global',d,1)
 on conflict(scope,day) do update set count=public.trendlens_usage.count+1 returning count into n;
 if n>50 then raise exception 'Global daily limit reached'; end if;
 insert into public.trendlens_usage(scope,day,count) values(p_user::text,d,1)
 on conflict(scope,day) do update set count=public.trendlens_usage.count+1 returning count into n;
 if n>5 then raise exception 'User daily limit reached'; end if;
 return true;
end; $$;
revoke all on function public.trendlens_reserve_research(uuid,uuid,text,text) from public,anon,authenticated;
grant execute on function public.trendlens_reserve_research(uuid,uuid,text,text) to service_role;
