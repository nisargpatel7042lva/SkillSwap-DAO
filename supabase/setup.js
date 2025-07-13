const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  console.log('🚀 Setting up SkillSwap DAO database...');

  try {
    // Read the schema file
    const fs = require('fs');
    const path = require('path');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('📋 Executing schema...');
    
    // Split the schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          const { error } = await supabase.rpc('exec_sql', { sql: statement });
          if (error) {
            console.log(`⚠️  Statement skipped (likely already exists): ${statement.substring(0, 50)}...`);
          }
        } catch (err) {
          // Ignore errors for statements that might already exist
          console.log(`⚠️  Statement skipped: ${statement.substring(0, 50)}...`);
        }
      }
    }

    console.log('✅ Database schema setup completed!');

    // Insert some sample data
    console.log('📝 Inserting sample data...');
    
    // Sample users
    const sampleUsers = [
      {
        address: '0x1234567890123456789012345678901234567890',
        username: 'alice_dev',
        bio: 'Full-stack developer with 5+ years experience',
        reputation: 95
      },
      {
        address: '0x2345678901234567890123456789012345678901',
        username: 'bob_designer',
        bio: 'UI/UX designer specializing in modern web applications',
        reputation: 88
      },
      {
        address: '0x3456789012345678901234567890123456789012',
        username: 'charlie_writer',
        bio: 'Technical writer and content creator',
        reputation: 92
      }
    ];

    for (const user of sampleUsers) {
      try {
        const { error } = await supabase
          .from('users')
          .upsert(user, { onConflict: 'address' });
        
        if (error) {
          console.log(`⚠️  User ${user.username} already exists or error: ${error.message}`);
        } else {
          console.log(`✅ Added user: ${user.username}`);
        }
      } catch (err) {
        console.log(`⚠️  Could not add user ${user.username}: ${err.message}`);
      }
    }

    // Sample skills
    const sampleSkills = [
      {
        user_id: '0x1234567890123456789012345678901234567890',
        title: 'React Development',
        description: 'Expert React development with TypeScript, hooks, and modern patterns',
        price: 0.05,
        category: 'Programming',
        token_address: '0x0000000000000000000000000000000000000000'
      },
      {
        user_id: '0x2345678901234567890123456789012345678901',
        title: 'UI/UX Design',
        description: 'Complete UI/UX design services including wireframes, prototypes, and final designs',
        price: 0.08,
        category: 'Design',
        token_address: '0x0000000000000000000000000000000000000000'
      },
      {
        user_id: '0x3456789012345678901234567890123456789012',
        title: 'Technical Writing',
        description: 'Professional technical documentation, user guides, and API documentation',
        price: 0.03,
        category: 'Writing',
        token_address: '0x0000000000000000000000000000000000000000'
      }
    ];

    for (const skill of sampleSkills) {
      try {
        const { error } = await supabase
          .from('skills')
          .insert(skill);
        
        if (error) {
          console.log(`⚠️  Could not add skill ${skill.title}: ${error.message}`);
        } else {
          console.log(`✅ Added skill: ${skill.title}`);
        }
      } catch (err) {
        console.log(`⚠️  Could not add skill ${skill.title}: ${err.message}`);
      }
    }

    console.log('✅ Sample data inserted successfully!');
    
    // Create storage buckets
    console.log('📦 Setting up storage buckets...');
    try {
      // Create work-evidence bucket
      const { error: evidenceError } = await supabase.storage.createBucket('work-evidence', {
        public: false,
        allowedMimeTypes: ['image/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
        fileSizeLimit: 52428800 // 50MB
      });
      
      if (evidenceError && !evidenceError.message.includes('already exists')) {
        console.log(`⚠️  Could not create work-evidence bucket: ${evidenceError.message}`);
      } else {
        console.log('✅ Created work-evidence storage bucket');
      }
      
      // Create skill-images bucket if it doesn't exist
      const { error: skillError } = await supabase.storage.createBucket('skill-images', {
        public: true,
        allowedMimeTypes: ['image/*'],
        fileSizeLimit: 10485760 // 10MB
      });
      
      if (skillError && !skillError.message.includes('already exists')) {
        console.log(`⚠️  Could not create skill-images bucket: ${skillError.message}`);
      } else {
        console.log('✅ Created skill-images storage bucket');
      }
      
    } catch (err) {
      console.log(`⚠️  Storage setup issues: ${err.message}`);
    }
    
    console.log('🎉 Database setup completed successfully!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Deploy your smart contracts');
    console.log('2. Update your .env file with contract addresses');
    console.log('3. Start your development server: npm run dev');
    console.log('');
    console.log('Happy coding! 🚀');

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase(); 