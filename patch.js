const fs = require('fs');

let code = fs.readFileSync('src/worker.js', 'utf8');

// 1. mC function
code = code.replace(
  `function mC(name) { var i = S.members.indexOf(name); return CLRS[i < 0 ? 0 : i % CLRS.length]; }`,
  `function mC(name) { var i = S.members.findIndex(function(x){return x.name===name}); return CLRS[i < 0 ? 0 : i % CLRS.length]; }`
);

// 2. renderLogin
code = code.replace(
  `var add = document.createElement('div');`,
  `var adminCard = document.createElement('div');
  adminCard.className = 'ucard';
  adminCard.innerHTML = '<div class="uav" style="background:#555;color:#fff;">A</div><div class="uname">Admin</div><div class="uhint">Admin Access</div>';
  adminCard.onclick = function(){ startPin({id: "admin", name: "Admin", is_admin: 1}); };
  g.appendChild(adminCard);

  var add = document.createElement('div');`
);

// 3. doLogin (Admin Nav)
code = code.replace(
  `$('gname').textContent = ME.name;`,
  `$('gname').textContent = ME.name;
  if (ME.is_admin) {
    if (!$('nb-admin')) {
      var nb = document.createElement('button');
      nb.className = 'nb'; nb.id = 'nb-admin';
      nb.innerHTML = '<span style="font-size:18px">⚙</span>Admin<div class="nb-bar"></div>';
      nb.onclick = function(){ go('admin'); };
      document.querySelector('nav').appendChild(nb);
    }
  }`
);

// 4. createUser
code = code.replace(
  `if (!S.members.includes(name)) S.members.push(name);`,
  `if (!S.members.find(function(x){return x.name===name})) S.members.push({name:name, spend_limit:0});`
);

// 5. rHome
let rHomeOld = `function rHome() {
  var total = S.expenses.reduce(function(a,e){ return a+e.amount; }, 0);
  var bal = getBals();
  var setts = getSettlements(bal);

  // Stats
  $('stats').innerHTML =
    sbox(fmt(total), 'Total Spent') +
    sbox(S.members.length ? fmt(total/S.members.length) : '₹0', 'Per Person') +
    sbox(S.expenses.length, 'Expenses');

  // Urgent alert
  var urg = S.needs.filter(function(n){ return !n.done && n.urgent; }).length;
  if (urg > 0) {
    $('ualert').style.display = 'flex';
    $('utext').textContent = urg + ' urgent item' + (urg>1?'s':'') + ' needed';
  } else {
    $('ualert').style.display = 'none';
  }

  // Balance card
  var h = '<div class="sec">Member Balances</div>';
  S.members.forEach(function(m) {
    var b = bal[m] || 0;
    var paid = S.expenses.filter(function(e){ return (e.paid_by||e.paidBy)===m; }).reduce(function(a,e){ return a+e.amount; }, 0);
    var col = b >= 0 ? '#55CC88' : '#f55';
    h += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">'
      + av(m, 32)
      + '<div style="flex:1"><div style="font-size:13px;font-weight:700">'+m+'</div>'
      + '<div style="font-size:10px;color:#555">Paid '+fmt(paid)+'</div></div>'
      + '<div style="text-align:right">'
      + '<div style="font-family:monospace;font-size:15px;font-weight:800;color:'+col+'">'+(b>=0?'+':'')+fmt(b)+'</div>'
      + '<div style="font-size:9px;color:'+col+';font-weight:700">'+(b>=0?'GETS BACK':'OWES')+'</div>'
      + '</div></div>';
  });

  if (setts.length) {
    h += '<div class="line"></div><div class="sec">Pay To Settle</div>';
    setts.forEach(function(s) {
      h += '<div class="srow">'+av(s.from,26)
        +'<div style="flex:1;font-size:13px"><b>'+s.from+'</b><span style="color:#555"> pays </span><b>'+s.to+'</b></div>'
        +'<div style="font-family:monospace;font-weight:800;font-size:15px">'+fmt(s.amount)+'</div></div>';
    });
  } else if (S.expenses.length) {
    h += '<div style="text-align:center;color:#55CC88;font-size:12px;font-weight:600;margin-top:8px">✓ All settled up!</div>';
  }
  $('balcard').innerHTML = h;`;

