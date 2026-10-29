import { readFileSync } from 'node:fs'

const { total } = JSON.parse(readFileSync('coverage/coverage-summary.json', 'utf8'))
const keys = ['statements', 'branches', 'functions', 'lines']
const rows = keys.map(
  (key) => `| ${key} | ${total[key].pct}% | ${total[key].covered}/${total[key].total} |`
)

console.log(`### Test coverage

| Metric | Percent | Covered |
| --- | --- | --- |
${rows.join('\n')}`)
