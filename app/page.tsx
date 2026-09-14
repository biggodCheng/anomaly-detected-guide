import { redirect } from 'next/navigation'
import { routing } from '@/i18n/routing'

// dev 下根路径重定向到默认语言 —— 静态导出的"默认语言无前缀"由 promote 脚本
// 在构建期落地(out/index.html 会被默认语言真首页覆盖),本文件只服务 dev。
export default function RootPage() {
  redirect(`/${routing.defaultLocale}`)
}
