#!/usr/bin/env node

/**
 * 记忆口诀系统完整性验证脚本
 * 验证所有1282道题目都有对应的记忆口诀
 */

const fs = require('fs')
const path = require('path')
const Papa = require('papaparse')

// 读取CSV文件
const csvPath = path.join(__dirname, '../public/C类题库_extracted.csv')
const csvContent = fs.readFileSync(csvPath, 'utf8')

// 解析CSV
const { data: questions } = Papa.parse(csvContent, {
  header: true,
  skipEmptyLines: true
})

console.log('📊 题库统计：')
console.log(`总题数: ${questions.length}`)

// 统计各类别题目数
const categoryStats = {}
questions.forEach(q => {
  const category = q.P ? q.P.charAt(0) : '未知'
  categoryStats[category] = (categoryStats[category] || 0) + 1
})

console.log('\n按分类统计：')
Object.entries(categoryStats).forEach(([cat, count]) => {
  console.log(`  第${cat}类: ${count}题`)
})

// 读取记忆口诀文件
console.log('\n📝 记忆口诀统计：')

const memoryAidsPath = path.join(__dirname, '../src/services/memoryAids')
const categories = [1, 2, 3, 4, 5]
let totalMemoryAids = 0
const memoryAidsByCategory = {}

categories.forEach(cat => {
  const filePath = path.join(memoryAidsPath, `category${cat}.ts`)
  const content = fs.readFileSync(filePath, 'utf8')

  // 提取所有 'MC*-*' 格式的键
  const matches = content.match(/'(MC[0-9]+-[0-9]+)':/g) || []
  const count = matches.length

  // 提取具体的ID
  const ids = matches.map(m => m.match(/'(MC[0-9]+-[0-9]+)':/)[1])
  memoryAidsByCategory[cat] = ids

  console.log(`  第${cat}类: ${count}条口诀`)
  totalMemoryAids += count
})

console.log(`\n总计: ${totalMemoryAids}条记忆口诀`)

// 验证覆盖率
console.log('\n🔍 覆盖率验证：')

const questionsWithoutAids = []
const questionIds = questions.map(q => q.I).filter(Boolean)

questionIds.forEach(qid => {
  const hasAid = Object.values(memoryAidsByCategory).some(aids => aids.includes(qid))
  if (!hasAid) {
    questionsWithoutAids.push(qid)
  }
})

if (questionsWithoutAids.length === 0) {
  console.log('✅ 完美！所有题目都有记忆口诀！')
  console.log(`   覆盖率: ${totalMemoryAids}/${questions.length} = 100%`)
} else {
  console.log(`❌ 发现 ${questionsWithoutAids.length} 道题目缺少记忆口诀：`)
  questionsWithoutAids.slice(0, 10).forEach(qid => {
    const question = questions.find(q => q.I === qid)
    console.log(`   - ${qid}: ${question.Q.substring(0, 50)}...`)
  })
  if (questionsWithoutAids.length > 10) {
    console.log(`   ... 还有 ${questionsWithoutAids.length - 10} 道题目`)
  }
}

// 验证是否有多余的口诀
console.log('\n🔍 检查多余口诀：')

const allMemoryAidIds = Object.values(memoryAidsByCategory).flat()
const extraAids = allMemoryAidIds.filter(aid => !questionIds.includes(aid))

if (extraAids.length === 0) {
  console.log('✅ 没有多余的记忆口诀')
} else {
  console.log(`⚠️  发现 ${extraAids.length} 条多余的记忆口诀：`)
  extraAids.slice(0, 10).forEach(aid => {
    console.log(`   - ${aid}`)
  })
  if (extraAids.length > 10) {
    console.log(`   ... 还有 ${extraAids.length - 10} 条`)
  }
}

// 最终总结
console.log('\n' + '='.repeat(60))
console.log('📊 最终统计：')
console.log(`   题库题目数: ${questions.length}`)
console.log(`   记忆口诀数: ${totalMemoryAids}`)
console.log(`   覆盖率: ${((totalMemoryAids / questions.length) * 100).toFixed(2)}%`)
console.log(`   状态: ${totalMemoryAids === questions.length ? '✅ 完整' : '❌ 不完整'}`)
console.log('='.repeat(60))

process.exit(questionsWithoutAids.length === 0 && extraAids.length === 0 ? 0 : 1)
