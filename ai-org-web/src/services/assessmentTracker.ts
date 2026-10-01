/**
 * Assessment Tracker · 测评前端埋点 + 本地历史
 * -----------------------------------------------------------------------------
 * 设计原则：0 后端依赖，所有数据落 localStorage。
 *
 * 记录事件：
 *  - assessment_started     : 用户进入测评页（第 1 次答题时触发）
 *  - assessment_completed   : 用户答完最后一题并查看结果
 *  - report_downloaded      : 用户点击"下载完整报告"
 *  - expert_consult_clicked : 用户点击"预约专家解读"
 *
 * 数据出口：
 *  - 控制台埋点  window.dataLayer.push（兼容 GTM）
 *  - 本地历史    localStorage.assessment_history（最多 50 条）
 *  - 自定义回调  调用方可注入 onEvent(event) 拿到原始事件
 */

const STORAGE_KEY = 'assessment_history'
const MAX_HISTORY = 50
const SESSION_KEY = 'assessment_session_id'

export interface AssessmentEvent {
  type:
    | 'assessment_started'
    | 'assessment_completed'
    | 'report_downloaded'
    | 'expert_consult_clicked'
  timestamp: string // ISO
  sessionId: string
  // 携带的上下文（按事件类型不同字段不同）
  stage?: string
  totalScore?: number
  topGaps?: string[]
  answersCount?: number
}

export interface AssessmentHistoryEntry extends AssessmentEvent {}

/* ----------------------------- Session ID ---------------------------------- */

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'server'
  let id = sessionStorage.getItem(SESSION_KEY)
  if (!id) {
    id = `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    sessionStorage.setItem(SESSION_KEY, id)
  }
  return id
}

/* ----------------------------- Storage I/O --------------------------------- */

function readHistory(): AssessmentHistoryEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AssessmentHistoryEntry[]) : []
  } catch {
    return []
  }
}

function writeHistory(entries: AssessmentHistoryEntry[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(-MAX_HISTORY)))
  } catch (e) {
    console.warn('[assessmentTracker] localStorage 写入失败:', e)
  }
}

function appendHistory(event: AssessmentEvent) {
  const entries = readHistory()
  entries.push(event)
  writeHistory(entries)
}

/* ----------------------------- DataLayer ----------------------------------- */

function pushDataLayer(event: AssessmentEvent) {
  if (typeof window === 'undefined') return
  // 兼容 GTM / GA4 dataLayer
  ;(window as unknown as { dataLayer: unknown[] }).dataLayer =
    (window as unknown as { dataLayer?: unknown[] }).dataLayer || []
  ;(window as unknown as { dataLayer: unknown[] }).dataLayer.push({
    event: event.type,
    assessment_session_id: event.sessionId,
    assessment_stage: event.stage,
    assessment_score: event.totalScore,
    assessment_top_gaps: event.topGaps?.join(','),
    assessment_answers_count: event.answersCount,
    assessment_timestamp: event.timestamp
  })
}

/* ----------------------------- Public API ---------------------------------- */

type EventListener = (event: AssessmentEvent) => void
const listeners: EventListener[] = []

export function onAssessmentEvent(listener: EventListener) {
  listeners.push(listener)
  return () => {
    const i = listeners.indexOf(listener)
    if (i >= 0) listeners.splice(i, 1)
  }
}

function emit(event: AssessmentEvent) {
  appendHistory(event)
  pushDataLayer(event)
  if (typeof console !== 'undefined') {
    console.info('[assessmentTracker]', event.type, {
      stage: event.stage,
      score: event.totalScore,
      gaps: event.topGaps
    })
  }
  listeners.forEach((l) => {
    try {
      l(event)
    } catch (e) {
      console.warn('[assessmentTracker] listener error:', e)
    }
  })
}

/* --------------------------- Convenience Helpers --------------------------- */

export function trackAssessmentStarted(answersCount: number) {
  emit({
    type: 'assessment_started',
    timestamp: new Date().toISOString(),
    sessionId: getOrCreateSessionId(),
    answersCount
  })
}

export function trackAssessmentCompleted(params: {
  stage: string
  totalScore: number
  topGaps: string[]
  answersCount: number
}) {
  emit({
    type: 'assessment_completed',
    timestamp: new Date().toISOString(),
    sessionId: getOrCreateSessionId(),
    ...params
  })
}

export function trackReportDownloaded(params: {
  stage: string
  totalScore: number
  topGaps: string[]
}) {
  emit({
    type: 'report_downloaded',
    timestamp: new Date().toISOString(),
    sessionId: getOrCreateSessionId(),
    ...params
  })
}

export function trackExpertConsultClicked(params: {
  stage: string
  totalScore: number
}) {
  emit({
    type: 'expert_consult_clicked',
    timestamp: new Date().toISOString(),
    sessionId: getOrCreateSessionId(),
    ...params
  })
}

/* ----------------------------- Admin Helpers ------------------------------- */

/** 读取全部历史（管理后台用） */
export function getAssessmentHistory(): AssessmentHistoryEntry[] {
  return readHistory()
}

/** 导出 CSV（管理后台用） */
export function exportAssessmentHistoryCSV(): string {
  const entries = readHistory()
  const header = [
    'timestamp',
    'type',
    'session_id',
    'stage',
    'total_score',
    'top_gaps',
    'answers_count'
  ].join(',')
  const rows = entries.map((e) =>
    [
      e.timestamp,
      e.type,
      e.sessionId,
      e.stage || '',
      e.totalScore ?? '',
      (e.topGaps || []).join('|'),
      e.answersCount ?? ''
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(',')
  )
  return [header, ...rows].join('\n')
}

/** 清空历史（仅调试） */
export function clearAssessmentHistory() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}
