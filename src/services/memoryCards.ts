/**
 * 记忆卡片集数据服务
 *
 * 基于【核心记忆工具箱 (Mnemonic Toolbox)】方法论
 * 提供系统化的分类记忆卡片，帮助快速记忆C类考试1282道题目
 */

export interface MemoryCard {
  id: string
  title: string
  content: string
  tip?: string // 额外提示
  tool?: string // 使用的记忆工具
}

export interface MemoryCardSet {
  id: string
  title: string
  icon: string
  description: string
  color: string
  category?: number // 对应题库分类 1-5
  cards: MemoryCard[]
}

// =============================================================================
// 【记忆工具箱概览卡片集】- 必读！
// =============================================================================

export const toolboxCardSets: MemoryCardSet[] = [
  {
    id: 'toolbox-intro',
    title: '🧰 记忆工具箱入门',
    icon: 'construction',
    description: '4大核心工具，掌握1282题的记忆密码',
    color: 'deep-purple',
    cards: [
      {
        id: 'tool1-anchor',
        title: '工具1️⃣：关键词锚定法',
        content: '**适用场景**：单选题（占83%）\n\n**3步操作**：\n1. 提取题目**"提问锚点A"**（最关键名词/动词）\n2. 提取答案**"答案锚点B"**（核心词）\n3. 用**夸张/有趣**的方式，将A和B"焊接"在一起\n\n**示例**：\n题目锚点：罚款 + 答案锚点：最大金额\n→ 口诀："看到罚款选最大"',
        tip: '联想越离奇，记忆越深刻！',
        tool: '关键词锚定法'
      },
      {
        id: 'tool2-acronym',
        title: '工具2️⃣：首字串联法',
        content: '**适用场景**：多选题（占16%）\n\n**2种方式**：\n1. **首字串联**：提取关键词首字，组成新词组\n2. **故事串联**：用关键词编微型故事\n\n**示例**：\n中继台设置：共享集约+平等服务+公开参数+超区协调\n→ 首字："**共平公超**" \n→ 故事："**共**建**平**台**公**开**超**区"',
        tip: '多选题全选标记：MC4=四选全选，MC3=三选，MC2=双选',
        tool: '首字串联法'
      },
      {
        id: 'tool3-elimination',
        title: '工具3️⃣：错误选项排除法',
        content: '**适用场景**：选项相似/易混淆题\n\n**3步操作**：\n1. 完成正确答案记忆\n2. 审视最易混淆的错误选项\n3. 贴上"为什么错"的标签\n\n**示例**：\n信标台功能选错误的：\n→ "接收和转发都是错的"（信标只发不收）',
        tip: '反向记忆更深刻！',
        tool: '错误选项排除法'
      },
      {
        id: 'tool4-homophonic',
        title: '工具4️⃣：谐音/图像替换法',
        content: '**适用场景**：抽象概念/数字/生僻字\n\n**3步操作**：\n1. 找到抽象的关键词\n2. 用发音相近的具体物体替换\n3. 将具体物体编入视觉联想\n\n**示例**：\n29.3-29.51MHz（10米星用频段）\n→ 谐音："**二酒散到二酒我要**"\n→ 图像：卫星在天上喝酒',
        tip: '数字谐音化，记忆效率提升10倍！',
        tool: '谐音/图像替换法'
      },
      {
        id: 'exam-stats',
        title: '📊 考试题型分析',
        content: '**总题数**：1282题\n**单选题**：1065题（83%）← 关键词锚定法\n**多选题**：210题（16%）← 首字串联法\n\n**分类分布**：\n1. 法规 181题（14.1%）\n2. 技术基础 325题（25.4%）\n3. 发射接收机 324题（25.3%）\n4. 天线馈线 421题（32.8%）← 最多\n5. 安全防护 31题（2.4%）',
        tip: '及格线：768分（60%），优秀线：1024分（80%）'
      }
    ]
  }
]

// =============================================================================
// 【第1类：无线电管理法规】181题 - 14.1%
// =============================================================================

