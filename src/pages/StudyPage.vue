<template>
  <div class="q-pa-md">
    <div class="text-h4 q-mb-md">学习模式 - {{ categoryName }}</div>

    <div v-if="loading" class="text-center">
      <q-spinner-dots size="50px" color="primary" />
      <div class="q-mt-md">加载题目中...</div>
    </div>

    <q-card v-else-if="currentQuestion">
      <q-card-section>
        <!-- 移动端：垂直布局，PC端：水平布局 -->
        <div class="column q-gutter-sm q-mb-md">
          <!-- 题目信息行 -->
          <div class="row items-center justify-between">
            <div class="text-h6">
              题目 {{ currentIndex + 1 }} / {{ totalQuestions }}
            </div>
            <div class="row q-gutter-xs">
              <q-chip color="blue-grey" text-color="white" size="sm">
                {{ currentQuestion.id }}
              </q-chip>
              <q-chip v-if="isMultipleChoice" color="orange" text-color="white" size="sm">
                多选
              </q-chip>
            </div>
          </div>

          <!-- 跳转输入行 -->
          <div class="row items-center q-gutter-sm">
            <span class="text-caption text-grey-7">跳转：</span>
            <q-input
              v-model.number="jumpToNumber"
              type="number"
              dense
              outlined
              placeholder="输入题号"
              class="col-grow"
              style="max-width: 150px"
              :min="1"
              :max="totalQuestions"
              @keyup.enter="jumpToQuestion"
            >
              <template v-slot:append>
                <q-btn
                  flat
                  dense
                  icon="arrow_forward"
                  color="primary"
                  @click="jumpToQuestion"
                  :disable="!isValidJumpNumber"
                />
              </template>
            </q-input>
          </div>
        </div>

        <div class="text-body1 q-mb-md" v-html="currentQuestion.content"></div>

        <q-option-group
          v-if="!isMultipleChoice"
          v-model="selectedAnswer"
          :options="currentQuestion.options"
          color="primary"
          type="radio"
        />

        <q-option-group
          v-else
          v-model="selectedAnswers"
          :options="currentQuestion.options"
          color="primary"
          type="checkbox"
        />
      </q-card-section>

      <q-card-section v-if="memoryAid">
        <q-banner class="bg-blue-1">
          <template v-slot:avatar>
            <q-icon name="psychology" color="primary" />
          </template>
          <div class="row items-center justify-between">
            <div class="col">
              <strong>记忆口诀：</strong> {{ memoryAid }}
            </div>
            <!-- 特殊题目：显示详情按钮 -->
            <q-btn
              v-if="hasMemoryCard"
              flat
              dense
              round
              icon="info"
              color="primary"
              @click="showMemoryCardDialog = true"
              size="sm"
            >
              <q-tooltip>查看完整记忆卡片</q-tooltip>
            </q-btn>
          </div>
        </q-banner>
      </q-card-section>

      <q-card-actions class="column q-gutter-sm q-pa-md">
        <!-- 导航按钮行 -->
        <div class="row justify-between full-width">
          <q-btn
            unelevated
            color="grey-7"
            icon="navigate_before"
            label="上一题"
            :disable="currentIndex === 0"
            @click="previousQuestion"
            class="col"
          />
          <q-btn
            unelevated
            color="grey-7"
            icon-right="navigate_next"
            label="下一题"
            :disable="currentIndex === totalQuestions - 1"
            @click="nextQuestion"
            class="col q-ml-sm"
          />
        </div>

        <!-- 显示答案按钮 -->
        <q-btn
          unelevated
          color="primary"
          icon="visibility"
          label="显示答案"
          @click="showAnswer"
          :disable="answerShown"
          class="full-width"
          size="md"
        />

        <!-- 答案显示 -->
        <q-banner
          v-if="answerShown"
          :class="isCorrect ? 'bg-green-1' : 'bg-red-1'"
          class="text-center"
        >
          <template v-slot:avatar>
            <q-icon
              :name="isCorrect ? 'check_circle' : 'cancel'"
              :color="isCorrect ? 'green' : 'red'"
              size="md"
            />
          </template>
          <div class="text-weight-bold">
            正确答案: {{ displayAnswer }}
          </div>
        </q-banner>
      </q-card-actions>

      <q-linear-progress
        :value="progress"
        color="primary"
        class="q-mt-md"
      />
    </q-card>

    <div v-else-if="!currentQuestion && !loading" class="text-center">
      <q-icon name="quiz" size="80px" color="grey-5" />
      <div class="q-mt-md text-h6">暂无题目</div>
      <div class="text-caption">该分类暂时没有可用的题目</div>
    </div>

    <div class="text-center q-mt-lg">
      <q-btn flat @click="goBackToCategories" icon="arrow_back" label="返回分类" />
    </div>

    <!-- ITU频段分类记忆卡片弹窗 -->
    <q-dialog v-model="showMemoryCardDialog" maximized>
      <q-card class="bg-grey-1">
        <!-- 顶部工具栏 -->
        <q-toolbar class="bg-primary text-white">
          <q-toolbar-title>
            <q-icon name="stars" class="q-mr-sm" />
            ITU频段分类速记卡
          </q-toolbar-title>
          <q-btn flat round dense icon="close" @click="showMemoryCardDialog = false" />
        </q-toolbar>

        <!-- 卡片内容 -->
        <q-card-section class="q-pa-md">
          <!-- 核心口诀 -->
          <q-card class="q-mb-md bg-orange-1">
            <q-card-section>
              <div class="text-h6 text-primary q-mb-sm">
                <q-icon name="school" /> 核心口诀（30秒记住！）
              </div>
              <div class="text-body1 text-weight-bold q-mb-xs">
                "老马很威武，是恶霸" + "3和30交替跳"
              </div>
            </q-card-section>
          </q-card>

          <!-- 速查表 -->
          <q-card class="q-mb-md">
            <q-card-section>
              <div class="text-h6 text-primary q-mb-sm">
                <q-icon name="table_chart" /> 速查表
              </div>
              <q-markup-table flat dense class="bg-white">
                <thead>
                  <tr>
                    <th>缩写</th>
                    <th>频率范围</th>
                    <th>中文</th>
                    <th>波长</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="text-weight-bold text-primary">LF</td>
                    <td>30-300 kHz</td>
                    <td>低频</td>
                    <td>长波</td>
                  </tr>
                  <tr>
                    <td class="text-weight-bold text-primary">MF</td>
                    <td>0.3-3 MHz</td>
                    <td>中频</td>
                    <td>中波</td>
                  </tr>
                  <tr>
                    <td class="text-weight-bold text-primary">HF</td>
                    <td>3-30 MHz</td>
                    <td>高频</td>
                    <td>短波</td>
                  </tr>
                  <tr>
                    <td class="text-weight-bold text-primary">VHF</td>
                    <td>30-300 MHz</td>
                    <td>甚高频</td>
                    <td>米波</td>
                  </tr>
                  <tr>
                    <td class="text-weight-bold text-primary">UHF</td>
                    <td>0.3-3 GHz</td>
                    <td>特高频</td>
                    <td>分米波</td>
                  </tr>
                  <tr>
                    <td class="text-weight-bold text-primary">SHF</td>
                    <td>3-30 GHz</td>
                    <td>超高频</td>
                    <td>厘米波</td>
                  </tr>
                  <tr>
                    <td class="text-weight-bold text-primary">EHF</td>
                    <td>30-300 GHz</td>
                    <td>极高频</td>
                    <td>毫米波</td>
                  </tr>
                </tbody>
              </q-markup-table>
            </q-card-section>
          </q-card>

          <!-- 三步答题法 -->
          <q-card class="q-mb-md bg-blue-1">
            <q-card-section>
              <div class="text-h6 text-primary q-mb-sm">
                <q-icon name="format_list_numbered" /> 三步答题法
              </div>
              <q-list dense>
                <q-item>
                  <q-item-section avatar>
                    <q-avatar color="primary" text-color="white" size="sm">1</q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label><strong>看单位：</strong>kHz → LF/MF，MHz → HF/VHF/UHF，GHz → SHF/EHF</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar>
                    <q-avatar color="primary" text-color="white" size="sm">2</q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label><strong>看范围：</strong>0.3-3 / 3-30 / 30-300</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar>
                    <q-avatar color="primary" text-color="white" size="sm">3</q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label><strong>选答案：</strong>对照速查表</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>

          <!-- 记忆技巧 -->
          <q-card class="q-mb-md">
            <q-card-section>
              <div class="text-h6 text-primary q-mb-sm">
                <q-icon name="lightbulb" /> 记忆技巧
              </div>
              <q-list dense>
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="filter_1" color="orange" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label caption class="text-grey-7">首字母联想</q-item-label>
                    <q-item-label>"老马很威武，是恶霸" = L/M/H/V/U/S/E</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="filter_2" color="orange" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label caption class="text-grey-7">边界规律</q-item-label>
                    <q-item-label>只记两个数：<strong>3</strong> 和 <strong>30</strong>，每级×10倍</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="filter_3" color="orange" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label caption class="text-grey-7">单位口诀</q-item-label>
                    <q-item-label>"千兆吉，二三二" = kHz(2个) / MHz(3个) / GHz(2个)</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>

          <!-- 易混辨析 -->
          <q-card class="q-mb-md bg-red-1">
            <q-card-section>
              <div class="text-h6 text-red-8 q-mb-sm">
                <q-icon name="warning" /> 常考陷阱
              </div>
              <q-banner class="bg-white q-mb-sm">
                <template v-slot:avatar>
                  <q-icon name="error" color="red" />
                </template>
                <div class="text-weight-bold">Ultra vs Super（最容易混！）</div>
                <div class="q-mt-xs">
                  • <strong>Ultra</strong>(特高) = UHF = 300MHz起 = WiFi<br>
                  • <strong>Super</strong>(超高) = SHF = 3GHz起 = 卫星
                </div>
                <div class="q-mt-xs text-caption text-grey-7">
                  记忆：Ultra字母U在S前 → 频率更低
                </div>
              </q-banner>
            </q-card-section>
          </q-card>

          <!-- 实战示例 -->
          <q-card class="q-mb-md">
            <q-card-section>
              <div class="text-h6 text-primary q-mb-sm">
                <q-icon name="quiz" /> 实战速记
              </div>
              <q-list dense separator>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>题目</q-item-label>
                    <q-item-label>135 kHz</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-chip color="green" text-color="white" dense>LF 低频</q-chip>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>题目</q-item-label>
                    <q-item-label>28 MHz</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-chip color="green" text-color="white" dense>HF 高频</q-chip>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>题目</q-item-label>
                    <q-item-label>2.3 GHz</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-chip color="green" text-color="white" dense>UHF 特高频</q-chip>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>

        </q-card-section>

        <!-- 底部按钮 -->
        <q-card-actions align="center" class="q-pb-md">
          <q-btn
            unelevated
            color="primary"
            label="我记住了"
            icon="check_circle"
            @click="showMemoryCardDialog = false"
            padding="sm lg"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getQuestionsByCategory } from '../services/dataService'

