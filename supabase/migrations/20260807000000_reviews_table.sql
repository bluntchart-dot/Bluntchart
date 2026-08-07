-- Reviews table for collecting product reviews
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  product_type text not null default 'future-love-letter',
  rating smallint not null check (rating between 1 and 5),
  zodiac_sign text,
  emotional_reaction text,
  best_line text,
  name text,
  testimonial text,
  created_at timestamptz not null default now()
);

-- Index for fetching reviews by product
create index if not exists idx_reviews_product_type on reviews (product_type);

-- Index for sorting by newest
create index if not exists idx_reviews_created_at on reviews (created_at desc);

-- Enable RLS
alter table reviews enable row level security;

-- Allow anonymous inserts (public review submission)
create policy "Anyone can submit a review"
  on reviews for insert
  with check (true);

-- Allow anonymous reads (public review display)
create policy "Anyone can read reviews"
  on reviews for select
  using (true);
