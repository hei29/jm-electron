import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { execFile } from 'child_process'
import { mkdir } from 'fs/promises'
import { join } from 'path'
import { promisify } from 'util'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

const execFileAsync = promisify(execFile)
const albumIdPattern = /^[1-9]\d{0,11}$/
const getDownloadDirectory = (): string => join(app.getAppPath(), 'downloads')

const downloadAlbum = async (albumId: string): Promise<{ success: boolean; output: string }> => {
  if (!albumIdPattern.test(albumId)) {
    return { success: false, output: '请输入有效的本子 ID（仅限数字）。' }
  }

  try {
    const command = process.platform === 'win32' ? 'jmcomic.exe' : 'jmcomic'
    const downloadDirectory = getDownloadDirectory()
    await mkdir(downloadDirectory, { recursive: true })
    const { stdout, stderr } = await execFileAsync(command, [albumId], {
      cwd: downloadDirectory,
      windowsHide: true,
      timeout: 30 * 60 * 1000,
      maxBuffer: 10 * 1024 * 1024
    })

    return { success: true, output: `${stdout || stderr || '下载任务已完成。'}\n保存目录：${downloadDirectory}` }
  } catch (error) {
    const message = error instanceof Error ? error.message : '无法启动 jmcomic 命令。'
    return {
      success: false,
      output: `${message}\n请先按 docs/JMCOMIC.md 中的说明安装 Python 依赖，并确认 jmcomic 已加入 PATH。`
    }
  }
}

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })
  // 只在开发环境打开 DevTools
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools(); 
    // 或者指定位置：win.webContents.openDevTools({ mode: 'bottom' });
  }

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))
  ipcMain.handle('jmcomic:download-album', (_event, albumId: string) => downloadAlbum(albumId))
  ipcMain.handle('jmcomic:open-download-directory', () => shell.openPath(getDownloadDirectory()))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