let rHomeNew = `function rHome() {
  var deposits = S.expenses.filter(function(e){ return e.type==='deposit'; }).reduce(function(a,e){ return a+e.amount; }, 0);
  var expenses = S.expenses.filter(function(e){ return (!e.type || e.type==='expense'); }).reduce(function(a,e){ return a+e.amount; }, 0);
  var bal = deposits - expenses;

  $('stats').innerHTML =
    sbox(fmt(deposits), 'Total Bank') +
    sbox(fmt(expenses), 'Total Spent') +
    sbox(fmt(bal), 'Available');

  var urg = S.needs.filter(function(n){ return !n.done && n.urgent; }).length;
  if (urg > 0) {
    $('ualert').style.display = 'flex';
    $('utext').textContent = urg + ' urgent item' + (urg>1?'s':'') + ' needed';
  } else {
    $('ualert').style.display = 'none';
  }

  var h = '<div class="sec">Member Bank Stats</div>';
  S.members.forEach(function(m) {
    var dep = S.expenses.filter(function(e){ return e.type==='deposit' && (e.paid_by||e.paidBy)===m.name; }).reduce(function(a,e){ return a+e.amount; }, 0);
    var spent = S.expenses.filter(function(e){ 
      if (e.type==='deposit') return false;
      var sp = Array.isArray(e.splitAmong)?e.splitAmong:JSON.parse(e.split_among||'[]');
      return sp.includes(m.name);
    }).reduce(function(a,e){
      var sp = Array.isArray(e.splitAmong)?e.splitAmong:JSON.parse(e.split_among||'[]');
      return a + (e.amount / (sp.length||1));
    }, 0);
    var lim = m.spend_limit || 0;
    var col = spent > lim && lim > 0 ? '#f55' : '#55CC88';
    h += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">'
      + av(m.name, 32)
      + '<div style="flex:1"><div style="font-size:13px;font-weight:700">'+m.name+'</div>'
      + '<div style="font-size:10px;color:#555">Gave to Bank: '+fmt(dep)+'</div></div>'
      + '<div style="text-align:right">'
      + '<div style="font-family:monospace;font-size:15px;font-weight:800;color:'+col+'">'+fmt(spent)+'</div>'
      + '<div style="font-size:9px;color:'+col+';font-weight:700">SPENT '+ (lim>0 ? '/ '+fmt(lim) : '') +'</div>'
      + '</div></div>';
  });
  $('balcard').innerHTML = h;`;

code = code.replace(rHomeOld, rHomeNew);

// 6. eRow
code = code.replace(
  `function eRow(e) {
  var ic = e.cat_icon || e.catIcon || '📦';
  var py = e.paid_by || e.paidBy;
  return '<div class="erow">'
    +'<div class="eicon">'+ic+'</div>'
    +'<div style="flex:1;min-width:0"><div style="font-size:14px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+e.title+'</div>'
    +'<div style="font-size:11px;color:#555;margin-top:2px">'+py+' paid · '+e.date+'</div></div>'
    +'<div style="font-family:monospace;font-weight:800;font-size:15px;flex-shrink:0">'+fmt(e.amount)+'</div></div>';
}`,
  `function eRow(e) {
  var ic = e.cat_icon || e.catIcon || '📦';
  var py = e.paid_by || e.paidBy;
  if (e.type === 'deposit') { py = py + ' deposited'; ic = '💰'; }
  else { py = 'Paid from Bank'; }
  return '<div class="erow">'
    +'<div class="eicon">'+ic+'</div>'
    +'<div style="flex:1;min-width:0"><div style="font-size:14px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+e.title+'</div>'
    +'<div style="font-size:11px;color:#555;margin-top:2px">'+py+' · '+e.date+'</div></div>'
    +'<div style="font-family:monospace;font-weight:800;font-size:15px;color:'+(e.type==='deposit'?'#55CC88':'#fff')+';flex-shrink:0">'+(e.type==='deposit'?'+':'')+fmt(e.amount)+'</div></div>';
}`
);

