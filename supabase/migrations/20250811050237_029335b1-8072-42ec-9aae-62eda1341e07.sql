-- Create payment_transactions table
CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id integer NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  tx_hash text NOT NULL UNIQUE,
  from_address text NOT NULL,
  to_address text NOT NULL,
  amount text NOT NULL,
  token_address text NOT NULL,
  gas_used text,
  gas_price text,
  status text NOT NULL CHECK (status IN ('pending','confirmed','failed')),
  block_number integer,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS with temporary permissive policies (replace when auth added)
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'payment_transactions' AND policyname = 'Public read payment_transactions'
  ) THEN
    CREATE POLICY "Public read payment_transactions" ON public.payment_transactions FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'payment_transactions' AND policyname = 'Public insert payment_transactions'
  ) THEN
    CREATE POLICY "Public insert payment_transactions" ON public.payment_transactions FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'payment_transactions' AND policyname = 'Public update payment_transactions'
  ) THEN
    CREATE POLICY "Public update payment_transactions" ON public.payment_transactions FOR UPDATE USING (true);
  END IF;
END $$;

-- Create escrow_events table
CREATE TABLE IF NOT EXISTS public.escrow_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id integer NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  event_type text NOT NULL CHECK (event_type IN ('created','released','refunded')),
  amount text NOT NULL,
  token_address text NOT NULL,
  tx_hash text,
  triggered_by text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.escrow_events ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'escrow_events' AND policyname = 'Public read escrow_events'
  ) THEN
    CREATE POLICY "Public read escrow_events" ON public.escrow_events FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'escrow_events' AND policyname = 'Public insert escrow_events'
  ) THEN
    CREATE POLICY "Public insert escrow_events" ON public.escrow_events FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- Create work_evidence table
CREATE TABLE IF NOT EXISTS public.work_evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id integer NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  request_id integer,
  submitter text NOT NULL,
  evidence_url text NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.work_evidence ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'work_evidence' AND policyname = 'Public read work_evidence'
  ) THEN
    CREATE POLICY "Public read work_evidence" ON public.work_evidence FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'work_evidence' AND policyname = 'Public insert work_evidence'
  ) THEN
    CREATE POLICY "Public insert work_evidence" ON public.work_evidence FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- Alter bookings to add fields used by app
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS tx_hash text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS token_address text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS amount text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS auto_release_at timestamptz;

-- Enable realtime
ALTER TABLE public.payment_transactions REPLICA IDENTITY FULL;
ALTER TABLE public.escrow_events REPLICA IDENTITY FULL;
ALTER TABLE public.work_evidence REPLICA IDENTITY FULL;
ALTER TABLE public.bookings REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.payment_transactions;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.escrow_events;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.work_evidence;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;

-- Create storage bucket for evidence uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('work-evidence', 'work-evidence', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for evidence bucket
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public can read work evidence'
  ) THEN
    CREATE POLICY "Public can read work evidence"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'work-evidence');
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public can upload work evidence'
  ) THEN
    CREATE POLICY "Public can upload work evidence"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'work-evidence');
  END IF;
END $$;