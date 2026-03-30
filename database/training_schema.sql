-- Training & Tutorial System Database Schema
-- Comprehensive schema for solar and finance training content management

-- Training Categories
CREATE TABLE IF NOT EXISTS training_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    product_type VARCHAR(20) NOT NULL CHECK (product_type IN ('solar', 'finance')),
    icon_name VARCHAR(50),
    color_code VARCHAR(7), -- For UI theme colors
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Training Content
CREATE TABLE IF NOT EXISTS training_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    content_type VARCHAR(20) NOT NULL CHECK (content_type IN ('tutorial', 'training', 'guide', 'presentation')),
    product_type VARCHAR(20) NOT NULL CHECK (product_type IN ('solar', 'finance')),
    category_id UUID REFERENCES training_categories(id) ON DELETE SET NULL,
    
    -- Content Details
    difficulty_level VARCHAR(20) DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    duration_minutes INTEGER, -- Estimated completion time
    objectives TEXT[], -- Learning objectives array
    prerequisites TEXT[], -- What users should know before this content
    
    -- Media Information
    has_images BOOLEAN DEFAULT false,
    has_videos BOOLEAN DEFAULT false,
    total_media_count INTEGER DEFAULT 0,
    
    -- Status and Visibility
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    is_featured BOOLEAN DEFAULT false,
    target_roles TEXT[], -- Array of roles this content is for
    
    -- SEO and Organization
    slug VARCHAR(250) UNIQUE NOT NULL,
    tags TEXT[], -- Searchable tags
    meta_description TEXT,
    
    -- Engagement Metrics
    view_count INTEGER DEFAULT 0,
    completion_count INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    rating_count INTEGER DEFAULT 0,
    
    -- Timestamps
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Training Media
CREATE TABLE IF NOT EXISTS training_media (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    training_content_id UUID REFERENCES training_content(id) ON DELETE CASCADE,
    
    -- Media Information
    media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('image', 'video', 'pdf', 'document')),
    file_name VARCHAR(255) NOT NULL,
    file_size_bytes BIGINT,
    mime_type VARCHAR(100),
    
    -- Storage Information (R2)
    r2_key VARCHAR(500) NOT NULL UNIQUE,
    r2_url VARCHAR(1000),
    r2_bucket VARCHAR(100) DEFAULT 'mudrabase-media',
    
    -- Media Metadata
    title VARCHAR(200),
    description TEXT,
    alt_text VARCHAR(300), -- For images
    duration_seconds INTEGER, -- For videos
    resolution VARCHAR(20), -- e.g., "1920x1080"
    thumbnail_r2_key VARCHAR(500), -- For video thumbnails
    
    -- Display Options
    display_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT false, -- Primary media for the content
    is_thumbnail BOOLEAN DEFAULT false, -- Use as content thumbnail
    
    -- Timestamps
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- User Training Progress
CREATE TABLE IF NOT EXISTS user_training_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    training_content_id UUID REFERENCES training_content(id) ON DELETE CASCADE,
    
    -- Progress Information
    status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'bookmarked')),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    time_spent_minutes INTEGER DEFAULT 0,
    
    -- Engagement
    is_bookmarked BOOLEAN DEFAULT false,
    user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
    user_feedback TEXT,
    
    -- Completion Details
    started_at TIMESTAMP WITH TIME ZONE,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Unique constraint for user-content combination
    UNIQUE(user_id, training_content_id)
);

-- Training Content Sections (for structured content)
CREATE TABLE IF NOT EXISTS training_content_sections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    training_content_id UUID REFERENCES training_content(id) ON DELETE CASCADE,
    
    title VARCHAR(200) NOT NULL,
    content TEXT, -- Section content (markdown supported)
    section_type VARCHAR(20) DEFAULT 'text' CHECK (section_type IN ('text', 'video', 'image', 'quiz', 'checklist')),
    
    -- Organization
    sort_order INTEGER DEFAULT 0,
    is_required BOOLEAN DEFAULT true,
    
    -- Metadata
    estimated_time_minutes INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Training Assessments/Quizzes
CREATE TABLE IF NOT EXISTS training_assessments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    training_content_id UUID REFERENCES training_content(id) ON DELETE CASCADE,
    
    title VARCHAR(200) NOT NULL,
    description TEXT,
    assessment_type VARCHAR(20) DEFAULT 'quiz' CHECK (assessment_type IN ('quiz', 'assignment', 'practical')),
    
    -- Configuration
    passing_score INTEGER DEFAULT 70, -- Percentage required to pass
    time_limit_minutes INTEGER,
    max_attempts INTEGER DEFAULT 3,
    is_required BOOLEAN DEFAULT false,
    
    -- Questions (JSON format)
    questions JSONB, -- Array of question objects
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- User Assessment Results
CREATE TABLE IF NOT EXISTS user_assessment_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    assessment_id UUID REFERENCES training_assessments(id) ON DELETE CASCADE,
    
    -- Results
    score_percentage INTEGER CHECK (score_percentage >= 0 AND score_percentage <= 100),
    passed BOOLEAN DEFAULT false,
    time_taken_minutes INTEGER,
    attempt_number INTEGER DEFAULT 1,
    
    -- Detailed Results
    answers JSONB, -- Array of user answers
    feedback TEXT, -- Instructor feedback
    
    -- Timestamps
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Track attempts per user per assessment
    UNIQUE(user_id, assessment_id, attempt_number)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_training_categories_product_type ON training_categories(product_type);
