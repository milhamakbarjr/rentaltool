/**
 * UI Store
 *
 * Zustand store for global UI state (modals, sidebars, etc.)
 */

import { create } from 'zustand'

interface UIState {
  // Sidebar state
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void

  // Modal state
  modalOpen: string | null
  openModal: (modalId: string) => void
  closeModal: () => void

  // Loading state
  isLoading: boolean
  setIsLoading: (loading: boolean) => void

  // Toast/notification state
  toast: {
    message: string
    type: 'success' | 'error' | 'info' | 'warning'
  } | null
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void
  hideToast: () => void
}

export const useUIStore = create<UIState>((set) => ({
  // Sidebar
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  // Modal
  modalOpen: null,
  openModal: (modalId) => set({ modalOpen: modalId }),
  closeModal: () => set({ modalOpen: null }),

  // Loading
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),

  // Toast
  toast: null,
  showToast: (message, type) => set({ toast: { message, type } }),
  hideToast: () => set({ toast: null }),
}))
