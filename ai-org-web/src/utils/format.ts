import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')

export function formatDate(date: string | Date | number, pattern = 'YYYY-MM-DD'): string {
  return dayjs(date).format(pattern)
}

export function formatDateZh(date: string | Date | number): string {
  return dayjs(date).format('YYYY 年 M 月 D 日')
}

export function formatNumber(n: number): string {
  if (n >= 10000) return (n / 10000).toFixed(1) + 'w'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return String(n)
}