const route = useRoute()
const router = useRouter()

interface Question {
  id: string
  content: string
  options: { label: string, value: string }[]
  correctAnswer: string
  category: string
  categoryName: string
  memoryAid?: string
}

const currentIndex = ref(0)
const selectedAnswer = ref('')
const selectedAnswers = ref<string[]>([])
const answerShown = ref(false)
const questions = ref<Question[]>([])
const loading = ref(true)
const jumpToNumber = ref<number | null>(null)
const showMemoryCardDialog = ref(false)

// 判断当前题目是否有记忆卡片（MC1-0215 到 MC1-0231）
const hasMemoryCard = computed(() => {
  const questionId = currentQuestion.value?.id || ''
  // MC1-0215 是频段分类的第一题，后面16题也适用
  return questionId.match(/MC1-02(1[5-9]|2[0-9]|3[01])/)
})

// localStorage key
const getStorageKey = () => {
  const categoryId = route.params.category as string
  return `study-progress-${categoryId}`
}

// 保存当前进度到 localStorage
const saveProgress = () => {
  const key = getStorageKey()
  const progress = {
    currentIndex: currentIndex.value,
    timestamp: Date.now()
  }
  localStorage.setItem(key, JSON.stringify(progress))
}

// 从 localStorage 恢复进度
const loadProgress = () => {
  const key = getStorageKey()
  const saved = localStorage.getItem(key)
  if (saved) {
    try {
      const progress = JSON.parse(saved)
      // 只恢复24小时内的进度
      if (Date.now() - progress.timestamp < 24 * 60 * 60 * 1000) {
        currentIndex.value = progress.currentIndex
        console.log(`✅ 恢复进度：第 ${currentIndex.value + 1} 题`)
      }
    } catch (e) {
      console.error('恢复进度失败:', e)
    }
  }
}

