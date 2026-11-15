import type {
  Audio,
  AudioCategory,
  AudioIndexQuery,
  AudioIndexResponse,
  AudioResponse,
  AudioType,
  HomeResponse,
  ListResponse,
  PlaybackUrlResponse,
  Teacher,
  TeacherResponse,
} from './types'

/**
 * Base URL of the Laravel API. In development Vite proxies `/api` to the
 * local backend (see `vite.config.ts`), so the default is a relative path.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

/**
 * Public read-only key. It is compiled into the published bundle exactly like
 * the Flutter app does — it only supports rotation, identification and
 * server-side rate limiting.
 */
const API_KEY = import.meta.env.VITE_API_KEY ?? ''

export class ApiError extends Error {
  readonly status: number
  readonly payload: unknown

  constructor(message: string, status: number, payload: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST'
  query?: Record<string, string | number | null | undefined>
  signal?: AbortSignal
}

function buildUrl(path: string, query?: RequestOptions['query']): string {
  // A relative base (the default) keeps the request on the current origin so
  // the dev proxy can forward it. An absolute base points at another host.
  const isAbsolute = /^https?:\/\//i.test(API_BASE_URL)
  const base = isAbsolute ? API_BASE_URL : `${window.location.origin}${API_BASE_URL}`
  const url = new URL(`${base}${path}`)

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === '') continue
      url.searchParams.set(key, String(value))
    }
  }

  return isAbsolute ? url.toString() : `${url.pathname}${url.search}`
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  }

  if (API_KEY) {
    headers['X-API-Key'] = API_KEY
  }

  let response: Response

  try {
    response = await fetch(buildUrl(path, options.query), {
      method: options.method ?? 'GET',
      headers,
      signal: options.signal,
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error
    }

    throw new ApiError('Network request failed. Please check your connection.', 0, error)
  }

  if (!response.ok) {
    let payload: unknown = null

    try {
      payload = await response.json()
    } catch {
      payload = null
    }

    const message =
      (payload as { message?: string } | null)?.message ??
      `Request failed with status ${response.status}.`

    throw new ApiError(message, response.status, payload)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export const api = {
  home(signal?: AbortSignal) {
    return request<HomeResponse>('/home', { signal })
  },

  audios(query: AudioIndexQuery = {}, signal?: AbortSignal) {
    return request<AudioIndexResponse>('/audios', { query: { ...query }, signal })
  },

  audio(slug: string, signal?: AbortSignal) {
    return request<AudioResponse>(`/audios/${slug}`, { signal })
  },

  /**
   * Signed stream URLs expire after a short TTL, so refresh before playback.
   */
  playbackUrl(slug: string, signal?: AbortSignal) {
    return request<PlaybackUrlResponse>(`/audios/${slug}/playback-url`, {
      method: 'POST',
      signal,
    })
  },

  teachers(signal?: AbortSignal) {
    return request<ListResponse<Teacher>>('/teachers', { signal })
  },

  teacher(slug: string, signal?: AbortSignal) {
    return request<TeacherResponse>(`/teachers/${slug}`, { signal })
  },

  categories(signal?: AbortSignal) {
    return request<ListResponse<AudioCategory>>('/categories', { signal })
  },

  audioTypes(signal?: AbortSignal) {
    return request<ListResponse<AudioType>>('/audio-types', { signal })
  },
}

export type { Audio }
