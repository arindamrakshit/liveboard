import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { mockBackend } from './mockBackend'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 3000,
})

// Request interceptor — attach JWT & normalize path
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`

  // Ensure no duplicate /api if caller passes /api/...
  if (config.url?.startsWith('/api/')) {
    config.url = config.url.replace(/^\/api/, '')
  }
  return config
})

// Custom client adapter that falls back to mockBackend if Spring Boot backend is offline
const handleMockFallback = async (method: string, url: string, data?: any) => {
  const cleanUrl = url.replace(/^\/api/, '')

  // Auth routes
  if (cleanUrl.startsWith('/auth/login')) {
    const res = await mockBackend.login(data?.identifier || data?.email, data?.password)
    return { data: res, status: 200 }
  }
  if (cleanUrl.startsWith('/auth/register')) {
    const res = await mockBackend.register(data)
    return { data: res, status: 200 }
  }
  if (cleanUrl.startsWith('/auth/logout')) {
    return { data: null, status: 204 }
  }

  // Projects routes
  if (cleanUrl === '/projects' && method === 'get') {
    const res = await mockBackend.getProjects()
    return { data: res, status: 200 }
  }
  if (cleanUrl === '/projects' && method === 'post') {
    const res = await mockBackend.createProject(data)
    return { data: res, status: 201 }
  }
  const projectBoardMatch = cleanUrl.match(/^\/projects\/([^/]+)\/board/)
  if (projectBoardMatch && method === 'get') {
    const res = await mockBackend.getBoard(projectBoardMatch[1])
    return { data: res, status: 200 }
  }
  const projectMembersMatch = cleanUrl.match(/^\/projects\/([^/]+)\/members/)
  if (projectMembersMatch && method === 'get') {
    const res = await mockBackend.getMembers(projectMembersMatch[1])
    return { data: res, status: 200 }
  }
  const projectTasksMatch = cleanUrl.match(/^\/projects\/([^/]+)\/tasks/)
  if (projectTasksMatch && method === 'post') {
    const res = await mockBackend.createTask(projectTasksMatch[1], data)
    return { data: res, status: 201 }
  }
  const projectColumnsMatch = cleanUrl.match(/^\/projects\/([^/]+)\/columns/)
  if (projectColumnsMatch && method === 'post') {
    const res = await mockBackend.createColumn(projectColumnsMatch[1], data?.name)
    return { data: res, status: 201 }
  }
  const projectMatch = cleanUrl.match(/^\/projects\/([^/]+)$/)
  if (projectMatch && method === 'get') {
    const res = await mockBackend.getProject(projectMatch[1])
    return { data: res, status: 200 }
  }

  // Task routes
  const taskMoveMatch = cleanUrl.match(/^\/tasks\/([^/]+)\/move/)
  if (taskMoveMatch && method === 'post') {
    const res = await mockBackend.moveTask(taskMoveMatch[1], data?.targetColumnId, data?.newPosition)
    return { data: res, status: 200 }
  }
  const taskCommentsMatch = cleanUrl.match(/^\/tasks\/([^/]+)\/comments/)
  if (taskCommentsMatch && method === 'post') {
    const res = await mockBackend.addComment(taskCommentsMatch[1], data?.content)
    return { data: res, status: 201 }
  }
  const taskMatch = cleanUrl.match(/^\/tasks\/([^/]+)$/)
  if (taskMatch && method === 'patch') {
    const res = await mockBackend.updateTask(taskMatch[1], data)
    return { data: res, status: 200 }
  }
  if (taskMatch && method === 'delete') {
    await mockBackend.deleteTask(taskMatch[1])
    return { data: null, status: 204 }
  }

  // Default fallback for user
  if (cleanUrl.startsWith('/users/me')) {
    return {
      data: {
        id: '1',
        fullName: 'Alice Johnson',
        username: 'alice',
        email: 'alice@liveboard.dev',
        bio: 'Product Designer & Frontend Dev',
        timezone: 'UTC',
      },
      status: 200,
    }
  }

  return { data: {}, status: 200 }
}

// Wrapper that attempts real backend first, falling back to mock if backend is down/connecting refused
const client = {
  get: async <T = any>(url: string, config?: any) => {
    try {
      return await api.get<T>(url, config)
    } catch (err: any) {
      if (!err.response || err.code === 'ERR_NETWORK' || err.response.status === 404 || err.response.status === 502) {
        return (await handleMockFallback('get', url)) as any
      }
      throw err
    }
  },
  post: async <T = any>(url: string, data?: any, config?: any) => {
    try {
      return await api.post<T>(url, data, config)
    } catch (err: any) {
      if (!err.response || err.code === 'ERR_NETWORK' || err.response.status === 404 || err.response.status === 502) {
        return (await handleMockFallback('post', url, data)) as any
      }
      throw err
    }
  },
  patch: async <T = any>(url: string, data?: any, config?: any) => {
    try {
      return await api.patch<T>(url, data, config)
    } catch (err: any) {
      if (!err.response || err.code === 'ERR_NETWORK' || err.response.status === 404 || err.response.status === 502) {
        return (await handleMockFallback('patch', url, data)) as any
      }
      throw err
    }
  },
  delete: async <T = any>(url: string, config?: any) => {
    try {
      return await api.delete<T>(url, config)
    } catch (err: any) {
      if (!err.response || err.code === 'ERR_NETWORK' || err.response.status === 404 || err.response.status === 502) {
        return (await handleMockFallback('delete', url)) as any
      }
      throw err
    }
  },
}

export default client
