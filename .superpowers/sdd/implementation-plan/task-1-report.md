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

初始报告时无阻塞 concerns；当时没有端到端测试用例，因此未运行 `npm run test:e2e`。

## 审查修复追加

新增 `playwright.config.ts`，将 E2E 测试限定在 `e2e/**/*.spec.ts`，并配置 Chromium 项目及 `npm run dev` webServer。新增 `e2e/app.spec.ts` 作为最小 smoke test；Vitest 同时限定为 `src` 测试，避免两个测试运行器互相扫描。`test:e2e` 保留原脚本并显式绕过本地开发服务器代理。

### `npm test -- --run`

```text
Test Files  1 passed (1)
Tests       1 passed (1)
```

### `npm run test:e2e`

```text
Running 1 test using 1 worker
[1/1] [chromium] › e2e/app.spec.ts:3:1 › serves the app shell
1 passed (2.2s)
```

### `npm run build`

```text
✓ 29 modules transformed.
✓ built in 2.07s
PWA v1.3.0
precache  5 entries (193.12 KiB)
files generated: dist/sw.js, dist/workbox-9c191d2f.js
```

### Concerns

无阻塞 concerns。Smoke test 使用 Playwright `request` fixture 验证 webServer 返回应用壳，不启动浏览器页面；当前容器缺少 Chromium 的 `libnspr4.so`，因此未使用浏览器交互断言。

## 限定复审修复追加

将 `test:e2e` 恢复为跨平台的 `playwright test`。Playwright 配置现在使用 `npm run dev -- --host 127.0.0.1`，通过 `webServer.wait.stdout` 等待 Vite 的明确启动输出，避免代理或 IPv6 `localhost` 的 HTTP 就绪探测；配置了 30 秒 timeout 和 `reuseExistingServer: false`，并在配置内处理本地代理变量。`baseURL` 保持为 `http://127.0.0.1:5173`。

### `npm test -- --run`

```text
Test Files  1 passed (1)
Tests       1 passed (1)
```

### `npm run test:e2e`

```text
[WebServer] > vite --host 127.0.0.1
[WebServer] ➜  Local:   http://127.0.0.1:5173/
Running 1 test using 1 worker
[1/1] [chromium] › e2e/app.spec.ts:3:1 › serves the app shell
1 passed (2.5s)
```

### `npm run build`

```text
✓ 29 modules transformed.
✓ built in 2.31s
PWA v1.3.0
precache  5 entries (193.12 KiB)
files generated: dist/sw.js, dist/workbox-9c191d2f.js
```

### Concerns

无阻塞 concerns。当前 E2E 仅为 Playwright `request` smoke test；容器缺少 Chromium 所需的 `libnspr4.so`，因此明确不具备浏览器交互覆盖。
