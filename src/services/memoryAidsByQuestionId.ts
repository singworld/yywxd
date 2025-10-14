/**
 * 基于题号的记忆口诀系统
 * 直接映射：题号 → 记忆口诀
 *
 * 使用方法：
 * - 你说题号（如 LY0001），我就知道是哪题
 * - 不使用正则匹配，精确对应
 * - 方便协作修改
 */

export interface QuestionMemoryAid {
  questionId: string  // 题号，如 LY0001
  aid: string         // 记忆口诀
  note?: string       // 备注（可选）
}

/**
 * 记忆口诀映射表
 * 按分类组织，方便查找和维护
 */
export const memoryAidsMap: Record<string, string> = {
  // ========== 1. 无线电管理法规类 ==========

  // 1.1.1 行政法规与管理文件（使用 I 列内部ID）
  'MC2-0001': '行政法规条例院军委',
  'MC2-0002': '管理文件-管理办法工信部',
  'MC1-0003': '监管两级制，国家加省级',
  'MC1-0004': '业余术语频率划分规定',
  'MC1-0005': '新办法2024年3月1日生效',

  // 1.1.2 频率管理术语（关键字记忆法）
  'MC1-0006': '划分→划分',
  'MC1-0007': '指定→分配',
  'MC1-0008': '批准→指配',
  'MC1-0009': '频段划分分主次业务',
  'MC1-0010': '辐射=任何源发波，连闪电也算',
  'MC1-0011': '发射=发信机产波，杂散产物也算',

  // 1.1.2 无线电术语定义（第12-21题）
  'MC4-0012': '测定导航定位测向，全选',
  'MC1-0013': '一台可多机',
  'MC1-0014': '训练通信加研究，不跨业务',
  'MC2-0015': '批准爱好不营利',
  'MC1-0016': '发射类别标准符号示',
  'MC1-0017': '单边带=一边调幅',
  'MC3-0018': '无用能量干扰收',
  'MC2-0019': '有害干扰害安全业务',
  'MC3-0020': '次要让主要，不求保护',
  'MC1-0021': 'ITU协调国际无线电',

  // ========== 2. 无线电技术基础类 ==========
  // 'MC1-XXXX': '记忆口诀内容',

  // ========== 3. 发射机和接收机类 ==========
  // 'MC1-XXXX': '记忆口诀内容',

  // ========== 4. 天线和馈线类 ==========
  // 'MC1-XXXX': '记忆口诀内容',

  // ========== 5. 安全防护类 ==========
  // 'MC1-XXXX': '记忆口诀内容',

}

/**
 * 根据题号获取记忆口诀
 * @param questionId 题号（如 LY0001）
 * @returns 记忆口诀，如果没有则返回空字符串
 */
export function getMemoryAidByQuestionId(questionId: string): string {
  return memoryAidsMap[questionId] || ''
}

/**
 * 批量添加记忆口诀
 * @param aids 记忆口诀数组
 */
export function addMemoryAids(aids: QuestionMemoryAid[]): void {
  aids.forEach(({ questionId, aid }) => {
    memoryAidsMap[questionId] = aid
  })
}

/**
 * 获取所有已配置记忆口诀的题号列表
 */
export function getAllQuestionIdsWithAids(): string[] {
  return Object.keys(memoryAidsMap)
}

/**
 * 统计记忆口诀覆盖率
 * @param totalQuestions 总题数
 */
export function getMemoryAidsCoverage(totalQuestions: number): {
  covered: number
  total: number
  percentage: string
} {
  const covered = Object.keys(memoryAidsMap).length
  return {
    covered,
    total: totalQuestions,
    percentage: ((covered / totalQuestions) * 100).toFixed(2) + '%'
  }
}
