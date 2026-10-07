<template>
  <section class="ai-tools-disclaimer">
    <h3>⚠️ 免责声明</h3>
    <ul>
      <li v-for="(item, i) in items" :key="i">{{ item }}</li>
    </ul>
    <p class="copyright">© {{ year }} DoCore - AI 工具导航与信息整理平台</p>
  </section>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
const items = [
  '本站仅收录 AI 工具官网链接，不提供第三方 AI 服务本身',
  '本站不构成对所列工具的推荐、保证或代言，仅作信息整理与索引',
  '本站不提供跨境网络服务，海外工具的可用性、合规性与法律责任由用户自行评估',
  '工具的服务、功能、价格、可用地区及使用规则均以对应官方网站最新信息为准',
  '本站与所列工具的运营方无任何隶属、代理或合作关系',
  '访问任何第三方工具时，请阅读并遵守该工具自身的用户协议与隐私政策',
  '用户使用任何工具产生的一切后果由用户本人承担',
]
</script>

<style scoped>
.ai-tools-disclaimer {
  margin-top: 48px;
  padding: 24px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 13px;
  color: #64748b;
}

.ai-tools-disclaimer h3 {
  font-size: 16px;
  color: #1e293b;
  margin: 0 0 12px;
  font-weight: 600;
}

.ai-tools-disclaimer ul {
  margin: 0 0 12px;
  padding-left: 20px;
}

.ai-tools-disclaimer li {
  margin-bottom: 4px;
  line-height: 1.6;
}

.copyright {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e2e8f0;
  text-align: center;
  color: #94a3b8;
  font-size: 12px;
}
</style>