export const category1CardSets: MemoryCardSet[] = [
  {
    id: 'category1-penalty',
    title: '💰 罚款金额体系',
    icon: 'gavel',
    description: '最严重50万→最轻微1万，排除千元陷阱',
    color: 'red',
    category: 1,
    cards: [
      {
        id: 'penalty-top',
        title: '【最严重】20-50万档',
        content: '**诈骗电台** → 20-50万\n**干扰安全** → 20-50万（涉及人身安全）\n\n**记忆口诀**：\n"看到50万选它"',
        tip: '金字塔顶端，最严重的两种行为',
        tool: '关键词锚定法'
      },
      {
        id: 'penalty-serious',
        title: '【很严重】5-20万档',
        content: '**擅用频率** → 5万以下 + 5-20万\n**擅设电台** → 5万以下 + 5-20万\n**未取核准** → 5-20万（拒改20-100万翻倍）\n**干扰业务** → 没收设备 + 5-20万 + 吊照\n\n**记忆口诀**：\n"双5到20"（两档罚款）',
        tip: '没收设备+罚款，一个都不能少',
        tool: '关键词锚定法'
      },
      {
        id: 'penalty-medium',
        title: '【中等】3万/3-10万档（三兄弟）',
        content: '**不按执照** → 3万以下 + 严重吊照3-10万\n**故意收发** → 3万以下 + 严重吊照3-10万\n**擅编呼号** → 3万以下 + 严重吊照3-10万\n\n**记忆口诀**：\n"三兄弟3到10"',
        tip: '三个行为，相同处罚',
        tool: '首字串联法'
      },
      {
        id: 'penalty-foreign',
        title: '【涉外类】3-10万/10-30万档',
        content: '**大功率未抑制** → 拒改3-10万 + 严重10-30万\n**境外测试监测** → 拒改3-10万 + 严重10-30万\n**泄密电波参数** → 拒改3-10万 + 严重10-30万\n\n**记忆口诀**：\n"涉外两档：3到10再10到30"',
        tip: '涉外违规，逐级加重',
        tool: '首字串联法'
      },
      {
        id: 'penalty-light',
        title: '【最轻微】1-3万档',
        content: '**销售未备案** → 责改 + 拒改1-3万\n\n**记忆口诀**：\n"最小也是万元起"',
        tip: '金字塔底层，但仍然是万元级别',
        tool: '错误选项排除法'
      },
      {
        id: 'penalty-trap',
        title: '⚠️ 千元陷阱 & 管制不罚款',
        content: '**陷阱选项**：\n"千元以下罚款" ← 全是错的！\n\n**管制违法**：\n❌ 不罚款！\n✅ 只有：关机 + 查扣 + 吊照 + 公安管\n\n**记忆口诀**：\n"管制违法不罚款，只关查扣吊照"',
        tip: '排除法：看到千元罚款直接排除！',
        tool: '错误选项排除法'
      }
    ]
  },
  {
    id: 'category1-license',
    title: '📜 ABC类操作权限',
    icon: 'badge',
    description: '30MHz分界线，记住25W和1000W',
    color: 'blue',
    category: 1,
    cards: [
      {
        id: 'abc-table',
        title: 'ABC类权限对比表',
        content: '**A类新手**：\n30-3000MHz，最多25W，无等待期\n\n**B类进阶**：\n全频段，30下<15W + 30上≤25W，等6个月\n\n**C类高手**：\n全频段，30下≤1000W + 30上≤25W，等18个月\n\n**记忆口诀**：\n"A25全，B15短25长，C1000短25长"',
        tip: '关键分界线：30MHz',
        tool: '关键词锚定法'
      },
      {
        id: 'abc-frequency',
        title: '频率范围记忆',
        content: '**A类**：只能玩VU段（30-3000MHz）\n**B类**：全频段都能碰\n**C类**：全权限开放\n\n**30MHz分界线**：\n30以下 = HF短波\n30以上 = VHF/UHF超短波\n\n**记忆口诀**：\n"30MHz是分界线"',
        tip: 'A类不能碰短波（30MHz以下）',
        tool: '关键词锚定法'
      },
      {
        id: 'abc-waiting',
        title: '等待期限速记',
        content: '**A类** → 无等待期（立即考）\n**B类** → 6个月（半年）\n**C类** → 18个月（一年半）\n\n**记忆口诀**：\n"A无等，B半年，C一年半"',
        tip: '等待期从取得上一级执照算起',
        tool: '数字锚定法'
      },
      {
        id: 'abc-minor',
        title: '未成年人操作规则',
        content: '**可以申请**：A类、B类\n**不能申请**：C类\n\n**限制**：\nVU段25W可以 ✅\nHF短波不给碰 ❌\n\n**记忆口诀**：\n"未成年AB类都行，VU25瓦但HF不给碰"',
        tip: '保护未成年，不让玩大功率短波',
        tool: '错误选项排除法'
      }
    ]
  },
  {
    id: 'category1-frequency',
    title: '📡 频段划分速记',
    icon: 'straighten',
    description: '老马很威武是恶霸，3和30交替跳',
    color: 'green',
    category: 1,
    cards: [
      {
        id: 'freq-7bands',
        title: '7大频段口诀',
        content: '**"老马很威武，是恶霸"**\n\n**L**F (低频Low) - 老\n**M**F (中频Medium) - 马\n**H**F (高频High) - 很（基准）\n**V**HF (甚高频Very) - 威\n**U**HF (特高频Ultra) - 武\n**S**HF (超高频Super) - 是\n**E**HF (极高频Extremely) - 恶霸',
        tip: '易混陷阱：Ultra(特UHF)在前 < Super(超SHF)在后',
        tool: '首字串联法'
      },
      {
        id: 'freq-calculation',
        title: '频段范围计算规律',
        content: '**"3和30交替跳，×10倍"**\n\n基准：**HF = 3-30MHz**\n÷10：MF = 0.3-3MHz\n÷10：LF = 30-300kHz\n×10：VHF = 30-300MHz\n×10：UHF = 0.3-3GHz\n×10：SHF = 3-30GHz\n×10：EHF = 30-300GHz',
        tip: '记住基准HF=3-30MHz，其他都是×10或÷10',
        tool: '数字规律法'
      },
      {
        id: 'freq-amateur',
        title: '业余专用频段',
        content: '**口诀**："**7 14 21 28，加个47G最大**"\n\n**7MHz**（40米波段）- 妻\n**14MHz**（20米波段）- 要死\n**21MHz**（15米波段）- 儿要\n**28MHz**（10米波段）- 恶霸\n**47GHz** - 最高频段\n\n**规律**：等比数列7×2再翻倍',
        tip: '这几个是业余无线电专用频段',
        tool: '谐音法'
      },
      {
        id: 'freq-vu-bands',
        title: 'VU段主要业务频段',
        content: '**50MHz**（6米波段）- 武林守VHF门\n**144-146MHz**（2米波段）- 前两兆我独享\n**430-440MHz**（0.7米波段）- 次要业务要谦让\n\n**记忆口诀**：\n"50和144是主要，430是次要"',
        tip: '144MHz是VU段唯一主要业务频段',
        tool: '关键词锚定法'
      }
    ]
  }
]

