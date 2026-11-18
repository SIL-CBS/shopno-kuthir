// UI standard audit: summary table -> clickable rows -> popup (grid+single) -> export bar (Excel, PDF, Image, WhatsApp)
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.route(/fonts\.g|script\.google/,r=>r.abort());
await p.goto('file:///home/claude/shopno-kuthir/v2/index.html');
await p.fill('#u','620793');await p.fill('#p','admin@620');await p.click('#b');await p.waitForTimeout(6000);
const ids=await p.evaluate(()=>{const o=new Set();document.querySelectorAll('[data-id],[data-nav],[data-go],a[href^="#"]').forEach(a=>{const v=a.dataset.id||a.dataset.nav||a.dataset.go||(a.getAttribute('href')||'').slice(1);if(v)o.add(v)});return [...o]});
const rows=[];
const bar=()=>p.evaluate(()=>{const q=s=>document.querySelectorAll(s).length;const t=document.querySelector('#view').innerText;return {tables:q('#view table'),click:q('#view [data-k],#view .clk,#view [data-go],#view [data-open],#view [data-g]'),xl:q('#view [data-ex="x"]')>0,pdf:q('#view [data-ex="p"]')>0,img:q('#view [data-ex="i"]')>0,wa:q('#view [data-ex="w"]')>0}});
for(const id of ids){await p.evaluate(h=>{location.hash=h},id);await p.waitForTimeout(600);
 const v=await bar();let pop={opened:false};
 if(v.click){await p.evaluate(()=>{const e=document.querySelector('#view [data-k],#view .clk,#view [data-go],#view [data-open],#view [data-g]');e&&e.click()});await p.waitForTimeout(500);
  pop=await p.evaluate(()=>{const d=document.querySelector('#dmb');if(!d)return {opened:false};const q=s=>d.querySelectorAll(s).length;return {opened:true,grid:/গ্রিড ভিউ|Grid view/.test(d.innerText),single:/সিঙ্গেল ভিউ|Single view/.test(d.innerText),tbl:q('table')>0,xl:q('[data-dx="x"]')>0,pdf:q('[data-dx="p"]')>0,img:q('[data-dx="i"]')>0,wa:q('[data-dx="w"]')>0,paras:q('ol.steps li')}});
  await p.keyboard.press('Escape');await p.waitForTimeout(150);}
 rows.push({id,...v,pop});}
const ok=x=>x?'✔':'✘';
const EX=/^(my$|en-(exp|dep|bal|bin|bout|voice|img)|set-|old|deed-|all-scpdf|g-)/;const gaps=[];let md='| স্ক্রিন | টেবিল | ক্লিকযোগ্য সারি | Excel | PDF | ছবি | WhatsApp | পপআপ | গ্রিড+সিঙ্গেল | পপআপ টেবিল | পপআপ এক্সপোর্ট (X/P/ছবি/WA) | অনুচ্ছেদ-স্টাইল ধাপ |\n|---|---|---|---|---|---|---|---|---|---|---|---|\n';
for(const r of rows){const P=r.pop;if(EX.test(r.id)&&(!(r.tables&&r.click)||/^en-/.test(r.id)))continue;md+=`| ${r.id} | ${r.tables} | ${r.click} | ${ok(r.xl)} | ${ok(r.pdf)} | ${ok(r.img)} | ${ok(r.wa)} | ${P.opened?'✔':'—'} | ${P.opened?ok(P.grid&&P.single):'—'} | ${P.opened?ok(P.tbl):'—'} | ${P.opened?[P.xl,P.pdf,P.img,P.wa].map(ok).join(''):'—'} | ${P.opened?P.paras:'—'} |\n`;
 const g=[];if(r.tables&&!(r.xl&&r.pdf&&r.img&&r.wa))g.push('এক্সপোর্ট বার অসম্পূর্ণ');if(r.tables&&!r.click)g.push('সারি ক্লিকযোগ্য নয়');if(P.opened&&!(P.grid&&P.single))g.push('গ্রিড/সিঙ্গেল নেই');if(P.opened&&!P.tbl)g.push('পপআপে টেবিল নেই (অনুচ্ছেদ)');if(P.opened&&!(P.xl&&P.pdf&&P.img&&P.wa))g.push('পপআপ এক্সপোর্ট অসম্পূর্ণ');if(g.length)gaps.push(r.id+': '+g.join('; '));}
require('fs').writeFileSync('audit-report.md',md+'\n## গ্যাপ\n'+gaps.map(x=>'- '+x).join('\n')+'\n');
console.log(rows.length,'screens; gaps',gaps.length,errs);await b.close();})();