// 监听 currentIndex 变化，自动保存
watch(currentIndex, () => {
  saveProgress()
})

const categoryName = computed(() => {
  const categoryId = route.params.category as string
  const categoryNames: Record<string, string> = {
    '1': '无线电管理法规',
    '2': '无线电技术基础',
    '3': '发射机和接收机',
    '4': '天线和馈线',
    '5': '安全防护',
    'all': '全部题目'
  }
  return categoryNames[categoryId] || '未知分类'
})

const currentQuestion = computed(() => questions.value[currentIndex.value])
const totalQuestions = computed(() => questions.value.length)
const progress = computed(() => (currentIndex.value + 1) / totalQuestions.value)

const memoryAid = computed(() => {
  return currentQuestion.value?.memoryAid || ''
})

const isMultipleChoice = computed(() => {
  const correctAnswer = currentQuestion.value?.correctAnswer || ''
  return correctAnswer.length > 1
})

const isCorrect = computed(() => {
  const correctAnswer = currentQuestion.value?.correctAnswer || ''

  if (isMultipleChoice.value) {
    // 多选题：用户选择的答案必须和正确答案完全一致
    const userAnswer = selectedAnswers.value.sort().join('')
    return userAnswer === correctAnswer.split('').sort().join('')
  } else {
    // 单选题
    return selectedAnswer.value === correctAnswer
  }
})

