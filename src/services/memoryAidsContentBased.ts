/**
 * 基于内容的记忆口诀系统 - 简洁版
 * 参考Remember.md风格：简洁、口语化、易记
 * 不依赖选项位置（ABCD），基于实际答案内容
 */

export interface MemoryAidRule {
  questionPattern?: RegExp
  answerPattern?: RegExp
  generateAid: (question: string, correctAnswers: string[]) => string
  priority: number
}

function extractNumbers(text: string): number[] {
  const matches = text.match(/\d+/g)
  return matches ? matches.map(Number) : []
}

export const memoryAidRules: MemoryAidRule[] = [
  // ========== 罚款处罚类（优先级100） ==========
  {
    questionPattern: /罚款|处罚/,
    priority: 100,
    generateAid: (_question, correctAnswers) => {
      const amounts = correctAnswers.flatMap(ans => extractNumbers(ans).filter(n => n >= 1000))

      if (amounts.length > 0) {
        const max = Math.max(...amounts)

        // 常见罚款金额
        if (max === 30000 || max === 5000) return '罚款选最大3w/5k，拒不改正加倍罚'
        if (max === 50000) return '擅自设台5万封，拒改最高20万'
        if (max === 500000) return '干扰安全20-50万，情节重罚不手软'
        if (max >= 10000) return `罚款${max/10000}万，拒改翻倍`
      }

      if (correctAnswers.some(ans => ans.includes('责令改正'))) return '先责令改正，拒改加重罚'
      if (correctAnswers.some(ans => ans.includes('吊销'))) return '严重后果吊执照'

      return '罚款看情节，拒改必加重'
    }
  },

  // ========== ITU分区类（优先级95） ==========
  {
    questionPattern: /ITU|分区|三区|3区/,
    priority: 95,
    generateAid: (_question, correctAnswers) => {
      if (correctAnswers.some(ans => ans.includes('3') || ans.includes('三'))) {
        return 'ITU全球分三区，中国稳坐第三席'
      }
      return 'ITU分区看题目，含3就选3'
    }
  },

  // ========== 时间转换类（优先级95） ==========
  {
    questionPattern: /UTC|时间|时区|北京时间/,
    priority: 95,
    generateAid: (question, correctAnswers) => {
      if (question.includes('UTC')) {
        if (correctAnswers.some(ans => ans.includes('减') || ans.includes('-8'))) {
          return '北京超前8小时，UTC往回减'
        }
        if (correctAnswers.some(ans => ans.includes('加') || ans.includes('+8'))) {
          return '北京超前8小时，UTC加8是北京'
        }
        return '北京UTC+8，超前8小时'
      }

      if (question.includes('施行') || question.includes('生效') || question.includes('实施')) {
        if (correctAnswers.some(ans => ans.includes('2024') && ans.includes('3'))) {
          return '新办法2024年3月1日生效'
        }
        const dates = correctAnswers.flatMap(ans => extractNumbers(ans))
        if (dates.length >= 3) {
          return `记生效日：${dates.slice(0, 3).join('-')}`
        }
        return '留意答案里的生效日期'
      }

      if (question.includes('有效期') || question.includes('期届满')) {
        if (correctAnswers.some(ans => ans.includes('30') && ans.includes('工作日'))) {
          return '续期30天前，拆台60天后'
        }
        if (correctAnswers.some(ans => ans.includes('60') && ans.includes('工作日'))) {
          return '注销后60天拆台'
        }
      }

      if (correctAnswers.some(ans => ans.includes('2024') && ans.includes('3'))) {
        return '新办法2024年3月生效'
      }

      return '时间看关键数字'
    }
  },

  // ========== 频率功率类（优先级95） ==========
  {
    questionPattern: /频率|频段|MHz|GHz|功率|瓦/,
    answerPattern: /\d+\s*(MHz|GHz|kHz|瓦)/,
    priority: 95,
    generateAid: (question, correctAnswers) => {
      // ABC类别
      if (question.includes('A 类') || question.includes('A类')) {
        return 'A类30-3000MHz，25瓦管VHF/UHF'
      }
      if (question.includes('B 类') || question.includes('B类')) {
        return 'B类30下小于15瓦，30上不超25瓦'
      }
      if (question.includes('C 类') || question.includes('C类')) {
        return 'C类30下千瓦王，30上还是25瓦'
      }

      // 波长计算
      if (question.includes('波长')) {
        return '波长300除频率，远距离靠电离反射'
      }

      // 频段划分
      const freqs = correctAnswers.flatMap(ans => extractNumbers(ans))
      if (freqs.some(f => f >= 30 && f < 300)) return 'VHF甚高频30-300MHz'
      if (freqs.some(f => f >= 300 && f < 3000)) return 'UHF特高频300-3000MHz'

      return '30MHz是分界线'
    }
  },

  // ========== 呼号前缀类（优先级90） ==========
  {
    questionPattern: /呼号|字头|前缀|B[A-Z0-9]|BY|BH/,
    priority: 90,
    generateAid: (question, correctAnswers) => {
      if (correctAnswers.some(ans => ans.match(/B[A-Z0-9]/))) {
        return '中国呼号B字头，BY、BH、BA记心间'
      }

      if (question.includes('空间业余')) {
        if (correctAnswers.some(ans => ans.includes('BJ1'))) {
          return '空间电台BJ1，其他都是地面台'
        }
      }

      return '呼号看字头，B是中国'
    }
  },

  // ========== 管理机构类（优先级90） ==========
  {
    questionPattern: /管理机构|管理部门|负责|制定|许可|管制/,
    priority: 90,
    generateAid: (question, correctAnswers) => {
      if (correctAnswers.some(ans => ans.includes('国务院') && ans.includes('中央军委'))) {
        return '条例院军委，办法工信部'
      }

      if (correctAnswers.some(ans => ans.includes('工业和信息化部'))) {
        return '工信部管办法，两级抓监管'
      }

      if (correctAnswers.some(ans => ans.includes('国家无线电管理机构') && ans.includes('省'))) {
        return '监管两级制，国家加省级'
      }

      if (question.includes('15 瓦以上') && question.includes('HF')) {
        return '15瓦以上短波台，国家机构来许可'
      }

      return '条例院军委，办法工信部，两级管监督'
    }
  },

  // ========== 基础术语定义类（优先级88） ==========
  {
    questionPattern: /辐射（|radiation|发射（|emission|电信（|telecommunication|关于无线电通信|地面无线电通信|无线电波是指|电磁波（/,
    priority: 88,
    generateAid: (question, correctAnswers) => {
      const answerText = correctAnswers.join('；')
      const normalizedAnswer = answerText.replace(/,/g, '')

      if (question.includes('辐射（') || question.includes('radiation')) {
        return '辐射=任何源发波，连闪电也算'
      }

      if (question.includes('发射（') || question.includes('emission')) {
        return '发射=发信机产波，杂散产物也算'
      }

      if (question.includes('电信（') || question.includes('telecommunication') || answerText.includes('邮政')) {
        return '电信不含邮政，重在传输信息'
      }

      if (question.includes('地面无线电通信')) {
        return '地面通信含航空，别漏这一类'
      }

      if (question.includes('关于无线电通信') || (answerText.includes('无线电波') && answerText.includes('信息'))) {
        return '无线电通信=用无线波传信息'
      }

      if (question.includes('无线电波是指') || normalizedAnswer.includes('3000')) {
        return '无线电波<3THz，频率低于3000G'
      }

      if (question.includes('电磁波（') || (answerText.includes('电场') && answerText.includes('磁场'))) {
        return '电磁波=电场+磁场成对跑'
      }

      return ''
    }
  },

  // ========== 国际组织类（优先级88） ==========
  {
    questionPattern: /国际电信联盟|国际无线电管理|IARU|CQ 分区|CQ分区|国际业余无线电联盟|WAZ/,
    priority: 88,
    generateAid: (_question, correctAnswers) => {
      const answerText = correctAnswers.join('；')

      if (answerText.includes('国际电信联盟')) {
        return '协调无线电靠ITU'
      }

      if (answerText.includes('国家资源')) {
        return 'IARU把业余当国家资源'
      }

      if (answerText.includes('WAZ') || answerText.includes('《CQ》')) {
        return 'CQ分区源自美国CQ杂志WAZ'
      }

      return '国际题：记住ITU与IARU分工'
    }
  },

  // ========== 执照办理类（优先级86） ==========
  {
    questionPattern: /执照|许可|申请|变更|注销|设台|步骤|责任|自律/,
    priority: 86,
    generateAid: (_question, correctAnswers) => {
      const answerText = correctAnswers.join('；')

      if (answerText.includes('提出申请') && answerText.includes('执照')) {
        return '设台先申请执照，依法走流程'
      }

      if (answerText.includes('许可决定') && answerText.includes('办理变更')) {
        return '执照事项找原许可机关'
      }

      if (answerText.includes('注销') && answerText.includes('许可决定')) {
        return '注销也要回原许可机关'
      }

      if (answerText.includes('加强自律')) {
        return '持证自律守规矩'
      }

      return '执照流程：申请→许可→变更/注销均报机关'
    }
  },

  // ========== 类别比较类（优先级84） ==========
  {
    questionPattern: /不同类别|主要区别|类别区别/,
    priority: 84,
    generateAid: (_question, correctAnswers) => {
      const answerText = correctAnswers.join('；')
      if (answerText.includes('频率') && answerText.includes('功率')) {
        return '类别区别看频率+功率限制'
      }
      return '类别差异锁定频率和功率'
    }
  },

  // ========== 调制方式：SSB（优先级85） ==========
  {
    questionPattern: /SSB|单边带|侧边带/,
    priority: 85,
    generateAid: (_question, correctAnswers) => {
      if (correctAnswers.some(ans => ans.includes('单边带') || ans.includes('边带'))) {
        return '长距离弱信号SSB，窄带省功率'
      }
      if (correctAnswers.some(ans => ans.includes('调幅'))) {
        return 'SSB单边带调幅，省功率占频窄'
      }
      return 'SSB记忆：单边带，长距离，弱信号'
    }
  },

  // ========== 调制方式：FM（优先级85） ==========
  {
    questionPattern: /FM|调频|频率调制/,
    priority: 85,
    generateAid: (_question, correctAnswers) => {
      if (correctAnswers.some(ans => ans.includes('调频') || ans.includes('频率'))) {
        return 'FM对称波，本地清晰通信好'
      }
      if (correctAnswers.some(ans => ans.includes('中继'))) {
        return 'FM常用中继台，覆盖本地区域'
      }
      return 'FM频率调制，本地通信'
    }
  },

  // ========== 调制方式：CW（优先级85） ==========
  {
    questionPattern: /CW|等幅|莫尔斯|电键|电报/,
    priority: 85,
    generateAid: (question, correctAnswers) => {
      if (correctAnswers.some(ans => ans.includes('速度') || ans.includes('对方'))) {
        return 'CW发送跟对方，速度不要太快'
      }
      if (question.includes('带宽')) {
        return 'CW窄带之王，占频最省'
      }
      return 'CW等幅电报，带宽最窄'
    }
  },

  // ========== 功率类（优先级85） ==========
  {
    questionPattern: /功率|瓦|发射功率|e\.i\.r\.p/,
    priority: 85,
    generateAid: (_question, correctAnswers) => {
      const powerNums = correctAnswers.flatMap(ans => extractNumbers(ans))

      if (powerNums.includes(25)) return 'VHF/UHF最大25瓦'
      if (powerNums.includes(15)) return 'B类短波小于15瓦'
      if (powerNums.includes(1000)) return 'C类短波千瓦王'
      if (correctAnswers.some(ans => ans.includes('e.i.r.p') && ans.includes('1'))) {
        return '低频EIRP小于1瓦'
      }

      return '功率记：ABC递增，30MHz分两段'
    }
  },

  // ========== 天线类（优先级80） ==========
  {
    questionPattern: /天线|GP|垂直|八木|Yagi|偶极|定向/,
    priority: 80,
    generateAid: (question, correctAnswers) => {
      if (correctAnswers.some(ans => ans.includes('垂直') && ans.includes('全向'))) {
        return 'GP垂直全向1/4波，地网做镜像'
      }

      if (correctAnswers.some(ans => ans.includes('八木') || ans.includes('Yagi'))) {
        return '八木定向有增益，指向通信强'
      }

      if (correctAnswers.some(ans => ans.includes('偶极'))) {
        return '偶极半波水平架，双臂对称辐射'
      }

      if (question.includes('增益') && question.includes('dBi')) {
        return '天线增益是密度，dBi点源dBd半波'
      }

      if (question.includes('水平') && question.includes('指向性')) {
        return '水平方向没指向性'
      }

      return '天线记：GP全向，八木定向，偶极基准'
    }
  },

  // ========== 电波传播类（优先级80） ==========
  {
    questionPattern: /电离层|反射|传播|远距离|天波|地波/,
    priority: 80,
    generateAid: (question, correctAnswers) => {
      if (correctAnswers.some(ans => ans.includes('电离层') && ans.includes('反射'))) {
        return '远距离靠电离反射，短波天波传播'
      }

      if (correctAnswers.some(ans => ans.includes('地波'))) {
        return '地波沿地表，近距离传播'
      }

      if (question.includes('F107')) {
        return 'F107太阳辐射，预测电离层'
      }

      return '传播记：短波靠反射，VHF直线走'
    }
  },

  // ========== 操作规范类（优先级75） ==========
  {
    questionPattern: /呼叫|CQ|通联|守听|发起|语言|明语|缩略语|遇险|插入/,
    priority: 75,
    generateAid: (_question, correctAnswers) => {
      if (correctAnswers.some(ans => ans.includes('守听') || ans.includes('空闲'))) {
        return '呼叫前先守听，确认频率空闲'
      }

      if (correctAnswers.some(ans => ans.includes('CQ'))) {
        return 'CQ普遍呼叫，邀请任何台应答'
      }

      if (correctAnswers.some(ans => ans.includes('明语') || ans.includes('缩略语'))) {
        return '通信用明语，公认缩略语，禁用暗语'
      }

      if (correctAnswers.some(ans => ans.includes('遇险') || ans.includes('险情'))) {
        return '遇险优先，先确认需求再行动'
      }

      return '操作记：先听后叫，明语规范'
    }
  },

  // ========== 收发信机面板类（优先级83） ==========
  {
    questionPattern: /收发信机|面板|符号|SPLIT|RIT|XIT|NB|AGC|ATT|PRE|MODE/,
    priority: 83,
    generateAid: (question, correctAnswers) => {
      const merged = `${question}；${correctAnswers.join('；')}`.toUpperCase()

      if (merged.includes('NB') && merged.includes('SQL')) {
        return 'NB抑脉冲噪，SQL静噪断音'
      }

      if (merged.includes('MODE')) {
        return 'MODE切换工作方式：FM/AM/SSB/CW'
      }

      if (merged.includes('ATT')) {
        return 'ATT输入衰减，压住大信号'
      }

      if (merged.includes('AGC')) {
        return 'AGC自动增益，防止前级过载'
      }

      if (merged.includes('PRE')) {
        return 'PRE前置放大，弱信号才开启'
      }

      if (merged.includes('RIT')) {
        return 'RIT接收微调，不动主频'
      }

      if (merged.includes('XIT')) {
        return 'XIT发射微调，主频照旧'
      }

      if (merged.includes('SPLIT')) {
        return 'SPLIT异频收发，疏导堆叠'
      }

      return ''
    }
  },

  // ========== Q简语类（优先级83） ==========
  {
    questionPattern: /Q 简语|Q简语|QR[A-Z]|QS[A-Z]/,
    priority: 83,
    generateAid: (question) => {
      const qMap: Record<string, string> = {
        QRV: 'QRV=准备收，Ready to receive',
        QRZ: 'QRZ=谁在呼叫我',
        QSA: 'QSA=信号强度等级',
        QSB: 'QSB=信号起伏衰落',
        QSK: 'QSK=边发边听插入',
        QSL: 'QSL=确认抄收',
        QSO: 'QSO=当前通联',
        QSP: 'QSP=帮忙中转',
        QSY: 'QSY=换频到新频点'
      }

      for (const code of Object.keys(qMap)) {
        if (question.includes(code)) {
          return qMap[code]
        }
      }

      return ''
    }
  },

  // ========== 计量词头类（优先级82） ==========
  {
    questionPattern: /法定计量单位|词头/,
    priority: 82,
    generateAid: (question, _correctAnswers) => {
      const prefixMatch = question.match(/词头\s*([kMGTmpnμ\u03bc])/u)
      if (!prefixMatch) {
        return ''
      }

      const symbol = prefixMatch[1]
      const normalized = symbol === '\u03bc' ? 'μ' : symbol

      const prefixMap: Record<string, string> = {
        k: 'k=10^3 千',
        M: 'M=10^6 兆',
        G: 'G=10^9 吉',
        T: 'T=10^12 太',
        m: 'm=10^-3 毫',
        μ: 'μ=10^-6 微',
        n: 'n=10^-9 纳',
        p: 'p=10^-12 皮'
      }

      return prefixMap[normalized] || ''
    }
  },

  // ========== 应急通信类（优先级85） ==========
  {
    questionPattern: /应急|紧急|突发|抢险|救灾/,
    priority: 85,
    generateAid: (_question, correctAnswers) => {
      if (correctAnswers.some(ans => ans.includes('突发') && ans.includes('紧急'))) {
        return '突发灾害才应急，平时训练不算数'
      }

      if (correctAnswers.some(ans => ans.includes('抢险救灾') || ans.includes('应急救援'))) {
        return '应急内容限救灾，相关事务才能说'
      }

      if (correctAnswers.some(ans => ans.includes('48 小时') || ans.includes('48小时'))) {
        return '临时设台48小时报告'
      }

      return '应急记：突发灾害，限定内容，48小时报告'
    }
  },

  // ========== 中继台类（优先级80） ==========
  {
    questionPattern: /中继|转发|覆盖|频差/,
    priority: 80,
    generateAid: (_question, correctAnswers) => {
      if (correctAnswers.some(ans => ans.includes('600') && ans.includes('kHz'))) {
        return '144频差600k，430频差5M'
      }

      if (correctAnswers.some(ans => ans.includes('5') && ans.includes('MHz'))) {
        return '430中继频差5MHz标准'
      }

      if (correctAnswers.some(ans => ans.includes('平等') || ans.includes('服务'))) {
        return '中继平等服务，覆盖区内所有台'
      }

      if (correctAnswers.some(ans => ans.includes('遥控') || ans.includes('停止发射'))) {
        return '中继配遥控，干扰及时停'
      }

      return '中继记：频差标准，服务平等，可控可停'
    }
  },

  // ========== 禁止行为类（优先级80） ==========
  {
    questionPattern: /禁止|不得|严禁|不可以|错误|违法|行为|评论|性质/,
    priority: 80,
    generateAid: (_question, correctAnswers) => {
      if (correctAnswers.some(ans => ans.includes('谋取商业') || ans.includes('营利'))) {
        return '五不原则：商转播干密都禁止'
      }

      if (correctAnswers.some(ans => ans.includes('转达信息') || ans.includes('转发'))) {
        return '不为他人转信息，只能自己通'
      }

      if (correctAnswers.some(ans => ans.includes('广播') || ans.includes('通播'))) {
        return '未批准不能广播，不发通播信号'
      }

      if (correctAnswers.some(ans => ans.includes('干扰') || ans.includes('压制'))) {
        return '不得故意干扰，不压制他台'
      }

      if (correctAnswers.some(ans => ans.includes('暗语') || ans.includes('加密'))) {
        return '禁用暗语加密，只用明语'
      }

      if (correctAnswers.some(ans => ans.includes('违法'))) {
        return '违法=违背五不原则'
      }

      return '禁止记：商转播干密，五不要记牢'
    }
  },

  // ========== 频率使用原则类（优先级83） ==========
  {
    questionPattern: /频率的使用|平等使用权|网络频率|加入通信/,
    priority: 83,
    generateAid: (_question, correctAnswers) => {
      if (correctAnswers.some(ans => ans.includes('平等'))) {
        return '业余频率人人平等，要礼让'
      }

      if (correctAnswers.some(ans => ans.includes('欢迎加入'))) {
        return '网络频率也公用，欢迎业余台加入'
      }

      return ''
    }
  },

  // ========== 违规互通提醒类（优先级83） ==========
  {
    questionPattern: /公众对讲机|扩频|对讲机通信/,
    priority: 83,
    generateAid: () => '业余台不能与公众对讲机互通'
  },

  // ========== 设备管理类（优先级75） ==========
  {
    questionPattern: /型号核准|自制|改装|拼装|设备/,
    priority: 75,
    generateAid: (_question, correctAnswers) => {
      if (correctAnswers.some(ans => ans.includes('型号核准') && ans.includes('业余业务频段'))) {
        return '商品设备要核准，频率含业余段'
      }

      if (correctAnswers.some(ans => ans.includes('自制') && ans.includes('国家标准'))) {
        return '自制设备符合标准，仅限业余频段'
      }

      if (correctAnswers.some(ans => ans.includes('批量生产') || ans.includes('未取得型号核准'))) {
        return '批量生产未核准，不能用于业余台'
      }

      return '设备记：商品核准，自制合规'
    }
  },

  // ========== 验证考试类（优先级75） ==========
  {
    questionPattern: /验证|考试|题库|证书|能力/,
    priority: 75,
    generateAid: (_question, correctAnswers) => {
      if (correctAnswers.some(ans => ans.includes('A 类') || ans.includes('B 类') || ans.includes('C 类'))) {
        return 'ABC三类递进，难度功率递增'
      }

      if (correctAnswers.some(ans => ans.includes('6 个月'))) {
        return 'B类需持A证6个月以上'
      }

      if (correctAnswers.some(ans => ans.includes('18 个月'))) {
        return 'C类需持短波证18个月以上'
      }

      if (correctAnswers.some(ans => ans.includes('题库') && ans.includes('国家'))) {
        return '题库标准国家定，验证组织提前公布'
      }

      if (correctAnswers.some(ans => ans.includes('不得') && ans.includes('费用'))) {
        return '验证考试不收费'
      }

      return '验证记：ABC递进，有门槛，免费考'
    }
  },

  // ========== 干扰相关类（优先级80） ==========
  {
    questionPattern: /干扰|有害干扰|杂散|谐波/,
    priority: 80,
    generateAid: (_question, correctAnswers) => {
      if (correctAnswers.some(ans => ans.includes('导航') || ans.includes('安全业务'))) {
        return '有害干扰：危害导航安全业务'
      }

      if (correctAnswers.some(ans => ans.includes('阻碍') || ans.includes('损害'))) {
        return '有害干扰：严重损害阻断通信'
      }

      if (correctAnswers.some(ans => ans.includes('责令改正') && ans.includes('拒不改正'))) {
        return '干扰处理：先责令，拒改没收+罚款'
      }

      if (correctAnswers.some(ans => ans.includes('20 万') || ans.includes('50 万'))) {
        return '安全通信受干扰，罚款20-50万'
      }

      return '干扰记：避免有害干扰是首要责任'
    }
  },

  // ========== 电路电压类（优先级70） ==========
  {
    questionPattern: /电压|电流|电阻|欧姆|并联|串联/,
    priority: 70,
    generateAid: (question, correctAnswers) => {
      if (question.includes('峰峰') && correctAnswers.some(ans => ans.includes('35'))) {
        return '峰峰电压是35V，单峰是70V，平均0V'
      }

      if (correctAnswers.some(ans => ans.includes('并联') && ans.includes('电压'))) {
        return '电压并联，电流串联'
      }

      if (correctAnswers.some(ans => ans.includes('90度') || ans.includes('90 度'))) {
        return '容抗电压滞后电流90度'
      }

      return '电路记：电压并，电流串'
    }
  },

  // ========== 驻波比类（优先级70） ==========
  {
    questionPattern: /驻波|驻波比|SWR|匹配/,
    priority: 70,
    generateAid: (_question, correctAnswers) => {
      if (correctAnswers.some(ans => ans.includes('1') && (ans.includes(':1') || ans.includes('比1')))) {
        return '完美驻波1:1，完美匹配无反射'
      }

      if (correctAnswers.some(ans => ans.includes('匹配') || ans.includes('质量'))) {
        return '驻波比看匹配质量，越小越好'
      }

      return '驻波记：1:1完美，越小越好'
    }
  },

  // ========== 频率划分类（优先级80） ==========
  {
    questionPattern: /(频率|频道|业务|术语).*(划分|分配|指配|称为|过程|使用)|主要业务|次要业务|划分|分配|指配/,
    answerPattern: /(划分|分配|指配|主要业务|次要业务)/,
    priority: 80,
    generateAid: (_question, correctAnswers) => {
      if (correctAnswers.some(ans => ans.includes('主要业务') && ans.includes('次要业务'))) {
        return '频率划分：主要次要两类业务'
      }

      if (correctAnswers.some(ans => ans.includes('不得') && ans.includes('主要业务'))) {
        return '次要业务：不干扰主要，不要求保护'
      }

      if (correctAnswers.some(ans => ans.includes('划分'))) return '划分：规定频段供业务使用'
      if (correctAnswers.some(ans => ans.includes('分配'))) return '分配：规定部门区域使用'
      if (correctAnswers.some(ans => ans.includes('指配'))) return '指配：批准电台使用频率'

      return '频率管理：划分→分配→指配三级'
    }
  },

  // ========== 业余业务定义类（优先级75） ==========
  {
    questionPattern: /业余业务|卫星业余|定义|自我训练|相互通信|法定用途|业余无线电台|业余无线电爱好者/,
    priority: 75,
    generateAid: (_question, correctAnswers) => {
      if (correctAnswers.some(ans => ans.includes('自我训练') && ans.includes('相互通信') && ans.includes('技术研究'))) {
        return '业余业务三要素：训练通信研究'
      }

      if (correctAnswers.some(ans => ans.includes('卫星') && ans.includes('地球卫星'))) {
        return '卫星业余：利用卫星开展业余业务'
      }

      if (correctAnswers.some(ans => ans.includes('纯系个人爱好') && ans.includes('不涉及谋取利润'))) {
        return '业余性质：个人兴趣，非营利'
      }

      return '业余定义：技术爱好，非营利'
    }
  },

  // ========== 多选题特征（优先级65） ==========
  {
    questionPattern: /正确的|说法正确|符合|应当遵守|包括|哪些/,
    priority: 65,
    generateAid: (_question, correctAnswers) => {
      if (correctAnswers.length === 4) return '全面题：问全部完整，通常四选'
      if (correctAnswers.length === 3) return '多数题：除...外，通常三选'
      if (correctAnswers.length === 2) return '部分题：正确的有，通常两选'
      return ''
    }
  },

  // ========== 错误选项题（优先级65） ==========
  {
    questionPattern: /错误|不正确|不符合|不得|禁止/,
    priority: 65,
    generateAid: (question, _correctAnswers) => {
      if (question.includes('错误的是') || question.includes('不正确的是')) {
        return '反向题：问错误选项，选错误描述'
      }
      return ''
    }
  },

  // ========== 默认规则（优先级1，兜底） ==========
  {
    priority: 1,
    generateAid: (_question, correctAnswers) => {
      if (correctAnswers.length === 1) {
        // 单选题：提取答案关键内容
        const answer = correctAnswers[0]

        // 如果答案很短，直接返回
        if (answer.length <= 20) return answer

        // 提取核心关键词
        if (answer.includes('国家') || answer.includes('无线电管理机构')) {
          return '国家或无线电管理机构相关'
        }

        if (answer.includes('不得') || answer.includes('禁止')) {
          return '禁止性规定'
        }

        if (answer.includes('应当') || answer.includes('必须')) {
          return '强制性规定'
        }

        // 提取数字特征
        const nums = extractNumbers(answer)
        if (nums.length > 0) {
          return `关键数字：${nums.slice(0, 3).join('、')}`
        }

        // 提取前面关键词
        const keywords = answer.substring(0, 15)
        return keywords + (answer.length > 15 ? '...' : '')
      } else {
        // 多选题：提炼每个答案的首句作为记忆点
        const summaries = correctAnswers
          .map(ans => ans.trim())
          .map(ans => {
            const segment = ans.split(/，|。|；|;|,/)[0] || ans
            return segment.length > 12 ? segment.slice(0, 12) : segment
          })
          .filter(Boolean)

        if (summaries.length === 0) {
          return `${correctAnswers.length}个要点`
        }

        const joined = summaries.slice(0, 3).join('、')
        return `记：${joined}${summaries.length > 3 ? '…' : ''}`
      }
    }
  }
]

/**
 * 根据题目内容和正确答案内容生成记忆口诀
 */
export function generateMemoryAid(question: string, correctAnswerTexts: string[]): string {
  // 按优先级排序
  const sortedRules = [...memoryAidRules].sort((a, b) => b.priority - a.priority)

  // 遍历规则找匹配
  for (const rule of sortedRules) {
    let questionMatch = true
    let answerMatch = true

    if (rule.questionPattern) {
      questionMatch = rule.questionPattern.test(question)
    }

    if (rule.answerPattern) {
      answerMatch = correctAnswerTexts.some(ans => rule.answerPattern!.test(ans))
    }

    if (questionMatch && answerMatch) {
      const aid = rule.generateAid(question, correctAnswerTexts)
      if (aid && aid.trim() !== '') {
        return aid
      }
    }
  }

  // 默认规则
  const defaultRule = sortedRules[sortedRules.length - 1]
  return defaultRule.generateAid(question, correctAnswerTexts)
}
