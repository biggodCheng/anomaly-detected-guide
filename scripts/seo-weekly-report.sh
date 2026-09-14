#!/usr/bin/env bash
# SEO 周报数据管道 — 一键拉取 GSC + GA4 数据生成 Markdown 数据报告
#
# 与 .claude/skills/seo-report/SKILL.md 配对:本脚本只做确定性的数据搬运(可 cron、零 token),
# 洞察诊断(P0/P1/P2 + 健康度评分 + OKR)由 seo-report skill 在报告上追加。
#
# 站点无关设计:域名从 config/site.config.json 的 url 提取,GA4 Property 从
# gsc_config/.env.ga4 读取 —— 换皮后无需改本脚本。均可被环境变量覆盖:
#   GSC_SITE      GSC 资源标识(默认 sc-domain:<config 域名>)
#   GA4_PROPERTY  GA4 Data API property ID
#   GSC_PROXY     代理地址(默认 http://127.0.0.1:7897)
#
# 用法(从项目根):
#   bash scripts/seo-weekly-report.sh              # 最近 7 天(截止昨天)
#   bash scripts/seo-weekly-report.sh 2026-09-06   # 指定结束日往前推 7 天
#
# 依赖: .claude/skills/marketingskills-main/gsc_config/(gsc.sh + ga4.sh + .env.*)
# 输出: docs/seo-report-YYYYMMDD.md
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
GSC_DIR="$PROJECT_ROOT/.claude/skills/marketingskills-main/gsc_config"
PROXY="${GSC_PROXY:-http://127.0.0.1:7897}"

# ─── 站点配置(从 config/site.config.json 读,换皮自动跟随) ───
cd "$PROJECT_ROOT"
SITE_URL=$(node -p "require('./config/site.config.json').url")
SITE_HOST=$(node -p "new URL(require('./config/site.config.json').url).host")
SITE="${GSC_SITE:-sc-domain:$SITE_HOST}"
# 不用 grep -P:本机 Git Bash 在 GBK locale 下 -P 直接报错(2026-09-14 实测),grep|cut 全兼容
GA4_PROPERTY="${GA4_PROPERTY:-$(grep '^GA4_PROPERTY=' "$GSC_DIR/.env.ga4" | head -1 | cut -d= -f2- | tr -d '"\r')}"
if [ -z "$GA4_PROPERTY" ]; then
  echo "❌ 未配置 GA4_PROPERTY:$GSC_DIR/.env.ga4 缺该字段,或用 GA4_PROPERTY 环境变量传入" >&2
  exit 1
fi

# ─── 日期范围: 默认最近 7 天(结束 = 昨天,GA4/GSC 当天数据均不完整) ───
if [ -n "${1:-}" ]; then
  END="$1"
else
  END=$(date -d '1 day ago' +%F)
fi
START=$(date -d "$END - 6 days" +%F)
PREV_END=$(date -d "$START - 1 day" +%F)
PREV_START=$(date -d "$PREV_END - 6 days" +%F)
REPORT="$PROJECT_ROOT/docs/seo-report-$(echo "$END" | tr -d '-').md"

echo "📊 生成 SEO 周报: $START → $END" >&2
echo "   站点: $SITE ($SITE_URL)" >&2
echo "   GA4 Property: $GA4_PROPERTY" >&2

# 非法/空/非 JSON 输出一律降级为空行集 —— 防 node 内联脚本语法崩
# (代理挂了 curl 输出空、API 返回 HTML 错误页等场景)
safe_json() {
  printf '%s' "${1:-}" | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{try{const j=JSON.parse(s);if(typeof j!=='object'||!j)throw 0;console.log(JSON.stringify(j))}catch(e){console.log('{\"rows\":[]}')}})"
}

# GA4 Data API 查询; $1=dimensions JSON $2=metrics JSON $3=body 附加段(以 , 开头,可空,勿带收尾})
# 响应含 "error" 时 stderr 报警并降级空行集 —— 防止 body 构造错误静默变空表
ga4_query() {
  set -a; . <(tr -d '\r' < "$GSC_DIR/.env.ga4.access" 2>/dev/null); set +a
  local body="{\"dateRanges\":[{\"startDate\":\"$START\",\"endDate\":\"$END\"}],\"dimensions\":$1,\"metrics\":$2$3}"
  local resp
  resp=$(curl -s --max-time 60 --proxy "$PROXY" -X POST \
    -H "Authorization: Bearer ${GA4_ACCESS_TOKEN:-}" -H "Content-Type: application/json" \
    "https://analyticsdata.googleapis.com/v1beta/properties/$GA4_PROPERTY:runReport" \
    -d "$body" || true)
  if printf '%s' "$resp" | grep -q '"error"'; then
    echo "⚠️ GA4 查询失败($1): $(printf '%s' "$resp" | head -c 200)" >&2
    echo '{"rows":[]}'
  else
    printf '%s' "$resp"
  fi
}

