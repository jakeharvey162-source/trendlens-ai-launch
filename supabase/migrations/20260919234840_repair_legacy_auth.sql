create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if to_regclass('public.user_profiles') is not null then
   execute 'insert into public.user_profiles(id,email,full_name,role) values ($1,$2,$3,''user''::public.user_role) on conflict(id) do nothing'
   using new.id,new.email,coalesce(new.raw_user_meta_data->>'full_name',split_part(new.email,'@',1));
 end if;
 return new;
end; $$;
revoke execute on function public.handle_new_user() from public,anon,authenticated;
create or replace function public.is_admin() returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from auth.users au where au.id=(select auth.uid()) and au.raw_app_meta_data->>'role'='admin');
$$;
revoke execute on function public.is_admin() from public,anon;
grant execute on function public.is_admin() to authenticated;
alter function public.update_updated_at() set search_path='';
