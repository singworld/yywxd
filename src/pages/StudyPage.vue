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
          <strong>记忆口诀：</strong> {{ memoryAid }}
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
