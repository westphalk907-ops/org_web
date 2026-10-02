// Vercel Serverless Function 入口
// Vercel 会把这个文件编译为单个 serverless 函数
// 所有请求都路由到这里，由 Express app 处理
import { createApp } from '../src/app.js'

export default createApp()