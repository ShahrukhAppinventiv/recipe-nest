create or replace function public.get_random_published_recipe_id()
returns bigint
language sql
stable
as $$
  select id
  from public.recipes
  where status = 'published'
  order by random()
  limit 1;
$$;
