/**
 * 测试脚本：验证所有题目的记忆口诀覆盖情况
 * 运行方式：pnpm tsx src/utils/testMemoryAids.ts
 */

import { loadQuestions } from '../services/dataService'
import { memoryAidsComplete, STATISTICS } from '../services/memoryAidsComplete'

interface AidCoverage {
  pattern: string
  count: number
  examples: string[]
  priority: number
}

async function analyzeMemoryAidCoverage() {
  console.log('='.repeat(60))
  console.log('记忆口诀系统测试报告')
  console.log('='.repeat(60))

  // 加载所有题目
  const questions = await loadQuestions()
  console.log(`\n📊 题库统计：`)
  console.log(`   总题数: ${questions.length}`)
  console.log(`   答案分布:`)
  console.log(`   - A: ${STATISTICS.answerDistribution.A} (${(STATISTICS.answerDistribution.A / questions.length * 100).toFixed(1)}%)`)
  console.log(`   - AB: ${STATISTICS.answerDistribution.AB} (${(STATISTICS.answerDistribution.AB / questions.length * 100).toFixed(1)}%)`)
  console.log(`   - ABC: ${STATISTICS.answerDistribution.ABC} (${(STATISTICS.answerDistribution.ABC / questions.length * 100).toFixed(1)}%)`)
  console.log(`   - ABCD: ${STATISTICS.answerDistribution.ABCD} (${(STATISTICS.answerDistribution.ABCD / questions.length * 100).toFixed(1)}%)`)

  // 统计每个口诀模式的覆盖情况
  const coverageMap = new Map<string, AidCoverage>()

  // 初始化覆盖统计
  memoryAidsComplete.forEach(aid => {
    const key = aid.aid
    if (!coverageMap.has(key)) {
      coverageMap.set(key, {
        pattern: aid.pattern.toString(),
        count: 0,
        examples: [],
        priority: aid.priority
      })
    }
  })

  // 分析每道题的口诀
  const noAidQuestions: any[] = []
  const answerStats = new Map<string, number>()

  questions.forEach(q => {
    // 统计答案分布
    const answer = q.correctAnswer
    answerStats.set(answer, (answerStats.get(answer) || 0) + 1)

    // 检查口诀覆盖
    if (!q.memoryAid) {
      noAidQuestions.push(q)
    } else {
      // 找出匹配的口诀
      for (const aid of memoryAidsComplete) {
        if (aid.pattern.test(q.content)) {
          const coverage = coverageMap.get(aid.aid)
          if (coverage) {
            coverage.count++
            if (coverage.examples.length < 3) {
              coverage.examples.push(`[${q.id}] ${q.content.substring(0, 30)}...`)
            }
          }
          break // 只统计最高优先级的匹配
        }
      }
    }
  })

  // 输出口诀覆盖报告
  console.log(`\n📝 记忆口诀覆盖情况：`)
  console.log(`   口诀模式总数: ${memoryAidsComplete.length}`)
  console.log(`   无口诀题目: ${noAidQuestions.length}`)
  console.log(`   覆盖率: ${((questions.length - noAidQuestions.length) / questions.length * 100).toFixed(1)}%`)

  // 按优先级和使用频率排序输出
  const sortedCoverage = Array.from(coverageMap.entries())
    .filter(([_, coverage]) => coverage.count > 0)
    .sort((a, b) => {
      // 先按优先级排序，再按使用次数排序
      if (a[1].priority !== b[1].priority) {
        return b[1].priority - a[1].priority
      }
      return b[1].count - a[1].count
    })

  console.log(`\n🎯 高频口诀（前10个）：`)
  sortedCoverage.slice(0, 10).forEach(([aid, coverage], index) => {
    console.log(`\n   ${index + 1}. ${aid}`)
    console.log(`      优先级: ${coverage.priority}`)
    console.log(`      匹配题数: ${coverage.count}`)
    console.log(`      题目示例:`)
    coverage.examples.forEach(ex => {
      console.log(`        - ${ex}`)
    })
  })

  // 验证答案分布
  console.log(`\n✅ 实际答案分布验证：`)
  const sortedAnswers = Array.from(answerStats.entries())
    .sort((a, b) => b[1] - a[1])

  sortedAnswers.forEach(([answer, count]) => {
    const percentage = (count / questions.length * 100).toFixed(1)
    console.log(`   ${answer}: ${count} 道 (${percentage}%)`)
  })

  // 输出未覆盖的题目示例
  if (noAidQuestions.length > 0) {
    console.log(`\n⚠️ 无口诀题目示例（前5个）：`)
    noAidQuestions.slice(0, 5).forEach(q => {
      console.log(`   [${q.id}] ${q.content.substring(0, 50)}...`)
      console.log(`      正确答案: ${q.correctAnswer}`)
    })
  }

  // 分类统计
  console.log(`\n📊 分类口诀覆盖：`)
  const categoryStats = new Map<string, { total: number, withAid: number }>()

  questions.forEach(q => {
    const cat = q.categoryName
    if (!categoryStats.has(cat)) {
      categoryStats.set(cat, { total: 0, withAid: 0 })
    }
    const stats = categoryStats.get(cat)!
    stats.total++
    if (q.memoryAid) {
      stats.withAid++
    }
  })

  categoryStats.forEach((stats, category) => {
    const coverage = (stats.withAid / stats.total * 100).toFixed(1)
    console.log(`   ${category}: ${stats.withAid}/${stats.total} (${coverage}%)`)
  })

  // 多选题特殊统计
  const multipleChoiceQuestions = questions.filter(q => q.correctAnswer.length > 1)
  console.log(`\n🔢 多选题统计：`)
  console.log(`   多选题总数: ${multipleChoiceQuestions.length}`)
  console.log(`   多选题占比: ${(multipleChoiceQuestions.length / questions.length * 100).toFixed(1)}%`)

  const multiAnswerDist = new Map<string, number>()
  multipleChoiceQuestions.forEach(q => {
    multiAnswerDist.set(q.correctAnswer, (multiAnswerDist.get(q.correctAnswer) || 0) + 1)
  })

  console.log(`   多选题答案分布:`)
  Array.from(multiAnswerDist.entries())
    .sort((a, b) => b[1] - a[1])
    .forEach(([answer, count]) => {
      console.log(`     ${answer}: ${count} 道`)
    })

  console.log(`\n${'='.repeat(60)}`)
  console.log('测试完成！')
  console.log(`记忆口诀系统覆盖率: ${((questions.length - noAidQuestions.length) / questions.length * 100).toFixed(1)}%`)
  console.log(`核心规则: ${STATISTICS.masterRule}`)
  console.log(`${'='.repeat(60)}`)
}

// 运行测试
analyzeMemoryAidCoverage().catch(console.error)