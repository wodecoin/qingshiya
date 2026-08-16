# Task 1 实现报告

## 改动文件

- `.gitignore`
- `package.json` 和 `package-lock.json`
- `tsconfig.json`、`tsconfig.app.json`、`tsconfig.node.json`
- `vite.config.ts`
- `index.html`
- `src/main.tsx`
- `src/app/App.tsx`
- `src/app/App.test.tsx`
- `src/test/setup.ts`
- `src/styles/tokens.css`

实现了 React + TypeScript + Vite 应用壳、PWA 插件配置、首页空状态、底部导航、浅蓝/淡紫/奶油白/低饱和粉色/粉黄/薄荷色 token，以及 360px 移动布局和 reduced-motion 规则。应用不包含数据上传逻辑。

## 测试命令及实际输出

### `npm test -- --run src/app/App.test.tsx`

```text
Test Files  1 passed (1)
Tests       1 passed (1)
```

### `npm test -- --run`

```text
Test Files  1 passed (1)
Tests       1 passed (1)
```

### `npm run build`

```text
vite v7.3.6 building client environment for production...
✓ 29 modules transformed.
✓ built in 2.11s
PWA v1.3.0
precache  5 entries (193.12 KiB)
files generated: dist/sw.js, dist/workbox-9c191d2f.js
```

## Concerns

无。当前任务没有提供端到端测试用例，因此未运行 `npm run test:e2e`；该脚本已配置供后续任务使用。