// 7. rHistory
code = code.replace(
  `+'<div style="font-size:11px;color:#555;margin-top:2px">Paid by <b style="color:#ccc">'+py+'</b> · ÷'+sp.length+' = '+fmt(e.amount/(sp.length||1))+' each</div>'`,
  `+(e.type==='deposit' ? '<div style="font-size:11px;color:#555;margin-top:2px"><b style="color:#55CC88">Funds Added by '+py+'</b></div>' : '<div style="font-size:11px;color:#555;margin-top:2px">Paid from Bank · ÷'+sp.length+' = '+fmt(e.amount/(sp.length||1))+' each</div>')`
);

// 8. rNeeds
code = code.replace(
  `S.members.forEach(function(m){ var o=document.createElement('option');o.value=o.textContent=m;sel.appendChild(o); });`,
  `S.members.forEach(function(m){ var o=document.createElement('option');o.value=o.textContent=m.name;sel.appendChild(o); });`
);

// 9. rMembers
code = code.replace(
  `function rMembers() {
  var bal = getBals();
  $('mlist').innerHTML = S.members.map(function(m) {
    var b = bal[m] || 0;
    var paid = S.expenses.filter(function(e){ return (e.paid_by||e.paidBy)===m; }).reduce(function(a,e){ return a+e.amount; }, 0);
    var share = S.expenses.reduce(function(a,e){
      var sp = Array.isArray(e.splitAmong)?e.splitAmong:JSON.parse(e.split_among||'[]');
      return a + (sp.includes(m) ? e.amount/(sp.length||1) : 0);
    }, 0);
    var col = b >= 0 ? '#55CC88' : '#f55';
    return '<div class="mrow">'+av(m,44)
      +'<div style="flex:1"><div style="font-size:15px;font-weight:700">'+m+'</div>'
      +'<div style="font-size:11px;color:#555;margin-top:2px">Total paid: <b style="color:#aaa">'+fmt(paid)+'</b></div>'
      +'<div style="font-size:11px;color:#555">Your share: <b style="color:#aaa">'+fmt(share)+'</b></div>'
      +'<div style="font-size:12px;font-weight:700;margin-top:4px;color:'+col+'">'+(b>=0?'Gets back ':'Owes ')+fmt(b)+'</div></div></div>';
  }).join('')+'<div class="line"></div><div style="font-size:13px;color:#555">New members: Sign out → tap "+ Add Flatmate"</div>';
}`,
  `function rMembers() {
  $('mlist').innerHTML = S.members.map(function(m) {
    var dep = S.expenses.filter(function(e){ return e.type==='deposit' && (e.paid_by||e.paidBy)===m.name; }).reduce(function(a,e){ return a+e.amount; }, 0);
    var spent = S.expenses.filter(function(e){ 
      if (e.type==='deposit') return false;
      var sp = Array.isArray(e.splitAmong)?e.splitAmong:JSON.parse(e.split_among||'[]');
      return sp.includes(m.name);
    }).reduce(function(a,e){
      var sp = Array.isArray(e.splitAmong)?e.splitAmong:JSON.parse(e.split_among||'[]');
      return a + (e.amount / (sp.length||1));
    }, 0);
    var lim = m.spend_limit || 0;
    var col = spent > lim && lim > 0 ? '#f55' : '#55CC88';
    return '<div class="mrow">'+av(m.name,44)
      +'<div style="flex:1"><div style="font-size:15px;font-weight:700">'+m.name+'</div>'
      +'<div style="font-size:11px;color:#555;margin-top:2px">Total Deposited: <b style="color:#aaa">'+fmt(dep)+'</b></div>'
      +'<div style="font-size:11px;color:#555">Total Spent: <b style="color:'+col+'">'+fmt(spent)+'</b>' + (lim>0 ? ' / '+fmt(lim) : '') + '</div>'
      +'</div></div>';
  }).join('')+'<div class="line"></div><div style="font-size:13px;color:#555">New members: Sign out → tap "+ Add Flatmate"</div>';
}`
);

