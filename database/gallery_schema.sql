-- Company Gallery Database Schema
-- Tables for managing company photos and videos

-- Gallery Items Table
CREATE TABLE gallery_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('image', 'video')),
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  category VARCHAR(50) NOT NULL CHECK (category IN (
    'branches', 'travels', 'celebrations', 'office_meetings', 
    'interviews', 'training', 'events', 'projects', 'team', 
    'awards', 'installations', 'other'
  )),
  tags TEXT[],
  
  -- File details
  file_name VARCHAR(255) NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  duration INTEGER, -- for videos in seconds
  width INTEGER,
  height INTEGER,
  
  -- Location and context
  location VARCHAR(255),
  branch_id UUID REFERENCES branches(id),
  event_date DATE,
  
  -- Access control
  is_public BOOLEAN DEFAULT false,
  visibility_roles TEXT[],
  
  -- Metadata
  uploaded_by UUID NOT NULL REFERENCES users(id),
  uploaded_by_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Stats
  likes_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0
);

-- Gallery Albums Table (for organizing items into collections)
CREATE TABLE gallery_albums (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  category VARCHAR(50) NOT NULL CHECK (category IN (
    'branches', 'travels', 'celebrations', 'office_meetings', 
    'interviews', 'training', 'events', 'projects', 'team', 
    'awards', 'installations', 'other'
  )),
  
  -- Album settings
  is_public BOOLEAN DEFAULT false,
  visibility_roles TEXT[],
  
  -- Metadata
  created_by UUID NOT NULL REFERENCES users(id),
  created_by_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Counts (updated via triggers)
  items_count INTEGER DEFAULT 0,
  images_count INTEGER DEFAULT 0,
  videos_count INTEGER DEFAULT 0
);

-- Album Items Junction Table
CREATE TABLE album_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  album_id UUID NOT NULL REFERENCES gallery_albums(id) ON DELETE CASCADE,
  gallery_item_id UUID NOT NULL REFERENCES gallery_items(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(album_id, gallery_item_id)
);

-- Gallery Comments Table
CREATE TABLE gallery_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gallery_item_id UUID NOT NULL REFERENCES gallery_items(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  user_name VARCHAR(255) NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Gallery Likes Table
CREATE TABLE gallery_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gallery_item_id UUID NOT NULL REFERENCES gallery_items(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(gallery_item_id, user_id)
);

-- Gallery Views Table (for tracking view counts)
CREATE TABLE gallery_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gallery_item_id UUID NOT NULL REFERENCES gallery_items(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  ip_address INET,
  user_agent TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_gallery_items_category ON gallery_items(category);
CREATE INDEX idx_gallery_items_media_type ON gallery_items(media_type);
CREATE INDEX idx_gallery_items_uploaded_by ON gallery_items(uploaded_by);
CREATE INDEX idx_gallery_items_branch_id ON gallery_items(branch_id);
CREATE INDEX idx_gallery_items_created_at ON gallery_items(created_at);
CREATE INDEX idx_gallery_items_is_public ON gallery_items(is_public);
CREATE INDEX idx_gallery_items_event_date ON gallery_items(event_date);

CREATE INDEX idx_gallery_comments_item_id ON gallery_comments(gallery_item_id);
CREATE INDEX idx_gallery_comments_user_id ON gallery_comments(user_id);

CREATE INDEX idx_gallery_likes_item_id ON gallery_likes(gallery_item_id);
CREATE INDEX idx_gallery_likes_user_id ON gallery_likes(user_id);

CREATE INDEX idx_gallery_views_item_id ON gallery_views(gallery_item_id);
CREATE INDEX idx_gallery_views_viewed_at ON gallery_views(viewed_at);

CREATE INDEX idx_album_items_album_id ON album_items(album_id);
CREATE INDEX idx_album_items_gallery_item_id ON album_items(gallery_item_id);

-- Full-text search index for titles and descriptions
CREATE INDEX idx_gallery_items_search ON gallery_items USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- Triggers for updating stats

-- Function to update gallery item stats
CREATE OR REPLACE FUNCTION update_gallery_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update likes count
  IF TG_TABLE_NAME = 'gallery_likes' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE gallery_items 
      SET likes_count = likes_count + 1 
      WHERE id = NEW.gallery_item_id;
      RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE gallery_items 
      SET likes_count = GREATEST(0, likes_count - 1) 
      WHERE id = OLD.gallery_item_id;
      RETURN OLD;
    END IF;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to update album stats
CREATE OR REPLACE FUNCTION update_album_stats()
RETURNS TRIGGER AS $$
DECLARE
  album_id_val UUID;
BEGIN
  IF TG_OP = 'INSERT' THEN
    album_id_val := NEW.album_id;
  ELSE
    album_id_val := OLD.album_id;
  END IF;

  UPDATE gallery_albums 
  SET 
    items_count = (
      SELECT COUNT(*) 
      FROM album_items 
      WHERE album_id = album_id_val
    ),
    images_count = (
      SELECT COUNT(*) 
      FROM album_items ai 
      JOIN gallery_items gi ON ai.gallery_item_id = gi.id 
      WHERE ai.album_id = album_id_val AND gi.media_type = 'image'
    ),
    videos_count = (
      SELECT COUNT(*) 
      FROM album_items ai 
      JOIN gallery_items gi ON ai.gallery_item_id = gi.id 
      WHERE ai.album_id = album_id_val AND gi.media_type = 'video'
    )
  WHERE id = album_id_val;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER gallery_items_updated_at
  BEFORE UPDATE ON gallery_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER gallery_albums_updated_at
  BEFORE UPDATE ON gallery_albums
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER gallery_likes_stats
  AFTER INSERT OR DELETE ON gallery_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_gallery_stats();

CREATE TRIGGER album_items_stats
  AFTER INSERT OR DELETE ON album_items
  FOR EACH ROW
  EXECUTE FUNCTION update_album_stats();

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE album_items ENABLE ROW LEVEL SECURITY;

-- Gallery Items Policies
CREATE POLICY gallery_items_select ON gallery_items
  FOR SELECT USING (
    is_public = true 
    OR uploaded_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'DIRECTOR', 'HR_HEAD', 'OPS_HEAD')
    )
  );

