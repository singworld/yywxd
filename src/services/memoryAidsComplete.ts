/**
 * 完整的记忆口诀系统
 * 基于1283道题目的答案分析
 * 答案分布：A(83.5%), AB(8.6%), ABC(4.9%), ABCD(2.6%)
 */

export interface MemoryAid {
  pattern: RegExp
  aid: string
  priority: number // 优先级，数字越大优先级越高
}

// 核心记忆规则：大部分答案是A
const MASTER_RULE = "默认选A原则：无特殊关键词时首选A（83.5%概率）"

export const memoryAidsComplete: MemoryAid[] = [
  // ========== 超高优先级规则（特定答案模式）==========
  {
    pattern: /罚款|处罚|违法/g,
    aid: '看到罚款选最大（3万/5千），拒不改正选更重',
    priority: 100
  },

  // ========== 答案为A的高频模式（1072题）==========
  // 法规管理类（答案多为A）
  {
    pattern: /管理条例|管理办法|管理机构|法规/g,
    aid: '法规管理选第一（A）',
    priority: 90
  },
  {
    pattern: /批准|审批|核准|许可/g,
    aid: '批准审批选正规（A）',
    priority: 90
  },

  // 技术参数类
  {
    pattern: /最小|最低|最少|至少/g,
    aid: '最小最低选A（最基础）',
    priority: 85
  },
  {
    pattern: /标准|规范|正常|常规/g,
    aid: '标准规范选A（官方第一）',
    priority: 85
  },

  // 频率功率类（大部分是A）
  {
    pattern: /频率.*范围|工作频率|频段/g,
    aid: '频率范围选A（基础频段）',
    priority: 80
  },
  {
    pattern: /发射功率|输出功率|功率限制/g,
    aid: '功率限制选A（安全第一）',
    priority: 80
  },
  {
    pattern: /MHz.*Hz|kHz.*Hz/g,
    aid: '频率单位换算选A',
    priority: 75
  },

  // 波长计算
  {
    pattern: /波长.*计算|计算.*波长|300/g,
    aid: '波长计算300除频率，单位选A',
    priority: 85
  },

  // 设备器件类
  {
    pattern: /设备|器件|装置|仪器/g,
    aid: '设备器件选标准（A）',
    priority: 75
  },
  {
    pattern: /天线.*类型|天线.*种类/g,
    aid: '天线类型选基础（A）',
    priority: 75
  },

  // 操作规程类
  {
    pattern: /正确|应当|应该|必须/g,
    aid: '正确做法选A（规范第一）',
    priority: 80
  },
  {
    pattern: /不正确|不应|禁止|不得/g,
    aid: '错误做法选A（第一个错）',
    priority: 80
  },

  // ========== 多选题答案模式 ==========
  // AB模式（110题）
  {
    pattern: /下列.*正确.*[有是]/g,
    aid: '正确的有选AB（前两个对）',
    priority: 70
  },
  {
    pattern: /包括|包含|含有/g,
    aid: '包括包含选AB（基础两项）',
    priority: 70
  },
  {
    pattern: /主要.*[有是]/g,
    aid: '主要的选AB（核心两项）',
    priority: 70
  },

  // ABC模式（63题）
  {
    pattern: /以下.*都|全部|所有/g,
    aid: '全部都选ABC（除了最后）',
    priority: 65
  },
  {
    pattern: /除.*外|除了/g,
    aid: '除了XX外选ABC（排除D）',
    priority: 65
  },

  // ABCD模式（33题）
  {
    pattern: /下列.*全部正确|都正确|均正确/g,
    aid: '全部正确选ABCD（全选）',
    priority: 60
  },
  {
    pattern: /完整|完全|全面/g,
    aid: '完整全面选ABCD（都对）',
    priority: 60
  },

  // ========== 特殊记忆技巧 ==========
  // 数字规律
  {
    pattern: /ITU.*分区|区号/g,
    aid: 'ITU分区中国是3区，选含3的',
    priority: 95
  },
  {
    pattern: /呼号|字头|前缀/g,
    aid: '中国呼号B开头，选B相关',
    priority: 90
  },
  {
    pattern: /UTC|北京时间|时差/g,
    aid: '北京时间UTC+8，比UTC早8小时',
    priority: 85
  },

  // 技术术语
  {
    pattern: /SSB|单边带/g,
    aid: 'SSB单边带用于远距离弱信号',
    priority: 85
  },
  {
    pattern: /FM|调频/g,
    aid: 'FM调频本地通信，对称波形',
    priority: 85
  },
  {
    pattern: /CW|等幅电报/g,
    aid: 'CW等幅电报最窄带宽',
    priority: 85
  },

  // 安全防护
  {
    pattern: /接地|防雷|保护/g,
    aid: '安全防护选最严格（A）',
    priority: 85
  },
  {
    pattern: /干扰|QRM|QRN/g,
    aid: 'QRM人为干扰，QRN天然干扰',
    priority: 80
  },

  // 天线相关
  {
    pattern: /驻波|SWR|匹配/g,
    aid: '完美驻波比1:1，越小越好选A',
    priority: 80
  },
  {
    pattern: /增益|dBi|dBd/g,
    aid: 'dBi点源增益，dBd半波增益，选A',
    priority: 80
  },
  {
    pattern: /偶极|DP|dipole/g,
    aid: '偶极天线DP，双极子选A',
    priority: 75
  },

  // 电路参数
  {
    pattern: /阻抗|欧姆|Ω/g,
    aid: '标准阻抗50欧，选50或A',
    priority: 80
  },
  {
    pattern: /电压.*并联|并联.*电压/g,
    aid: '电压并联相等，选A',
    priority: 75
  },
  {
    pattern: /电流.*串联|串联.*电流/g,
    aid: '电流串联相等，选A',
    priority: 75
  },

  // ========== 通用规则（低优先级）==========
  {
    pattern: /第一|首要|主要|基本/g,
    aid: '第一首要选A（第一选项）',
    priority: 50
  },
  {
    pattern: /简单|基础|基本|常见/g,
    aid: '简单基础选A（最基本）',
    priority: 50
  },
  {
    pattern: /国际|世界|全球/g,
    aid: '国际标准选A（通用第一）',
    priority: 50
  },
  {
    pattern: /推荐|建议|优选/g,
    aid: '推荐建议选A（首选方案）',
    priority: 50
  },

  // ========== 默认规则 ==========
  {
    pattern: /.*/g,
    aid: MASTER_RULE,
    priority: 1
  }
]

