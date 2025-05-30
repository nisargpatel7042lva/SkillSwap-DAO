-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  address text UNIQUE NOT NULL,
  username text,
  avatar_url text,
  reputation integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc', now())
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
  id serial PRIMARY KEY,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  price numeric NOT NULL,
  category text,
  illustration_url text,
  created_at timestamp with time zone DEFAULT timezone('utc', now())
);

-- Bookings/Requests table
CREATE TABLE IF NOT EXISTS bookings (
  id serial PRIMARY KEY,
  skill_id integer REFERENCES skills(id) ON DELETE CASCADE,
  requester_id uuid REFERENCES users(id) ON DELETE CASCADE,
  requirements text,
  status text DEFAULT 'pending', -- pending, accepted, completed, cancelled
  payment_status text DEFAULT 'unpaid', -- unpaid, paid, released
  created_at timestamp with time zone DEFAULT timezone('utc', now())
);

-- Ratings table
CREATE TABLE IF NOT EXISTS ratings (
  id serial PRIMARY KEY,
  service_id integer REFERENCES bookings(id) ON DELETE CASCADE,
  rater_id uuid REFERENCES users(id) ON DELETE CASCADE,
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