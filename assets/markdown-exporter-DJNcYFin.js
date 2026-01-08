import{p as l,f as y}from"./index-BiV6bNhz.js";function D(t){const r=l(t.startDate),i=l(t.endDate);let e=`# Week of ${y(r,i)}

`;for(const o of t.days){const a=l(o.date),m=["January","February","March","April","May","June","July","August","September","October","November","December"][a.getMonth()],k=a.getDate();if(e+=`## ${o.dayOfWeek}, ${m} ${k}

`,o.entries.length>0){e+=`### Daily Entries
`;for(const s of o.entries){const d=s.completed?"[x]":"[ ]";e+=`- ${d} ${s.text}
`}e+=`
`}const u=t.fieldLists.filter(s=>s.relatedDay===o.date);for(const s of u){e+=`### ${s.title}
`;for(const d of s.entries){const p=d.completed?"[x]":"[ ]";e+=`- ${p} ${d.text}
`}e+=`
`}}const n=t.fieldLists.filter(o=>o.relatedDay===null);if(n.length>0){e+=`## Week-Level Field Lists

`;for(const o of n){e+=`### ${o.title}
`;for(const a of o.entries){const f=a.completed?"[x]":"[ ]";e+=`- ${f} ${a.text}
`}e+=`
`}}return e}function g(t){if(t.length===0)return"";const r=[...t].sort((n,o)=>n.weekId.localeCompare(o.weekId));let c=r.map(n=>D(n)).join(`
---

`);const e={weeks:r.map(n=>({weekId:n.weekId,startDate:n.startDate,endDate:n.endDate})),exportDate:new Date().toISOString(),version:"1.0",multiWeek:!0};return c+`

<!-- METADATA: ${JSON.stringify(e)} -->`}function h(t){if(t.length===0)return"weeks-export.md";if(t.length===1)return`week-${t[0].weekId}.md`;const r=[...t].sort((e,n)=>e.startDate.localeCompare(n.startDate)),i=r[0].startDate,c=r[r.length-1].weekId;return`weeks-${i}-to-${c}.md`}export{g as exportMultipleWeeksToMarkdown,D as exportToMarkdown,h as getMultiWeekFilename};
