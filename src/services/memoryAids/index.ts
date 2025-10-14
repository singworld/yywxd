/**
 * 记忆口诀索引文件
 * 汇总所有5个分类的记忆口诀
 */

import { category1MemoryAids } from './category1'
import { category2MemoryAids } from './category2'
import { category3MemoryAids } from './category3'
import { category4MemoryAids } from './category4'
import { category5MemoryAids } from './category5'

/**
 * 合并所有分类的记忆口诀
 */
export const allMemoryAids: Record<string, string> = {
  ...category1MemoryAids,
  ...category2MemoryAids,
  ...category3MemoryAids,
  ...category4MemoryAids,
  ...category5MemoryAids,
}

/**
 * 按分类导出
 */
export {
  category1MemoryAids,
  category2MemoryAids,
  category3MemoryAids,
  category4MemoryAids,
  category5MemoryAids,
}

/**
 * 统计信息
 */
export const memoryAidsStats = {
  category1: Object.keys(category1MemoryAids).length,
  category2: Object.keys(category2MemoryAids).length,
  category3: Object.keys(category3MemoryAids).length,
  category4: Object.keys(category4MemoryAids).length,
  category5: Object.keys(category5MemoryAids).length,
  total: Object.keys(allMemoryAids).length,
}
