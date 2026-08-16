import type { ReactNode } from 'react'

export type AppPage = 'home' | 'entry' | 'exercises' | 'review' | 'settings'

export interface AppRoute {
  id: AppPage
  label: string
  render: () => ReactNode
}

export const routeLabels: Record<AppPage, string> = {
  home: '首页',
  entry: '记录',
  exercises: '练习',
  review: '复盘',
  settings: '设置',
}