// 10. rChips
code = code.replace(
  `  var pb = $('pbchips');
  if (pb) pb.innerHTML = S.members.map(function(m){
    return '<div class="chip'+(AF.paidBy===m?' on':'')+'" onclick="selPB(&#39;'+m+'&#39;)">'
      +av(m,18)+m+'</div>';
  }).join('');

  var sc = $('spchips');
  if (sc) sc.innerHTML = S.members.map(function(m){
    return '<div class="chip'+(AF.split.includes(m)?' on':'')+'" onclick="togSp(&#39;'+m+'&#39;)">'
      +av(m,18)+m+'</div>';
  }).join('');`,
  `  var pb = $('pbchips');
  if (pb) pb.innerHTML = S.members.map(function(m){
    return '<div class="chip'+(AF.paidBy===m.name?' on':'')+'" onclick="selPB(&#39;'+m.name+'&#39;)">'
      +av(m.name,18)+m.name+'</div>';
  }).join('');

  var sc = $('spchips');
  if (sc) sc.innerHTML = S.members.map(function(m){
    return '<div class="chip'+(AF.split.includes(m.name)?' on':'')+'" onclick="togSp(&#39;'+m.name+'&#39;)">'
      +av(m.name,18)+m.name+'</div>';
  }).join('');`
);

// 11. goAdd
code = code.replace(
  `function goAdd() {
  if (!ME) { toast('Log in first','err'); return; }
  AF = { cat:CATS[0], paidBy:ME.name, split:[...S.members] };
  PIC = null;`,
  `function goAdd() {
  if (!ME) { toast('Log in first','err'); return; }
  AF = { type: 'expense', cat:CATS[0], paidBy:ME.name, split:S.members.map(function(m){return m.name}) };
  PIC = null;`
);

// 12. Add transaction type toggle to step 1
code = code.replace(
  `<div class="astep on" id="st1">
        <div style="font-size:20px;font-weight:800;margin:8px 0 4px">What was bought?</div>
        <div style="font-size:12px;color:#555;margin-bottom:18px">Name and total amount paid</div>
        <label class="lbl">Expense Name</label>`,
  `<div class="astep on" id="st1">
        <div style="display:flex;gap:10px;margin:8px 0 16px;">
          <button id="type-exp" onclick="setTxType('expense')" style="flex:1;padding:10px;border-radius:12px;border:1px solid #fff;background:rgba(255,255,255,.1);color:#fff;font-weight:700">Expense</button>
          <button id="type-dep" onclick="setTxType('deposit')" style="flex:1;padding:10px;border-radius:12px;border:1px solid #333;background:transparent;color:#555;font-weight:700">Add Funds</button>
        </div>
        <div style="font-size:20px;font-weight:800;margin:8px 0 4px" id="st1-t">What was bought?</div>
        <div style="font-size:12px;color:#555;margin-bottom:18px" id="st1-s">Name and total amount paid</div>
        <label class="lbl" id="lbl-n">Expense Name</label>`
);

// 13. setTxType logic
code = code.replace(
  `function selC(i,l){ AF.cat={icon:i,label:l}; rChips(); }`,
  `function setTxType(t) {
  AF.type = t;
  if(t==='expense') {
    $('type-exp').style.border='1px solid #fff'; $('type-exp').style.background='rgba(255,255,255,.1)'; $('type-exp').style.color='#fff';
    $('type-dep').style.border='1px solid #333'; $('type-dep').style.background='transparent'; $('type-dep').style.color='#555';
    $('st1-t').textContent='What was bought?'; $('st1-s').textContent='Name and total amount paid'; $('lbl-n').textContent='Expense Name';
    $('catg').style.display='grid';
  } else {
    $('type-dep').style.border='1px solid #fff'; $('type-dep').style.background='rgba(255,255,255,.1)'; $('type-dep').style.color='#fff';
    $('type-exp').style.border='1px solid #333'; $('type-exp').style.background='transparent'; $('type-exp').style.color='#555';
    $('st1-t').textContent='Add Funds to Bank'; $('st1-s').textContent='Who is adding and how much'; $('lbl-n').textContent='Note / Title';
    $('catg').style.display='none';
  }
}
function selC(i,l){ AF.cat={icon:i,label:l}; rChips(); }`
);

