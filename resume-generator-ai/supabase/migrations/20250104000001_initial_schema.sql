-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Profile Table
-- Extends Supabase auth.users with app-specific data
CREATE TABLE users_profile (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  generation_count INTEGER NOT NULL DEFAULT 0,
  subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro')),
  subscription_id TEXT, -- Stripe customer ID
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Base Information Table
-- Stores user's master resume data
CREATE TABLE base_information (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  personal_info JSONB NOT NULL DEFAULT '{}'::JSONB,
  -- Structure: { full_name, email, phone, location, linkedin_url, portfolio_url, professional_title }
  work_experience JSONB NOT NULL DEFAULT '[]'::JSONB,
  -- Array of: { company, job_title, start_date, end_date, is_current, location, responsibilities[] }
  education JSONB NOT NULL DEFAULT '[]'::JSONB,
  -- Array of: { institution, degree_type, field_of_study, graduation_date, gpa, coursework }
  skills JSONB NOT NULL DEFAULT '{}'::JSONB,
  -- Structure: { technical: [], soft: [], languages: [{name, proficiency}], certifications: [{name, org, date}] }
  additional_sections JSONB NOT NULL DEFAULT '{}'::JSONB,
  -- Structure: { projects: [], volunteer: [], awards: [], publications: [] }
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id)
);

-- Job Descriptions Table
-- Stores job postings that users want to tailor resumes for
CREATE TABLE job_descriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT,
  job_title TEXT NOT NULL,
  description_text TEXT NOT NULL,
  parsed_keywords JSONB DEFAULT '{}'::JSONB,
  -- Structure: { skills: [], keywords: [], job_level: '', industry: '' }
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Resumes Table
-- Stores generated resume versions
CREATE TABLE resumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_description_id UUID REFERENCES job_descriptions(id) ON DELETE SET NULL,
  title TEXT NOT NULL, -- User-friendly name for the resume
  template_id TEXT NOT NULL DEFAULT 'classic',
  content JSONB NOT NULL DEFAULT '{}'::JSONB,
  -- Structure: Complete resume content with all sections
  customization JSONB DEFAULT '{}'::JSONB,
  -- Structure: { accent_color, font, font_size }
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- AI Section Config Table
-- Controls AI behavior for different resume sections
CREATE TABLE ai_section_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_name TEXT NOT NULL UNIQUE,
  ai_enabled BOOLEAN NOT NULL DEFAULT true,
  ai_prompt_template TEXT NOT NULL,
  processing_priority INTEGER NOT NULL DEFAULT 0,
  user_editable BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Subscription History Table
-- Tracks Stripe subscription changes
CREATE TABLE subscription_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT NOT NULL,
  status TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Indexes for performance
CREATE INDEX idx_users_profile_user_id ON users_profile(id);
CREATE INDEX idx_base_information_user_id ON base_information(user_id);
CREATE INDEX idx_job_descriptions_user_id ON job_descriptions(user_id);
CREATE INDEX idx_job_descriptions_created_at ON job_descriptions(created_at DESC);
CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE INDEX idx_resumes_created_at ON resumes(created_at DESC);
CREATE INDEX idx_subscription_history_user_id ON subscription_history(user_id);

-- Row Level Security (RLS) Policies
ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE base_information ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_descriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_history ENABLE ROW LEVEL SECURITY;

-- Users can only see and modify their own data
CREATE POLICY "Users can view own profile" ON users_profile
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users_profile
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own base info" ON base_information
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own base info" ON base_information
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own base info" ON base_information
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own job descriptions" ON job_descriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own job descriptions" ON job_descriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own job descriptions" ON job_descriptions
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own resumes" ON resumes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resumes" ON resumes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes" ON resumes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes" ON resumes
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own subscription history" ON subscription_history
  FOR SELECT USING (auth.uid() = user_id);

-- AI section config is readable by all authenticated users
CREATE POLICY "Anyone can view AI config" ON ai_section_config
  FOR SELECT USING (auth.role() = 'authenticated');

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_profile_updated_at BEFORE UPDATE ON users_profile
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_base_information_updated_at BEFORE UPDATE ON base_information
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resumes_updated_at BEFORE UPDATE ON resumes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_section_config_updated_at BEFORE UPDATE ON ai_section_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users_profile (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