const displayAnswer = computed(() => {
  const correctAnswer = currentQuestion.value?.correctAnswer || ''
  if (correctAnswer.length > 1) {
    return correctAnswer.split('').join('、')
  }
  return correctAnswer
})

const isValidJumpNumber = computed(() => {
  return jumpToNumber.value !== null &&
    jumpToNumber.value >= 1 &&
    jumpToNumber.value <= totalQuestions.value
})

async function loadQuestions() {
  try {
    const categoryId = route.params.category as string
    questions.value = await getQuestionsByCategory(categoryId)
    console.log(`✅ 加载了 ${questions.value.length} 道题目 (分类: ${categoryId})`)

    // 加载完题目后恢复进度
    loadProgress()
  } catch (error) {
    console.error('❌ 加载题目失败:', error)
  } finally {
    loading.value = false
  }
}

function nextQuestion() {
  if (currentIndex.value < totalQuestions.value - 1) {
    currentIndex.value++
    selectedAnswer.value = ''
    selectedAnswers.value = []
    answerShown.value = false
  }
}

function previousQuestion() {
  if (currentIndex.value > 0) {
    currentIndex.value--
    selectedAnswer.value = ''
    selectedAnswers.value = []
    answerShown.value = false
  }
}

function showAnswer() {
  answerShown.value = true
}

function jumpToQuestion() {
  if (isValidJumpNumber.value && jumpToNumber.value !== null) {
    currentIndex.value = jumpToNumber.value - 1
    selectedAnswer.value = ''
    selectedAnswers.value = []
    answerShown.value = false
    jumpToNumber.value = null
  }
}

onMounted(() => {
  loadQuestions()
})

function goBackToCategories() {
  router.push('/categories')
}
</script>
