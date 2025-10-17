<template>
  <div class="q-pa-md">
    <div class="row justify-center">
      <div class="col-xs-12 col-sm-8 col-md-6">
        <q-card class="q-mb-lg">
          <q-card-section class="text-center">
            <div class="text-h4 text-primary">🎯 中国业余无线电考试系统</div>
            <div class="text-subtitle1 q-mt-md text-grey-7">C类考试题库记忆助手</div>
          </q-card-section>

          <q-card-section>
            <div class="row q-gutter-md">
              <div class="col">
                <q-card flat bordered>
                  <q-card-section class="text-center">
                    <q-icon name="quiz" size="2rem" color="primary" />
                    <div class="text-h6 q-mt-sm">{{ totalQuestions }}</div>
                    <div class="text-caption">题目总数</div>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col">
                <q-card flat bordered>
                  <q-card-section class="text-center">
                    <q-icon name="category" size="2rem" color="secondary" />
                    <div class="text-h6 q-mt-sm">{{ totalCategories }}</div>
                    <div class="text-caption">分类数量</div>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col">
                <q-card flat bordered>
                  <q-card-section class="text-center">
                    <q-icon name="psychology" size="2rem" color="accent" />
                    <div class="text-h6 q-mt-sm">{{ memoryAids }}</div>
                    <div class="text-caption">记忆口诀</div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </q-card-section>

          <q-card-actions align="center" class="q-gutter-md">
            <q-btn
              color="primary"
              size="lg"
              label="开始学习"
              icon="school"
              @click="goToCategories"
            />
            <q-btn
              outline
              color="secondary"
              size="lg"
              label="记忆手册"
              icon="book"
              @click="goToMemoryHandbook"
            />
          </q-card-actions>
        </q-card>

        <q-card>
          <q-card-section>
            <div class="text-h6">🚀 系统特性</div>
          </q-card-section>
          <q-card-section>
            <q-list>
              <q-item>
                <q-item-section avatar>
                  <q-icon name="memory" color="primary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>智能记忆助手</q-item-label>
                  <q-item-label caption>基于题目特征自动匹配记忆口诀</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar>
                  <q-icon name="auto_stories" color="warning" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>记忆卡片集</q-item-label>
                  <q-item-label caption>6大主题，30+张精心设计的记忆卡片</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar>
                  <q-icon name="mobile_friendly" color="secondary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>移动端优化</q-item-label>
                  <q-item-label caption>支持离线学习，随时随地复习</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar>
                  <q-icon name="analytics" color="accent" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>学习进度跟踪</q-item-label>
                  <q-item-label caption>实时记录学习进度和薄弱环节</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>

        <div class="text-center q-mt-lg">
          <q-btn flat color="grey" size="sm" label="API测试" @click="testAPI" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()

import { loadQuestions, getAllMemoryAids } from '../services/dataService'

const totalQuestions = ref(1283)
const totalCategories = ref(5)
const memoryAids = ref(32)

async function testAPI() {
  try {
    const questions = await loadQuestions()
    const aids = getAllMemoryAids()
    totalQuestions.value = questions.length
    memoryAids.value = aids.length
    $q.notify({
      color: 'positive',
      message: `✅ 成功加载 ${questions.length} 道题目`,
      icon: 'check'
    })
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: '❌ 加载数据失败',
      icon: 'error'
    })
  }
}

function goToCategories() {
  router.push('/categories')
}

function goToMemoryHandbook() {
  router.push('/memory-handbook')
}
</script>
