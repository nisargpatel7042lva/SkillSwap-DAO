const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  console.log('🚀 Setting up SkillSwap DAO database...');

  try {
    // 1. Create storage bucket for skill images
    console.log('📦 Creating storage bucket for skill images...');
    const { data: bucketData, error: bucketError } = await supabase.storage.createBucket('skill-images', {
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
      fileSizeLimit: 5242880, // 5MB
    });

    if (bucketError && !bucketError.message.includes('already exists')) {
      throw bucketError;
    }
    console.log('✅ Storage bucket created/verified');

    // 2. Create storage bucket for user avatars
    console.log('👤 Creating storage bucket for user avatars...');
    const { error: avatarBucketError } = await supabase.storage.createBucket('user-avatars', {
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
      fileSizeLimit: 2097152, // 2MB
    });

    if (avatarBucketError && !avatarBucketError.message.includes('already exists')) {
      throw avatarBucketError;
    }
    console.log('✅ Avatar storage bucket created/verified');

    // 3. Apply database schema
    console.log('🗄️ Applying database schema...');
    const schemaPath = path.join(__dirname, '../supabase/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    for (const statement of statements) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        if (error && !error.message.includes('already exists')) {
          console.warn(`⚠️ Statement warning: ${error.message}`);
        }
      } catch (err) {
        // Ignore errors for statements that already exist
        if (!err.message.includes('already exists')) {
          console.warn(`⚠️ Statement warning: ${err.message}`);
        }
      }
    }
    console.log('✅ Database schema applied');

    // 4. Set up Row Level Security (RLS) policies
    console.log('🔒 Setting up Row Level Security policies...');
    await setupRLSPolicies();
    console.log('✅ RLS policies configured');

    // 5. Create sample data (optional)
    if (process.env.CREATE_SAMPLE_DATA === 'true') {
      console.log('📝 Creating sample data...');
      await createSampleData();
      console.log('✅ Sample data created');
    }

    console.log('\n🎉 Database setup completed successfully!');
    console.log('='.repeat(50));
    console.log('📋 Setup Summary:');
    console.log('✅ Storage buckets created');
    console.log('✅ Database schema applied');
    console.log('✅ RLS policies configured');
    console.log('='.repeat(50));

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

async function setupRLSPolicies() {
  // Users table policies
  await supabase.rpc('exec_sql', {
    sql: `
      ALTER TABLE users ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY "Users can view their own profile" ON users
        FOR SELECT USING (auth.uid()::text = address);
      
      CREATE POLICY "Users can update their own profile" ON users
        FOR UPDATE USING (auth.uid()::text = address);
      
      CREATE POLICY "Users can insert their own profile" ON users
        FOR INSERT WITH CHECK (auth.uid()::text = address);
    `
  });

  // Skills table policies
  await supabase.rpc('exec_sql', {
    sql: `
      ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY "Anyone can view active skills" ON skills
        FOR SELECT USING (true);
      
      CREATE POLICY "Users can manage their own skills" ON skills
        FOR ALL USING (user_id = (SELECT id FROM users WHERE address = auth.uid()::text));
    `
  });

  // Bookings table policies
  await supabase.rpc('exec_sql', {
    sql: `
      ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY "Users can view their own bookings" ON bookings
        FOR SELECT USING (
          requester_id = (SELECT id FROM users WHERE address = auth.uid()::text) OR
          skill_id IN (SELECT id FROM skills WHERE user_id = (SELECT id FROM users WHERE address = auth.uid()::text))
        );
      
      CREATE POLICY "Users can create their own bookings" ON bookings
        FOR INSERT WITH CHECK (requester_id = (SELECT id FROM users WHERE address = auth.uid()::text));
      
      CREATE POLICY "Users can update their own bookings" ON bookings
        FOR UPDATE USING (
          requester_id = (SELECT id FROM users WHERE address = auth.uid()::text) OR
          skill_id IN (SELECT id FROM skills WHERE user_id = (SELECT id FROM users WHERE address = auth.uid()::text))
        );
    `
  });

  // Ratings table policies
  await supabase.rpc('exec_sql', {
    sql: `
      ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY "Anyone can view ratings" ON ratings
        FOR SELECT USING (true);
      
      CREATE POLICY "Users can create ratings for their bookings" ON ratings
        FOR INSERT WITH CHECK (
          rater_id = (SELECT id FROM users WHERE address = auth.uid()::text) AND
          service_id IN (SELECT id FROM bookings WHERE requester_id = (SELECT id FROM users WHERE address = auth.uid()::text))
        );
    `
  });
}

async function createSampleData() {
  // Create sample users
  const sampleUsers = [
    {
      address: '0x1234567890123456789012345678901234567890',
      username: 'Alice Developer',
      bio: 'Full-stack developer with 5+ years of experience',
      reputation: 4.8
    },
    {
      address: '0x2345678901234567890123456789012345678901',
      username: 'Bob Designer',
      bio: 'UI/UX designer specializing in modern web applications',
      reputation: 4.9
    },
    {
      address: '0x3456789012345678901234567890123456789012',
      username: 'Carol Writer',
      bio: 'Technical writer and content creator',
      reputation: 4.7
    }
  ];

  for (const user of sampleUsers) {
    await supabase.from('users').upsert(user, { onConflict: 'address' });
  }

  // Create sample skills
  const sampleSkills = [
    {
      user_id: '0x1234567890123456789012345678901234567890',
      title: 'React Development',
      description: 'Expert React development with TypeScript, hooks, and modern patterns',
      price: 50,
      category: 'Programming'
    },
    {
      user_id: '0x2345678901234567890123456789012345678901',
      title: 'UI/UX Design',
      description: 'Complete UI/UX design services including wireframes, prototypes, and final designs',
      price: 75,
      category: 'Design'
    },
    {
      user_id: '0x3456789012345678901234567890123456789012',
      title: 'Technical Writing',
      description: 'Professional technical documentation, user guides, and API documentation',
      price: 40,
      category: 'Writing'
    }
  ];

  for (const skill of sampleSkills) {
    await supabase.from('skills').insert(skill);
  }
}

// Run the setup
setupDatabase(); 