// =============================================================================
// 【第2类：无线电技术基础】325题 - 25.4%
// =============================================================================

export const category2CardSets: MemoryCardSet[] = [
  {
    id: 'category2-q-code',
    title: '📻 Q简语系统',
    icon: 'settings_input_antenna',
    description: '第3个字母决定含义，M=Man他台，N=Nature天电',
    color: 'indigo',
    category: 2,
    cards: [
      {
        id: 'q-interference',
        title: '干扰类Q简语',
        content: '**QRM** - 他台干扰（M=Man人）\n**QRN** - 天电干扰（N=Nature自然）\n\n**记忆口诀**：\n"M=man他台，N=nature天电"',
        tip: 'QRM和QRN最容易混淆，记住第3个字母',
        tool: '首字母谐音法'
      },
      {
        id: 'q-power',
        title: '功率类Q简语',
        content: '**QRP** - 小功率（P=Power功率）\n**QRO** - 增功率（O=mOre更多）\n\n**记忆口诀**：\n"P小O增，RP就是小功率"',
        tip: 'QRP不限定5W，只是小功率的意思',
        tool: '关键词锚定法'
      },
      {
        id: 'q-speed',
        title: '速度类Q简语',
        content: '**QRQ** - 加快速度（Q=Quick快）\n**QRS** - 放慢速度（S=Slow慢）\n\n**记忆口诀**：\n"Q快S慢"',
        tip: 'PSE QRQ = 请加快，PSE QRS = 请放慢',
        tool: '首字母谐音法'
      },
      {
        id: 'q-operation',
        title: '操作类Q简语',
        content: '**QRT** - 关机（T=Terminate结束）\n**QRV** - 准备好（V=ready）\n**QRZ?** - 谁呼叫我？（Z=谁）\n\n**记忆口诀**：\n"T结束，V准备，Z谁"',
        tip: 'QRT结束通联，QRV准备收信',
        tool: '首字母谐音法'
      },
      {
        id: 'q-signal',
        title: '信号类Q简语',
        content: '**QSA** - 信号强度（A=Amplitude幅度）\n**QSB** - 信号衰落（B=变化）\n**QSL** - 收到确认（L=Listen听到了吗）\n\n**记忆口诀**：\n"A幅度，B衰落，L收到"',
        tip: 'QSL也指QSL卡片',
        tool: '首字母谐音法'
      },
      {
        id: 'q-frequency',
        title: '频率类Q简语',
        content: '**QSX** - 守听（X=watch守听某频率）\n**QSY** - 换频（Y=Yonder那边）\n**QTH** - 位置（TH=THere那里）\n\n**记忆口诀**：\n"X守听，Y换频，TH位置"',
        tip: 'QSX守听7074，QSY到某频',
        tool: '首字母谐音法'
      }
    ]
  },
  {
    id: 'category2-timezone',
    title: '🌍 时区换算',
    icon: 'schedule',
    description: '北京东8区UTC+8，东加西减8基准',
    color: 'cyan',
    category: 2,
    cards: [
      {
        id: 'timezone-base',
        title: '北京时间换算公式',
        content: '**UTC → 北京**：UTC + 8小时\n**北京 → UTC**：北京 - 8小时\n\n**注意**：\n时>24则-24，日期+1\n时<0则+24，日期-1\n\n**记忆口诀**：\n"北京东八区UTC+8"',
        tip: '东边早，西边晚',
        tool: '公式锚定法'
      },
      {
        id: 'timezone-ew',
        title: '东西时区换算',
        content: '**西N区 → 北京**：北京 - (8+N)小时\n**东N区 → 北京**：北京 - (8-N)小时\n\n**记忆口诀**：\n"东加西减8基准"',
        tip: '想象地球仪，北京在东8区',
        tool: '公式锚定法'
      },
      {
        id: 'timezone-division',
        title: '时区划分规则',
        content: '**24个时区**：每区15度\n**0区中心**：本初子午线（伦敦）\n**东1-东12**：向东数\n**西1-西12**：向西数\n\n**中国**：北京、西安、乌鲁木齐都属东8区',
        tip: '法定时区，全国统一用北京时间',
        tool: '关键词锚定法'
      }
    ]
  },
  {
    id: 'category2-nato',
    title: '🔤 NATO字母表',
    icon: 'text_fields',
    description: 'B=Bravo，H=Hotel，首字母对应',
    color: 'purple',
    category: 2,
    cards: [
      {
        id: 'nato-common',
        title: '高频字母速记',
        content: '**A** - Alfa（阿尔法狗）\n**B** - Bravo（布拉沃！）\n**C** - Charlie（查理·卓别林）\n**D** - Delta（三角洲△）\n**H** - Hotel（酒店）\n**J** - Juliett（朱丽叶）\n**K** - Kilo（千克）\n**R** - Romeo（罗密欧）\n**S** - Sierra（山脉）\n**V** - Victor（胜利）',
        tip: '首字母法：B=Bravo，H=Hotel',
        tool: '场景记忆法'
      },
      {
        id: 'nato-usage',
        title: 'NATO拼读规则',
        content: '**示例**：\nBH1XYZ → Bravo Hotel One X-ray Yankee Zulu\n\n**规则**：\n1. 字母用NATO单词\n2. 数字直接读\n3. "/"读作Portable\n\n**记忆口诀**：\n"看到NATO题，直接用首字母对应"',
        tip: 'BH1XYZ → 找Bravo Hotel One开头',
        tool: '首字母法'
      }
    ]
  },
  {
    id: 'category2-contest',
    title: '🏆 竞赛与通联',
    icon: 'emoji_events',
    description: '日志5要素：时频模呼报',
    color: 'orange',
    category: 2,
    cards: [
      {
        id: 'contest-log',
        title: '日志5要素',
        content: '**时间** - DATE TIME\n**频率** - FREQ\n**模式** - MODE\n**呼号** - CALL\n**报告** - RST\n\n**记忆口诀**：\n"时频模呼报"',
        tip: '日志是通联记录，必须包含这5项',
        tool: '首字串联法'
      },
      {
        id: 'contest-qsl',
        title: 'QSL卡6要素',
        content: '**双方呼号**\n**报告**\n**时间**\n**方式**\n**频率**\n**签章地址**\n\n**记忆口诀**：\n"双方报告时间方式频率签章"',
        tip: 'Eyeball QSO（现场交流）不能空白卡',
        tool: '首字串联法'
      },
      {
        id: 'contest-report',
        title: '竞赛报告格式',
        content: '**CQWW CW**：599 + CQ分区（59924）\n**IARU SSB**：59 + 年龄（5944 = 20+24女）\n**ALL ASIAN SSB**：59 + 年龄（5900或5920）\n**ARRL 160米**：599 + 州缩写（599NJ）',
        tip: '不同竞赛，报告格式不同',
        tool: '场景记忆法'
      }
    ]
  }
]

