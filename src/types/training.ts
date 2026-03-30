// Training & Tutorial System Types
// Comprehensive TypeScript definitions for training content management

export type ProductType = 'solar' | 'finance'
export type MediaType = 'image' | 'video' | 'pdf' | 'document'
export type ContentType = 'tutorial' | 'training' | 'guide' | 'presentation'
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'
export type ContentStatus = 'draft' | 'published' | 'archived'
export type ProgressStatus = 'not_started' | 'in_progress' | 'completed' | 'bookmarked'
export type SectionType = 'text' | 'video' | 'image' | 'quiz' | 'checklist'
export type AssessmentType = 'quiz' | 'assignment' | 'practical'

// Training Category Interface
export interface TrainingCategory {
  id: string
  name: string
  description?: string
  product_type: ProductType
  icon_name?: string
  color_code?: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
  created_by?: string
  
  // Computed fields
  content_count?: number
  popular_content?: TrainingContent[]
}

// Training Content Interface
export interface TrainingContent {
  id: string
  title: string
  description?: string
  content_type: ContentType
  product_type: ProductType
  category_id?: string
  
  // Content Details
  difficulty_level: DifficultyLevel
  duration_minutes?: number
  objectives?: string[]
  prerequisites?: string[]
  
  // Media Information
  has_images: boolean
  has_videos: boolean
  total_media_count: number
  
  // Status and Visibility
  status: ContentStatus
  is_featured: boolean
  target_roles?: string[]
  
  // SEO and Organization
  slug: string
  tags?: string[]
  meta_description?: string
  
  // Engagement Metrics
  view_count: number
  completion_count: number
  average_rating: number
  rating_count: number
  
  // Timestamps
  published_at?: string
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
  
  // Related Data (populated via joins)
  category?: TrainingCategory
  media?: TrainingMedia[]
  sections?: TrainingContentSection[]
  assessments?: TrainingAssessment[]
  user_progress?: UserTrainingProgress
  primary_media?: TrainingMedia
}

// Training Media Interface
export interface TrainingMedia {
  id: string
  training_content_id: string
  
  // Media Information
  media_type: MediaType
  file_name: string
  file_size_bytes?: number
  mime_type?: string
  
  // Storage Information (R2)
  r2_key: string
  r2_url?: string
  r2_bucket: string
  
  // Media Metadata
  title?: string
  description?: string
  alt_text?: string
  duration_seconds?: number
  resolution?: string
  thumbnail_r2_key?: string
  
  // Display Options
  display_order: number
  is_primary: boolean
  is_thumbnail: boolean
  
  // Timestamps
  uploaded_at: string
  created_at: string
  created_by?: string
  
  // Related Data
  training_content?: TrainingContent
}

// User Training Progress Interface
export interface UserTrainingProgress {
  id: string
  user_id: string
  training_content_id: string
  
  // Progress Information
  status: ProgressStatus
  progress_percentage: number
  time_spent_minutes: number
  
  // Engagement
  is_bookmarked: boolean
  user_rating?: number
  user_feedback?: string
  
  // Completion Details
  started_at?: string
  last_accessed_at: string
  completed_at?: string
  
  // Related Data
  training_content?: TrainingContent
}

// Training Content Section Interface
export interface TrainingContentSection {
  id: string
  training_content_id: string
  title: string
  content?: string
  section_type: SectionType
  sort_order: number
  is_required: boolean
  estimated_time_minutes?: number
  created_at: string
  updated_at: string
  
  // Related Data
  training_content?: TrainingContent
}

// Assessment Question Interface
export interface AssessmentQuestion {
  id: string
  question: string
  type: 'multiple_choice' | 'true_false' | 'text_input' | 'file_upload'
  options?: string[] // For multiple choice
  correct_answer?: string | string[]
  explanation?: string
  points: number
  required: boolean
}

// Training Assessment Interface
export interface TrainingAssessment {
  id: string
  training_content_id: string
  title: string
  description?: string
  assessment_type: AssessmentType
  
  // Configuration
  passing_score: number
  time_limit_minutes?: number
  max_attempts: number
  is_required: boolean
  
  // Questions
  questions: AssessmentQuestion[]
  
  created_at: string
  updated_at: string
  created_by?: string
  
  // Related Data
  training_content?: TrainingContent
  user_results?: UserAssessmentResult[]
}

// User Assessment Result Interface
export interface UserAssessmentResult {
  id: string
  user_id: string
  assessment_id: string
  
  // Results
  score_percentage?: number
  passed: boolean
  time_taken_minutes?: number
  attempt_number: number
  
  // Detailed Results
  answers: any[] // User answers array
  feedback?: string
  
  // Timestamps
  started_at: string
  completed_at?: string
  
