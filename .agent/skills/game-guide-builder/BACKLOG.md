# game-guide-builder 技能迭代任务清单

> 来源：dumbwaystobuild.site 建站全流程复盘（2026-09-12，Phase 1-12 全跑通）
> 维护规则：任务优化完成后直接从本清单删除（编号不复用；落地与验收记录以 SKILL.md 正文 + git 历史为准）
> 完成任务后 bump SKILL.md frontmatter version。

---

## 一、踩坑复盘（按阶段）

### 已在 SKILL.md 沉淀的（不重复列任务）

| 阶段 | 坑 | 沉淀位置 |
|------|----|---------|
| P3/P5 | 重写 en.json 丢叶子 key；data 丢导出 TS2724；单机 multiplayer 口径 7 处；小写盘符 | 失败处理表 |
| P10 | Steam 商店页 JS 渲染 → appdetails API；Read 本地图片返 CDN URL → 视觉模型链路；.tmp-img 项目内相对路径（/tmp ENOENT） | 10.1/10.2 正文 |
| P11 | source.type="git" 报 8000046；www 522；rulesets 10405 | 失败处理表 + 11.3 Step 2.5（本轮新增） |
| P12 | PUT 411；indexStatusResult 字段名；多行 JSON sed 提取空 | 失败处理表 + Step 5 注（本轮新增） |

### 遗漏的坑 → 任务化

（暂无——全部已沉淀进 SKILL.md 失败处理表）

---

## 二、冗余处理复盘

| 观察 | 结论 |
|------|------|
| Phase 7/8/9 三份审计文档（AI_SEO + 36×AUDIT + PHASE8_SUMMARY + PHASE9 深审） | 分工递进合理，**保留**；成本大头在 36 份逐页文档 → 生成器固化后消失 |
| 一次性脚本（AUDIT 生成器 / 候选对比表 sharp 脚本）每站现写 | 已解决：AUDIT 生成器固化为 `scripts/generate-audit-docs.mjs`，候选对比脚本内联进 SKILL.md 10.2.5 |
| 记忆 vs 技能双写（cloudflare-pages-deploy / gsc-setup-automation ↔ SKILL.md P11/P12） | 已明确分工：坑→SKILL.md、凭据→记忆（SKILL.md「沉淀分工」节 + 两记忆文件头指针，2026-09-13） |
| og 变更 → avif 重跑（派生链红线正确） | 流程缺陷不在派生链而在"未定稿先生成" → 已由 10.2.5 候选对比定稿关口解决 |
| audit_rules.js 逐页 36 次 + 生成器再读一遍 HTML | 幅度小，生成器顺手吸收脚本对照，不单独立任务 |

---

## 三、迭代任务（按优先级）

### P1 — 下站开工前必须解决

- [ ] **任务 11：本地目录错位决策（回流同步已完成 2026-09-13）**
  模板仓已回流至最新：generate-audit-docs.mjs / 换皮SOP 红线 / SKILL.md 2.2 / BACKLOG.md 四文件已 push 进 game-guide-template；wrangler.toml 站名特定不回流。
  遗留决策：本地目录 game-guide-template 内容是 dumbways 站——保持现状（错位仅记档）或改名 dumbways-guide 后把模板仓 clone 回本地该名下（影响 VSCode 工作区与 memory 路径，需权衡）。

### P2 — 锦上添花 / 跨技能改动

- [ ] **任务 9：gsc_config 补一键 setup 脚本（跨技能，需确认）**
  问题：Phase 12 五步手动 curl+node，坑（411/字段名/多行 JSON）全靠失败表兜。
  方案：marketingskills 仓加 `gsc-setup.mjs <域名>`：getToken → CF TXT → verify → add sc-domain → submit sitemap → 单页 inspect 基线，一步一校验。涉及外部技能仓，动前征得同意。

### P3 — 记录暂不做

- 36 份 AUDIT.md 产出形态压缩（生成器落地后成本已低，观察两站再议）
- og jpg 体积观察项（dumbways 209KB，无契约上限，暂不加门禁）
- audit_rules.js 上游修 H1 正则（第三方技能资源，不动上游，靠复核层兜底）
