/**
 * 社交媒体二维码配置
 * -----------------------------------------------------------------------------
 * 占位阶段：src 留空，前端会显示 SVG 占位
 * 真实二维码：上传图片到 /public/qr/，把 src 改为相对路径即可
 *
 * 上传图片规范：
 *  - 公众号：240×240 PNG，主体居中，四周留白 12%
 *  - 抖音号：200×200 PNG
 *  - 小红书：200×200 PNG
 *  - 文件名固定：public-qr.png / douyin-qr.png / xhs-qr.png
 */
export interface SocialQrItem {
  id: 'public' | 'douyin' | 'xhs'
  zhName: string
  enName: string
  tagline: string
  src: string // 占位时留空
  /** 点击跳转链接（占位或无图片时使用） */
  link: string
  /** 占位 SVG 用色 */
  accent: string
}

export const SOCIAL_QR_LIST: SocialQrItem[] = [
  {
    id: 'public',
    zhName: 'AI时代组织进化论',
    enName: 'WeChat 公众号',
    tagline: '每周三篇 · 趋势 · 观点 · 实践',
    src: '/qr/public-qr.png',
    // 没图时点击跳转微信搜一搜，让用户搜账号名后关注
    link: 'weixin://search/user?keyword=AI%E6%97%B6%E4%BB%A3%E7%BB%84%E7%BB%87%E8%BF%9B%E5%8C%96%E8%AE%BA',
    accent: '#C9A961'
  },
  {
    id: 'douyin',
    zhName: '道可乾元',
    enName: 'Douyin 抖音号',
    tagline: '个体+组织 AI 转型问题',
    src: '/qr/douyin-qr.png',
    link: '#',
    accent: '#FF2C55'
  },
  {
    id: 'xhs',
    zhName: 'Do Core',
    enName: '小红书账号',
    tagline: '组织 AI 化的真实案例拆解',
    src: '/qr/xhs-qr.png',
    link: '#',
    accent: '#FE2C55'
  }
]
