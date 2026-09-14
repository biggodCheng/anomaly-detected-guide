// formatHumanDate 直测:手动月名映射是全站日期渲染的唯一实现(19 个 topic 页
// + guides/bosses/monsters/regions 详情页),此前零覆盖 —— 变异实测把 'August'
// 改 'Agust' 全量绿,错误月名直达全站。月名拼写与索引在此钉死。
import { describe, expect, it } from 'vitest'
import { formatHumanDate } from './date'

describe('formatHumanDate', () => {
  it('12 个月名逐一钉死(月名 typo / 索引错位在此红)', () => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ]
    months.forEach((m, i) => {
      expect(formatHumanDate(`2026-${String(i + 1).padStart(2, '0')}-04`)).toBe(`${m} 4, 2026`)
    })
  })

  it('跨月/跨年边界与个位日无前导零', () => {
    expect(formatHumanDate('2026-12-31')).toBe('December 31, 2026')
    expect(formatHumanDate('2027-01-01')).toBe('January 1, 2027')
  })
})
