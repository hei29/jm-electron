# JMComic-Crawler-Python 集成说明

本项目通过 Electron 主进程调用 [JMComic-Crawler-Python](https://github.com/hect0x7/JMComic-Crawler-Python) 提供的 `jmcomic` 命令行工具。上游仓库采用 MIT 许可证。

> 请仅下载、保存和使用你拥有权利或已获授权的内容，并遵守所在地法律、服务条款及版权规定。不要进行批量或高频请求。

## 前置条件

1. 安装 Python 3.10 或更高版本。
2. 在 PowerShell 中安装或更新工具：

   ```powershell
   python -m pip install -U jmcomic
   ```

3. 关闭并重新打开终端，确认命令可用：

   ```powershell
   jmcomic --help
   ```

如果 Windows 找不到 `jmcomic`，请将 Python 的 `Scripts` 目录添加到 `PATH`，然后重启 JM Electron。

## 应用内使用

1. 登录、注册或以游客身份进入主页。
2. 在输入框填写仅由数字组成的本子 ID。
3. 点击“下载”或按 Enter。
4. 应用会通过受限 IPC 将 ID 传给主进程，再执行等价命令：

   ```powershell
   jmcomic <album-id>
   ```

主进程会校验 ID，且不会把渲染进程输入拼接为 shell 命令；命令输出会显示在主页。

## 下载文件位置

应用统一将下载命令的工作目录设置为项目根目录中的 `downloads` 文件夹：

```text
E:\codex\JM-electron\downloads
```

下载完成后，主页会显示绝对路径；也可以点击“打开下载目录”按钮在资源管理器中查看。打包后的应用不再有项目根目录，届时应改为可写的用户目录。

## 配置下载行为

`jmcomic` 支持通过 option 文件配置下载路径、图片格式、代理和并发等选项。创建 option 文件后，可通过环境变量指定：

```powershell
setx JM_OPTION_PATH "D:/jmcomic/option.yml"
```

设置后需要重启应用。完整 option 语法和高级功能请参考上游项目文档。
