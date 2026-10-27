create extension if not exists pgcrypto;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  idempotency_key uuid not null unique,
  product_id text not null,
  product_name text not null,
  quantity integer not null default 1 check (quantity > 0 and quantity <= 10),
  unit_price integer not null check (unit_price >= 0),
  original_price integer not null check (original_price >= 0),
  discount_amount integer not null default 0 check (discount_amount >= 0),
  customer_name text not null check (char_length(customer_name) between 2 and 80),
  customer_phone text not null,
  delivery_address text not null check (char_length(delivery_address) between 8 and 300),
  delivery_area text not null check (delivery_area in ('inside_dhaka','outside_dhaka')),
  delivery_charge integer not null check (delivery_charge >= 0),
  total_amount integer not null check (total_amount >= 0),
  payment_method text not null check (payment_method in ('bkash','nagad','cod')),
  payment_status text not null default 'pending' check (payment_status in ('pending','verified','failed','refunded')),
  order_status text not null default 'new' check (order_status in ('new','confirmed','processing','shipped','delivered','cancelled','refunded')),
  source text not null default 'hiora_product_landing',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.orders enable row level security;
revoke all on table public.orders from anon, authenticated;

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx on public.orders (order_status, created_at desc);

create or replace function public.set_updated_at() returns trigger language plpgsql security invoker set search_path = '' as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at before update on public.orders for each row execute function public.set_updated_at();

comment on table public.orders is 'Orders created only by the validated Hiora Cloudflare Worker. No anonymous table access.';