CREATE POLICY gallery_items_insert ON gallery_items
  FOR INSERT WITH CHECK (
    uploaded_by = auth.uid()
  );

CREATE POLICY gallery_items_update ON gallery_items
  FOR UPDATE USING (
    uploaded_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'DIRECTOR', 'HR_HEAD', 'OPS_HEAD')
    )
  );

CREATE POLICY gallery_items_delete ON gallery_items
  FOR DELETE USING (
    uploaded_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'DIRECTOR', 'HR_HEAD', 'OPS_HEAD')
    )
  );

-- Gallery Albums Policies  
CREATE POLICY gallery_albums_select ON gallery_albums
  FOR SELECT USING (
    is_public = true 
    OR created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'DIRECTOR', 'HR_HEAD', 'OPS_HEAD')
    )
  );

CREATE POLICY gallery_albums_insert ON gallery_albums
  FOR INSERT WITH CHECK (
    created_by = auth.uid()
  );

CREATE POLICY gallery_albums_update ON gallery_albums
  FOR UPDATE USING (
    created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'DIRECTOR', 'HR_HEAD', 'OPS_HEAD')
    )
  );

CREATE POLICY gallery_albums_delete ON gallery_albums
  FOR DELETE USING (
    created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'DIRECTOR', 'HR_HEAD', 'OPS_HEAD')
    )
  );

-- Comments and Likes Policies (allow authenticated users)
CREATE POLICY gallery_comments_select ON gallery_comments
  FOR SELECT TO authenticated USING (true);

CREATE POLICY gallery_comments_insert ON gallery_comments
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY gallery_comments_delete ON gallery_comments
  FOR DELETE USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'DIRECTOR', 'HR_HEAD', 'OPS_HEAD')
    )
  );

CREATE POLICY gallery_likes_all ON gallery_likes
  FOR ALL TO authenticated USING (true);

CREATE POLICY gallery_views_all ON gallery_views
  FOR ALL TO authenticated USING (true);

CREATE POLICY album_items_select ON album_items
  FOR SELECT TO authenticated USING (true);

CREATE POLICY album_items_insert ON album_items
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM gallery_albums 
      WHERE id = album_id 
      AND (
        created_by = auth.uid()
        OR EXISTS (
          SELECT 1 FROM users 
          WHERE id = auth.uid() 
          AND role IN ('admin', 'DIRECTOR', 'HR_HEAD', 'OPS_HEAD')
        )
      )
    )
  );

CREATE POLICY album_items_delete ON album_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM gallery_albums 
      WHERE id = album_id 
      AND (
        created_by = auth.uid()
        OR EXISTS (
          SELECT 1 FROM users 
          WHERE id = auth.uid() 
          AND role IN ('admin', 'DIRECTOR', 'HR_HEAD', 'OPS_HEAD')
        )
      )
    )
  );

-- Create storage bucket for gallery files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Gallery files are publicly viewable" ON storage.objects
  FOR SELECT USING (bucket_id = 'gallery');

CREATE POLICY "Authenticated users can upload gallery files" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'gallery');

CREATE POLICY "Users can update their own gallery files" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'gallery' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own gallery files" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'gallery' AND auth.uid()::text = (storage.foldername(name))[1]);