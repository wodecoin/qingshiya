# Task 9 Report

## Status

完成核心产品闭环与状态一致性修复。

## 改动文件

- `src/app/App.tsx`: 接入记录、练习库、练习运行器和复盘/设置刷新；增加首次本机隐私说明。
- `src/features/entry/EntryFlow.tsx`, `entryForm.ts`, `EntrySummary.tsx`: 记录流程选择练习，并将完成结果合并回同一条待保存记录。
- `src/features/exercises/ExerciseRunner.tsx`: 完成前校验练习后强度为 1..10 的整数。
- `src/features/home/HomePage.tsx`, `src/features/review/ReviewPage.tsx`: 区分读取中、空数据和读取错误，提供重试与导出建议；复盘显示中文练习标题和未知 ID fallback。
- `src/features/settings/SettingsPage.tsx`: 清除成功通知刷新，失败显示错误。
- `src/styles/tokens.css`: 隐私说明样式。
- `src/app/App.test.tsx`, `src/features/entry/EntryFlow.test.tsx`, `src/features/exercises/ExerciseRunner.test.tsx`, `src/features/review/reviewSelectors.test.ts`, `src/test/setup.ts`: 增加/更新流程、校验和本机 IndexedDB 测试覆盖。

## 实际验证

命令：`npm test -- --run`

结果：7 个测试文件通过，33 个测试通过，0 失败。

命令：`npm run build`

结果：`tsc -b` 通过，Vite production build 通过，退出码 0。

## Concerns

- 未运行 Playwright E2E；本任务要求的验证命令已完成。
- 练习退出时保留当前记录流程和已选练习，但只有完成练习回调才写入 `durationMinutes` 与 `intensityAfter`。
- 设置清除会清空 IndexedDB 中的设置；下次重新加载应用会再次显示本机隐私说明，这是清除全部数据的预期结果。

## Follow-up Review Fixes

- 练习选择只启动 runner，不再立即写入 `form.exerciseId`；只有 runner 完成回调才将 `exerciseId`、`durationMinutes` 和可选 `intensityAfter` 合并到当前记录。
- 未完成练习退出后可继续保存压力草稿，保存结果不含 `exerciseId` 或练习时长。
- App 统一通过离开记录、开始新记录和导航处理清理 `activeExercise` 与 `exerciseResult`，避免旧 runner/result 污染新记录。
- `src/app/App.test.tsx` 新增真实 IndexedDB App 集成测试：完成练习保存同一条记录、退出未完成练习不带 exercise ID、离开再进入不残留 runner/result。

Follow-up 实际验证：

- `npm test -- --run`：7 个测试文件通过，36 个测试通过，0 失败。
- `npm run build`：`tsc -b` 和 Vite production build 通过，退出码 0。

Follow-up concerns：

- 未运行 Playwright E2E；按本次要求执行了全量 Vitest 和 production build。
