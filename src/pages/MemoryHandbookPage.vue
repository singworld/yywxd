<template>
  <div class="memory-handbook-page">
    <!-- 头部标题 -->
    <div class="page-header q-pa-md">
      <div class="row items-center justify-between">
        <div>
          <div class="text-h5 text-weight-bold">📚 记忆手册</div>
          <div class="text-caption text-grey-7">
            {{ stats.totalSets }} 个卡片集，共 {{ stats.totalCards }} 张卡片
          </div>
        </div>
        <q-btn flat round icon="home" @click="goHome">
          <q-tooltip>返回首页</q-tooltip>
        </q-btn>
      </div>
    </div>

    <!-- 卡片集列表 -->
    <div class="card-sets-container q-pa-md">
      <div class="row q-col-gutter-md">
        <div
          v-for="cardSet in cardSets"
          :key="cardSet.id"
          class="col-12 col-sm-6 col-md-4"
        >
          <q-card
            class="card-set-item cursor-pointer"
            :class="`border-${cardSet.color}`"
            @click="openCardSet(cardSet)"
          >
            <q-card-section class="row items-center q-pb-none">
              <q-icon
                :name="cardSet.icon"
                size="32px"
                :color="cardSet.color"
                class="q-mr-sm"
              />
              <div class="text-h6 text-weight-bold">{{ cardSet.title }}</div>
            </q-card-section>

            <q-card-section>
              <div class="text-caption text-grey-7">
                {{ cardSet.description }}
              </div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-badge :color="cardSet.color" outline>
                {{ cardSet.cards.length }} 张卡片
              </q-badge>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- 卡片浏览对话框 -->
    <q-dialog v-model="showDialog" maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card class="card-viewer">
        <!-- 对话框头部 -->
        <q-bar class="bg-primary text-white">
          <q-icon :name="selectedSet?.icon || 'book'" />
          <div class="text-weight-bold q-ml-sm">{{ selectedSet?.title }}</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>关闭</q-tooltip>
          </q-btn>
        </q-bar>

        <!-- 卡片导航 -->
        <q-card-section class="card-navigation bg-grey-2">
          <div class="row items-center justify-between">
            <q-btn
              flat
              dense
              icon="chevron_left"
              :disable="currentCardIndex === 0"
              @click="previousCard"
            >
              <q-tooltip>上一张</q-tooltip>
            </q-btn>

            <div class="text-body2 text-weight-bold">
              {{ currentCardIndex + 1 }} / {{ selectedSet?.cards.length || 0 }}
            </div>

            <q-btn
              flat
              dense
              icon="chevron_right"
              :disable="currentCardIndex === (selectedSet?.cards.length || 0) - 1"
              @click="nextCard"
            >
              <q-tooltip>下一张</q-tooltip>
            </q-btn>
          </div>
        </q-card-section>

        <!-- 卡片内容 -->
        <q-card-section class="card-content q-pa-lg" v-if="currentCard">
          <div class="text-h6 text-weight-bold text-primary q-mb-md">
            {{ currentCard.title }}
          </div>

          <div class="card-body q-mb-md" v-html="renderMarkdown(currentCard.content)"></div>

          <q-separator v-if="currentCard.tip" class="q-my-md" />

          <div v-if="currentCard.tip" class="tip-box">
            <q-icon name="lightbulb" color="warning" size="20px" class="q-mr-sm" />
            <span class="text-caption text-grey-8">{{ currentCard.tip }}</span>
          </div>
        </q-card-section>

        <!-- 卡片缩略图导航 -->
        <q-card-section class="card-thumbnails bg-grey-1 q-pa-md">
          <div class="row q-col-gutter-sm">
            <div
              v-for="(card, index) in selectedSet?.cards"
              :key="card.id"
              class="col-4 col-sm-3 col-md-2"
            >
              <q-btn
                :outline="index !== currentCardIndex"
                :unelevated="index === currentCardIndex"
                :color="index === currentCardIndex ? selectedSet?.color : 'grey-5'"
                class="full-width"
                @click="currentCardIndex = index"
              >
                {{ index + 1 }}
              </q-btn>
            </div>
          </div>
        </q-card-section>

        <!-- 底部操作栏 -->
        <q-card-actions align="center" class="q-pa-md bg-grey-2">
          <q-btn
            outline
            color="primary"
            icon="shuffle"
            label="随机浏览"
            @click="randomCard"
          />
          <q-btn
            outline
            color="secondary"
            icon="restart_alt"
            label="重新开始"
            @click="currentCardIndex = 0"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getAllMemoryCardSets, getMemoryCardStats, type MemoryCardSet, type MemoryCard } from 'src/services/memoryCards'

const router = useRouter()

// 数据
const cardSets = ref(getAllMemoryCardSets())
const stats = ref(getMemoryCardStats())

// 对话框状态
const showDialog = ref(false)
const selectedSet = ref<MemoryCardSet | null>(null)
const currentCardIndex = ref(0)

// 当前卡片
const currentCard = computed<MemoryCard | null>(() => {
  if (!selectedSet.value) return null
  return selectedSet.value.cards[currentCardIndex.value] || null
})

// 打开卡片集
function openCardSet(cardSet: MemoryCardSet) {
  selectedSet.value = cardSet
  currentCardIndex.value = 0
  showDialog.value = true
}

// 上一张卡片
function previousCard() {
  if (currentCardIndex.value > 0) {
    currentCardIndex.value--
  }
}

// 下一张卡片
function nextCard() {
  if (selectedSet.value && currentCardIndex.value < selectedSet.value.cards.length - 1) {
    currentCardIndex.value++
  }
}

// 随机卡片
function randomCard() {
  if (!selectedSet.value) return
  const randomIndex = Math.floor(Math.random() * selectedSet.value.cards.length)
  currentCardIndex.value = randomIndex
}

// 简单的Markdown渲染（支持加粗和换行）
function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // 加粗
    .replace(/\n/g, '<br>') // 换行
}

// 返回首页
function goHome() {
  router.push('/')
}
</script>

<style scoped lang="scss">
.memory-handbook-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.page-header {
  background: white;
  border-bottom: 2px solid #e0e0e0;
}

.card-sets-container {
  max-width: 1200px;
  margin: 0 auto;
}

.card-set-item {
  transition: all 0.3s ease;
  border-left: 4px solid transparent;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &.border-primary {
    border-left-color: var(--q-primary);
  }
  &.border-secondary {
    border-left-color: var(--q-secondary);
  }
  &.border-accent {
    border-left-color: var(--q-accent);
  }
  &.border-positive {
    border-left-color: var(--q-positive);
  }
  &.border-warning {
    border-left-color: var(--q-warning);
  }
  &.border-negative {
    border-left-color: var(--q-negative);
  }
}

.card-viewer {
  display: flex;
  flex-direction: column;
  height: 100%;

  .card-navigation {
    border-bottom: 1px solid #e0e0e0;
  }

  .card-content {
    flex: 1;
    overflow-y: auto;
    background: white;
  }

  .card-body {
    font-size: 16px;
    line-height: 1.8;

    :deep(strong) {
      color: var(--q-primary);
      font-weight: 600;
    }
  }

  .tip-box {
    display: flex;
    align-items: center;
    padding: 12px;
    background: #fff9e6;
    border-left: 3px solid var(--q-warning);
    border-radius: 4px;
  }

  .card-thumbnails {
    border-top: 1px solid #e0e0e0;
    max-height: 150px;
    overflow-y: auto;
  }
}
</style>