// =============================================================================
// 【第3类：发射机和接收机】324题 - 25.3%
// =============================================================================

export const category3CardSets: MemoryCardSet[] = [
  {
    id: 'category3-buttons',
    title: '🎛️ 按钮功能速记',
    icon: 'settings',
    description: 'RIT=R收，XIT=X发，ATT挡强信号',
    color: 'primary',
    category: 3,
    cards: [
      {
        id: 'strong-signal',
        title: '强信号三剑客',
        content: '**ATT** - 衰减器挡强信号\n**AGC** - 自动增益控制防爆音\n**降功率** - 保护器件\n\n**记忆口诀**：\n"ATT挡强信号防互调"',
        tip: '强信号+干扰 → 开ATT',
        tool: '关键词锚定法'
      },
      {
        id: 'weak-signal',
        title: '弱信号三法宝',
        content: '**PRE** - 前置放大器（Pre-amplifier）\n**长AGC** - 缓慢控制\n**射频增益** - 开到最大\n\n**记忆口诀**：\n"PRE前放弱信号专用"',
        tip: '弱信号+强干扰 → 关AGC',
        tool: '关键词锚定法'
      },
      {
        id: 'interference',
        title: '干扰三杀手',
        content: '**NB** - 脉冲噪声抑制（Noise Blanker）\n**SQL** - 静噪（Squelch）\n**窄带宽** - 滤邻频\n\n**记忆口诀**：\n"NB切脉冲，SQL关音频"',
        tip: '火花干扰 → 开NB',
        tool: '关键词锚定法'
      },
      {
        id: 'distortion',
        title: '失真三招治',
        content: '**降话筒增益** - 间隙沙沙声\n**调ALC** - 自动电平控制\n**关PROC** - 语音压缩器\n\n**记忆口诀**：\n"话音间隙沙沙→降话筒增益"',
        tip: 'AFSK发送要关ALC和PROC',
        tool: '场景记忆法'
      },
      {
        id: 'freq-tune',
        title: '频率微调组',
        content: '**RIT** - 接收增量调谐（R=Receiver）\n**XIT** - 发射增量调谐（X=Transmitter）\n**SPLIT** - 异频收发（劈开）\n\n**记忆口诀**：\n"RIT=R收，XIT=X发，SPLIT劈开"',
        tip: 'RIT调音调（SSB/CW偏音）',
        tool: '首字母谐音法'
      }
    ]
  },
  {
    id: 'category3-sensitivity',
    title: '📶 灵敏度换算',
    icon: 'signal_cellular_alt',
    description: '只记4个数字：107、6、113、0',
    color: 'teal',
    category: 3,
    cards: [
      {
        id: 'sensitivity-4kings',
        title: '灵敏度4天王',
        content: '**1μV测值**：\n灵敏度 = 2μV\n功率 = **-107**dBm\n电平 = **6**dBμV\n\n**0.5μV测值**：\n灵敏度 = 1μV\n功率 = **-113**dBm\n电平 = **0**dBμV（基准）\n\n**记忆口诀**：\n"记107和6，记113和0基准"',
        tip: '10dB信噪比 → 灵敏度翻倍',
        tool: '数字锚定法'
      },
      {
        id: 'sensitivity-rule',
        title: '灵敏度规律',
        content: '**规律**：\n因10dB信噪比，测值要翻倍\n\n1μV测值 → 灵敏度2μV\n0.5μV测值 → 灵敏度1μV\n\n**记忆口诀**：\n"测值翻倍变灵敏度"',
        tip: '制约灵敏度：机内噪声',
        tool: '公式锚定法'
      }
    ]
  },
  {
    id: 'category3-repeater',
    title: '🔁 中继台故障诊断',
    icon: 'cell_tower',
    description: '互调算法：2发减收',
    color: 'deep-orange',
    category: 3,
    cards: [
      {
        id: 'repeater-intermod',
        title: '中继台互调计算',
        content: '**互调频率公式**：\nf_互调 = 2×f_发1 - f_收\n或：f_互调 = 2×f_发2 - f_收\n\n**记忆口诀**：\n"互调算法：2发减收"',
        tip: '双工滤波挡自发',
        tool: '公式锚定法'
      },
      {
        id: 'repeater-symptoms',
        title: '中继台故障症状',
        content: '**持续发射** → 自锁了（隔离差）\n**断续模糊** → 互调来\n**忽长忽短模糊** → 又是互调\n\n**记忆口诀**：\n"断续模糊→互调来，持续发射→自锁了"',
        tip: '共天线插双工，双工滤波挡自发',
        tool: '场景记忆法'
      },
      {
        id: 'repeater-frequency',
        title: '中继频差速记',
        content: '**V段（144MHz）** → 0.6MHz（溜溜溜）\n**U段（430MHz）** → 5MHz（我最猛）\n\n**记忆口诀**：\n"V段0.6M，U段5M"',
        tip: '中继频差顺口溜',
        tool: '谐音法'
      }
    ]
  },
  {
    id: 'category3-propagation',
    title: '📡 电波传播',
    icon: 'waves',
    description: 'HF靠电离层，VHF/UHF靠视距',
    color: 'light-blue',
    category: 3,
    cards: [
      {
        id: 'ionosphere-layers',
        title: '电离层高度与密度',
        content: '**高度排序**：F2 > F1 > E > D（从高到低）\n**密度排序**：F2 > F1 > E > D（从密到疏）\n\n**记忆口诀**：\n"电离层高度：F2>F1>E>D"',
        tip: '太阳黑子多 → 电离密度高 → HF DX好',
        tool: '关键词锚定法'
      },
      {
        id: 'vhf-propagation',
        title: 'VHF/UHF超视距传播',
        content: '**对流层散射** → 500公里\n**突发E层** → 1000+公里（6米2米千里）\n**大气波导** → 高空逆温\n**流星余迹** → 6米波段（50MHz）\n\n**记忆口诀**：\n"VHF/UHF超视距→大气波导"',
        tip: '视距传播看相对高度',
        tool: '场景记忆法'
      },
      {
        id: 'path-loss',
        title: '路径损耗速算',
        content: '**距离×5** → -14dB → 降2S格\n**距离×10** → -20dB → 降3S格\n**频率×3** → -9.5dB → 降1.5S格\n**功率÷4** → -6dB → 降1S格\n\n**记忆口诀**：\n"记住：5→14→2，10→20→3"',
        tip: 'S表换算：6dB=1S格',
        tool: '数字规律法'
      }
    ]
  }
]

