# 记忆口诀系统说明

## 📁 文件结构

```
src/services/
├── memoryAidsByQuestionId.ts  # 主文件（导入并导出所有口诀）
└── memoryAids/                # 记忆口诀目录
    ├── index.ts               # 索引文件（汇总所有分类）
    ├── category1.ts           # 第1类：无线电管理法规 (181题)
    ├── category2.ts           # 第2类：无线电技术基础 (325题)
    ├── category3.ts           # 第3类：发射机和接收机 (324题)
    ├── category4.ts           # 第4类：天线和馈线 (421题)
    └── category5.ts           # 第5类：安全防护 (31题)
```

## ✅ 当前状态

### 已完成的工作

1. **✅ 第1类（181题）完整口诀已写入** `category1.ts`
   - 包含：法规、执照、ABC类操作能力、使用规范、应急通信、处罚规定、频段分类

2. **⚠️ 第2-5类（1102题）需要补全**
   - 已创建文件框架
   - agents已生成所有口诀（在任务输出中）
   - 需要从agents输出中提取并写入文件

## 🔧 下一步操作

### 方案1：手动补全（推荐用于验证）

从本次对话中的agents输出提取记忆口诀，逐个写入对应文件。

### 方案2：使用agents输出自动生成

由于agents已经生成了所有1283题的记忆口诀，可以：
1. 提取agents的输出内容
2. 编写脚本批量写入文件
3. 验证覆盖率达到100%

## 📊 agents生成的记忆口诀摘要

### 第2类示例（agents已生成）
```typescript
'MC1-0232': 'ITU三个区，中国在第三',
'MC1-0244': '中国CQ分区是23、24、27',
'MC1-0245': '中国ITU分区最多：33、42、43、44、50',
// ...共325题
```

### 第3类示例（agents已生成）
```typescript
'MC1-0592': '中继台收发共天线，双工器来隔离间',
'MC1-0599': 'NB抑噪切脉冲，SQL静噪关音频',
'MC1-0625': 'RIT接收增量调谐，微调接收不变发射',
// ...共324题
```

### 第4类示例（agents已生成）
```typescript
'MC1-0719': '天驻线行（天线驻波，馈线行波）',
'MC1-0721': '半波偶极每边71.3除频率',
'MC1-0651': 'dBi相比点源天线，理想全向作基准',
// ...共421题
```

### 第5类示例（agents已生成）
```typescript
'MC1-1345': '设备指标看频杂（频率容限+杂散发射）',
'MC1-1358': '防雷三件套：接闪器（避雷针）引下线接地体',
'MC1-1367': '工频最危险HF其次UHF最安全',
// ...共31题
```

## 💡 如何使用

### 在代码中使用

```typescript
import { getMemoryAidByQuestionId } from './services/memoryAidsByQuestionId'

// 获取单个题目的记忆口诀
const aid = getMemoryAidByQuestionId('MC1-0001')
console.log(aid) // 输出：'行政法规条例院军委'
```

### 按分类使用

```typescript
import { category1MemoryAids } from './services/memoryAids'

// 获取第1类所有口诀
Object.entries(category1MemoryAids).forEach(([id, aid]) => {
  console.log(`${id}: ${aid}`)
})
```

### 查看统计信息

```typescript
import { memoryAidsStats } from './services/memoryAids'

console.log(memoryAidsStats)
// 输出：
// {
//   category1: 181,
//   category2: 3,    // 待补全
//   category3: 2,    // 待补全
//   category4: 3,    // 待补全
//   category5: 6,    // 待补全
//   total: 195       // 当前总数
// }
```

## 📝 记忆口诀生成原则

所有口诀遵循以下原则（参考Remember.md）：

1. **简洁口语化**：10-20字，易于记忆
2. **抓住核心**：聚焦题目关键知识点
3. **数字记忆**：突出重要数字（如3w/5k、71.3、48.8）
4. **对比记忆**：使用对比手法（如"远低近高"）
5. **谐音联想**：使用谐音（如"扶贫乡=幅频相"）
6. **押韵顺口**：便于朗读记忆

## 🎯 任务完成确认

- ✅ agents已为全部1283题生成记忆口诀
- ✅ 第1类（181题）已完整写入文件
- ⚠️ 第2-5类（1102题）需要从agents输出中提取并写入

**当前覆盖率：181/1283 = 14.1%**
**目标覆盖率：1283/1283 = 100%**

---

*生成时间：2025-10-14*
*生成方式：10个并行agents独立生成*
*风格参考：Remember.md*
