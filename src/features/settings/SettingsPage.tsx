import { useState } from 'react'
import { clearAllData } from '../../storage/db'
import { exportEntries } from './exportActions'

interface SettingsPageProps { onCleared?: () => void }

export function SettingsPage({ onCleared }: SettingsPageProps) {
  const [confirming, setConfirming] = useState(false)
  const [status, setStatus] = useState('')

  async function download(format: 'json' | 'csv') {
    try {
      await exportEntries(format)
      setStatus(`已下载 ${format.toUpperCase()} 文件`)
    } catch {
      setStatus('导出失败，请稍后重试')
    }
  }

  async function clearData() {
    try {
      await clearAllData()
      setConfirming(false)
      setStatus('本机记录已清除')
      onCleared?.()
    } catch (error) {
      setStatus(error instanceof Error ? `清除失败：${error.message}` : '清除失败，请稍后重试')
    }
  }

  return <main className="app-content settings-page">
    <p className="eyebrow">只属于你的空间</p>
    <h1>设置</h1>
    <section className="settings-section" aria-labelledby="export-title">
      <h2 id="export-title">导出记录</h2>
      <p>记录只保存在本机。导出文件也不会自动上传。</p>
      <div className="settings-actions"><button type="button" onClick={() => void download('json')}>导出 JSON</button><button type="button" onClick={() => void download('csv')}>导出 CSV</button></div>
    </section>
    <section className="settings-section" aria-labelledby="privacy-title">
      <h2 id="privacy-title">隐私与安全</h2>
      <p>轻释压不会上传、分析或分享你的记录。数据使用浏览器本机 IndexedDB 保存，清除浏览器数据或卸载应用可能使记录无法恢复。</p>
    </section>
    <section className="settings-section danger-zone" aria-labelledby="clear-title">
      <h2 id="clear-title">清除数据</h2>
      <p>清除全部记录后不可恢复，请先确认你已经导出需要保留的内容。</p>
      {!confirming ? <button type="button" onClick={() => setConfirming(true)}>清除全部数据</button> : <div role="alertdialog" aria-labelledby="clear-confirm-title"><h3 id="clear-confirm-title">确定清除全部数据？</h3><p>此操作不可恢复。</p><button type="button" onClick={() => void clearData()}>确认清除</button><button type="button" onClick={() => setConfirming(false)}>取消</button></div>}
    </section>
    {status && <p role={status.startsWith('清除失败') ? 'alert' : 'status'}>{status}</p>}
  </main>
}
