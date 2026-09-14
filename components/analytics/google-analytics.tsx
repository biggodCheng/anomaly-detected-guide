import Script from 'next/script'
import { siteConfig } from '@/lib/site'

export function GoogleAnalytics() {
  // env 优先(部署平台可覆盖),config 兜底(Vercel 导入即生效)
  const gaId = process.env.NEXT_PUBLIC_GA_ID ?? siteConfig.gaId
  if (!gaId) return null

  return (
    <>
      {/* lazyOnload:GA 移出首屏带宽竞争。实测(next 15.5 静态导出 + afterInteractive):
          head 会生成 <link rel="preload" as="script"> 指向 googletagmanager,与 LCP
          图/字体争低速网络;script 本体不在静态 HTML 里,靠水合后注入。
          已知权衡:丢 load 前的早期事件——Cyberpunk 站曾因 lazyOnload 丢 42% 点击
          (GSC 33 vs GA4 19,单点数据)改回 afterInteractive。重数据覆盖的换皮站可
          自行权衡。 */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="lazyOnload"
      />
      <Script id="gtag-init" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  )
}