# ─── GSC 数据(gsc.sh 自带 token 刷新 + 代理 + JSON 校验) ───
echo "⏳ 拉取 GSC 数据..." >&2
export GSC_SITE="$SITE"
GSC_QUERIES=$(safe_json "$(bash "$GSC_DIR/gsc.sh" query 100 "$START" "$END" 2>/dev/null || true)")
GSC_PAGES=$(safe_json "$(bash "$GSC_DIR/gsc.sh" pages 50 "$START" "$END" 2>/dev/null || true)")
GSC_COUNTRIES=$(safe_json "$(bash "$GSC_DIR/gsc.sh" countries 25 "$START" "$END" 2>/dev/null || true)")
GSC_QUERIES_PREV=$(safe_json "$(bash "$GSC_DIR/gsc.sh" query 100 "$PREV_START" "$PREV_END" 2>/dev/null || true)")

# ─── GA4 数据(先刷新 token,失败沿用缓存 token,过期则各查询降级空表) ───
echo "⏳ 拉取 GA4 数据..." >&2
( cd "$GSC_DIR" && bash ga4.sh refresh quiet ) >/dev/null 2>&1 \
  || echo "⚠️ GA4 token 刷新失败,沿用缓存 token(过期则 GA4 段降级为空表)" >&2

GA4_DAILY=$(safe_json "$(ga4_query '[{"name":"date"}]' '[{"name":"sessions"},{"name":"totalUsers"},{"name":"screenPageViews"}]' ', "orderBys":[{"dimension":{"dimensionName":"date"},"desc":false}]')")
GA4_SOURCES=$(safe_json "$(ga4_query '[{"name":"sessionSource"},{"name":"sessionMedium"}]' '[{"name":"sessions"},{"name":"totalUsers"}]' '')")
GA4_DEVICES=$(safe_json "$(ga4_query '[{"name":"deviceCategory"}]' '[{"name":"sessions"},{"name":"totalUsers"},{"name":"screenPageViews"}]' '')")
GA4_COUNTRIES=$(safe_json "$(ga4_query '[{"name":"country"}]' '[{"name":"sessions"},{"name":"totalUsers"},{"name":"screenPageViews"}]' '')")
GA4_PAGES=$(safe_json "$(ga4_query '[{"name":"pagePath"},{"name":"pageTitle"}]' '[{"name":"screenPageViews"},{"name":"sessions"}]' ', "orderBys":[{"metric":{"metricName":"screenPageViews"},"desc":true}], "limit":20')")

# ─── 汇总生成 Markdown ───
echo "⏳ 生成报告..." >&2

node -e "
const gscQ = $GSC_QUERIES;
const gscP = $GSC_PAGES;
const gscC = $GSC_COUNTRIES;
const gscQPrev = $GSC_QUERIES_PREV;
const ga4D = $GA4_DAILY;
const ga4S = $GA4_SOURCES;
const ga4Dev = $GA4_DEVICES;
const ga4C = $GA4_COUNTRIES;
const ga4P = $GA4_PAGES;

const SITE_URL = '$SITE_URL';
const stripHost = s => s.replace(/^https?:\/\/[^\/]+/, '');

// GSC 汇总
const gscRows = gscQ.rows||[];
const gscTotalClicks = gscRows.reduce((s,r)=>s+r.clicks,0);
const gscTotalImpr = gscRows.reduce((s,r)=>s+r.impressions,0);
const gscAvgCtr = gscTotalImpr ? (gscTotalClicks/gscTotalImpr*100).toFixed(1) : '0';
const gscAvgPos = gscRows.length ? (gscRows.reduce((s,r)=>s+r.position*(r.impressions||1),0)/Math.max(gscTotalImpr,1)).toFixed(1) : '—';

const prevClicks = (gscQPrev.rows||[]).reduce((s,r)=>s+r.clicks,0);
const prevImpr = (gscQPrev.rows||[]).reduce((s,r)=>s+r.impressions,0);
const clickDelta = prevClicks > 0 ? ((gscTotalClicks-prevClicks)/prevClicks*100).toFixed(0) : (gscTotalClicks > 0 ? '新增' : '0');
const imprDelta = prevImpr > 0 ? ((gscTotalImpr-prevImpr)/prevImpr*100).toFixed(0) : (gscTotalImpr > 0 ? '新增' : '0');

// GA4 汇总
const ga4Rows = ga4D.rows||[];
const ga4Sessions = ga4Rows.reduce((s,r)=>s+Number(r.metricValues[0].value),0);
const ga4Users = ga4Rows.reduce((s,r)=>s+Number(r.metricValues[1].value),0);
const ga4PV = ga4Rows.reduce((s,r)=>s+Number(r.metricValues[2].value),0);

const gscEmpty = gscRows.length === 0 && (gscP.rows||[]).length === 0;
const ga4Empty = ga4Rows.length === 0 && (ga4S.rows||[]).length === 0;

