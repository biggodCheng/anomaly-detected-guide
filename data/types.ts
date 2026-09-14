// 共享内容类型 —— topic 页引擎与 guides 引擎的通用内容区块契约。
// 此前 TopicSection/TopicData 在多个 topic 域复制粘贴定义,
// GuideSection(guides)与 TopicSection 同构 —— 统一到 ContentSection 一处。

/** 通用内容区块:标题 + 可选正文/列表/表格/提示,渲染顺序即数组顺序 */
export type ContentSection = {
  heading: string
  body?: string
  items?: string[]
  table?: { headers: string[]; rows: string[][] }
  tip?: string
}

/** topic 页数据:{sections} — economy/equipment 等通用攻略页的形状 */
export type TopicData = {
  sections: ContentSection[]
}

