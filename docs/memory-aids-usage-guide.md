# 记忆口诀系统使用指南

## 概述

业余无线电C类考试记忆助手现已集成完整的记忆口诀系统，覆盖全部1282道题目。每道题都有精心设计的记忆口诀，帮助快速记忆关键知识点。

## 系统架构

```
记忆口诀系统
├── 数据层
│   ├── category1.ts - 第1类：无线电管理法规 (181条)
│   ├── category2.ts - 第2类：无线电技术基础 (325条)
│   ├── category3.ts - 第3类：发射机和接收机 (324条)
│   ├── category4.ts - 第4类：天线和馈线 (421条)
│   └── category5.ts - 第5类：安全防护 (31条)
│
├── 接口层
│   ├── index.ts - 汇总导出所有记忆口诀
│   └── memoryAidsByQuestionId.ts - 提供查询函数
│
└── 应用层
    └── dataService.ts - 加载题目时自动关联记忆口诀
```

## 使用方式

### 在代码中使用

#### 1. 导入记忆口诀查询函数

```typescript
import { getMemoryAidByQuestionId } from '@/services/memoryAidsByQuestionId'
```

#### 2. 根据题目ID获取记忆口诀

```typescript
// 单个题目查询
const aid = getMemoryAidByQuestionId('MC1-0001')
console.log(aid) // 输出：'行政法规条例院军委'

// 批量查询
const questionIds = ['MC1-0001', 'MC1-0003', 'MC1-0059']
const aids = questionIds.map(id => ({
  id,
  aid: getMemoryAidByQuestionId(id)
}))
```

#### 3. 获取所有记忆口诀

```typescript
import { allMemoryAids } from '@/services/memoryAids'

// 所有记忆口诀的键值对
console.log(Object.keys(allMemoryAids).length) // 1282

// 遍历所有记忆口诀
Object.entries(allMemoryAids).forEach(([id, aid]) => {
  console.log(`${id}: ${aid}`)
})
```

#### 4. 获取分类记忆口诀

```typescript
import {
  category1MemoryAids,
  category2MemoryAids,
  category3MemoryAids,
  category4MemoryAids,
  category5MemoryAids
} from '@/services/memoryAids'

// 仅获取第1类的记忆口诀
const cat1Aids = category1MemoryAids
console.log(Object.keys(cat1Aids).length) // 181
```

#### 5. 查看覆盖率统计

```typescript
import { memoryAidsStats } from '@/services/memoryAids'

console.log(memoryAidsStats)
// 输出：
// {
//   category1: 181,
//   category2: 325,
//   category3: 324,
//   category4: 421,
//   category5: 31,
//   total: 1282
// }
```

### 在组件中使用

#### Vue 3 Composition API

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { getMemoryAidByQuestionId } from '@/services/memoryAidsByQuestionId'
import type { Question } from '@/services/dataService'

const props = defineProps<{
  question: Question
}>()

// 获取当前题目的记忆口诀
const memoryAid = computed(() => {
  return getMemoryAidByQuestionId(props.question.id)
})
</script>

<template>
  <div class="question-card">
    <h3>{{ question.content }}</h3>

    <!-- 显示记忆口诀 -->
    <div v-if="memoryAid" class="memory-aid">
      <q-icon name="lightbulb" />
      <span>记忆口诀: {{ memoryAid }}</span>
    </div>

    <!-- 其他题目内容 -->
  </div>
