import { ElectronAPI } from '@electron-toolkit/preload'

interface JmcomicDownloadResult {
  success: boolean
  output: string
}

interface JmcomicAPI {
  downloadJmcomicAlbum: (albumId: string) => Promise<JmcomicDownloadResult>
  openDownloadDirectory: () => Promise<string>
}

declare global {
  interface Window {
    electron: ElectronAPI
    jmcomicApi: JmcomicAPI
  }
}