// 14. ns
code = code.replace(
  `function ns(n) {
  if (n===2 && (!$('ft').value.trim() || !$('fa').value)) { toast('Fill name & amount','err'); return; }
  if (n===3 && (!AF.paidBy || !AF.split.length)) { toast('Select payer & members','err'); return; }
  gs(n);
}`,
  `function ns(n) {
  if (n===2 && (!$('ft').value.trim() || !$('fa').value)) { toast('Fill name & amount','err'); return; }
  if (n===2 && AF.type==='deposit') { gs(3); return; } // Skip step 2 for deposits
  if (n===3 && (!AF.paidBy || !AF.split.length)) { toast('Select payer & members','err'); return; }
  gs(n);
}`
);
code = code.replace(
  `function gs(n) {
  document.querySelectorAll('.astep').forEach(function(s){ s.classList.remove('on'); });`,
  `function gs(n) {
  if (n===2 && AF.type==='deposit') n=1; // Back from step 3 goes to 1 for deposits
  document.querySelectorAll('.astep').forEach(function(s){ s.classList.remove('on'); });`
);

// 15. saveExp
code = code.replace(
  `async function saveExp() {
  var title = $('ft').value.trim(), amount = parseFloat($('fa').value);
  if (!title || !amount) { toast('Fill name & amount','err'); return; }
  if (!AF.paidBy || !AF.split.length) { toast('Select payer & split','err'); return; }`,
  `async function saveExp() {
  var title = $('ft').value.trim(), amount = parseFloat($('fa').value);
  if (!title || !amount) { toast('Fill name & amount','err'); return; }
  if (AF.type==='expense' && (!AF.paidBy || !AF.split.length)) { toast('Select payer & split','err'); return; }
  if (AF.type==='deposit') { AF.split=[]; AF.paidBy=ME.name; AF.cat={icon:'💰',label:'Deposit'}; }`
);

// Also add e.type
code = code.replace(
  `date:$('fd').value, note:$('fn').value, screenshot:PIC||''`,
  `date:$('fd').value, note:$('fn').value, screenshot:PIC||'', type:AF.type`
);


// 16. Admin Page HTML and Logic
code = code.replace(
  `<!-- HISTORY -->`,
  `<!-- ADMIN -->
  <div class="page" id="pg-admin">
    <div class="hdr">
      <button class="back" onclick="go('home')">←</button>
      <div class="htitle">Admin Settings</div>
    </div>
    <div style="padding:14px 16px 0">
      <div class="sec">Set Member Spending Limits</div>
      <div id="admin-mlist"></div>
    </div>
  </div>

  <!-- HISTORY -->`
);

code = code.replace(
  `function go(id) {`,
  `async function saveLimit(name) {
    var val = parseFloat($('lim-'+name).value) || 0;
    try {
      var r = await api('PUT', '/members/'+encodeURIComponent(name), {spend_limit: val});
      if (r.ok) { S.members = r.data; toast('Limit saved'); }
    } catch(e) { toast('Error', 'err'); }
  }
  function rAdmin() {
    $('admin-mlist').innerHTML = S.members.map(function(m) {
      return '<div class="card" style="display:flex;align-items:center;gap:10px">'
        + av(m.name, 32)
        + '<div style="flex:1;font-size:14px;font-weight:700">'+m.name+'</div>'
        + '<input class="inp" type="number" id="lim-'+m.name+'" value="'+(m.spend_limit||0)+'" style="width:100px;padding:8px" placeholder="Limit">'
        + '<button class="btn" style="width:auto;padding:8px 12px" onclick="saveLimit(&#39;'+m.name+'&#39;)">Save</button>'
        + '</div>';
    }).join('');
  }
function go(id) {`
);

code = code.replace(
  `if (id === 'calendar') rCal();`,
  `if (id === 'calendar') rCal();
  if (id === 'admin') rAdmin();`
);


// 17. S.members join in askAI
code = code.replace(
  `S.members.join(',')`,
  `S.members.map(function(m){return m.name;}).join(',')`
);

fs.writeFileSync('src/worker.js', code, 'utf8');
console.log("Patched worker.js");
