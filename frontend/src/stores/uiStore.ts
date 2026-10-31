import { create } from 'zustand'

interface UIState {
  sidebarCollapsed: boolean
  activeProjectId: number | null
  searchQuery: string
  selectedTaskId: number | null
  isOnline: boolean
  pendingOpsCount: number
  setSidebarCollapsed: (v: boolean) => void
  toggleSidebar: () => void
  setActiveProject: (id: number | null) => void
  setSearchQuery: (q: string) => void
  setSelectedTask: (id: number | null) => void
  setOnline: (online: boolean) => void
  setPendingOps: (count: number) => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  activeProjectId: null,
  searchQuery: '',
  selectedTaskId: null,
  isOnline: navigator.onLine,
  pendingOpsCount: 0,

  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setActiveProject: (id) => set({ activeProjectId: id }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setSelectedTask: (id) => set({ selectedTaskId: id }),
  setOnline: (online) => set({ isOnline: online }),
  setPendingOps: (count) => set({ pendingOpsCount: count }),
}))
