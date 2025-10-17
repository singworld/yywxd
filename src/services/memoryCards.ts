/**
 * 记忆卡片集数据服务
 *
 * 提供分类记忆卡片，帮助快速记忆考试要点
 */

export interface MemoryCard {
  id: string
  title: string
  content: string
  tip?: string // 额外提示
}

export interface MemoryCardSet {
  id: string
  title: string
  icon: string
  description: string
  color: string
  cards: MemoryCard[]
}

/**
 * Category3（发射机和接收机）记忆卡片集
 */
export const category3CardSets: MemoryCardSet[] = [
  {
    id: 'buttons',
    title: '按钮功能速记',
    icon: 'settings',
    description: '收发信机面板按钮功能，高频考点',
    color: 'primary',
    cards: [
      {
        id: 'strong-signal',
        title: '强信号三剑客',
        content: '**ATT** 挡强信号\n**AGC** 自动控制\n**降功率** 保护器件',
        tip: '看到"强信号"关键词就想到这三个'
      },
      {
        id: 'weak-signal',
        title: '弱信号三法宝',
        content: '**PRE** 前置放大\n**长AGC** 缓慢控制\n**射频增益** 开到最大',
        tip: 'PRE = Pre-amplifier（前放）'
      },
      {
        id: 'interference',
        title: '干扰三杀手',
        content: '**NB** 切脉冲（火花干扰）\n**SQL** 关音频（静噪）\n**窄带宽** 滤邻频',
        tip: 'NB = Noise Blanker'
      },
      {
        id: 'distortion',
        title: '失真三招治',
        content: '**降话筒** 增益（间隙沙沙）\n**调ALC** 电平控制\n**关PROC** 语音压缩',
        tip: 'AFSK发送要关ALC和PROC'
      },
      {
        id: 'freq-tune',
        title: '频率微调组',
        content: '**RIT** = R收（调收不动发）\n**XIT** = X发（调发不动收）\n**SPLIT** = 劈开（收发独立）',
        tip: '记首字母：R收、X发、劈开'
      }
    ]
  },
  {
    id: 'numbers',
    title: '数字速记卡',
    icon: 'calculate',
    description: '常考数字、公式，谐音记忆',
    color: 'secondary',
    cards: [
      {
        id: 'sensitivity-4kings',
        title: '灵敏度4天王',
        content: '**107、6、113、0**\n\n1μV测值：-**107**dBm、**6**dBμV\n0.5μV测值：-**113**dBm、**0**dBμV',
        tip: '谐音：要灵气（107），溜（6），要要算（113），灵（0）'
      },
      {
        id: 'formula-brothers',
        title: '公式双雄',
        content: '**71.3/f** = 半波偶极长度\n**48.8/f** = 1/4同轴长度\n\nf单位：MHz，结果单位：米',
        tip: '谐音：去一删（71.3）、si吧吧（48.8）'
      },
      {
        id: 'coefficient-brothers',
        title: '系数兄弟',
        content: '**0.95** = 缩短系数\n**0.65** = 速度因子（聚乙烯）\n**50欧** = 业余标准阻抗',
        tip: '这三个数字必须死记'
      },
      {
        id: 'current-sisters',
        title: '电流姐妹',
        content: '**0.091×N** = FM电流（安）\n**0.0057×N** = AC220V电流（安）\n\nN = 发射功率（瓦）',
        tip: '谐音：灵衣安（0.091）、灵舞漆（0.0057）'
      },
      {
        id: 's-meter-law',
        title: 'S表铁律',
        content: '**6dB = 1S格**\n**12dB = 2S格**\n\n双方都换天线要×2！',
        tip: 'S4加12dB → S6（单方6dB）'
      }
    ]
  },
  {
    id: 'antenna',
    title: '天线对比卡',
    icon: 'cell_tower',
    description: '天线增益、极化、驻波',
    color: 'accent',
    cards: [
      {
        id: 'gain-units',
        title: '增益单位换算',
        content: '**dBi** = 对比点源（i = 一点圆）\n**dBd** = 对比偶极（d = 偶极）\n\n**0dBd = 2.15dBi**',
        tip: '换算口诀：d加2.15变i，i减2.15变d'
      },
      {
        id: 'gain-compare',
        title: '增益快速比较',
        content: '**6.15i vs 1d** → 甲2倍乙（3dB差）\n**0d vs 2i** → 甲强（0d=2.15i）\n**4.5d vs 5.85i** → 甲强0.8dB',
        tip: '先统一单位，再比较数值'
      },
      {
        id: 'polarization',
        title: '极化匹配规律',
        content: '✅ **双方同改** → 效果好\n❌ **单方改** → 效果差\n⚠️ **圆改线** → 不变（都损3dB）',
        tip: '记住：同好、单差、圆线不变'
      },
      {
        id: 'swr',
        title: '驻波比SWR',
        content: '**SWR = 1:1** → 完美匹配\n**SWR = 4:1** → 匹配不佳\n\nSWR越接近1:1越好',
        tip: 'SWR不稳 → 接触不良'
      },
      {
        id: 'antenna-types',
        title: '天线特性速记',
        content: '**垂直GP** → 水平全向，零仰角\n**半波偶极** → 垂直方向峰值增益\n**八木** → 短前长后（引反）',
        tip: 'GP = Ground Plane（地网天线）'
      }
    ]
  },
  {
    id: 'propagation',
    title: '传播规律卡',
    icon: 'waves',
    description: '路径损耗、电波传播',
    color: 'positive',
    cards: [
      {
        id: 'path-loss',
        title: '路径损耗公式',
        content: '**距离×5** → -14dB → 降2S\n**距离×10** → -20dB → 降3S\n**频率×3** → -9.5dB → 降1.5S\n**功率÷4** → -6dB → 降1S',
        tip: '记住：5→14→2，10→20→3'
      },
      {
        id: 'ionosphere',
        title: '电离层记忆',
        content: '**高度排序**：F2 > F1 > E > D\n**密度排序**：F2 > F1 > E > D\n\n从高到低、从密到疏',
        tip: '太阳黑子多 → 电离密度高 → HF DX好'
      },
      {
        id: 'propagation-types',
        title: '传播方式速记',
        content: '**地波** → 低频衰减小\n**天波** → HF电离层反射\n**空间波** → VHF/UHF视距\n**散射** → 超视距特殊情况',
        tip: 'HF静寂区 = 地到不了天够不着'
      },
      {
        id: 'vhf-propagation',
        title: 'VHF/UHF超视距',
        content: '**对流层散射** → 500公里\n**突发E层** → 1000+公里\n**大气波导** → 高空逆温\n**流星余迹** → 6米波段',
        tip: '视距传播看相对高度'
      },
      {
        id: 'multi-path',
        title: '多径效应',
        content: '**现象**：信号强度周期变化\n**原因**：多路径干涉\n**解决**：移动几步或改频',
        tip: 'VHF/UHF移动通信常见'
      }
    ]
  },
  {
    id: 'calculation',
    title: '计算题速算',
    icon: 'functions',
    description: '快速计算公式汇总',
    color: 'warning',
    cards: [
      {
        id: 'wavelength',
        title: '波长计算',
        content: '**λ = 300/f**\n\nλ：波长（米）\nf：频率（MHz）',
        tip: '光速3×10⁸ m/s = 300 Mm/s'
      },
      {
        id: 'antenna-length',
        title: '天线长度',
        content: '**半波偶极**：71.3/f 米\n**1/4垂直**：35.6/f 米\n**1/4同轴**：48.8/f 米\n\nf单位：MHz',
        tip: '记住71.3和48.8两个数字'
      },
      {
        id: 'power-current',
        title: '功率与电流',
        content: '**FM电流**：0.091×√N 安\n**AC220V电流**：0.0057×N 安\n\nN：发射功率（瓦）',
        tip: 'FM有根号，AC是直接乘'
      },
      {
        id: 'db-conversion',
        title: 'dB换算速算',
        content: '**3dB** ≈ 2倍功率\n**6dB** = 4倍功率 = 1S格\n**10dB** = 10倍功率\n**20dB** = 100倍功率',
        tip: '10log(功率比) 或 20log(电压比)'
      },
      {
        id: 'eirp',
        title: 'EIRP有效辐射功率',
        content: '**EIRP = 发射功率 + 天线增益**\n\n10W + 6dBi ≈ 40W\n10W + 3dB = 20W',
        tip: 'dB加法 = 功率乘法'
      }
    ]
  },
  {
    id: 'troubleshooting',
    title: '故障诊断卡',
    icon: 'build',
    description: '常见问题与解决方案',
    color: 'negative',
    cards: [
      {
        id: 'repeater-issues',
        title: '中继台故障',
        content: '**持续发射不停** → 自锁（隔离差）\n**断续模糊话音** → 互调干扰\n**忽长忽短模糊** → 又是互调',
        tip: '互调算法：2fT - fR'
      },
      {
        id: 'audio-issues',
        title: '音频问题',
        content: '**间隙沙沙声** → 降话筒增益\n**ALC开还失真** → 话筒太高\n**NFM收WFM** → 声音小（带宽窄）',
        tip: 'FM无信号沙沙 = 噪声鉴频'
      },
      {
        id: 'swr-issues',
        title: 'SWR异常',
        content: '**SWR不稳** → 接触不良\n**SSB的SWR摆动** → 正常（话音变化）\n**SWR高** → 阻抗不匹配',
        tip: '测驻波先找空频，SSB切CW按键'
      },
      {
        id: 'interference',
        title: '干扰处理',
        content: '**火花干扰** → 开NB切脉冲\n**邻频干扰** → 窄带宽滤波\n**镜像干扰** → 预选滤波器',
        tip: '强信号还有互调？开ATT衰减'
      },
      {
        id: 'performance',
        title: '性能优化',
        content: '**弱信号** → 开PRE前放\n**强干扰+弱信号** → 关AGC\n**多径衰落** → 移动或改频',
        tip: 'VHF前放装天线与收机之间'
      }
    ]
  }
]

/**
 * 获取所有记忆卡片集
 */
export function getAllMemoryCardSets(): MemoryCardSet[] {
  return category3CardSets
}

/**
 * 根据ID获取卡片集
 */
export function getMemoryCardSetById(id: string): MemoryCardSet | undefined {
  return category3CardSets.find(set => set.id === id)
}

/**
 * 获取卡片集统计
 */
export function getMemoryCardStats() {
  return {
    totalSets: category3CardSets.length,
    totalCards: category3CardSets.reduce((sum, set) => sum + set.cards.length, 0)
  }
}
