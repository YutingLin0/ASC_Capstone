// Dependency-free checks for static links and the shared journey component.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');

for (const page of ['index.html', 'infographic.html']) {
  const html = fs.readFileSync(path.join(root, page), 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(ids.length, new Set(ids).size, `${page}: duplicate IDs`);
  for (const [, link] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    if (/^https?:/.test(link)) continue;
    if (link.startsWith('#')) {
      assert(ids.includes(link.slice(1)), `${page}: missing anchor ${link}`);
    } else {
      assert(fs.existsSync(path.join(root, link)), `${page}: missing file ${link}`);
    }
  }
}

const html = fs.readFileSync(path.join(root, 'infographic.html'), 'utf8');
const parts=[...html.matchAll(/<[^>]+data-mode="(walk|bus|rail|bike)"[^>]*>/g)].map(m=>{const set=new Set(m[0].includes('class="hotspot"')?['hotspot']:[]);return{dataset:{mode:m[1]},attrs:{},handlers:{},classList:{contains:k=>set.has(k),toggle:(k,on)=>on?set.add(k):set.delete(k)},setAttribute(k,v){this.attrs[k]=v},addEventListener(k,v){this.handlers[k]=v}}});
const svg={querySelectorAll:()=>parts,addEventListener(){}};const status={};let cleared=false;const context={document:{querySelector:s=>s==='svg'?svg:status,addEventListener(){}},matchMedia:()=>({matches:true}),setTimeout:()=>1,clearTimeout:()=>{cleared=true}};vm.createContext(context);vm.runInContext(html.split('<script>')[1].split('</script>')[0],context);
for(const mode of ['walk','bus','rail','bike']){const box=parts.find(p=>p.dataset.mode===mode&&p.classList.contains('hotspot'));box.handlers.click({stopPropagation(){}});for(const p of parts)assert.equal(p.classList.contains('dim'),p.dataset.mode!==mode);assert.equal(box.attrs['aria-pressed'],'true');box.handlers.click({stopPropagation(){}});assert(parts.every(p=>!p.classList.contains('dim')))}
assert(cleared);assert(!html.includes('<header>'));assert(!html.includes('<aside'));assert(html.includes('height:100dvh'));console.log('PASS: all four mode selections, same-mode reset, tour cancellation, and infographic-only full-page layout.');
