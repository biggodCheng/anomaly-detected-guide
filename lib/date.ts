// 共享日期格式化工具 —— 全站唯一实现,统一 "August 29, 2026" 风格。
// 手动月名映射而非 toLocaleDateString:静态构建要确定性输出 —— date-only ISO
// 被 new Date() 按 UTC 零点解析,tuple 渲染依赖构建机时区,UTC 以西的机器上
// 全站日期会比数据早一天(实测 America/New_York 少一天)。
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export function formatHumanDate(iso: string): string {
  const parts = iso.split('-').map(Number)
  const y = parts[0]
  const m = parts[1]
  const d = parts[2]
  // 防御性校验:坏数据(空串/格式错误)不渲染 "undefined NaN, NaN" 到页面,
  // 而是返回空串让调用方处理。数据文件的日期由 tests 守护,这里是兜底。
  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d) || m < 1 || m > 12) {
    return ''
  }
  return `${MONTHS[m - 1]} ${d}, ${y}`
}
