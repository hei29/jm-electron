import { ElectronAPI } from '@electron-toolkit/preload'

interface JmcomicDownloadResult {
  success: boolean
  output: string
}

interface JmcomicAPI {
  downloadJmcomicAlbum: (albumId: string) => Promise<JmcomicDownloadResult>
  openDownloadDirectory: () => Promise<string>
}

interface AppSettings {
  downloadDirectory: string
}

interface SettingsAPI {
  getSettings: () => Promise<AppSettings>
  setDownloadDirectory: (downloadDirectory: string) => Promise<AppSettings>
  chooseDownloadDirectory: () => Promise<string | null>
  openProject: () => Promise<void>
}

declare global {
  interface Window {
    electron: ElectronAPI
    jmcomicApi: JmcomicAPI
    settingsApi: SettingsAPI
  }
}
