/**
 * Node.js测试脚本：验证所有题目的记忆口诀覆盖情况
 * 运行方式：pnpm tsx src/utils/testMemoryAidsNode.ts
 */

import fs from 'fs'
import path from 'path'
import Papa from 'papaparse'
import { memoryAidsComplete, STATISTICS, getMemoryAid } from '../services/memoryAidsComplete'

interface Question {
  id: string
  content: string
  correctAnswer: string
  category: string
  categoryName: string
  memoryAid?: string
}

interface AidCoverage {
  pattern: string
  count: number
  examples: string[]
  priority: number
}

const categoryNames: Record<string, string> = {
  '1': '无线电管理法规',
  '2': '无线电技术基础',
  '3': '发射机和接收机',
  '4': '天线和馈线',
  '5': '安全防护'
}

function getCategoryFromP(p: string): string {
  const parts = p.split('.')
  return parts[0] || '1'
}

async function loadQuestionsFromFile(): Promise<Question[]> {
  const csvPath = path.join(process.cwd(), 'public', 'C类题库_extracted.csv')
  const csvText = fs.readFileSync(csvPath, 'utf-8')

  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const questions: Question[] = []

        results.data.forEach((row: any) => {
          if (row.Q && row.T && row.A && row.B && row.C && row.D) {
            const category = getCategoryFromP(row.P || '1')
            const correctAnswerStr = row.T.trim()
            const correctAnswers = correctAnswerStr.split('').filter((a: string) => ['A', 'B', 'C', 'D'].includes(a))

            const question: Question = {
              id: row.J || `Q_${questions.length + 1}`,
              content: row.Q,
              correctAnswer: correctAnswers.join(''),
              category,
              categoryName: categoryNames[category] || '未知分类',
              memoryAid: getMemoryAid(row.Q, correctAnswers.join(''))
            }
            questions.push(question)
          }
        })

        resolve(questions)
      },
      error: (error: Error) => {
        reject(error)
      }
    })
  })
}