/**
 * 获取题目的记忆口诀
 * @param content 题目内容
 * @param correctAnswer 正确答案
 * @returns 最匹配的记忆口诀
 */
export function getMemoryAid(content: string, correctAnswer?: string): string {
  // 找出所有匹配的口诀
  const matchedAids = memoryAidsComplete
    .filter(item => item.pattern.test(content))
    .sort((a, b) => b.priority - a.priority) // 按优先级排序

  if (matchedAids.length > 0) {
    // 如果有正确答案，优先返回与答案相关的口诀
    if (correctAnswer) {
      // 对于多选题，提供额外提示
      if (correctAnswer.length > 1) {
        const baseAid = matchedAids[0].aid
        const answerHint = `【${correctAnswer}】${correctAnswer.split('').join('、')}`
        return `${baseAid} ${answerHint}`
      }
    }

    return matchedAids[0].aid
  }

  return MASTER_RULE
}

/**
 * 批量处理题目，为每道题生成记忆口诀
 * @param questions 题目数组
 * @returns 带有记忆口诀的题目数组
 */
export function batchProcessMemoryAids(questions: any[]): any[] {
  return questions.map(q => ({
    ...q,
    memoryAid: getMemoryAid(q.content || q.Q, q.correctAnswer || q.T)
  }))
}

// 导出统计信息
export const STATISTICS = {
  totalQuestions: 1283,
  answerDistribution: {
    'A': 1072,     // 83.5%
    'AB': 110,     // 8.6%
    'ABC': 63,     // 4.9%
    'ABCD': 33,    // 2.6%
    'AC': 2,       // 0.2%
    'BCD': 2       // 0.2%
  },
  masterRule: MASTER_RULE,
  totalAidPatterns: memoryAidsComplete.length
}