let md = '';
md += '# SEO 周报: $START → $END\n\n';
md += '> 站点: $SITE_URL | 生成时间: ' + new Date().toISOString().split('T')[0] + '\n\n';
md += '---\n\n';
md += '## 核心指标\n\n';
if (gscEmpty) md += '> ⚠️ GSC 无数据 —— 资源未验证/未收录/凭据问题。排查: bash .claude/skills/marketingskills-main/gsc_config/gsc.sh sites\n\n';
if (ga4Empty) md += '> ⚠️ GA4 无数据 —— token 过期/property 不符/追踪未部署。排查: bash .claude/skills/marketingskills-main/gsc_config/ga4.sh accounts\n\n';
md += '| 指标 | 本周 | 上周 | 环比 |\n|------|------|------|------|\n';
md += '| GSC 点击 | ' + gscTotalClicks + ' | ' + prevClicks + ' | ' + clickDelta + '% |\n';
md += '| GSC 展示 | ' + gscTotalImpr + ' | ' + prevImpr + ' | ' + imprDelta + '% |\n';
md += '| GSC 平均 CTR | ' + gscAvgCtr + '% | — | — |\n';
md += '| GSC 平均排名 | ' + gscAvgPos + ' | — | — |\n';
md += '| GA4 会话 | ' + ga4Sessions + ' | — | — |\n';
md += '| GA4 用户 | ' + ga4Users + ' | — | — |\n';
md += '| GA4 页面浏览 | ' + ga4PV + ' | — | — |\n';

md += '\n## Top 关键词 (GSC)\n\n';
md += '| 关键词 | 点击 | 展示 | CTR | 排名 |\n|--------|------|------|-----|------|\n';
gscRows.slice(0,20).forEach(r => {
  md += '| ' + r.keys[0] + ' | ' + r.clicks + ' | ' + r.impressions + ' | ' + (r.ctr*100).toFixed(1) + '% | ' + r.position.toFixed(1) + ' |\n';
});

md += '\n## Top 页面 (GSC)\n\n';
md += '| 页面 | 点击 | 展示 | CTR | 排名 |\n|------|------|------|-----|------|\n';
(gscP.rows||[]).slice(0,15).forEach(r => {
  md += '| ' + (stripHost(r.keys[0]) || '/') + ' | ' + r.clicks + ' | ' + r.impressions + ' | ' + (r.ctr*100).toFixed(1) + '% | ' + r.position.toFixed(1) + ' |\n';
});

md += '\n## 流量来源 (GA4)\n\n';
md += '| 来源 | 媒介 | 会话 | 用户 |\n|------|------|------|------|\n';
(ga4S.rows||[]).forEach(r => {
  md += '| ' + r.dimensionValues[0].value + ' | ' + r.dimensionValues[1].value + ' | ' + r.metricValues[0].value + ' | ' + r.metricValues[1].value + ' |\n';
});

md += '\n## 设备分布 (GA4)\n\n';
md += '| 设备 | 会话 | 用户 | 页面浏览 |\n|------|------|------|----------|\n';
(ga4Dev.rows||[]).forEach(r => {
  md += '| ' + r.dimensionValues[0].value + ' | ' + r.metricValues[0].value + ' | ' + r.metricValues[1].value + ' | ' + r.metricValues[2].value + ' |\n';
});

md += '\n## 每日趋势 (GA4)\n\n';
md += '| 日期 | 会话 | 用户 | 页面浏览 |\n|------|------|------|----------|\n';
ga4Rows.forEach(r => {
  const d = r.dimensionValues[0].value;
  md += '| ' + d.slice(0,4)+'-'+d.slice(4,6)+'-'+d.slice(6) + ' | ' + r.metricValues[0].value + ' | ' + r.metricValues[1].value + ' | ' + r.metricValues[2].value + ' |\n';
});

md += '\n## 地域分布 (GSC)\n\n';
md += '| 国家 | 点击 | 展示 | CTR | 排名 |\n|------|------|------|-----|------|\n';
(gscC.rows||[]).slice(0,15).forEach(r => {
  md += '| ' + r.keys[0].toUpperCase() + ' | ' + r.clicks + ' | ' + r.impressions + ' | ' + (r.ctr*100).toFixed(1) + '% | ' + r.position.toFixed(1) + ' |\n';
});

md += '\n## 热门页面 (GA4)\n\n';
md += '| 页面 | 标题 | 浏览量 | 会话 |\n|------|------|--------|------|\n';
(ga4P.rows||[]).forEach(r => {
  md += '| ' + r.dimensionValues[0].value + ' | ' + (r.dimensionValues[1].value||'').slice(0,40) + ' | ' + r.metricValues[0].value + ' | ' + r.metricValues[1].value + ' |\n';
});

md += '\n---\n\n<!-- 洞察分界线:seo-report skill 在此之前追加诊断/评分/OKR -->\n';
md += '*数据报告由 scripts/seo-weekly-report.sh 自动生成*\n';
console.log(md);
" > "$REPORT"

echo "✅ 报告已生成: $REPORT" >&2
echo "" >&2
echo "💡 下一步: 用 seo-report skill(或让 Claude 读报告)补充洞察诊断和行动建议" >&2