async function analyzeMemoryAidCoverage() {
  console.log('='.repeat(60))
  console.log('记忆口诀系统测试报告')
  console.log('='.repeat(60))

  // 加载所有题目
  const questions = await loadQuestionsFromFile()
  console.log(`\n📊 题库统计：`)
  console.log(`   总题数: ${questions.length}`)

  // 实际统计答案分布
  const actualAnswerStats = new Map<string, number>()
  questions.forEach(q => {
    const answer = q.correctAnswer
    actualAnswerStats.set(answer, (actualAnswerStats.get(answer) || 0) + 1)
  })

  console.log(`\n   系统预设答案分布:`)
  console.log(`   - A: ${STATISTICS.answerDistribution.A} (${(STATISTICS.answerDistribution.A / STATISTICS.totalQuestions * 100).toFixed(1)}%)`)
  console.log(`   - AB: ${STATISTICS.answerDistribution.AB} (${(STATISTICS.answerDistribution.AB / STATISTICS.totalQuestions * 100).toFixed(1)}%)`)
  console.log(`   - ABC: ${STATISTICS.answerDistribution.ABC} (${(STATISTICS.answerDistribution.ABC / STATISTICS.totalQuestions * 100).toFixed(1)}%)`)
  console.log(`   - ABCD: ${STATISTICS.answerDistribution.ABCD} (${(STATISTICS.answerDistribution.ABCD / STATISTICS.totalQuestions * 100).toFixed(1)}%)`)

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
  const noAidQuestions: Question[] = []
  const aidByPriority = new Map<number, number>()

  questions.forEach(q => {
    // 检查口诀覆盖
    if (!q.memoryAid || q.memoryAid === '') {
      noAidQuestions.push(q)
    } else {
      // 找出匹配的口诀
      let matched = false
      for (const aid of memoryAidsComplete) {
        if (aid.pattern.test(q.content)) {
          const coverage = coverageMap.get(aid.aid)
          if (coverage && !matched) {
            coverage.count++
            if (coverage.examples.length < 3) {
              const preview = q.content.length > 40 ? q.content.substring(0, 40) + '...' : q.content
              coverage.examples.push(`[${q.id}] ${preview} (答案:${q.correctAnswer})`)
            }
            // 统计优先级分布
            aidByPriority.set(aid.priority, (aidByPriority.get(aid.priority) || 0) + 1)
            matched = true
          }
        }
      }
    }
  })

  // 输出口诀覆盖报告
  console.log(`\n📝 记忆口诀覆盖情况：`)
  console.log(`   口诀模式总数: ${memoryAidsComplete.length}`)
  console.log(`   无口诀题目: ${noAidQuestions.length}`)
  console.log(`   覆盖率: ${((questions.length - noAidQuestions.length) / questions.length * 100).toFixed(1)}%`)

  // 按优先级分组显示
  console.log(`\n🎯 口诀优先级分布：`)
  const sortedPriorities = Array.from(aidByPriority.entries()).sort((a, b) => b[0] - a[0])
  sortedPriorities.forEach(([priority, count]) => {
    console.log(`   优先级 ${priority}: ${count} 道题`)
  })

  // 按优先级和使用频率排序输出
  const sortedCoverage = Array.from(coverageMap.entries())
    .filter(([_, coverage]) => coverage.count > 0)
    .sort((a, b) => {
      if (a[1].priority !== b[1].priority) {
        return b[1].priority - a[1].priority
      }
      return b[1].count - a[1].count
    })

  console.log(`\n🔥 高频口诀（前15个）：`)
  sortedCoverage.slice(0, 15).forEach(([aid, coverage], index) => {
    console.log(`\n   ${index + 1}. ${aid}`)
    console.log(`      优先级: ${coverage.priority}`)
    console.log(`      匹配题数: ${coverage.count}`)
    if (coverage.examples.length > 0) {
      console.log(`      题目示例:`)
      coverage.examples.forEach(ex => {
        console.log(`        - ${ex}`)
      })
    }
  })

  // 验证实际答案分布
  console.log(`\n✅ 实际答案分布验证：`)
  const sortedAnswers = Array.from(actualAnswerStats.entries())
    .sort((a, b) => b[1] - a[1])

  sortedAnswers.slice(0, 10).forEach(([answer, count]) => {
    const percentage = (count / questions.length * 100).toFixed(1)
    console.log(`   ${answer}: ${count} 道 (${percentage}%)`)
  })

  // 输出未覆盖的题目示例
  if (noAidQuestions.length > 0) {
    console.log(`\n⚠️ 无口诀题目示例（前5个）：`)
    noAidQuestions.slice(0, 5).forEach(q => {
      const preview = q.content.length > 60 ? q.content.substring(0, 60) + '...' : q.content
      console.log(`   [${q.id}] ${preview}`)
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
    if (q.memoryAid && q.memoryAid !== '') {
      stats.withAid++
    }
  })

  Array.from(categoryStats.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([category, stats]) => {
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
    .slice(0, 10)
    .forEach(([answer, count]) => {
      const percentage = (count / multipleChoiceQuestions.length * 100).toFixed(1)
      console.log(`     ${answer}: ${count} 道 (${percentage}%)`)
    })

  // 验证记忆口诀质量
  console.log(`\n🌟 记忆口诀质量分析：`)
  const sampleQuestions = questions.slice(0, 5)
  sampleQuestions.forEach(q => {
    console.log(`\n   题目: ${q.content.substring(0, 60)}...`)
    console.log(`   答案: ${q.correctAnswer}`)
    console.log(`   口诀: ${q.memoryAid}`)
  })

  console.log(`\n${'='.repeat(60)}`)
  console.log('测试完成！')
  console.log(`记忆口诀系统覆盖率: ${((questions.length - noAidQuestions.length) / questions.length * 100).toFixed(1)}%`)
  console.log(`核心规则: ${STATISTICS.masterRule}`)
  console.log(`${'='.repeat(60)}`)
}

// 运行测试
analyzeMemoryAidCoverage().catch(console.error)