</template>
```

### 自动集成

系统已经在 `dataService.ts` 中自动集成，加载题目时会自动关联记忆口诀：

```typescript
// dataService.ts (已自动处理)
const question: Question = {
  id: row.I,
  content: row.Q,
  options: [...],
  correctAnswer: correctAnswers.join(''),
  category,
  categoryName: categoryNames[category],
  // 自动关联记忆口诀
  memoryAid: getMemoryAidByQuestionId(row.I || '')
}
```

这意味着通过 `loadQuestions()` 或 `getQuestionsByCategory()` 获取的题目对象会自动包含 `memoryAid` 字段。

## 记忆口诀示例

### 第1类：无线电管理法规

| 题目ID | 记忆口诀 | 说明 |
|--------|----------|------|
| MC1-0003 | 监管两级制，国家加省级 | 监管机构 |
| MC1-0059 | A类新手30到3000兆，最多25瓦 | A类操作能力 |
| MC2-0154 | 擅用频率罚5万，拒不改正5到20（看到罚款选最大） | 处罚规定 |
| MC1-0176 | 次要业务规则1：不得对主要业务电台产生有害干扰 | 频率使用 |

### 第2类：无线电技术基础

| 题目ID | 记忆口诀 | 说明 |
|--------|----------|------|
| MC1-0232 | ITU三个区，中国在第三 | ITU分区 |
| MC2-0326 | Q简语三字母，Q开头后跟两字母 | Q简语 |
| MC2-0376 | 73祝你好（Best regards） | CW缩语 |
| MC2-0501 | 通联前先守听，确认频率无人用 | 通信礼仪 |

### 第3类：发射机和接收机

| 题目ID | 记忆口诀 | 说明 |
|--------|----------|------|
| MC1-0592 | 中继台收发共天线，双工器来隔离间 | 中继台 |
| MC1-0599 | NB抑噪切脉冲，SQL静噪关音频 | 噪声控制 |
| MC1-0625 | RIT接收增量调谐，微调接收不变发射 | RIT功能 |

### 第4类：天线和馈线

| 题目ID | 记忆口诀 | 说明 |
|--------|----------|------|
| MC1-0719 | 天驻线行（天线驻波，馈线行波） | 驻波与行波 |
| MC1-0721 | 半波偶极每边71.3除频率 | 天线长度 |
| MC1-0651 | dBi相对点源天线，理想全向作基准 | 天线增益 |

### 第5类：安全防护

| 题目ID | 记忆口诀 | 说明 |
|--------|----------|------|
| MC1-1345 | 设备指标看频杂（频率容限+杂散发射） | 设备指标 |
| MC1-1358 | 防雷三件套：接闪器（避雷针）引下线接地体 | 防雷措施 |
| MC1-1367 | 工频最危险HF其次UHF最安全 | 射频安全 |

## 记忆技巧

记忆口诀采用多种记忆技巧：

### 1. 数字强化

- **MC1-0059**: "A类新手**30到3000**兆，最多**25**瓦"
- **MC1-0721**: "半波偶极每边**71.3**除频率"

### 2. 对比记忆

- **MC1-0719**: "**天**驻**线**行（天线驻波，馈线行波）"
- **MC1-1367**: "工频**最危险**HF其次UHF**最安全**"

### 3. 谐音联想

- **扶贫乡** = 幅频相（AM/FM/PM）
- **秘书长** = MHz/kHz/GHz

### 4. 押韵顺口

- "看到罚款选最大（3w/5k），如遇拒不改正就选它"
- "电压并，电流串，完美组成电和磁"

### 5. 分类归纳

- "三用原则"：通信、研究、训练
- "五不原则"：不商业、不转信、不广播、不干扰、不加密

### 6. 关键词提取

- **MC1-0003**: "监管**两级**制，**国家加省级**"
- **MC2-0154**: "擅用频率罚**5万**，拒不改正**5到20**"

## 更新记忆口诀

如果需要修改或添加记忆口诀：

### 1. 编辑分类文件

找到对应的分类文件（如 `category1.ts`），直接修改：

```typescript
export const category1MemoryAids: Record<string, string> = {
  'MC1-0001': '行政法规条例院军委', // 修改这里
  'MC1-0002': '管理文件-管理办法工信部',
  // ...
}
```

### 2. 添加新题目

```typescript
export const category1MemoryAids: Record<string, string> = {
  // ... 现有口诀
  'MC1-0232': '新增的记忆口诀', // 添加新条目
}
```

### 3. 验证更改

运行验证脚本确保系统完整性：

```bash
node scripts/final-verification.js
```

## 常见问题

### Q1: 如何查看某个类别有多少记忆口诀？

```typescript
import { memoryAidsStats } from '@/services/memoryAids'
console.log(memoryAidsStats.category1) // 输出：181
```

### Q2: 如果题目没有记忆口诀会返回什么？

```typescript
const aid = getMemoryAidByQuestionId('NON_EXISTENT_ID')
console.log(aid) // 输出：'' (空字符串)
```

### Q3: 如何获取覆盖率？

```typescript
import { getMemoryAidsCoverage } from '@/services/memoryAidsByQuestionId'

const coverage = getMemoryAidsCoverage(1282)
console.log(coverage)
// 输出：
// {
//   covered: 1282,
//   total: 1282,
//   percentage: '100.00%'
// }
```

### Q4: 记忆口诀会影响性能吗？

不会。记忆口诀在编译时就被打包进JavaScript，运行时是简单的对象查找操作（O(1)时间复杂度），对性能影响可以忽略不计。

### Q5: 可以导出记忆口诀列表吗？

可以。使用 `allMemoryAids` 对象即可获取所有记忆口诀：

```typescript
import { allMemoryAids } from '@/services/memoryAids'

// 导出为JSON
const json = JSON.stringify(allMemoryAids, null, 2)
console.log(json)

// 导出为CSV
const csv = Object.entries(allMemoryAids)
  .map(([id, aid]) => `"${id}","${aid}"`)
  .join('\n')
console.log(csv)
```

## 性能优化

系统已经做了以下优化：

1. **模块化加载**：按需导入分类记忆口诀
2. **类型安全**：完整的TypeScript类型定义
3. **缓存机制**：题目加载后自动缓存
4. **树摇优化**：未使用的记忆口诀会被Vite自动删除

## 贡献指南

如果您想改进记忆口诀：

1. 编辑对应的 `category*.ts` 文件
2. 确保口诀简洁易记（10-20字）
3. 运行验证脚本确保语法正确
4. 提交Pull Request

## 相关文档

- [项目说明](../CLAUDE.md)
- [完成报告](./memory-aids-completion-report.md)
- [Remember.md](../Remember.md) - 记忆口诀风格参考

## 技术支持

如有问题，请：

1. 查看 [完成报告](./memory-aids-completion-report.md)
2. 运行验证脚本：`node scripts/final-verification.js`
3. 检查控制台错误信息

---

**版本**: 1.0.0
**更新时间**: 2025-10-15
**覆盖率**: 100% (1282/1282)
**状态**: ✅ 完整可用
