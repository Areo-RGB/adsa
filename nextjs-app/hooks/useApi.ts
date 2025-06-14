import { useState, useCallback } from 'react'

interface ApiError {
  message: string
  status?: number
}

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: ApiError | null
}

export function useApi<T = any>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null
  })

  const request = useCallback(async (
    url: string,
    options: RequestInit = {}
  ): Promise<T> => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      })

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage: string
        
        try {
          const errorJson = JSON.parse(errorText)
          errorMessage = errorJson.error || errorJson.message || `HTTP ${response.status}`
        } catch {
          errorMessage = errorText || `HTTP ${response.status}`
        }

        throw new Error(errorMessage)
      }

      // Handle 204 No Content responses
      if (response.status === 204) {
        setState({ data: null, loading: false, error: null })
        return null as T
      }

      const data = await response.json()
      setState({ data, loading: false, error: null })
      return data
    } catch (error) {
      const apiError: ApiError = {
        message: error instanceof Error ? error.message : 'An error occurred',
        status: error instanceof Response ? error.status : undefined
      }
      
      setState({ data: null, loading: false, error: apiError })
      throw apiError
    }
  }, [])

  const get = useCallback((url: string) => {
    return request(url, { method: 'GET' })
  }, [request])

  const post = useCallback((url: string, data?: any) => {
    return request(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    })
  }, [request])

  const put = useCallback((url: string, data?: any) => {
    return request(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    })
  }, [request])

  const del = useCallback((url: string) => {
    return request(url, { method: 'DELETE' })
  }, [request])

  return {
    ...state,
    request,
    get,
    post,
    put,
    delete: del
  }
}