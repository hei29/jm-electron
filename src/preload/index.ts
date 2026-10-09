import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

interface JmcomicDownloadResult {
  success: boolean
  output: string
}

interface AppSettings {
  downloadDirectory: string
}

// Custom APIs for renderer
const jmcomicApi = {
  downloadJmcomicAlbum: (albumId: string): Promise<JmcomicDownloadResult> =>
    ipcRenderer.invoke('jmcomic:download-album', albumId),
  openDownloadDirectory: (): Promise<string> => ipcRenderer.invoke('jmcomic:open-download-directory')
}

const settingsApi = {
  getSettings: (): Promise<AppSettings> => ipcRenderer.invoke('settings:get'),
  setDownloadDirectory: (downloadDirectory: string): Promise<AppSettings> =>
    ipcRenderer.invoke('settings:set-download-directory', downloadDirectory),
  chooseDownloadDirectory: (): Promise<string | null> =>
    ipcRenderer.invoke('settings:choose-download-directory'),
  openProject: (): Promise<void> => ipcRenderer.invoke('app:open-project')
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('jmcomicApi', jmcomicApi)
    contextBridge.exposeInMainWorld('settingsApi', settingsApi)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.jmcomicApi = jmcomicApi
  // @ts-ignore (define in dts)
  window.settingsApi = settingsApi
}
