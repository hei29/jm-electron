import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

interface JmcomicDownloadResult {
  success: boolean
  output: string
}

// Custom APIs for renderer
const jmcomicApi = {
  downloadJmcomicAlbum: (albumId: string): Promise<JmcomicDownloadResult> =>
    ipcRenderer.invoke('jmcomic:download-album', albumId),
  openDownloadDirectory: (): Promise<string> => ipcRenderer.invoke('jmcomic:open-download-directory')
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('jmcomicApi', jmcomicApi)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.jmcomicApi = jmcomicApi
}