// =============================================================================
// 【第4类：天线和馈线】421题 - 32.8%（最多）
// =============================================================================

export const category4CardSets: MemoryCardSet[] = [
  {
    id: 'category4-units',
    title: '📏 单位词头系统',
    icon: 'straighten',
    description: '昆明高铁没有牛皮',
    color: 'amber',
    category: 4,
    cards: [
      {
        id: 'units-big',
        title: '大单位：昆明高铁',
        content: '**k（千）** = 1,000（3个零）- **昆**明\n**M（兆）** = 1,000,000（6个零）- **明**天\n**G（吉）** = 1,000,000,000（9个零）- **高**铁\n**T（太）** = 1,000,000,000,000（12个零）- **铁**路\n\n**记忆口诀**：\n"昆(k)明(M)高(G)铁(T)"',
        tip: '从小到大：3、6、9、12个零',
        tool: '谐音法'
      },
      {
        id: 'units-small',
        title: '小单位：没有牛皮',
        content: '**m（毫）** = 0.001（小数点后3位）- **没**有\n**μ（微）** = 0.000001（小数点后6位）- **有**人\n**n（纳）** = 0.000000001（小数点后9位）- **牛**皮\n**p（皮）** = 0.000000000001（小数点后12位）- **皮**革\n\n**记忆口诀**：\n"没(m)有(μ)牛(n)皮(p)"',
        tip: '镜像规律：k↔m（3位），M↔μ（6位）',
        tool: '谐音法'
      },
      {
        id: 'units-story',
        title: '单位词头完整故事',
        content: '**昆明高铁没有牛皮**\n\n昆明的高铁，没有牛皮座椅\n\nk M G T m μ n p\n千 兆 吉 太 毫 微 纳 皮\n\n**记忆口诀**：\n"昆(k)明(M)高(G)铁(T) 没(m)有(μ)牛(n)皮(p)"',
        tip: '从大到小的故事，一气呵成',
        tool: '故事串联法'
      }
    ]
  },
  {
    id: 'category4-db',
    title: '📊 dB计算速查',
    icon: 'calculate',
    description: '功率×2≈3dB，×10=10dB',
    color: 'deep-purple',
    category: 4,
    cards: [
      {
        id: 'db-power',
        title: '功率增益（记3个数字）',
        content: '**3dB** ≈ 2倍功率（最常用）\n**7dB** ≈ 5倍功率\n**10dB** = 10倍功率（整数）\n**20dB** = 100倍功率\n**60dB** = 100万倍功率\n\n**记忆口诀**：\n"功率×2≈3dB，×10=10dB"',
        tip: 'dB加法 = 功率乘法',
        tool: '数字规律法'
      },
      {
        id: 'db-voltage',
        title: '电压增益（功率×2）',
        content: '**6dB** ≈ 2倍电压（功率3dB×2）\n**20dB** = 10倍电压（功率10dB×2）\n**40dB** = 100倍电压（功率20dB×2）\n\n**记忆口诀**：\n"电压dB = 功率dB × 2"',
        tip: '功率倍数用10log，电压倍数用20log',
        tool: '数字规律法'
      },
      {
        id: 'db-s-meter',
        title: 'S表换算（6dB=1S）',
        content: '**6dB** = 1S格\n**12dB** = 2S格\n**18dB** = 3S格\n\n**示例**：\nS4加8.15i → S5（6dB=1S）\nS4加12d → S6（12dB=2S）\n\n**记忆口诀**：\n"6dB=1S，12dB=2S"',
        tip: '双方都换天线要×2（双向12dB）',
        tool: '数字锚定法'
      }
    ]
  },
  {
    id: 'category4-formulas',
    title: '📐 常用计算公式大全',
    icon: 'functions',
    description: '波长、功率、天线、驻波比全套公式',
    color: 'pink',
    category: 4,
    cards: [
      {
        id: 'formula-wavelength',
        title: '1️⃣ 波长与频率换算',
        content: '**λ = 300/f** 或 **f = 300/λ**\n\nλ：波长（米）\nf：频率（MHz）\n\n**示例**：\n• 7MHz → 300/7 ≈ 42.9米\n• 14MHz → 300/14 ≈ 21.4米\n• 28MHz → 300/28 ≈ 10.7米\n• 144MHz → 300/144 ≈ 2.08米\n\n**记忆口诀**：\n"波长300除频率"',
        tip: '光速c=3×10⁸ m/s = 300,000,000 m/s',
        tool: '公式锚定法'
      },
      {
        id: 'formula-dipole',
        title: '2️⃣ 半波偶极天线长度',
        content: '**理论公式**：L = λ/2 = 150/f 米\n**实用公式**：L = 143/f 米（缩短系数0.95）\n**精确公式**：L = 71.3/f 米（半波）\n\nf单位：MHz\n\n**示例**：\n• 7MHz → 143/7 ≈ 20.4米\n• 14MHz → 143/14 ≈ 10.2米\n• 28MHz → 143/28 ≈ 5.1米\n\n**记忆口诀**：\n"半波除2是75，实际143最靠谱"',
        tip: '考虑端部效应，实际天线比理论值短5%',
        tool: '公式锚定法'
      },
      {
        id: 'formula-quarter',
        title: '3️⃣ 1/4波长天线长度',
        content: '**空气中**：L = 75/f 米\n**同轴电缆中**：L = 48.8/f 米\n（速度因子VF=0.65，聚乙烯介质）\n\nf单位：MHz\n\n**示例**：\n• 144MHz垂直天线 → 75/144 ≈ 0.52米\n• 430MHz 1/4同轴 → 48.8/430 ≈ 0.11米\n\n**记忆口诀**：\n"空中75，电缆48.8（si吧吧）"',
        tip: '1/4波长天线需要地网或金属地面作镜像',
        tool: '公式锚定法'
      },
      {
        id: 'formula-power-dbm',
        title: '4️⃣ 功率单位转换（dBm/W）',
        content: '**dBm = 10 × log₁₀(P_mW)**\n\n**常用对照**：\n• 0 dBm = 1 mW\n• 10 dBm = 10 mW\n• 20 dBm = 100 mW\n• 30 dBm = 1 W\n• 40 dBm = 10 W\n• 50 dBm = 100 W\n• 60 dBm = 1000 W\n\n**记忆口诀**：\n"10dB=10倍，30dBm=1瓦"',
        tip: 'dBm是以1毫瓦为基准的对数功率',
        tool: '数字规律法'
      },
      {
        id: 'formula-power-dbw',
        title: '5️⃣ dBm与dBW换算',
        content: '**dBW = dBm - 30**\n**dBm = dBW + 30**\n\n**示例**：\n• 100W = 20dBW = 50dBm\n• 1000W = 30dBW = 60dBm\n• 10W = 10dBW = 40dBm\n\n**记忆口诀**：\n"dBm比dBW大30"',
        tip: 'dBW是以1瓦为基准，dBm是以1毫瓦为基准',
        tool: '公式锚定法'
      },
      {
        id: 'formula-vswr',
        title: '6️⃣ 驻波比(VSWR)计算',
        content: '**VSWR = (1+|ρ|) / (1-|ρ|)**\n\nρ：反射系数\n\n**理想值**：VSWR = 1:1（完美匹配）\n**优秀**：VSWR < 1.5:1\n**可接受**：VSWR < 2:1\n**不理想**：VSWR > 3:1\n\n**反射功率百分比**：\n• VSWR 1.5 → 4% 反射\n• VSWR 2.0 → 11% 反射\n• VSWR 3.0 → 25% 反射\n\n**记忆口诀**：\n"完美驻波1比1，小于2就能用"',
        tip: 'VSWR越小越好，表示天线与馈线阻抗匹配越好',
        tool: '公式锚定法'
      },
      {
        id: 'formula-antenna-gain',
        title: '7️⃣ 天线增益单位换算',
        content: '**dBi ≈ dBd + 2.15**\n**dBd ≈ dBi - 2.15**\n\n**说明**：\n• dBi：相对于各向同性天线的增益\n• dBd：相对于半波偶极天线的增益\n\n**示例**：\n• 0 dBd = 2.15 dBi（半波偶极）\n• 3 dBd = 5.15 dBi\n• 6 dBd = 8.15 dBi\n\n**记忆口诀**：\n"dBi比dBd大2.15"',
        tip: 'i是各向同性点源，d是半波偶极',
        tool: '公式锚定法'
      },
      {
        id: 'formula-freq-bands',
        title: '8️⃣ 常用频段波长对照',
        content: '**HF短波段**：\n• 160米 → 1.8-2.0 MHz\n• 80米 → 3.5-4.0 MHz\n• 40米 → 7.0-7.2 MHz\n• 20米 → 14.0-14.35 MHz\n• 15米 → 21.0-21.45 MHz\n• 10米 → 28.0-29.7 MHz\n\n**VHF/UHF**：\n• 6米 → 50-54 MHz\n• 2米 → 144-148 MHz\n• 70cm → 430-440 MHz\n\n**记忆口诀**：\n"7 14 21 28四兄弟"',
        tip: '波段名称来源于近似波长',
        tool: '场景记忆法'
      },
      {
        id: 'formula-ohm-power',
        title: '9️⃣ 欧姆定律与功率公式',
        content: '**欧姆定律**：\n• U = I × R（电压=电流×电阻）\n• I = U / R（电流=电压÷电阻）\n• R = U / I（电阻=电压÷电流）\n\n**功率公式**：\n• P = U × I（功率=电压×电流）\n• P = I² × R（功率=电流²×电阻）\n• P = U² / R（功率=电压²÷电阻）\n\n**记忆口诀**：\n"电压并，电流串；P等于UI"',
        tip: '三角形记忆法：U在上，IR在下',
        tool: '公式锚定法'
      },
      {
        id: 'formula-impedance',
        title: '🔟 阻抗匹配公式',
        content: '**同轴电缆特性阻抗**：\n• 50Ω：标准业余无线电\n• 75Ω：电视/FM广播\n• 300Ω：扁平馈线\n\n**1/4波长阻抗变换**：\nZ₀ = √(Z₁ × Z₂)\n\n**示例**：\n• 匹配50Ω到200Ω\n• Z₀ = √(50×200) = 100Ω\n• 用100Ω的1/4波长线\n\n**记忆口诀**：\n"50欧是标准，1/4波长能变换"',
        tip: '阻抗不匹配会产生驻波',
        tool: '公式锚定法'
      },
      {
        id: 'formula-coax-loss',
        title: '1️⃣1️⃣ 同轴电缆损耗估算',
        content: '**损耗与频率关系**：\n损耗 ∝ √f（与频率平方根成正比）\n\n**常见电缆@100MHz/100米**：\n• RG-58：约6-8 dB\n• RG-213：约3-4 dB\n• LMR-400：约2 dB\n• LMR-600：约1.5 dB\n\n**规律**：\n• 频率×3 → 损耗×1.7\n• 长度×2 → 损耗×2\n\n**记忆口诀**：\n"频率高损耗大，电缆粗损耗小"',
        tip: '实际使用尽量选粗电缆，缩短长度',
        tool: '数字规律法'
      },
      {
        id: 'formula-db-conversion',
        title: '1️⃣2️⃣ dB快速换算表',
        content: '**功率倍数**：\n• 3dB ≈ ×2（2倍）\n• 6dB ≈ ×4（4倍）\n• 10dB = ×10（10倍）\n• 20dB = ×100（100倍）\n• 30dB = ×1000（1000倍）\n\n**电压倍数**（功率dB×2）：\n• 6dB ≈ ×2（2倍电压）\n• 20dB = ×10（10倍电压）\n\n**负值表示衰减**：\n• -3dB ≈ ÷2（减半）\n• -10dB = ÷10（1/10）\n\n**记忆口诀**：\n"3dB翻倍，10dB十倍"',
        tip: 'dB相加 = 功率相乘',
        tool: '数字规律法'
      }
    ]
  },
  {
    id: 'category4-circuit',
    title: '⚡ 电路基础',
    icon: 'developer_board',
    description: '欧姆定律，P=UI，串并联规律',
    color: 'lime',
    category: 4,
    cards: [
      {
        id: 'circuit-ohm',
        title: '欧姆定律三角形',
        content: '**I = U/R**（电流=电压÷电阻）\n**U = IR**（电压=电流×电阻）\n**R = U/I**（电阻=电压÷电流）\n\n**功率公式**：\n**P = UI**（功率=电压×电流）\n**P = I²R**（功率=电流²×电阻）\n**P = U²/R**（功率=电压²÷电阻）',
        tip: '三角形记忆：U在上，I和R在下',
        tool: '图像记忆法'
      },
      {
        id: 'circuit-series',
        title: '串联规律（电流相同）',
        content: '**电流**：I相同（串联电流处处等）\n**电压**：U=U1+U2+...（分压）\n**电阻**：R=R1+R2+...（相加）\n**功率**：R大→P大（N倍）\n\n**记忆口诀**：\n"串联电流处处等，电压分配电阻加"',
        tip: '串联N个：I减1/N → P减1/N²',
        tool: '规律记忆法'
      },
      {
        id: 'circuit-parallel',
        title: '并联规律（电压相同）',
        content: '**电压**：U相同（并联电压处处等）\n**电流**：I=I1+I2+...（分流）\n**电阻**：1/R=1/R1+1/R2+...（倒数相加）\n**功率**：R大→I小→P小（1/N）\n\n**记忆口诀**：\n"并联电压处处等，电流分配电阻倒数加"',
        tip: '并联N个：I不变 → 总P为N倍',
        tool: '规律记忆法'
      },
      {
        id: 'circuit-capacitor',
        title: '电容电感相位',
        content: '**电容**：\n电流**超前**电压90°\n电压**落后**电流90°\n\n**电感**：\n电流**落后**电压90°\n电压**超前**电流90°\n\n**记忆口诀**：\n"电容电流超前电压90°"',
        tip: '频率↑ → 容抗↓，感抗↑',
        tool: '关键词锚定法'
      }
    ]
  },
  {
    id: 'category4-symbols',
    title: '🔣 电路符号识别',
    icon: 'category',
    description: 'NPN箭头向外，PNP箭头向内',
    color: 'brown',
    category: 4,
    cards: [
      {
        id: 'symbols-basic',
        title: '基础元件符号',
        content: '**接地** - ⏚（三横线向下）\n**天线** - ▽（三角向上+三条线）\n**电阻** - ▭（矩形）\n**电容** - ⎮⎮（两条平行线）\n**电感** - 〜〜〜（波浪线圈）\n\n**记忆口诀**：\n"接地三横，天线三线，电阻砖块"',
        tip: '形状记忆：像什么就是什么',
        tool: '图像记忆法'
      },
      {
        id: 'symbols-diode',
        title: '二极管类符号',
        content: '**二极管** - ▷⎮（三角+竖线）\n**LED** - ▷⎮+两个箭头向外（发光）\n**稳压二极管** - ▷⎮+Z字\n\n**记忆口诀**：\n"箭头方向=电流方向"',
        tip: '二极管单向导电，箭头指示方向',
        tool: '图像记忆法'
      },
      {
        id: 'symbols-transistor',
        title: '三极管符号',
        content: '**NPN** - 箭头向外（Not Pointing iN）\n**PNP** - 箭头向内（Pointing iN Proudly）\n\n**记忆口诀**：\n"N往外跑，P往里进"',
        tip: '看箭头方向：外=NPN，内=PNP',
        tool: '首字母谐音法'
      }
    ]
  }
]

