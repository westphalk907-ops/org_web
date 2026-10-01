/**
 * 全局开关：是否走后端 API
 *
 * 改这里就能切换前端的数据来源：
 *   - false (默认)：直接读 src/data/ 本地 mock，零网络请求
 *   - true        ：调 src/api/server.ts 里的真实后端
 *
 * 切换后无需改任何 Vue 文件 / composable。
 */
export const USE_BACKEND = true