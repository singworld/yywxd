/**
 * 测试基于内容的记忆口诀系统
 * 运行：pnpm tsx src/utils/testContentBasedAids.ts
 */

import fs from 'fs'
import path from 'path'
import Papa from 'papaparse'
import { generateMemoryAid } from '../services/memoryAidsContentBased'

interface TestCase {
  id: string
  question: string
  correctAnswerTexts: string[]
  memoryAid: string
}

async function testContentBasedMemoryAids() {
  console.log('='.repeat(70))
  console.log('基于内容的记忆口诀系统测试')
  console.log('='.repeat(70))

  const csvPath = path.join(process.cwd(), 'public', 'C类题库_extracted.csv')
  const csvText = fs.readFileSync(csvPath, 'utf-8')

  const testCases: TestCase[] = []

  await new Promise((resolve) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        results.data.forEach((row: any) => {
          if (row.Q && row.T && row.A && row.B && row.C && row.D) {
            const correctAnswerStr = row.T.trim()
            const correctAnswers = correctAnswerStr.split('').filter((a: string) => ['A', 'B', 'C', 'D'].includes(a))

            const optionTexts: Record<string, string> = {
              A: row.A,
              B: row.B,
              C: row.C,
              D: row.D
            }

            const correctAnswerTexts = correctAnswers.map((ans: string) => optionTexts[ans])
            const memoryAid = generateMemoryAid(row.Q, correctAnswerTexts)

            testCases.push({
              id: row.J || `Q_${testCases.length + 1}`,
              question: row.Q,
              correctAnswerTexts,
              memoryAid
            })
          }
        })
        resolve(true)
      }
    })
  })

  console.log(`\n📊 总题数: ${testCases.length}`)

  // 统计记忆口诀类型分布
  const aidTypes = new Map<string, number>()
  testCases.forEach(tc => {
    const aidPrefix = tc.memoryAid.substring(0, tc.memoryAid.indexOf('：') + 1) || tc.memoryAid.substring(0, 10)
    aidTypes.set(aidPrefix, (aidTypes.get(aidPrefix) || 0) + 1)
  })

  console.log(`\n📝 记忆口诀类型分布（前15种）:`)
  Array.from(aidTypes.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .forEach(([type, count]) => {
      const percentage = (count / testCases.length * 100).toFixed(1)
      console.log(`   ${type.padEnd(30)} ${count.toString().padStart(4)} 道 (${percentage}%)`)
    })

  // 展示典型示例
  console.log(`\n🎯 典型记忆口诀示例：`)

  // 罚款类
  const penaltyCase = testCases.find(tc => tc.question.includes('罚款') && tc.memoryAid.includes('罚款'))
  if (penaltyCase) {
    console.log(`\n   【罚款类】`)
    console.log(`   题目: ${penaltyCase.question.substring(0, 50)}...`)
    console.log(`   答案: ${penaltyCase.correctAnswerTexts[0].substring(0, 60)}...`)
    console.log(`   口诀: ${penaltyCase.memoryAid}`)
  }

  // 频率类
  const freqCase = testCases.find(tc => tc.question.includes('频率') && tc.question.includes('A 类'))
  if (freqCase) {
    console.log(`\n   【频率类】`)
    console.log(`   题目: ${freqCase.question.substring(0, 50)}...`)
    console.log(`   答案: ${freqCase.correctAnswerTexts[0].substring(0, 60)}...`)
    console.log(`   口诀: ${freqCase.memoryAid}`)
  }

  // 时间类
  const timeCase = testCases.find(tc => tc.question.includes('UTC'))
  if (timeCase) {
    console.log(`\n   【时间类】`)
    console.log(`   题目: ${timeCase.question.substring(0, 50)}...`)
    console.log(`   答案: ${timeCase.correctAnswerTexts[0].substring(0, 60)}...`)
    console.log(`   口诀: ${timeCase.memoryAid}`)
  }

  // 机构类
  const orgCase = testCases.find(tc => tc.question.includes('管理机构') && tc.question.includes('监督'))
  if (orgCase) {
    console.log(`\n   【管理机构类】`)
    console.log(`   题目: ${orgCase.question.substring(0, 50)}...`)
    console.log(`   答案: ${orgCase.correctAnswerTexts[0].substring(0, 60)}...`)
    console.log(`   口诀: ${orgCase.memoryAid}`)
  }

  // SSB类
  const ssbCase = testCases.find(tc => tc.question.includes('SSB') || tc.question.includes('单边带'))
  if (ssbCase) {
    console.log(`\n   【SSB类】`)
    console.log(`   题目: ${ssbCase.question.substring(0, 50)}...`)
    console.log(`   答案: ${ssbCase.correctAnswerTexts[0].substring(0, 60)}...`)
    console.log(`   口诀: ${ssbCase.memoryAid}`)
  }

  // 应急类
  const emergCase = testCases.find(tc => tc.question.includes('应急') && tc.question.includes('突发'))
  if (emergCase) {
    console.log(`\n   【应急通信类】`)
    console.log(`   题目: ${emergCase.question.substring(0, 50)}...`)
    console.log(`   答案: ${emergCase.correctAnswerTexts[0].substring(0, 60)}...`)
    console.log(`   口诀: ${emergCase.memoryAid}`)
  }

  // 禁止类
  const prohibitCase = testCases.find(tc => tc.question.includes('禁止') && tc.memoryAid.includes('禁止'))
  if (prohibitCase) {
    console.log(`\n   【禁止事项类】`)
    console.log(`   题目: ${prohibitCase.question.substring(0, 50)}...`)
    console.log(`   答案: ${prohibitCase.correctAnswerTexts.join(', ').substring(0, 60)}...`)
    console.log(`   口诀: ${prohibitCase.memoryAid}`)
  }

  // 中继台类
  const repeaterCase = testCases.find(tc => tc.question.includes('中继') && tc.question.includes('频差'))
  if (repeaterCase) {
    console.log(`\n   【中继台类】`)
    console.log(`   题目: ${repeaterCase.question.substring(0, 50)}...`)
    console.log(`   答案: ${repeaterCase.correctAnswerTexts[0].substring(0, 60)}...`)
    console.log(`   口诀: ${repeaterCase.memoryAid}`)
  }

  // 随机抽取10道题验证
  console.log(`\n🔍 随机抽样验证（10道题）：`)
  const randomSamples = []
  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * testCases.length)
    randomSamples.push(testCases[randomIndex])
  }

  randomSamples.forEach((tc, index) => {
    console.log(`\n   ${index + 1}. [${tc.id}]`)
    console.log(`      题目: ${tc.question.substring(0, 50)}${tc.question.length > 50 ? '...' : ''}`)
    console.log(`      正确答案: ${tc.correctAnswerTexts[0].substring(0, 40)}${tc.correctAnswerTexts[0].length > 40 ? '...' : ''}`)
    console.log(`      记忆口诀: ${tc.memoryAid}`)
  })

  // 验证覆盖率
  const nonDefaultAids = testCases.filter(tc =>
    !tc.memoryAid.includes('答案关键词') &&
    !tc.memoryAid.includes('多选题：')
  )

  console.log(`\n✅ 系统评估：`)
  console.log(`   总题数: ${testCases.length}`)
  console.log(`   特定规则匹配: ${nonDefaultAids.length} 道`)
  console.log(`   默认规则兜底: ${testCases.length - nonDefaultAids.length} 道`)
  console.log(`   特定规则覆盖率: ${(nonDefaultAids.length / testCases.length * 100).toFixed(1)}%`)

  console.log(`\n${'='.repeat(70)}`)
  console.log('✅ 新系统特点：')
  console.log('   1. 基于实际答案内容，不依赖选项位置（ABCD）')
  console.log('   2. 提取关键数字、机构名称、技术特征等实质内容')
  console.log('   3. 适合打乱选项顺序的背题模式')
  console.log('   4. 口诀帮助理解知识点，而非机械记忆位置')
  console.log(`${'='.repeat(70)}`)
}

testContentBasedMemoryAids().catch(console.error)
