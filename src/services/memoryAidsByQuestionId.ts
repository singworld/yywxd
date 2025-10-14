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

  // 1.1.1 行政法规与管理文件
  'LY0001': '行政法规条例院军委',
  'LY0002': '管理办法工信部',
  'LY0004': '监管两级制，国家加省级',
  'LK0007': '术语定义看频率划分规定',
  'LX': '新办法2024年3月1日生效',

  // 1.1.2 频率管理术语
  'LY0113': '划分：规定频段供业务用',
  'LY0114': '分配：规定部门区域用',
  'LY0115': '指配：批准电台使用频率',
  'LK0140': '频段划分分主次业务',
  'LK0125': '辐射=任何源发波，连闪电也算',
  'LK0126': '发射=发信机产波，杂散产物也算',

  // ========== 2. 无线电技术基础类 ==========
  // 'LY0XXX': '记忆口诀内容',

  // ========== 3. 发射机和接收机类 ==========
  // 'LY0XXX': '记忆口诀内容',

  // ========== 4. 天线和馈线类 ==========
  // 'LY0XXX': '记忆口诀内容',

  // ========== 5. 安全防护类 ==========
  // 'LY0XXX': '记忆口诀内容',

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
