import Papa from 'papaparse'
import { getMemoryAidByQuestionId } from './memoryAidsByQuestionId'

export interface Question {
  id: string
  content: string
  options: { label: string; value: string }[]
  correctAnswer: string
  category: string
  categoryName: string
  memoryAid?: string
}

// interface RawQuestion {
//   J: string
//   P: string
//   I: string
//   Q: string
//   T: string
//   A: string
//   B: string
//   C: string
//   D: string
// }

// 使用新的完整记忆口诀系统（已导入）

const categoryNames: Record<string, string> = {
  '1': '无线电管理法规',
  '2': '无线电技术基础',
  '3': '发射机和接收机',
  '4': '天线和馈线',
  '5': '安全防护'
}

// 现在使用新的getMemoryAid函数

function getCategoryFromP(p: string): string {
  const parts = p.split('.')
  return parts[0] || '1'
}

let cachedQuestions: Question[] | null = null

export async function loadQuestions(): Promise<Question[]> {
  if (cachedQuestions) {
    return cachedQuestions
  }

  try {
    const response = await fetch('/C类题库_extracted.csv')
    const csvText = await response.text()

    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const questions: Question[] = []

          results.data.forEach((row: any) => {
            if (row.Q && row.T && row.A && row.B && row.C && row.D) {
              const category = getCategoryFromP(row.P || '1')

              // 处理正确答案，可能包含多个选项 (如 "AB", "ABC")
              const correctAnswerStr = row.T.trim()
              const correctAnswers = correctAnswerStr.split('').filter((a: string) => ['A', 'B', 'C', 'D'].includes(a))

              // 获取正确答案对应的实际文字内容
              const optionTexts: Record<string, string> = {
                A: row.A,
                B: row.B,
                C: row.C,
                D: row.D
              }

              const correctAnswerTexts = correctAnswers.map((ans: string) => optionTexts[ans])

              const question: Question = {
                id: row.J || `Q_${questions.length + 1}`,
                content: row.Q,
                options: [
                  { label: `A. ${row.A}`, value: 'A' },
                  { label: `B. ${row.B}`, value: 'B' },
                  { label: `C. ${row.C}`, value: 'C' },
                  { label: `D. ${row.D}`, value: 'D' }
                ].filter(opt => opt.label !== 'A. ' && opt.label !== 'B. ' && opt.label !== 'C. ' && opt.label !== 'D. '),
                correctAnswer: correctAnswers.join(''), // 多选题会返回如 "AB"
                category,
                categoryName: categoryNames[category] || '未知分类',
                // 使用题号直接匹配记忆口诀
                memoryAid: getMemoryAidByQuestionId(row.J || '')
              }
              questions.push(question)
            }
          })

          cachedQuestions = questions
          console.log(`✅ 成功加载 ${questions.length} 道题目`)
          resolve(questions)
        },
        error: (error: Error) => {
          console.error('❌ CSV解析失败:', error)
          reject(error)
        }
      })
    })
  } catch (error) {
    console.error('❌ 加载CSV文件失败:', error)
    throw error
  }
}

export async function getQuestionsByCategory(categoryId: string): Promise<Question[]> {
  const allQuestions = await loadQuestions()

  if (categoryId === 'all') {
    return allQuestions
  }

  return allQuestions.filter(q => q.category === categoryId)
}

export async function getCategoryStats(): Promise<Array<{
  id: string
  name: string
  total: number
  description: string
}>> {
  const allQuestions = await loadQuestions()
  const stats: Record<string, { count: number; name: string }> = {}

  allQuestions.forEach(q => {
    if (!stats[q.category]) {
      stats[q.category] = { count: 0, name: q.categoryName }
    }
    stats[q.category].count++
  })

  return Object.entries(stats)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([id, data]) => ({
      id,
      name: data.name,
      total: data.count,
      description: `包含 ${data.count} 道题目`
    }))
}

export function getAllMemoryAids(): Array<{ pattern: string; aid: string }> {
  // 新的基于内容的记忆口诀系统
  return [
    {
      pattern: '罚款金额',
      aid: '根据违规情节，从责令改正到数十万罚款，拒不改正加倍处罚'
    },
    {
      pattern: '频率频段',
      aid: '30MHz是分界线：A类30-3000MHz≤25瓦，B类30下<15瓦，C类30下≤1000瓦'
    },
    {
      pattern: '时间转换',
      aid: '北京东八区UTC+8，北京时间=UTC+8小时'
    },
    {
      pattern: '管理机构',
      aid: '条例国务院+中央军委，办法工信部，监管国家+省两级'
    },
    {
      pattern: '操作规范',
      aid: '先守听后呼叫，明语或公认缩略语，禁用暗语'
    },
    {
      pattern: '应急通信',
      aid: '仅限突发重大灾害，内容限抢险救灾，临时设台48小时内报告'
    },
    {
      pattern: '禁止事项',
      aid: '五不原则：不商业、不转信、不广播、不干扰、不加密'
    }
  ]
}
