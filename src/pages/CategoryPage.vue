<template>
  <div class="q-pa-md">
    <div class="text-h4 q-mb-md">题目分类</div>

    <div v-if="loading" class="text-center">
      <q-spinner-dots size="50px" color="primary" />
      <div class="q-mt-md">加载分类中...</div>
    </div>

    <div v-else class="row q-gutter-md">
      <div
        v-for="category in categories"
        :key="category.id"
        class="col-xs-12 col-sm-6 col-md-4"
      >
        <q-card clickable @click="openCategory(category.id)">
          <q-card-section>
            <div class="text-h6">{{ category.name }}</div>
            <div class="text-caption">{{ category.description }}</div>
          </q-card-section>

          <q-card-section>
            <q-linear-progress
              :value="category.progress"
              color="primary"
              class="q-mt-sm"
            />
            <div class="text-caption q-mt-xs">
              进度: {{ Math.round(category.progress * 100) }}%
              ({{ category.completed }}/{{ category.total }})
            </div>
          </q-card-section>

          <q-card-actions>
            <q-btn
              flat
              color="primary"
              :label="`${category.total} 题目`"
              icon="quiz"
            />
            <q-spacer />
            <q-btn
              flat
              color="secondary"
              label="开始学习"
              icon="school"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <div class="text-center q-mt-lg">
      <q-btn flat @click="goHome" icon="arrow_back" label="返回首页" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCategoryStats } from '../services/dataService'

const router = useRouter()

interface Category {
  id: string
  name: string
  description: string
  total: number
  completed: number
  progress: number
}

const categories = ref<Category[]>([])
const loading = ref(true)

async function loadCategories() {
  try {
    const stats = await getCategoryStats()
    categories.value = stats.map(cat => ({
      id: cat.id,
      name: cat.name,
      description: cat.description,
      total: cat.total,
      completed: 0,
      progress: 0
    }))
  } catch (error) {
    console.error('加载分类失败:', error)
  } finally {
    loading.value = false
  }
}

function openCategory(categoryId: string) {
  router.push(`/study/${categoryId}`)
}

function goHome() {
  router.push('/')
}

onMounted(() => {
  loadCategories()
})
</script>
