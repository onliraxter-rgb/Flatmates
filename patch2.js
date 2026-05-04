const fs = require('fs');
let code = fs.readFileSync('src/worker.js', 'utf8');

let oldStr = `function goAdd() {
  if (!ME) { toast('Log in first','err'); return; }
  AF = { cat:CATS[0], paidBy:ME.name, split:[...S.members] };
  PIC = null;`.replace(/\n/g, '\r\n');

let newStr = `function goAdd() {
  if (!ME) { toast('Log in first','err'); return; }
  AF = { type: 'expense', cat:CATS[0], paidBy:ME.name, split:S.members.map(function(m){return m.name}) };
  PIC = null;
  setTxType('expense');`.replace(/\n/g, '\r\n');

code = code.replace(oldStr, newStr);

// Let's also check if setTxType was added correctly
if (!code.includes('function setTxType')) {
  console.log('Adding setTxType');
  code = code.replace(/function selC/, `function setTxType(t) {\r\n  AF.type = t;\r\n  if(t==='expense') {\r\n    $('type-exp').style.border='1px solid #fff'; $('type-exp').style.background='rgba(255,255,255,.1)'; $('type-exp').style.color='#fff';\r\n    $('type-dep').style.border='1px solid #333'; $('type-dep').style.background='transparent'; $('type-dep').style.color='#555';\r\n    $('st1-t').textContent='What was bought?'; $('st1-s').textContent='Name and total amount paid'; $('lbl-n').textContent='Expense Name';\r\n    $('catg').style.display='grid';\r\n  } else {\r\n    $('type-dep').style.border='1px solid #fff'; $('type-dep').style.background='rgba(255,255,255,.1)'; $('type-dep').style.color='#fff';\r\n    $('type-exp').style.border='1px solid #333'; $('type-exp').style.background='transparent'; $('type-exp').style.color='#555';\r\n    $('st1-t').textContent='Add Funds to Bank'; $('st1-s').textContent='Who is adding and how much'; $('lbl-n').textContent='Note / Title';\r\n    $('catg').style.display='none';\r\n  }\r\n}\r\nfunction selC`);
}

// Add admin styling and logic correctly if not done
if (!code.includes('pg-admin')) {
  console.log('Adding pg-admin');
  let adminStr = `  <!-- ADMIN -->\r\n  <div class="page" id="pg-admin">\r\n    <div class="hdr">\r\n      <button class="back" onclick="go('home')">←</button>\r\n      <div class="htitle">Admin Settings</div>\r\n    </div>\r\n    <div style="padding:14px 16px 0">\r\n      <div class="sec">Set Member Spending Limits</div>\r\n      <div id="admin-mlist"></div>\r\n    </div>\r\n  </div>\r\n`;
  code = code.replace('<!-- HISTORY -->', adminStr + '\r\n  <!-- HISTORY -->');
}

fs.writeFileSync('src/worker.js', code, 'utf8');
console.log('Fixed');
