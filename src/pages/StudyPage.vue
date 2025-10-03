<template>
  <div class="q-pa-md">
    <div class="text-h4 q-mb-md">学习模式 - {{ categoryName }}</div>

    <div v-if="loading" class="text-center">
      <q-spinner-dots size="50px" color="primary" />
      <div class="q-mt-md">加载题目中...</div>
    </div>

    <q-card v-else-if="currentQuestion">
      <q-card-section>
        <div class="text-h6 q-mb-md">
          题目 {{ currentIndex + 1 }} / {{ totalQuestions }}
        </div>

        <div class="text-body1 q-mb-md" v-html="currentQuestion.content"></div>

        <q-option-group
          v-model="selectedAnswer"
          :options="currentQuestion.options"
          color="primary"
          type="radio"
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

      <q-card-actions align="between">
        <div>
          <q-btn
            flat
            label="上一题"
            icon="navigate_before"
            :disable="currentIndex === 0"
            @click="previousQuestion"
          />
          <q-btn
            flat
            label="下一题"
            icon="navigate_next"
            :disable="currentIndex === totalQuestions - 1"
            @click="nextQuestion"
          />
        </div>

        <div>
          <q-btn
            color="primary"
            label="显示答案"
            icon="visibility"
            @click="showAnswer"
            :disable="answerShown"
          />
          <q-btn
            v-if="answerShown"
            :color="isCorrect ? 'green' : 'red'"
            :label="isCorrect ? '正确' : '错误'"
            :icon="isCorrect ? 'check' : 'close'"
          />
        </div>
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
      <q-btn flat @click="$router.push('/categories')" icon="arrow_back" label="返回分类" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getQuestionsByCategory } from '../services/dataService'

const route = useRoute()

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
const answerShown = ref(false)
const questions = ref<Question[]>([])
const loading = ref(true)

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

const isCorrect = computed(() => {
  const correctAnswers = currentQuestion.value?.correctAnswer || ''
  // 支持多选题，检查用户选择的答案是否在正确答案中
  return correctAnswers.includes(selectedAnswer.value)
})

async function loadQuestions() {
  try {
    const categoryId = route.params.category as string
    questions.value = await getQuestionsByCategory(categoryId)
    console.log(`✅ 加载了 ${questions.value.length} 道题目 (分类: ${categoryId})`)
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
    answerShown.value = false
  }
}

function previousQuestion() {
  if (currentIndex.value > 0) {
    currentIndex.value--
    selectedAnswer.value = ''
    answerShown.value = false
  }
}

function showAnswer() {
  answerShown.value = true
}

onMounted(() => {
  loadQuestions()
})
</script>