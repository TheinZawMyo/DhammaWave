/**
 * Response shapes returned by the Buddha Audio Laravel API (v1).
 * Mirrors `app/Http/Resources/Api/V1` on the backend.
 */

export interface AudioCategory {
  id: string
  slug: string
  name: string
  description: string | null
  sort_order: number
  is_active: boolean
}

export interface AudioType {
  id: string
  slug: string
  name: string
  description: string | null
  sort_order: number
  is_active: boolean
}

export interface Teacher {
  id: string
  slug: string
  name: string
  short_name: string
  bio: string | null
  photo_url: string | null
  sort_order: number
  is_active: boolean
}

export interface Audio {
  id: string
  slug: string
  title: string
  description: string | null
  teacher: Teacher
  type: AudioType
  categories: AudioCategory[]
  duration_seconds: number
  language: string
  cover_image_url: string | null
  playback_url: string | null
  published_at: string | null
}

export interface HomePayload {
  featured: Audio[]
  latest: Audio[]
  teachers: Teacher[]
  categories: AudioCategory[]
  audio_types: AudioType[]
}

export interface PaginationMeta {
  pagination: {
    next_cursor: string | null
    has_more: boolean
    total: number
  }
}

export interface AudioIndexResponse {
  data: Audio[]
  meta: PaginationMeta
}

export interface AudioIndexQuery {
  query?: string
  teacher?: string
  category?: string
  type?: string
  cursor?: string
  limit?: number
}

export interface HomeResponse {
  data: HomePayload
  meta: {
    generated_at: string
  }
}

export interface AudioResponse {
  data: Audio
}

export interface TeacherResponse {
  data: Teacher
}

export interface ListResponse<T> {
  data: T[]
}

export interface PlaybackUrlResponse {
  data: {
    playback_url: string | null
  }
}
