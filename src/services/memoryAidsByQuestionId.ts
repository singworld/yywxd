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
// 导入所有分类的记忆口诀
import { allMemoryAids } from './memoryAids'

/**
 * 记忆口诀映射表
 *
 * 所有1283题的记忆口诀已按分类组织在 memoryAids/ 目录中：
 * - category1.ts: 第1类 无线电管理法规 (181题)
 * - category2.ts: 第2类 无线电技术基础 (325题)
 * - category3.ts: 第3类 发射机和接收机 (324题)
 * - category4.ts: 第4类 天线和馈线 (421题)
 * - category5.ts: 第5类 安全防护 (31题)
 */
export const memoryAidsMap: Record<string, string> = allMemoryAids

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
