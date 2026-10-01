// Quick test script
const token = process.argv[2]
const body = JSON.stringify({
  slug: 'real-doc-test-2026',
  type: 'whitepaper',
  title: '真实环境 DOC 测试',
  subtitle: '验证 Express + Prisma + Postgres',
  summary: '验证 DOC 文档已落到 Postgres。',
  author: 'test',
  pages: 24,
  tags: ['DOC', 'Postgres'],
  audience: ['manager'],
  industry: ['互联网'],
  isFeatured: false,
  sortOrder: 99,
  fileUrl: '/uploads/real-doc-test.docx',
  fileName: 'test.docx',
  fileSize: '5.2 MB',
  fileType: 'docx',
})

const r = await fetch('http://localhost:4000/api/resources/admin', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Authorization': 'Bearer ' + token,
  },
  body,
})
const text = await r.text()
console.log('STATUS', r.status)
console.log('BODY', text)