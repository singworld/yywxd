/**
 * 导出所有题目清单
 * 用于协作编辑记忆口诀
 *
 * 使用方法：
 *   node scripts/exportQuestionsList.js
 *
 * 输出文件：
 *   - questions_list.txt - 纯文本格式，方便浏览
 *   - questions_list.json - JSON格式，方便程序处理
 */

const fs = require('fs')
const path = require('path')
const Papa = require('papaparse')

// 读取CSV文件
const csvPath = path.join(__dirname, '../public/C类题库_extracted.csv')
const csvContent = fs.readFileSync(csvPath, 'utf-8')

// 解析CSV
Papa.parse(csvContent, {
  header: true,
  skipEmptyLines: true,
  complete: (results) => {
    const questions = []

    results.data.forEach((row, index) => {
      if (row.Q && row.T && row.A && row.B && row.C && row.D) {
        questions.push({
          序号: index + 1,
          题号: row.J || '',
          分类: row.P || '',
          题目: row.Q || '',
          选项A: row.A || '',
          选项B: row.B || '',
          选项C: row.C || '',
          选项D: row.D || '',
          正确答案: row.T || '',
          记忆口诀: '' // 待填写
        })
      }
    })

    // 输出为纯文本格式
    let textOutput = '# 业余无线电C类考试题库清单\n\n'
    textOutput += `总计：${questions.length} 道题目\n\n`
    textOutput += '=' .repeat(80) + '\n\n'

    questions.forEach(q => {
      textOutput += `【${q.题号}】（第${q.序号}题）\n`
      textOutput += `分类：${q.分类}\n`
      textOutput += `题目：${q.题目}\n`
      textOutput += `  A. ${q.选项A}\n`
      textOutput += `  B. ${q.选项B}\n`
      textOutput += `  C. ${q.选项C}\n`
      textOutput += `  D. ${q.选项D}\n`
      textOutput += `正确答案：${q.正确答案}\n`
      textOutput += `记忆口诀：${q.记忆口诀 || '（待添加）'}\n`
      textOutput += '\n' + '-'.repeat(80) + '\n\n'
    })

    // 保存文本文件
    const textOutputPath = path.join(__dirname, '../questions_list.txt')
    fs.writeFileSync(textOutputPath, textOutput, 'utf-8')
    console.log(`✅ 纯文本清单已保存：${textOutputPath}`)

    // 输出为JSON格式
    const jsonOutputPath = path.join(__dirname, '../questions_list.json')
    fs.writeFileSync(jsonOutputPath, JSON.stringify(questions, null, 2), 'utf-8')
    console.log(`✅ JSON清单已保存：${jsonOutputPath}`)

    // 按分类统计
    const categoryStats = {}
    questions.forEach(q => {
      const mainCategory = q.分类.split('.')[0]
      categoryStats[mainCategory] = (categoryStats[mainCategory] || 0) + 1
    })

    console.log('\n📊 分类统计：')
    Object.entries(categoryStats)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([cat, count]) => {
        const categoryName = {
          '1': '无线电管理法规',
          '2': '无线电技术基础',
          '3': '发射机和接收机',
          '4': '天线和馈线',
          '5': '安全防护'
        }[cat] || '未知分类'
        console.log(`  ${cat}. ${categoryName}: ${count} 题`)
      })
  },
  error: (error) => {
    console.error('❌ CSV解析失败:', error)
  }
})
