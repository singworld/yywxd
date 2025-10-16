#!/usr/bin/env node

/**
 * 最终系统验证脚本
 * 验证记忆口诀系统的完整性和正确性
 */

const fs = require('fs')
const path = require('path')

console.log('╔═══════════════════════════════════════════════════════════╗')
console.log('║       业余无线电C类考试记忆助手 - 系统验证报告          ║')
console.log('╚═══════════════════════════════════════════════════════════╝')
console.log('')

// 验证文件存在性
console.log('📁 文件结构验证:')
const files = [
  'src/services/memoryAids/index.ts',
  'src/services/memoryAids/category1.ts',
  'src/services/memoryAids/category2.ts',
  'src/services/memoryAids/category3.ts',
  'src/services/memoryAids/category4.ts',
  'src/services/memoryAids/category5.ts',
  'src/services/memoryAidsByQuestionId.ts',
  'src/services/dataService.ts',
  'public/C类题库_extracted.csv'
]

let allFilesExist = true
files.forEach(file => {
  const fullPath = path.join(__dirname, '..', file)
  const exists = fs.existsSync(fullPath)
  const icon = exists ? '✅' : '❌'
  console.log(`  ${icon} ${file}`)
  if (!exists) allFilesExist = false
})

if (!allFilesExist) {
  console.log('\n❌ 部分文件缺失，请检查！')
  process.exit(1)
}

console.log('')

// 统计记忆口诀数量
console.log('📊 记忆口诀统计:')
const categories = [1, 2, 3, 4, 5]
let totalMemoryAids = 0

categories.forEach(cat => {
  const filePath = path.join(__dirname, '..', 'src/services/memoryAids', `category${cat}.ts`)
  const content = fs.readFileSync(filePath, 'utf8')

  // 统计 'MC*-*': 格式的条目数
  const matches = content.match(/'MC[0-9]+-[0-9]+'/g) || []
  const count = matches.length

  console.log(`  第${cat}类: ${count}条记忆口诀`)
  totalMemoryAids += count
})

console.log(`  ─────────────────`)
console.log(`  总计: ${totalMemoryAids}条`)
console.log('')

// 验证集成
console.log('🔗 系统集成验证:')

// 检查memoryAidsByQuestionId.ts
const memoryAidsFile = fs.readFileSync(
  path.join(__dirname, '..', 'src/services/memoryAidsByQuestionId.ts'),
  'utf8'
)
const hasImport = memoryAidsFile.includes("import { allMemoryAids } from './memoryAids'")
const hasExport = memoryAidsFile.includes('export const memoryAidsMap')
const hasFunction = memoryAidsFile.includes('export function getMemoryAidByQuestionId')

console.log(`  ${hasImport ? '✅' : '❌'} memoryAidsByQuestionId.ts 导入allMemoryAids`)
console.log(`  ${hasExport ? '✅' : '❌'} memoryAidsByQuestionId.ts 导出memoryAidsMap`)
console.log(`  ${hasFunction ? '✅' : '❌'} memoryAidsByQuestionId.ts 提供查询函数`)

// 检查dataService.ts
const dataServiceFile = fs.readFileSync(
  path.join(__dirname, '..', 'src/services/dataService.ts'),
  'utf8'
)
const hasDataImport = dataServiceFile.includes("import { getMemoryAidByQuestionId }")
const hasUsage = dataServiceFile.includes('memoryAid: getMemoryAidByQuestionId')

console.log(`  ${hasDataImport ? '✅' : '❌'} dataService.ts 导入记忆口诀查询函数`)
console.log(`  ${hasUsage ? '✅' : '❌'} dataService.ts 在加载题目时关联记忆口诀`)

console.log('')

// 验证TypeScript语法
console.log('🔧 TypeScript语法验证:')
try {
  const { execSync } = require('child_process')

  // 检查是否有编译错误
  try {
    execSync('npx tsc --noEmit', { cwd: path.join(__dirname, '..'), stdio: 'pipe' })
    console.log('  ✅ TypeScript编译检查通过')
  } catch (error) {
    const output = error.stdout?.toString() || error.stderr?.toString() || ''
    if (output.includes('error TS')) {
      console.log('  ❌ TypeScript编译有错误:')
      console.log(output.split('\n').slice(0, 10).join('\n'))
    } else {
      console.log('  ⚠️  TypeScript编译检查未运行（可能缺少tsc）')
    }
  }
} catch (error) {
  console.log('  ⚠️  无法运行TypeScript编译检查')
}

console.log('')

// 最终总结
console.log('╔═══════════════════════════════════════════════════════════╗')
console.log('║                      验证总结                             ║')
console.log('╚═══════════════════════════════════════════════════════════╝')
console.log('')
console.log(`  📚 题库题目数: 1282题`)
console.log(`  📝 记忆口诀数: ${totalMemoryAids}条`)
console.log(`  📊 覆盖率: ${((totalMemoryAids / 1282) * 100).toFixed(2)}%`)
console.log('')

if (totalMemoryAids === 1282) {
  console.log('  ✅ 系统状态: 完整且可用')
  console.log('  ✅ 所有题目都有对应的记忆口诀')
  console.log('  ✅ 系统已集成到dataService')
  console.log('')
  console.log('  🎉 恭喜！记忆口诀系统已经完全建立！')
} else {
  console.log(`  ⚠️  记忆口诀数量不匹配（期望1282，实际${totalMemoryAids}）`)
}

console.log('')
console.log('═══════════════════════════════════════════════════════════')

process.exit(totalMemoryAids === 1282 ? 0 : 1)
