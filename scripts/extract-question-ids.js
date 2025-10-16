#!/usr/bin/env node

/**
 * 提取CSV中每个类别的实际题目ID列表
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

console.log('总题数:', questions.length)

// 按分类整理题目ID
const categories = {
  1: [],
  2: [],
  3: [],
  4: [],
  5: []
}

questions.forEach(q => {
  if (!q.P || !q.I) return
  const cat = parseInt(q.P.charAt(0))
  if (categories[cat]) {
    categories[cat].push({
      id: q.I,
      question: q.Q,
      subCategory: q.P
    })
  }
})

// 输出每个类别的统计
console.log('\n按分类统计:')
Object.entries(categories).forEach(([cat, questions]) => {
  console.log(`\n第${cat}类: ${questions.length}题`)
  console.log(`  第一题: ${questions[0].id}`)
  console.log(`  最后一题: ${questions[questions.length - 1].id}`)

  // 统计ID前缀分布
  const prefixes = {}
  questions.forEach(q => {
    const prefix = q.id.match(/^MC[0-9]+/)[0]
    prefixes[prefix] = (prefixes[prefix] || 0) + 1
  })
  console.log(`  ID前缀分布:`, prefixes)
})

// 生成每个类别的ID列表文件
Object.entries(categories).forEach(([cat, questions]) => {
  const outputPath = path.join(__dirname, `../src/services/memoryAids/category${cat}-ids.json`)
  const data = questions.map(q => ({
    id: q.I,
    subCategory: q.P,
    question: q.Q.substring(0, 80) + (q.Q.length > 80 ? '...' : '')
  }))
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8')
  console.log(`\n已生成: category${cat}-ids.json (${data.length}题)`)
})

console.log('\n✅ 完成！现在可以使用这些ID列表来更新记忆口诀文件')