CREATE INDEX IF NOT EXISTS idx_training_categories_active ON training_categories(is_active);

CREATE INDEX IF NOT EXISTS idx_training_content_product_type ON training_content(product_type);
CREATE INDEX IF NOT EXISTS idx_training_content_category ON training_content(category_id);
CREATE INDEX IF NOT EXISTS idx_training_content_status ON training_content(status);
CREATE INDEX IF NOT EXISTS idx_training_content_featured ON training_content(is_featured);
CREATE INDEX IF NOT EXISTS idx_training_content_slug ON training_content(slug);
CREATE INDEX IF NOT EXISTS idx_training_content_published ON training_content(published_at);

CREATE INDEX IF NOT EXISTS idx_training_media_content ON training_media(training_content_id);
CREATE INDEX IF NOT EXISTS idx_training_media_type ON training_media(media_type);
CREATE INDEX IF NOT EXISTS idx_training_media_primary ON training_media(is_primary);

CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_training_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_content ON user_training_progress(training_content_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_status ON user_training_progress(status);
CREATE INDEX IF NOT EXISTS idx_user_progress_bookmarked ON user_training_progress(is_bookmarked);

CREATE INDEX IF NOT EXISTS idx_content_sections_content ON training_content_sections(training_content_id);
CREATE INDEX IF NOT EXISTS idx_content_sections_order ON training_content_sections(sort_order);

CREATE INDEX IF NOT EXISTS idx_assessments_content ON training_assessments(training_content_id);
CREATE INDEX IF NOT EXISTS idx_assessment_results_user ON user_assessment_results(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_results_assessment ON user_assessment_results(assessment_id);

-- Update triggers for updated_at fields
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_training_categories_updated_at BEFORE UPDATE ON training_categories FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_training_content_updated_at BEFORE UPDATE ON training_content FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_training_content_sections_updated_at BEFORE UPDATE ON training_content_sections FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_training_assessments_updated_at BEFORE UPDATE ON training_assessments FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE training_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_training_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_content_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_assessment_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Categories
CREATE POLICY "Categories are viewable by all authenticated users" ON training_categories FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Categories are manageable by authorized users" ON training_categories FOR ALL USING (
    auth.role() = 'authenticated' AND 
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND auth.users.raw_user_meta_data->>'role' IN ('director', 'ops_head', 'sales_head', 'hr_head')
    )
);

-- RLS Policies for Content
CREATE POLICY "Training content is viewable by all authenticated users" ON training_content FOR SELECT USING (
    auth.role() = 'authenticated' AND status = 'published'
);
CREATE POLICY "Training content is manageable by authorized users" ON training_content FOR ALL USING (
    auth.role() = 'authenticated' AND 
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND auth.users.raw_user_meta_data->>'role' IN ('director', 'ops_head', 'sales_head', 'hr_head')
    )
);

-- RLS Policies for Media
CREATE POLICY "Training media is viewable by all authenticated users" ON training_media FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Training media is manageable by authorized users" ON training_media FOR ALL USING (
    auth.role() = 'authenticated' AND 
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND auth.users.raw_user_meta_data->>'role' IN ('director', 'ops_head', 'sales_head', 'hr_head')
    )
);

-- RLS Policies for User Progress (users can only see their own progress)
CREATE POLICY "Users can view their own training progress" ON user_training_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own training progress" ON user_training_progress FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for Sections
CREATE POLICY "Content sections are viewable by all authenticated users" ON training_content_sections FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Content sections are manageable by authorized users" ON training_content_sections FOR ALL USING (
    auth.role() = 'authenticated' AND 
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND auth.users.raw_user_meta_data->>'role' IN ('director', 'ops_head', 'sales_head', 'hr_head')
    )
);

-- RLS Policies for Assessments
CREATE POLICY "Training assessments are viewable by all authenticated users" ON training_assessments FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Training assessments are manageable by authorized users" ON training_assessments FOR ALL USING (
    auth.role() = 'authenticated' AND 
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND auth.users.raw_user_meta_data->>'role' IN ('director', 'ops_head', 'sales_head', 'hr_head')
    )
);

-- RLS Policies for Assessment Results
CREATE POLICY "Users can view their own assessment results" ON user_assessment_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own assessment results" ON user_assessment_results FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own assessment results" ON user_assessment_results FOR UPDATE USING (auth.uid() = user_id);