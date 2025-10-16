#!/usr/bin/env node

/**
 * 查找记忆口诀文件中与CSV不匹配的题目ID
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

// 获取所有CSV中的题目ID
const csvQuestionIds = new Set(questions.map(q => q.I).filter(Boolean))

console.log('CSV中的题目总数:', csvQuestionIds.size)

// 读取记忆口诀文件
const memoryAidsPath = path.join(__dirname, '../src/services/memoryAids')
const categories = [1, 2, 3, 4, 5]
const memoryAidIds = new Set()
const memoryAidsByCategory = {}

categories.forEach(cat => {
  const filePath = path.join(memoryAidsPath, `category${cat}.ts`)
  const content = fs.readFileSync(filePath, 'utf8')

  // 提取所有 'MC*-*' 格式的键
  const matches = content.match(/'(MC[0-9]+-[0-9]+)':/g) || []

  // 提取具体的ID
  const ids = matches.map(m => m.match(/'(MC[0-9]+-[0-9]+)':/)[1])
  memoryAidsByCategory[cat] = ids
  ids.forEach(id => memoryAidIds.add(id))
})

console.log('记忆口诀文件中的题目总数:', memoryAidIds.size)

// 找出在记忆口诀中但不在CSV中的ID
const extraIds = [...memoryAidIds].filter(id => !csvQuestionIds.has(id))
console.log('\n在记忆口诀中但不在CSV中的ID数量:', extraIds.length)

if (extraIds.length > 0) {
  console.log('\n详细列表（前20个）:')
  extraIds.slice(0, 20).forEach(id => {
    // 找出这个ID在哪个分类文件中
    let catNum = 0
    for (let cat of categories) {
      if (memoryAidsByCategory[cat].includes(id)) {
        catNum = cat
        break
      }
    }
    console.log(`  ${id} (在category${catNum}.ts中)`)
  })
}

// 找出在CSV中但不在记忆口诀中的ID
const missingIds = [...csvQuestionIds].filter(id => !memoryAidIds.has(id))
console.log('\n在CSV中但不在记忆口诀中的ID数量:', missingIds.length)

if (missingIds.length > 0) {
  console.log('\n详细列表（前20个）:')
  missingIds.slice(0, 20).forEach(id => {
    const question = questions.find(q => q.I === id)
    const category = question.P ? question.P.charAt(0) : '?'
    console.log(`  ${id} (CSV分类${category}): ${question.Q.substring(0, 40)}...`)
  })
}

console.log('\n按分类统计缺失的ID:')
const missingByCategory = {}
missingIds.forEach(id => {
  const question = questions.find(q => q.I === id)
  const cat = question.P ? question.P.charAt(0) : '?'
  if (!missingByCategory[cat]) missingByCategory[cat] = []
  missingByCategory[cat].push(id)
})

Object.entries(missingByCategory).forEach(([cat, ids]) => {
  console.log(`  第${cat}类: ${ids.length}个缺失`)
})
