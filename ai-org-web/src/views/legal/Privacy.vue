<script setup lang="ts">
// 隐私政策页面（零数据收集版）
</script>

<template>
  <article class="py-30">
    <div class="container-reading">
      <div class="section-eyebrow">Legal · 法律</div>
      <h1 class="mt-4 text-display-md font-display font-medium text-ink-50">
        隐私政策
      </h1>
      <p class="mt-4 text-sm text-ink-200">更新日期：2026 年 9 月 29 日</p>

      <div class="mt-12 space-y-8 text-base text-ink-200 leading-relaxed">
        <section>
          <h2 class="text-xl font-medium text-ink-50 mb-4">核心承诺</h2>
          <p>
            <strong class="text-ink-50">我们不收集您的个人信息。</strong>
            本网站没有"留资表单"，没有账号体系，没有用户数据库。
            当您访问本网站的资源（白皮书、Prompt、Workflow）时，
            文件直接在您的浏览器与内容分发网络（CDN）之间传输，
            我们不会截获您的下载行为。
          </p>
        </section>

        <section>
          <h2 class="text-xl font-medium text-ink-50 mb-4">什么情况下我们会知道您是谁</h2>
          <p>仅在您<strong class="text-ink-50">主动</strong>通过以下方式联系我们时：</p>
          <ul class="mt-3 space-y-2 list-disc list-inside">
            <li>发送邮件到 <code class="text-ink-50">westphalk907@gmail.com</code> —— 邮件内容由您的邮箱服务商保管</li>
            <li>添加微信 <code class="text-ink-50">Do-core</code> —— 聊天记录由您与微信共同保存</li>
            <li>关注公众号、抖音、小红书 —— 由平台方按其隐私政策处理</li>
          </ul>
          <p class="mt-3">
            这些沟通<strong class="text-ink-50">不会进入我们的任何数据库</strong>，
            您可以随时在自己的客户端删除对话历史。
          </p>
        </section>

        <section>
          <h2 class="text-xl font-medium text-ink-50 mb-4">网站自动收集的信息</h2>
          <p>仅以下两类：</p>
          <ul class="mt-3 space-y-2 list-disc list-inside">
            <li>
              <strong class="text-ink-50">匿名访问统计</strong>（PV/UV/停留时长），
              通过 Plausible 或 Umami 等<strong class="text-ink-50">隐私友好</strong>工具采集，
              不包含 IP 地址、不使用 Cookie 进行跨站追踪。
            </li>
            <li>
              <strong class="text-ink-50">必要的 Cookie</strong>：仅用于本地记忆您的偏好（如深色模式），
              不与任何第三方共享。
            </li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-medium text-ink-50 mb-4">测评功能</h2>
          <p>
            页面上的"AI 成熟度测评"是<strong class="text-ink-50">纯前端计算</strong>：
            您的所有答题数据仅保存在您浏览器的 localStorage 中，
            不会上传到我们的服务器。您随时可以清除浏览器数据来删除测评记录。
          </p>
        </section>

        <section>
          <h2 class="text-xl font-medium text-ink-50 mb-4">第三方服务</h2>
          <p>本网站嵌入以下第三方服务，<strong class="text-ink-50">均不涉及个人信息共享</strong>：</p>
          <ul class="mt-3 space-y-2 list-disc list-inside">
            <li>Vercel / Netlify —— 静态托管与 CDN（仅看到 IP，不收集身份信息）</li>
            <li>Plausible / Umami —— 隐私友好型访问统计</li>
            <li>字体与图标由 jsDelivr / cdnjs 提供</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-medium text-ink-50 mb-4">未成年人</h2>
          <p>本网站不面向未成年人。如您是未成年人，请在监护人陪同下阅读本政策。</p>
        </section>

        <section>
          <h2 class="text-xl font-medium text-ink-50 mb-4">政策变更</h2>
          <p>
            本政策可能随产品迭代更新，更新日期见页面顶部。
            由于我们不持有您的个人信息，<strong class="text-ink-50">无需也无法通知到您个人</strong>。
          </p>
        </section>

        <section>
          <h2 class="text-xl font-medium text-ink-50 mb-4">联系我们</h2>
          <p>如您对本隐私政策有疑问，可通过以下方式联系我们：</p>
          <p class="mt-3">邮箱：<code class="text-ink-50">westphalk907@gmail.com</code></p>
          <p class="mt-1">微信：<code class="text-ink-50">Do-core</code></p>
        </section>
      </div>

      <div class="mt-12 pt-8 border-t border-ink-800">
        <RouterLink to="/" class="text-gold-400 hover:text-gold-300 transition-colors">
          ← 返回首页
        </RouterLink>
      </div>
    </div>
  </article>
</template>