// =============================================================================
// 【第5类：安全防护】31题 - 2.4%（最少）
// =============================================================================

export const category5CardSets: MemoryCardSet[] = [
  {
    id: 'category5-safety',
    title: '⚡ 电气安全',
    icon: 'warning',
    description: '16V交流+33V直流（要溜伤伤）',
    color: 'red-7',
    category: 5,
    cards: [
      {
        id: 'safety-voltage',
        title: '安全电压标准',
        content: '**交流** → 16V（要溜）\n**直流** → 33V（伤伤）\n\n**记忆口诀**：\n"16V交流+33V直流（要溜伤伤）"',
        tip: '直流比交流安全电压高（33>16）',
        tool: '谐音法'
      },
      {
        id: 'safety-danger',
        title: '触电危险程度',
        content: '**致死电流排序**：\n工频 > HF > UHF\n\n**灼伤电流排序**：\nUHF > HF > 工频\n\n**记忆口诀**：\n"致死降+灼伤升"',
        tip: '工频最危险，UHF灼伤最严重',
        tool: '规律记忆法'
      },
      {
        id: 'safety-operation',
        title: '安全操作原则',
        content: '**绝缘** - 穿绝缘鞋\n**单手** - 单手操作\n**不碰金属** - 避免触碰金属外壳\n\n**记忆口诀**：\n"绝缘+单手+不碰金属"',
        tip: '电容有残留电荷，要先放电',
        tool: '首字串联法'
      }
    ]
  },
  {
    id: 'category5-lightning',
    title: '⚡ 防雷接地',
    icon: 'flash_on',
    description: '接引地，单独+小阻+短粗',
    color: 'yellow-9',
    category: 5,
    cards: [
      {
        id: 'lightning-system',
        title: '防雷系统三要素',
        content: '**接闪器** - 避雷针\n**引下线** - 导线\n**接地装置** - 接地极\n\n**记忆口诀**：\n"接引地"',
        tip: '滚球半径：60米',
        tool: '首字串联法'
      },
      {
        id: 'lightning-ground',
        title: '接地要求',
        content: '**单独** - 单独接地（不与其他共用）\n**小阻** - 阻抗越小越好\n**短粗** - 导线短而粗（银铜编织扁带）\n\n**记忆口诀**：\n"单独+小阻+短粗"',
        tip: '同一金属带连接',
        tool: '首字串联法'
      }
    ]
  },
  {
    id: 'category5-fire',
    title: '🔥 消防安全',
    icon: 'local_fire_department',
    description: '断电+CO₂干粉，氢气爆炸',
    color: 'orange-9',
    category: 5,
    cards: [
      {
        id: 'fire-electric',
        title: '电气火灾处理',
        content: '**断电** - 先切断电源\n**CO₂** - 二氧化碳灭火器\n**干粉** - 干粉灭火器\n\n❌ **排除**：喷水（导电危险）\n\n**记忆口诀**：\n"断电+CO₂干粉"',
        tip: '电气火灾不能用水',
        tool: '首字串联法'
      },
      {
        id: 'fire-battery',
        title: '电池安全',
        content: '**铅酸电池充电** → 产生氢气\n**氢气遇明火** → 爆炸\n\n**记忆口诀**：\n"氢气爆炸"',
        tip: '充电时禁止烟火',
        tool: '关键词锚定法'
      }
    ]
  }
]

// =============================================================================
// 汇总所有卡片集
// =============================================================================

/**
 * 获取所有记忆卡片集
 */
export function getAllMemoryCardSets(): MemoryCardSet[] {
  return [
    ...toolboxCardSets,      // 工具箱入门（必读）
    ...category1CardSets,    // 第1类：法规
    ...category2CardSets,    // 第2类：技术基础
    ...category3CardSets,    // 第3类：发射接收机
    ...category4CardSets,    // 第4类：天线馈线
    ...category5CardSets     // 第5类：安全防护
  ]
}

/**
 * 根据ID获取卡片集
 */
export function getMemoryCardSetById(id: string): MemoryCardSet | undefined {
  return getAllMemoryCardSets().find(set => set.id === id)
}

/**
 * 根据分类获取卡片集
 */
export function getMemoryCardSetsByCategory(category: number): MemoryCardSet[] {
  return getAllMemoryCardSets().filter(set => set.category === category)
}

/**
 * 获取卡片集统计
 */
export function getMemoryCardStats() {
  const allSets = getAllMemoryCardSets()
  return {
    totalSets: allSets.length,
    totalCards: allSets.reduce((sum, set) => sum + set.cards.length, 0)
  }
}
