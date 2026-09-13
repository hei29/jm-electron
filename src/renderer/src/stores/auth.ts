import { defineStore } from 'pinia'

export type AuthType = 'user' | 'guest'

interface AuthState {
  displayName: string
  authType: AuthType | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({ displayName: '', authType: null }),
  getters: { isAuthenticated: (state) => state.authType !== null },
  actions: {
    login(username: string) { this.displayName = username; this.authType = 'user' },
    enterAsGuest() { this.displayName = '游客'; this.authType = 'guest' },
    logout() { this.displayName = ''; this.authType = null }
  }
})
