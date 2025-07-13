-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  address text UNIQUE NOT NULL,
  username text,
  avatar_url text,
  bio text,
  reputation integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc', now()),
  updated_at timestamp with time zone DEFAULT timezone('utc', now())
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
  id serial PRIMARY KEY,
  user_id text REFERENCES users(address) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  price numeric NOT NULL,
  category text,
  illustration_url text,
  token_address text DEFAULT '0x0000000000000000000000000000000000000000', -- ETH by default
  created_at timestamp with time zone DEFAULT timezone('utc', now())
);

-- Bookings/Requests table
CREATE TABLE IF NOT EXISTS bookings (
  id serial PRIMARY KEY,
  skill_id integer REFERENCES skills(id) ON DELETE CASCADE,
  requester_id text REFERENCES users(address) ON DELETE CASCADE,
  requirements text,
  status text DEFAULT 'pending', -- pending, accepted, in_progress, completed, cancelled
  payment_status text DEFAULT 'unpaid', -- unpaid, escrowed, paid, refunded
  tx_hash text, -- blockchain transaction hash
  token_address text DEFAULT '0x0000000000000000000000000000000000000000', -- payment token address
  amount numeric, -- payment amount in wei/smallest unit
  created_at timestamp with time zone DEFAULT timezone('utc', now()),
  updated_at timestamp with time zone DEFAULT timezone('utc', now())
);

-- Ratings table
CREATE TABLE IF NOT EXISTS ratings (
  id serial PRIMARY KEY,
  service_id integer REFERENCES bookings(id) ON DELETE CASCADE,
  rater_id text REFERENCES users(address) ON DELETE CASCADE,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamp with time zone DEFAULT timezone('utc', now())
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id serial PRIMARY KEY,
  title text NOT NULL,
  description text,
  status text
);

-- Payment transactions table for detailed payment tracking
CREATE TABLE IF NOT EXISTS payment_transactions (
  id serial PRIMARY KEY,
  booking_id integer REFERENCES bookings(id) ON DELETE CASCADE,
  tx_hash text UNIQUE NOT NULL,
  from_address text NOT NULL,
  to_address text NOT NULL,
  amount numeric NOT NULL,
  token_address text NOT NULL,
  gas_used numeric,
  gas_price numeric,
  status text DEFAULT 'pending', -- pending, confirmed, failed
  block_number integer,
  created_at timestamp with time zone DEFAULT timezone('utc', now())
);

-- Escrow events table for tracking escrow state changes
CREATE TABLE IF NOT EXISTS escrow_events (
  id serial PRIMARY KEY,
  booking_id integer REFERENCES bookings(id) ON DELETE CASCADE,
  event_type text NOT NULL, -- created, released, refunded
  amount numeric NOT NULL,
  token_address text NOT NULL,
  tx_hash text,
  triggered_by text NOT NULL, -- requester, provider, system
  created_at timestamp with time zone DEFAULT timezone('utc', now())
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_bookings_requester_id ON bookings(requester_id);
CREATE INDEX IF NOT EXISTS idx_bookings_skill_id ON bookings(skill_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_tx_hash ON bookings(tx_hash);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_tx_hash ON payment_transactions(tx_hash);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_booking_id ON payment_transactions(booking_id);
CREATE INDEX IF NOT EXISTS idx_escrow_events_booking_id ON escrow_events(booking_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc', now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_bookings_updated_at 
    BEFORE UPDATE ON bookings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 