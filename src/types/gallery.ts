/**
 * Company Gallery Types
 * For managing company images and videos
 */

export type MediaType = 'image' | 'video';

export type GalleryCategory = 
  | 'branches'
  | 'travels'
  | 'celebrations'
  | 'office_meetings'
  | 'interviews'
  | 'training'
  | 'events'
  | 'projects'
  | 'team'
  | 'awards'
  | 'installations'
  | 'other';

export interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  media_type: MediaType;
  file_url: string;
  thumbnail_url?: string;
  category: GalleryCategory;
  tags?: string[];
  
  // File details
  file_name: string;
  file_size: number;
  mime_type: string;
  duration?: number; // for videos in seconds
  dimensions?: {
    width: number;
    height: number;
  };
  
  // Location and context
  location?: string;
  branch_id?: string;
  event_date?: string;
  
  // Access control
  is_public: boolean;
  visibility_roles?: string[]; // which roles can view this
  
  // Metadata
  uploaded_by: string;
  uploaded_by_name: string;
  created_at: string;
  updated_at: string;
  likes_count?: number;
  views_count?: number;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  description?: string;
  cover_image_url?: string;
  category: GalleryCategory;
  
  // Album settings
  is_public: boolean;
  visibility_roles?: string[];
  
  // Metadata
  created_by: string;
  created_by_name: string;
  created_at: string;
  updated_at: string;
  
  // Counts
  items_count: number;
  images_count: number;
  videos_count: number;
}

export interface GalleryComment {
  id: string;
  gallery_item_id: string;
  user_id: string;
  user_name: string;
  comment: string;
  created_at: string;
}

export interface GalleryLike {
  id: string;
  gallery_item_id: string;
  user_id: string;
  created_at: string;
}

// Category configurations
export const GALLERY_CATEGORIES = {
  branches: {
    label: 'Branches',
    icon: 'bank',
    color: '#1890ff',
    description: 'Branch offices, openings, and facilities'
  },
  travels: {
    label: 'Business Travels',
    icon: 'car',
    color: '#52c41a',
    description: 'Business trips, site visits, and travel moments'
  },
  celebrations: {
    label: 'Celebrations',
    icon: 'gift',
    color: '#fa541c',
    description: 'Festivals, birthdays, achievements, and celebrations'
  },
  office_meetings: {
    label: 'Office Meetings',
    icon: 'team',
    color: '#722ed1',
    description: 'Team meetings, conferences, and discussions'
  },
  interviews: {
    label: 'Interviews',
    icon: 'user',
    color: '#13c2c2',
    description: 'Job interviews and recruitment activities'
  },
  training: {
    label: 'Training Sessions',
    icon: 'book',
    color: '#eb2f96',
    description: 'Training programs, workshops, and skill development'
  },
  events: {
    label: 'Company Events',
    icon: 'calendar',
    color: '#f5222d',
    description: 'Company events, seminars, and special occasions'
  },
  projects: {
    label: 'Project Work',
    icon: 'project',
    color: '#faad14',
    description: 'Project activities and milestones'
  },
  team: {
    label: 'Team Activities',
    icon: 'heart',
    color: '#a0d911',
    description: 'Team building, outings, and group activities'
  },
  awards: {
    label: 'Awards & Recognition',
    icon: 'trophy',
    color: '#fadb14',
    description: 'Awards, recognitions, and achievements'
  },
  installations: {
    label: 'Solar Installations',
    icon: 'thunderbolt',
    color: '#ff7a45',
    description: 'Solar panel installations and project completions'
  },
  other: {
    label: 'Others',
    icon: 'folder',
    color: '#8c8c8c',
    description: 'Miscellaneous company photos and videos'
  }
} as const;

// Supported file types
export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp'
];

export const SUPPORTED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/mov',
  'video/avi'
];

export const MAX_FILE_SIZE = {
  image: 10 * 1024 * 1024, // 10MB for images
  video: 100 * 1024 * 1024  // 100MB for videos
};

// Filter options
export interface GalleryFilters {
  category?: GalleryCategory;
  media_type?: MediaType;
  branch_id?: string;
  uploaded_by?: string;
  date_from?: string;
  date_to?: string;
  is_public?: boolean;
  search?: string;
  tags?: string[];
}

// View modes
export type GalleryViewMode = 'grid' | 'masonry' | 'list' | 'timeline';

// Sort options
export type GallerySortBy = 'created_at' | 'title' | 'likes_count' | 'views_count';
export type SortOrder = 'asc' | 'desc';