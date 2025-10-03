import Papa from 'papaparse'

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

// 记忆口诀数据
const memoryAids = [
  { pattern: /罚款/g, aid: '看到罚款选最大（3w/5k），如遇拒不改正就选它' },
  { pattern: /判刑|刑法/g, aid: '判刑选刑法，管制选特定' },
  { pattern: /干扰/g, aid: '干扰我日麻(QRM)天电QRN' },
  { pattern: /ARDF|指向/g, aid: 'ARDF是指向(侧向)，电台设备RIG，收发是VR' },
  { pattern: /Roger|偶极|VER/g, aid: 'Roger完全明白，偶极是double（DP），VER垂直' },
  { pattern: /北京|UTC|时间/g, aid: '北京超前（UTC+8实际前一天），cq全是2，itu选最多' },
  { pattern: /KMGT|munp|前缀/g, aid: '昆明高铁没有牛皮（KMGT munp-->3 6 9 12 -3 -6 -9 -12从小到大）' },
  { pattern: /功率|ae86/g, aid: '音频最小，功率换算找ae86，没有86选最大' },
  { pattern: /峰峰|电压|35|70/g, aid: '峰峰电压是35，单峰是70，平均选0v' },
  { pattern: /相位|内阻|额定/g, aid: '相位同频，内阻降压，额定是最大，通话必要带宽6.25' },
  { pattern: /接收|发射|调制/g, aid: '接收系统要输出，发射系统要发射，调制调频率' },
  { pattern: /简单|连续/g, aid: '一个F对一个F，只有一个是简单，有连续选单无限' },
  { pattern: /频率.*失真/g, aid: '多个频率会失真，电源轻巧减线圈' },
  { pattern: /FM|对称/g, aid: 'FM对称波，频谱图，amfmpm是扶贫乡(幅频相)' },
  { pattern: /带宽|调频|解调/g, aid: '带宽越宽，调频解调是鉴频，灵敏度是最弱信号(小强)' },
  { pattern: /静噪|衰减/g, aid: '静噪选退出，衰减衰落是起伏，无调制载波功率' },
  { pattern: /亚音|CTCSS|偏频/g, aid: '接收静噪是亚音(CTCSS)，M-蝙蝠：偏频是幅度' },
  { pattern: /过载|SSB/g, aid: '信号大会过载，长距离弱信号ssb，天驻线行' },
  { pattern: /电磁|3GHz|vox/g, aid: '电磁暴露3Ghz，vox是声控，感应电流套磁环' },
  { pattern: /防雷|接地/g, aid: '防雷接地粗而短，天线增益信号强' },
  { pattern: /电压.*并|电流.*串/g, aid: '电压并，电流串，完美组成电和磁，完美驻波1：1' },
  { pattern: /1\/4|波/g, aid: '1/4波奇，电器参数特性抗阻，水平方向没有指向性' },
  { pattern: /dBi|dBd|增益/g, aid: '天线增益是密度，dBi i是一点圆（点源）dBd是一半（半波）' },
  { pattern: /功率差|0\.8|驻波/g, aid: '功率差都为0.8db，驻波比匹配质量，馈线功耗高变热量' },
  { pattern: /同轴|50|欧|N型/g, aid: '同轴电缆50欧影响小，400以上是N型' },
  { pattern: /空气|损耗/g, aid: '空气uv损耗小，传播方式有天地，自由空间损耗两个正比' },
  { pattern: /极限|距离|多径/g, aid: '极限距离相对值，多径传播误码大，频率越高波长越短' },
  { pattern: /波长|300|电离/g, aid: '计算波长300除，远距离传过来靠电离反射，SQL是静噪' },
  { pattern: /窄.*宽|失真/g, aid: 'n窄m宽，窄n接宽w会失真，宽接窄会小声，没有信号经鉴频' },
  { pattern: /多径/g, aid: '有多径选多径，全频半频25/12.5，劣质开关是最短' },
  { pattern: /U段|工频|避雷器/g, aid: '加油（家里微博里用U段），工频，避雷器安装注意金属板' },
  { pattern: /电话线|1MHz|辐射/g, aid: '电话线1Mhz，人体特定辐射吸收大' }
]

const categoryNames: Record<string, string> = {
  '1': '无线电管理法规',
  '2': '无线电技术基础',
  '3': '发射机和接收机',
  '4': '天线和馈线',
  '5': '安全防护'
}

function findMemoryAid(content: string): string {
  for (const { pattern, aid } of memoryAids) {
    if (pattern.test(content)) {
      return aid
    }
  }
  return ''
}

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
                memoryAid: findMemoryAid(row.Q)
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
  return memoryAids.map(m => ({
    pattern: m.pattern.source,
    aid: m.aid
  }))
}
