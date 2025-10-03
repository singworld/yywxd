import fs from 'node:fs'
import Papa from 'papaparse'
import { memoryAidRules } from '../src/services/memoryAidsContentBased'

interface RawQuestionRow {
  J: string
  P: string
  I: string
  Q: string
  T: string
  A: string
  B: string
  C: string
  D: string
}

interface RuleStat {
  count: number
  sampleQuestions: string[]
  sampleAnswers: string[][]
  sampleAid?: string
}

function ruleKey(rule: (typeof memoryAidRules)[number], originalIndex: number): string {
  const pattern = rule.questionPattern?.source || 'DEFAULT'
  return `${originalIndex.toString().padStart(2, '0')}:${pattern}:p${rule.priority}`
}

const csvRaw = fs.readFileSync('C类题库_extracted.csv', 'utf8').replace(/^\uFEFF/, '')
const parsed = Papa.parse<RawQuestionRow>(csvRaw, {
  header: true,
  skipEmptyLines: true
})

const sortedRuleTuples = [...memoryAidRules]
  .map((rule, originalIndex) => ({ rule, originalIndex }))
  .sort((a, b) => b.rule.priority - a.rule.priority)

const fallbackKey = 'DEFAULT_RULE'
const stats = new Map<string, RuleStat>()

let total = 0
const fallbackItems: Array<{ id: string; question: string; answers: string[]; aid: string }>= []

parsed.data.forEach(row => {
  if (!row || !row.Q || !row.T) {
    return
  }

  const question = row.Q.trim()
  if (!question) return

  const answerLetters = (row.T || '').split('').filter(letter => ['A', 'B', 'C', 'D'].includes(letter))
  const optionTexts: Record<string, string> = {
    A: row.A ? row.A.trim() : '',
    B: row.B ? row.B.trim() : '',
    C: row.C ? row.C.trim() : '',
    D: row.D ? row.D.trim() : ''
  }

  const correctAnswerTexts = (
    answerLetters.length > 0 ? answerLetters : ['A']
  )
    .map(letter => optionTexts[letter])
    .filter(text => text && text.length > 0)

  let matched = false

  for (const { rule, originalIndex } of sortedRuleTuples) {
    let questionMatch = true
    let answerMatch = true

    if (rule.questionPattern) {
      rule.questionPattern.lastIndex = 0
      questionMatch = rule.questionPattern.test(question)
    }

    if (rule.answerPattern) {
      const pattern = rule.answerPattern
      answerMatch = correctAnswerTexts.some(ans => {
        pattern.lastIndex = 0
        return pattern.test(ans)
      })
    }

    if (questionMatch && answerMatch) {
      const aid = rule.generateAid(question, correctAnswerTexts)
      if (aid && aid.trim()) {
        const key = ruleKey(rule, originalIndex)
        const current = stats.get(key) || { count: 0, sampleQuestions: [], sampleAnswers: [] }
        current.count += 1
        if (current.sampleQuestions.length < 3) {
          current.sampleQuestions.push(question)
          current.sampleAnswers.push([...correctAnswerTexts])
          if (!current.sampleAid) {
            current.sampleAid = aid
          }
        }
        stats.set(key, current)
        if (originalIndex === memoryAidRules.length - 1) {
          fallbackItems.push({ id: row.J || '', question, answers: [...correctAnswerTexts], aid })
        }
        matched = true
        break
      }
    }
  }

  if (!matched) {
    const aid = memoryAidRules[memoryAidRules.length - 1].generateAid(question, correctAnswerTexts)
    const current = stats.get(fallbackKey) || { count: 0, sampleQuestions: [], sampleAnswers: [] }
    current.count += 1
    if (current.sampleQuestions.length < 3) {
      current.sampleQuestions.push(question)
      current.sampleAnswers.push([...correctAnswerTexts])
      if (!current.sampleAid) {
        current.sampleAid = aid
      }
    }
    stats.set(fallbackKey, current)
    fallbackItems.push({ id: row.J || '', question, answers: [...correctAnswerTexts], aid })
  }
  total += 1
})

const sortedStats = Array.from(stats.entries()).sort((a, b) => b[1].count - a[1].count)

console.log(`总题数: ${total}`)
console.log(`规则数量: ${memoryAidRules.length}`)
console.log('--- 规则命中分布 ---')
for (const [key, info] of sortedStats) {
  const ratio = ((info.count / total) * 100).toFixed(2)
  console.log(`${key} -> ${info.count} (${ratio}%)`)
  if (info.sampleAid) {
    console.log(`  示例口诀: ${info.sampleAid}`)
  }
  info.sampleQuestions.forEach((sample, idx) => {
    console.log(`  示例题目: ${sample}`)
    const answers = info.sampleAnswers[idx]
    if (answers && answers.length) {
      console.log(`    正确答案: ${answers.join(' | ')}`)
    }
  })
}

if (fallbackItems.length) {
  console.log(`\nTop ${Math.min(20, fallbackItems.length)} 未匹配示例:`)
  fallbackItems.slice(0, 20).forEach((item, idx) => {
    console.log(`${idx + 1}. ${item.id}: ${item.question}`)
    console.log(`   答案: ${item.answers.join(' | ')}`)
    console.log(`   当前口诀: ${item.aid}`)
  })
  fs.writeFileSync('scripts/default_items.json', JSON.stringify(fallbackItems, null, 2), 'utf8')
  console.log('\n已生成 scripts/default_items.json')
}