  // Related Data
  assessment?: TrainingAssessment
}

// API Response Interfaces
export interface TrainingContentResponse {
  content: TrainingContent[]
  categories: TrainingCategory[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface TrainingDashboardStats {
  statistics: {
    total_content: number
    published_content: number
    draft_content: number
    total_media: number
    user_progress: {
      completed: number
      in_progress: number
      not_started: number
      bookmarked: number
    }
  }
  popular_content: TrainingContent[]
  recent_content: TrainingContent[]
  featured_content: TrainingContent[]
  categories: TrainingCategory[]
  product_type?: ProductType
}

// Filter and Search Interfaces
export interface TrainingFilters {
  product_type?: ProductType
  category_id?: string
  content_type?: ContentType
  difficulty_level?: DifficultyLevel
  status?: ContentStatus
  is_featured?: boolean
  has_videos?: boolean
  has_images?: boolean
  tags?: string[]
  target_roles?: string[]
  search_query?: string
  date_range?: {
    start: string
    end: string
  }
}

export interface TrainingSortOptions {
  field: 'title' | 'created_at' | 'updated_at' | 'published_at' | 'view_count' | 'completion_count' | 'average_rating' | 'duration_minutes'
  direction: 'asc' | 'desc'
}

// Form Interfaces for Creating/Editing
export interface CreateTrainingCategoryForm {
  name: string
  description?: string
  product_type: ProductType
  icon_name?: string
  color_code?: string
  sort_order?: number
}

export interface CreateTrainingContentForm {
  title: string
  description?: string
  content_type: ContentType
  product_type: ProductType
  category_id?: string
  difficulty_level: DifficultyLevel
  duration_minutes?: number
  objectives?: string[]
  prerequisites?: string[]
  target_roles?: string[]
  tags?: string[]
  meta_description?: string
  is_featured?: boolean
}

export interface MediaUploadForm {
  training_content_id: string
  media_type: MediaType
  file: File
  title?: string
  description?: string
  alt_text?: string
  display_order?: number
  is_primary?: boolean
  is_thumbnail?: boolean
}

// Component Props Interfaces
export interface TrainingCardProps {
  content: TrainingContent
  showProgress?: boolean
  showActions?: boolean
  onClick?: () => void
  onBookmark?: () => void
  onRate?: (rating: number) => void
}

export interface CategorySelectorProps {
  productType: ProductType
  selectedCategory?: string
  onSelectCategory: (categoryId: string) => void
  showCreateNew?: boolean
}

export interface MediaGalleryProps {
  media: TrainingMedia[]
  currentIndex?: number
  onMediaSelect?: (media: TrainingMedia, index: number) => void
  showUpload?: boolean
  onUpload?: (files: File[]) => void
}

export interface ProgressTrackerProps {
  progress: UserTrainingProgress
  showDetails?: boolean
  allowRating?: boolean
  onProgressUpdate?: (newProgress: number) => void
  onComplete?: () => void
}

// Utility Types
export type TrainingContentPreview = Pick<
  TrainingContent,
  'id' | 'title' | 'description' | 'content_type' | 'product_type' | 'difficulty_level' | 
  'duration_minutes' | 'is_featured' | 'view_count' | 'average_rating' | 'published_at'
> & {
  category_name?: string
  primary_media_url?: string
}

export type CategoryWithStats = TrainingCategory & {
  content_count: number
  published_count: number
  completion_rate: number
  average_rating: number
}

// API Endpoints Type Map
export type TrainingAPIEndpoints = {
  // Categories
  'GET /api/training/categories': { params: { product_type?: ProductType } }
  'POST /api/training/categories': { body: CreateTrainingCategoryForm }
  'PUT /api/training/categories/[id]': { body: Partial<CreateTrainingCategoryForm> }
  'DELETE /api/training/categories/[id]': {}
  
  // Content
  'GET /api/training/content': { params: TrainingFilters & { page?: number; limit?: number; sort?: string } }
  'POST /api/training/content': { body: CreateTrainingContentForm }
  'GET /api/training/content/[id]': {}
  'PUT /api/training/content/[id]': { body: Partial<CreateTrainingContentForm> }
  'DELETE /api/training/content/[id]': {}
  
  // Media
  'POST /api/training/media/upload': { body: FormData }
  'GET /api/training/media/[id]': {}
  'DELETE /api/training/media/[id]': {}
  
  // Progress
  'GET /api/training/progress': { params: { user_id?: string; content_id?: string } }
  'POST /api/training/progress': { body: { content_id: string; status: ProgressStatus; progress_percentage?: number } }
  'PUT /api/training/progress/[id]': { body: Partial<UserTrainingProgress> }
  
  // Dashboard
  'GET /api/training/dashboard': { params: { product_type?: ProductType } }
}