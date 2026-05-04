
// ─── STATE ───────────────────────────────────────────────────────────────────
var S = { users:[], members:[], expenses:[], messages:[] };
var ME = null;
var PIN_TARGET = null, PIN_VAL = '';
var AF = { cat:{icon:'🛒',label:'Groceries'}, paidBy:'', split:[], type:'expense' };
var PIC = null;
var CAL_M = new Date().toISOString().slice(0,7);
var LAST_MSG_COUNT = 0;

var CATS = [
  {icon:'🛒',label:'Groceries'},{icon:'🍕',label:'Food'},
  {icon:'💡',label:'Electricity'},{icon:'💧',label:'Water/Gas'},
  {icon:'🌐',label:'Internet'},{icon:'🧹',label:'Cleaning'},
  {icon:'🚗',label:'Travel'},{icon:'💊',label:'Medical'},
  {icon:'🎬',label:'Entertainment'},{icon:'📦',label:'Other'}
];
var CLRS = ['#C9A84C','#5B8CFF','#55CC88','#FF7BAC','#A07EFF','#FF9955'];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function $(id) { return document.getElementById(id); }
function fmt(n) { return '₹' + Math.abs(Math.round(n)).toLocaleString('en-IN'); }
function today() { return new Date().toISOString().slice(0,10); }
function mC(name) { var i = S.members.findIndex(function(x){return x.name===name}); return CLRS[i < 0 ? 0 : i % CLRS.length]; }
function av(name, sz) {
  sz = sz || 32;
  var c = mC(name);
  return '<div class="av" style="width:'+sz+'px;height:'+sz+'px;background:'+c+'15;border:1.5px solid '+c+'44;font-size:'+(sz*.42)+'px;color:'+c+';font-weight:800;font-family:var(--font-display)">'+name[0]+'</div>';
}

var _toastT;
function toast(msg, type) {
  var el = $('toast');
  el.textContent = msg;
  el.style.background = type === 'err' ? '#3a1010' : '#1e1e1e';
  el.style.borderColor = type === 'err' ? '#f55' : '#444';
  el.style.color = type === 'err' ? '#f88' : '#fff';
  el.style.display = 'block';
  clearTimeout(_toastT);
  _toastT = setTimeout(function(){ el.style.display = 'none'; }, 2600);
}

function spinning(on) { var s = $('spin'); if (s) s.style.display = on ? 'block' : 'none'; }

// ─── API ─────────────────────────────────────────────────────────────────────
async function api(method, path, body) {
  var fid = localStorage.getItem('fm_flat_id') || 'flat_0';
  var opts = { 
    method: method, 
    headers: {
      'Content-Type':'application/json',
      'x-flat-id': fid
    } 
  };
  if (body) opts.body = JSON.stringify(body);
  var r = await fetch(path, opts);
  return r.json();
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
async function loadUsers() {
  try {
    var r = await api('GET', '/users');
    S.users = (r.ok && Array.isArray(r.data)) ? r.data : [];
  } catch(e) {
    S.users = [];
  }
  renderLogin();
}

function renderLogin() {
  var g = $('ugrid');
  g.innerHTML = '';

  if (S.users.length === 0) {
    $('lerr').textContent = 'Flat is empty. Ask admin to add members.';
  } else {
    $('lerr').textContent = '';
    S.users.forEach(function(u) {
      var c = u.color || '#C9A84C';
      var d = document.createElement('div');
      d.className = 'ucard';
      d.innerHTML = '<div class="uav" style="background:'+c+'15;color:'+c+';border:1.5px solid '+c+'44">'+u.name[0]+'</div>'
        + '<div class="uname">'+u.name+'</div>'
        + '<div class="uhint">Tap to enter</div>';
      d.onclick = function(){ startPin(u); };
      g.appendChild(d);
    });
  }

  var adminCard = document.createElement('div');
  adminCard.className = 'ucard';
  adminCard.innerHTML = '<div class="uav" style="background:#555;color:#fff;">A</div><div class="uname">Admin</div><div class="uhint">Admin Access</div>';
  adminCard.onclick = function(){ startPin({id: "admin", name: "Admin", is_admin: 1}); };
  g.appendChild(adminCard);

  var add = document.createElement('div');
  add.className = 'ucard ucard-add';
  add.innerHTML = '<div style="font-size:24px;margin-bottom:8px;color:var(--text-muted)">+</div>'
    + '<div class="uname" style="color:var(--text-muted)">Add Member</div>';
  add.onclick = function(){ $('adduser').classList.remove('hidden'); };
  g.appendChild(add);
}

function startPin(u) {
  PIN_TARGET = u; PIN_VAL = '';
  var c = u.color || '#D4AF37';
  $('pav').style.background = c + '15';
  $('pav').style.color = c;
  $('pav').style.border = '2px solid ' + c + '44';
  $('pav').style.boxShadow = '0 0 20px ' + c + '22';
  $('pav').textContent = u.name[0];
  $('pname').textContent = u.name;
  $('perr').textContent = '';
  [0,1,2,3].forEach(function(i){ $('d'+i).classList.remove('filled'); });
  $('pinscreen').classList.remove('hidden');
}

function pk(k) {
  if (PIN_VAL.length >= 4) return;
  PIN_VAL += k;
  $('d'+(PIN_VAL.length-1)).classList.add('filled');
  if (PIN_VAL.length === 4) setTimeout(checkPin, 200);
}

function pb() {
  if (!PIN_VAL.length) return;
  $('d'+(PIN_VAL.length-1)).classList.remove('filled');
  PIN_VAL = PIN_VAL.slice(0,-1);
}

function cancelPin() {
  $('pinscreen').classList.add('hidden');
  PIN_VAL = ''; PIN_TARGET = null;
}

async function checkPin() {
  try {
    var r = await api('POST', '/login', { userId: PIN_TARGET.id, pin: PIN_VAL });
    if (r.ok) {
      ME = r.data;
      localStorage.setItem('fm_me', JSON.stringify(ME));
      doLogin();
    } else {
      $('perr').textContent = 'Wrong PIN, try again';
      PIN_VAL = '';
      [0,1,2,3].forEach(function(i){ $('d'+i).classList.remove('filled'); });
    }
  } catch(e) {
    $('perr').textContent = 'Error, try again';
    PIN_VAL = '';
  }
}

function doLogin() {
  $('pinscreen').classList.add('hidden');
  $('login').style.display = 'none';
  $('app').style.display = 'block';
  $('gname').textContent = ME.name;
  if (ME.is_admin) {
    if (!$('nb-admin')) {
      var nb = document.createElement('button');
      nb.className = 'nb'; nb.id = 'nb-admin';
      nb.innerHTML = '<span style="font-size:18px">⚙</span>Admin<div class="nb-bar"></div>';
      nb.onclick = function(){ go('admin'); };
      document.querySelector('nav').appendChild(nb);
    }
  }
  loadAll();
  setInterval(function(){ loadAll(true); }, 20000);
}

function logout() {
  ME = null;
  localStorage.removeItem('fm_me');
  $('app').style.display = 'none';
  $('login').style.display = 'flex';
  loadUsers();
}

function closeAU() {
  $('adduser').classList.add('hidden');
  $('aun').value = ''; $('aup').value = '';
}

async function createUser() {
  var name = $('aun').value.trim();
  var pin = String($('aup').value).trim();
  if (!name || pin.length !== 4 || isNaN(Number(pin))) {
    toast('Enter name and 4-digit PIN', 'err'); return;
  }
  var c = CLRS[S.users.length % CLRS.length];
  try {
    var r = await api('POST', '/users', { name:name, pin:pin, color:c });
    if (r.ok) {
      S.users = r.data;
      await api('POST', '/members', { name:name });
      if (!S.members.find(function(x){return x.name===name})) S.members.push({name:name, spend_limit:0});
      renderLogin();
      closeAU();
      toast('✓ ' + name + ' added!');
    } else toast(r.error || 'Failed', 'err');
  } catch(e) { toast('Network error', 'err'); }
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
async function loadAll(quiet) {
  if (!quiet) spinning(true);
  try {
    var res = await Promise.all([
      api('GET', '/members'),
      api('GET', '/expenses'),
      api('GET', '/messages')
    ]);
    if (res[0].ok) S.members = res[0].data;
    if (res[1].ok) S.expenses = res[1].data;
    if (res[2].ok) S.messages = res[2].data;
    if (!quiet && S.messages.length > LAST_MSG_COUNT && ME) {
      if (S.messages[S.messages.length-1].sender !== ME.name) $('ualert').style.display = 'flex';
    }
    LAST_MSG_COUNT = S.messages.length;
    try { render(); } catch(err) { console.error('Render crash:', err); }
  } catch(e) {
    if (!quiet) toast('Connection error', 'err');
  }
  spinning(false);
}

// ─── BALANCES ────────────────────────────────────────────────────────────────
function getBals() {
  var b = {};
  S.members.forEach(function(m){ b[m.name] = { gave:0, spent:0, bal:0, limit: m.spend_limit||0 }; });
  S.expenses.forEach(function(e) {
    if (e.type === 'deposit') {
      var py = e.paid_by || e.paidBy;
      if (py in b) b[py].gave += e.amount;
    } else {
      var sp = Array.isArray(e.splitAmong) ? e.splitAmong : [];
      if (!sp || !sp.length) return;
      var share = e.amount / sp.length;
      sp.forEach(function(m){ if (m in b) b[m].spent += share; });
    }
  });
  Object.keys(b).forEach(function(k){ b[k].bal = b[k].gave - b[k].spent; });
  return b;
}

function getSettlements(bal) {
  var d = S.members.filter(function(m){ return bal[m.name] < -0.5; }).map(function(m){ return {n:m.name, a:-bal[m.name]}; }).sort(function(a,b){ return b.a-a.a; });
  var c = S.members.filter(function(m){ return bal[m.name] > 0.5; }).map(function(m){ return {n:m.name, a:bal[m.name]}; }).sort(function(a,b){ return b.a-a.a; });
  var res = []; var i = 0, j = 0;
  while (i < d.length && j < c.length) {
    var a = Math.min(d[i].a, c[j].a);
    if (a > 0.5) res.push({ from:d[i].n, to:c[j].n, amount:Math.round(a) });
    d[i].a -= a; c[j].a -= a;
    if (d[i].a < 0.5) i++;
    if (c[j].a < 0.5) j++;
  }
  return res;
}

// ─── RENDER ALL ──────────────────────────────────────────────────────────────
function render() { rHome(); rHistory(); rChat(); rMembers(); rAI(); rChips(); }

function rHome() {
  var bals = getBals();
  var pool = 0, spent = 0;
  S.expenses.forEach(function(e) {
    if (e.type === 'deposit') pool += e.amount;
    else spent += e.amount;
  });
  
  $('stats').innerHTML =
    sbox(fmt(pool), 'Deposit Pool', 'var(--accent-green)') +
    sbox(fmt(spent), 'Spent So Far', 'var(--accent-red)') +
    sbox(fmt(pool-spent), 'Available', 'var(--accent-gold)');

  // Wallet cards
  var h = '<div class="sec">Member Wallets</div>';
  S.members.forEach(function(m) {
    var b = bals[m.name];
    var col = b.bal >= 0 ? 'var(--accent-green)' : 'var(--accent-red)';
    h += '<div style="display:flex;align-items:center;gap:16px;margin-bottom:16px;background:var(--bg-input);padding:14px;border-radius:var(--radius-md);border:1px solid var(--border-subtle)">'
      + av(m.name, 44)
      + '<div style="flex:1"><div style="font-size:15px;font-weight:800;font-family:var(--font-display)">'+m.name+'</div>'
      + '<div style="font-size:10px;color:var(--text-muted)">In: '+fmt(b.gave)+' · Out: '+fmt(b.spent)+'</div></div>'
      + '<div style="text-align:right">'
      + '<div style="font-family:var(--font-mono);font-size:17px;font-weight:800;color:'+col+'">'+(b.bal>=0?'':'−')+fmt(b.bal)+'</div>'
      + '<div style="font-size:9px;color:'+col+';font-weight:800;letter-spacing:1px">'+(b.bal>=0?'SURPLUS':'OWED')+'</div>'
      + '</div></div>';
  });
  $('balcard').innerHTML = h;

  // Recent
  var rec = S.expenses.slice(0,5);
  $('reclist').innerHTML = rec.length
    ? rec.map(eRow).join('')
    : '<div style="color:#444;text-align:center;padding:28px 0;font-size:13px">No expenses yet — tap Add above</div>';

  var mb = $('moreBtn');
  if (S.expenses.length > 5) { mb.style.display='block'; mb.textContent='View all '+S.expenses.length+' →'; }
  else mb.style.display = 'none';
}

function sbox(v,l,c) { 
  return '<div class="stat-box" style="border-bottom:3px solid '+(c||'var(--border-default)')+'">'
    +'<div class="stat-v" style="color:'+(c||'var(--text-primary)')+'">'+v+'</div>'
    +'<div class="stat-l">'+l.toUpperCase()+'</div></div>'; 
}

function eRow(e) {
  var ic = e.cat_icon || e.catIcon || '📦';
  var py = e.paid_by || e.paidBy;
  var isDep = e.type === 'deposit';
  if (isDep) { py = py + ' deposited'; ic = '💰'; }
  else { py = 'Split among ' + (e.splitAmong ? e.splitAmong.length : 0); }
  return '<div class="erow" onclick="go(&#39;history&#39;)">'
    +'<div class="eicon" style="background:'+(isDep?'var(--accent-green)10':'var(--bg-input)')+'">'+ic+'</div>'
    +'<div style="flex:1;min-width:0"><div style="font-size:14px;font-weight:700;font-family:var(--font-display);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+e.title+'</div>'
    +'<div style="font-size:10px;color:var(--text-muted);margin-top:2px;font-weight:600">'+py+' · '+e.date+'</div></div>'
    +'<div style="text-align:right;flex-shrink:0">'
    +'<div style="font-family:var(--font-mono);font-weight:800;font-size:15px;color:'+(isDep?'var(--accent-green)':'var(--text-primary)')+'">'+(isDep?'+':'')+fmt(e.amount)+'</div>'
    +'</div></div>';
}

function rHistory() {
  $('htitle').textContent = 'History (' + S.expenses.length + ')';
  if (!S.expenses.length) {
    $('hlist').innerHTML = '<div style="color:var(--text-muted);text-align:center;padding:80px 24px;font-size:14px">No activity recorded yet.</div>';
    return;
  }
  $('hlist').innerHTML = S.expenses.map(function(e) {
    var sp = Array.isArray(e.splitAmong) ? e.splitAmong : [];
    var py = e.paid_by || e.paidBy;
    var ic = e.cat_icon || e.catIcon || '📦';
    var isDep = e.type === 'deposit';
    return '<div class="card" style="padding:16px;border-left:4px solid '+(isDep?'var(--accent-green)':'var(--accent-gold)')+'">'
      +'<div style="display:flex;gap:14px;align-items:flex-start">'
      +'<div class="eicon" style="width:44px;height:44px;background:var(--bg-input)">'+ic+'</div>'
      +'<div style="flex:1;min-width:0">'
      +'<div style="font-size:16px;font-weight:800;font-family:var(--font-display)">'+e.title+'</div>'
      +'<div style="font-size:11px;color:var(--text-muted);margin-top:2px;font-weight:600">'+(e.cat_label||e.catLabel||'')+' · '+e.date+'</div>'
      +(isDep ? '<div style="font-size:11px;color:var(--accent-green);margin-top:6px;font-weight:700">Added by '+py+'</div>' : '<div style="font-size:11px;color:var(--text-secondary);margin-top:6px">Paid by '+py+' · ÷'+sp.length+' = '+fmt(e.amount/(sp.length||1))+' share</div>')
      +'<div style="font-size:10px;color:var(--text-muted);margin-top:4px">Split: '+sp.join(', ')+'</div>'
      +(e.note?'<div style="font-size:11px;color:var(--text-secondary);margin-top:6px;padding:8px;background:var(--bg-input);border-radius:8px">"'+e.note+'"</div>':'')
      +'</div>'
      +'<div style="text-align:right;flex-shrink:0">'
      +'<div style="font-family:var(--font-mono);font-weight:800;font-size:17px;color:'+(isDep?'var(--accent-green)':'var(--text-primary)')+'">'+(isDep?'+':'')+fmt(e.amount)+'</div>'
      +'<button onclick="delExp('+e.id+')" style="background:none;border:none;color:var(--accent-red);font-size:10px;font-weight:700;cursor:pointer;margin-top:10px;text-transform:uppercase;letter-spacing:1px">Delete</button>'
      +'</div></div>'
      +(e.screenshot&&e.screenshot.length>10?'<img src="'+e.screenshot+'" style="width:100%;border-radius:var(--radius-md);margin-top:14px;max-height:160px;object-fit:cover;border:1px solid var(--border-subtle)">':'')
      +'</div>';
  }).join('');
}

function rCal() {
  var ym = CAL_M.split('-').map(Number), y=ym[0], mo=ym[1];
  $('ctitle').textContent = new Date(y,mo-1,1).toLocaleString('en-IN',{month:'long',year:'numeric'});
  var fd = new Date(y,mo-1,1).getDay(), dim = new Date(y,mo,0).getDate();
  var h = '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:8px">';
  ['Su','Mo','Tu','We','Th','Fr','Sa'].forEach(function(d){ h += '<div style="text-align:center;font-size:10px;color:var(--text-muted);font-weight:800;text-transform:uppercase">'+d+'</div>'; });
  h += '</div><div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px">';
  for (var i=0;i<fd;i++) h += '<div></div>';
  for (var d=1;d<=dim;d++) {
    var ds = CAL_M+'-'+String(d).padStart(2,'0');
    var de = S.expenses.filter(function(e){ return e.date===ds; });
    var dt = de.reduce(function(a,e){ return a+e.amount; }, 0);
    h += '<button onclick="showDay(&#39;'+ds+'&#39;)" style="background:'+(dt>0?'var(--bg-elevated)':'transparent')+';border:1px solid '+(dt>0?'var(--border-default)':'transparent')+';border-radius:var(--radius-sm);padding:8px 2px;cursor:'+(de.length?'pointer':'default')+';text-align:center;transition:all 0.2s">'
      +'<div style="font-size:13px;font-weight:'+(de.length?800:400)+';color:'+(de.length?'var(--text-primary)':'var(--text-muted)')+'">'+d+'</div>'
      +(dt>0?'<div style="font-size:8px;color:var(--accent-gold);font-family:var(--font-mono);font-weight:700">₹'+(dt>=1000?Math.round(dt/1000)+'k':dt)+'</div>':'')
      +'</button>';
  }
  h += '</div>';
  $('cgrid').innerHTML = h;
  var mt = S.expenses.filter(function(e){ return e.date&&e.date.startsWith(CAL_M); }).reduce(function(a,e){ return a+e.amount; }, 0);
  var mc = S.expenses.filter(function(e){ return e.date&&e.date.startsWith(CAL_M); }).length;
  $('csum').innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center">'
    +'<div style="font-size:14px;font-weight:800;font-family:var(--font-display)">Month Activity</div>'
    +'<div style="font-family:var(--font-mono);font-weight:800;font-size:22px;color:var(--accent-gold)">'+fmt(mt)+'</div></div>'
    +'<div style="font-size:11px;color:var(--text-muted);margin-top:3px;font-weight:600">'+mc+' transaction'+(mc!==1?'s':'')+' in this period</div>';
  $('cday').classList.add('hidden');
}

function showDay(ds) {
  var de = S.expenses.filter(function(e){ return e.date===ds; });
  if (!de.length) return;
  var dt = de.reduce(function(a,e){ return a+e.amount; }, 0);
  var el = $('cday'); el.classList.remove('hidden');
  el.innerHTML = '<div style="display:flex;justify-content:space-between;margin-bottom:14px">'
    +'<div style="font-size:15px;font-weight:800;font-family:var(--font-display)">'+ds+'</div>'
    +'<button onclick="document.getElementById(&#39;cday&#39;).classList.add(&#39;hidden&#39;)" style="background:var(--bg-input);border:none;color:var(--text-muted);cursor:pointer;font-size:14px;width:28px;height:28px;border-radius:50%">✕</button>'
    +'</div>'
    + de.map(function(e){ return '<div style="display:flex;gap:12px;align-items:center;margin-bottom:10px;background:var(--bg-input);padding:10px;border-radius:var(--radius-sm)"><span style="font-size:20px">'+(e.cat_icon||e.catIcon||'📦')+'</span><div style="flex:1;font-size:14px;font-weight:700">'+e.title+'</div><div style="font-family:var(--font-mono);font-weight:800;color:var(--accent-gold)">'+fmt(e.amount)+'</div></div>'; }).join('')
    +'<div style="border-top:1px solid var(--border-subtle);padding-top:10px;margin-top:6px;text-align:right;font-size:14px;font-weight:800;font-family:var(--font-display)">Total: <span style="color:var(--accent-gold)">'+fmt(dt)+'</span></div>';
}

function cm(d) {
  var ym = CAL_M.split('-').map(Number), nd = new Date(ym[0],ym[1]-1+d,1);
  CAL_M = nd.getFullYear()+'-'+String(nd.getMonth()+1).padStart(2,'0');
  rCal();
}

function rChat() {
  var bals = getBals();
  var rem = $('reminders');
  if (rem) {
    rem.innerHTML = S.members.map(function(m){
      var b = bals[m.name];
      if (b.bal >= 0) return '';
      return '<button class="chip" style="border-color:var(--accent-red);color:var(--accent-red);background:rgba(255,85,85,0.1)" onclick="sendReminder(&#39;'+m.name+'&#39;, '+Math.abs(b.bal)+')">'
        +'🔔 Remind '+m.name+' ('+fmt(b.bal)+')</button>';
    }).join('');
  }

  var list = $('chatlist');
  if (list) {
    list.innerHTML = S.messages.map(function(m) {
      var isMe = ME && m.sender === ME.name;
      var isAI = m.sender === 'AI Agent' || m.sender === 'FlatBot';
      var time = new Date(m.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
      if (m.type === 'reminder') {
        return '<div class="msg-rem" style="background:var(--bg-elevated);border:1px solid var(--border-default);color:var(--text-secondary);font-weight:700;padding:10px 14px;border-radius:12px;margin-bottom:12px;font-size:12px;text-align:center">🔔 '+m.text+'</div>';
      }
      return '<div class="msg'+(isMe?' me':(isAI?' ai':''))+'">'
        +'<div class="msg-info" style="font-weight:700;font-size:10px;letter-spacing:0.5px;text-transform:uppercase;margin-bottom:4px"><span>'+m.sender+'</span><span style="opacity:0.5;margin-left:8px">'+time+'</span></div>'
        +'<div class="msg-bubble" style="box-shadow:var(--glow-card)">'+m.text+'</div>'
        +'</div>';
    }).join('');
    list.scrollTop = list.scrollHeight;
  }
}

async function sendMsg() {
  var inp = $('msg-inp');
  var txt = inp.value.trim();
  if (!txt || !ME) return;
  inp.value = '';
  spinning(true);
  if(ME.id !== 'admin') $('typing').classList.remove('hidden');
  try {
    var r = await api('POST', '/messages', { sender: ME.name, text: txt, type: 'chat' });
    if (r.ok) {
      S.messages = r.data.messages || r.data;
      if (r.data.expenses) S.expenses = r.data.expenses;
      render();
    } else {
      toast(r.error || 'Failed to send message', 'err');
    }
  } catch(e) {
    toast('Connection error', 'err');
  } finally {
    spinning(false);
    $('typing').classList.add('hidden');
  }
}

function handleReceipt(inp) {
  var f = inp.files[0]; if (!f || !ME) return;
  toast('🤖 AI is reading receipt...', 'info');
  var img = new Image();
  var r = new FileReader();
  r.onload = function(ev){
    img.onload = async function() {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      var maxW = 800, maxH = 800;
      var w = img.width, h = img.height;
      if (w > maxW || h > maxH) {
        if (w > h) { h = Math.round((maxH / w) * h); w = maxW; }
        else { w = Math.round((maxW / h) * w); h = maxH; }
      }
      canvas.width = w; canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);
      var b64 = canvas.toDataURL('image/jpeg', 0.6); // Very compressed
      inp.value = ''; // Reset
      try {
        var r = await api('POST', '/ai-receipt', { sender: ME.name, image: b64 });
        if (r.ok) {
          S.messages = r.data.messages;
          S.expenses = r.data.expenses;
          render();
          toast('✓ Receipt processed!');
        } else { toast(r.error || 'Failed to read receipt', 'err'); }
      } catch(e) { toast('Network error', 'err'); }
    };
    img.src = ev.target.result;
  };
  r.readAsDataURL(f);
}

async function sendReminder(name, amt) {
  if (!ME) return;
  var txt = ME.name + " reminded " + name + " to pay " + fmt(amt);
  try {
    var r = await api('POST', '/messages', { sender: 'System', text: txt, type: 'reminder' });
    if (r.ok) { S.messages = r.data; rChat(); toast('Reminder sent'); }
  } catch(e) {}
}

function rMembers() {
  var bals = getBals();
  $('mlist').innerHTML = S.members.map(function(m) {
    var b = bals[m.name];
    var col = b.bal >= 0 ? 'var(--accent-green)' : 'var(--accent-red)';
    return '<div class="mrow" style="border-left:4px solid '+col+'">'+av(m.name,44)
      +'<div style="flex:1"><div style="font-size:16px;font-weight:800;font-family:var(--font-display)">'+m.name+'</div>'
      +'<div style="font-size:11px;color:var(--text-muted);margin-top:2px;font-weight:600">Deposited: <b style="color:var(--text-secondary)">'+fmt(b.gave)+'</b></div>'
      +'<div style="font-size:11px;color:var(--text-muted);font-weight:600">Spent: <b style="color:var(--text-secondary)">'+fmt(b.spent)+'</b>' + (b.limit>0 ? ' / '+fmt(b.limit) : '') + '</div>'
      +'<div style="font-size:12px;font-weight:800;margin-top:6px;color:'+col+';letter-spacing:0.5px">'+(b.bal>=0?'SURPLUS: ':'OWED: ')+fmt(b.bal)+'</div>'
      +'</div></div>';
  }).join('')+'<div class="line"></div><div style="font-size:12px;color:var(--text-muted);text-align:center;padding:10px 0">New members: Sign out → tap "+ Add Member"</div>';
}

function rAI() {
  var mt = S.expenses.filter(function(e){ return e.date&&e.date.startsWith(new Date().toISOString().slice(0,7)); }).reduce(function(a,e){ return a+e.amount; }, 0);
  var mc = S.expenses.filter(function(e){ return e.date&&e.date.startsWith(new Date().toISOString().slice(0,7)); }).length;
  var qs = [
    ['📊 Full Spending Review', 'Review all expenses by category, rate necessity 1–10, give 3 saving tips for next month.'],
    ['🧾 Rate Each Expense 1–10', 'Go through the 10 most recent expenses one by one. Rate each out of 10 for necessity. Be strict.'],
    ['🛒 What Do We Actually Need?', "Review the pending needs list. Label each: URGENT / CAN WAIT / DON'T NEED."],
    ['💸 Are We Overspending?', 'Is our spending reasonable for college students in India? What should our monthly budget be per person?'],
    ['📅 This Month Report Card', 'We spent Rs'+mt+' this month in '+mc+' transactions. Grade us A to F like a strict parent.'],
  ];
  $('aibtns').innerHTML = qs.map(function(q){
    return '<button onclick="askAI(this.dataset.p)" data-p="'+q[1].replace(/"/g,'&quot;')+'"'
      +' style="background:var(--bg-card);border:1px solid var(--border-default);border-radius:14px;padding:16px 18px;color:var(--text-primary);cursor:pointer;text-align:left;font-size:14px;font-weight:700;display:flex;justify-content:space-between;align-items:center;width:100%;margin-bottom:10px;font-family:var(--font-display);transition:all 0.2s">'
      +q[0]+'<span style="color:var(--text-muted)">→</span></button>';
  }).join('');
}

// ─── ADD EXPENSE ─────────────────────────────────────────────────────────────
function rChips() {
  var cg = $('catg');
  if (cg) cg.innerHTML = CATS.map(function(c){
    return '<button class="cat'+(AF.cat.label===c.label?' on':'')+'" onclick="selC(&#39;'+c.icon+'&#39;,&#39;'+c.label+'&#39;)">'
      +'<div class="ci">'+c.icon+'</div><div class="cl">'+c.label+'</div></button>';
  }).join('');

  var p = $('pbchips'), s = $('spchips');
  if (!p || !s) return;
  p.innerHTML = S.members.map(function(m){
    var sel = AF.paidBy === m.name;
    return '<div class="chip'+(sel?' on':'')+'" onclick="setPB(&#39;'+m.name+'&#39;)">'+av(m.name,18)+m.name+'</div>';
  }).join('');
  s.innerHTML = S.members.map(function(m){
    var sel = AF.split.includes(m.name);
    return '<div class="chip'+(sel?' on':'')+'" onclick="setSP(&#39;'+m.name+'&#39;)">'+av(m.name,18)+m.name+'</div>';
  }).join('') + '<button class="chip" onclick="AF.split=S.members.map(function(m){return m.name});rChips();updShare()" style="border-style:dashed">Select All</button>';
  updShare();
}

function setPB(n) { 
  AF.paidBy = n; 
  if (AF.split.length <= 1) AF.split = [n]; // Default split to only the payer
  rChips(); 
}

function setSP(n) {
  AF.split = AF.split.includes(n) ? AF.split.filter(function(x){return x!==n}) : [...AF.split, n];
  rChips();
}

function setTxType(t) {
  AF.type = t;
  if(t==='expense') {
    $('type-exp').style.borderColor='var(--accent-gold)'; $('type-exp').style.background='var(--accent-gold-glow)'; $('type-exp').style.color='var(--accent-gold)';
    $('type-dep').style.borderColor='var(--border-default)'; $('type-dep').style.background='transparent'; $('type-dep').style.color='var(--text-muted)';
    $('st1-t').textContent='What was bought?'; $('st1-s').textContent='Name and total amount paid'; $('lbl-n').textContent='Expense Name';
    $('catg').style.display='grid';
  } else {
    $('type-dep').style.borderColor='var(--accent-green)'; $('type-dep').style.background='rgba(52,211,153,0.1)'; $('type-dep').style.color='var(--accent-green)';
    $('type-exp').style.borderColor='var(--border-default)'; $('type-exp').style.background='transparent'; $('type-exp').style.color='var(--text-muted)';
    $('st1-t').textContent='Add Funds to Bank'; $('st1-s').textContent='Who is adding and how much'; $('lbl-n').textContent='Note / Title';
    $('catg').style.display='none';
  }
}
function setTxType(t) {
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
function selC(i,l){ AF.cat={icon:i,label:l}; rChips(); }

function updShare() {
  var amt = parseFloat($('fa') && $('fa').value) || 0;
  var box = $('psbox'), el = $('psamt');
  if (!box || !el) return;
  if (AF.split.length && amt) { box.style.display='block'; el.textContent=fmt(amt/AF.split.length); }
  else box.style.display = 'none';
}

function goAdd() {
  if (!ME) { toast('Log in first','err'); return; }
  AF = { cat:CATS[0], paidBy:ME.name, split:[ME.name], type:'expense' };
  $('ft').value = ''; $('fa').value = ''; $('fn').value = '';
  $('fd').value = today();
  $('pprev').style.display = 'none'; PIC = null;
  setTxType('expense');
  go('add'); ns(1);
}

function gs(n) {
  if (n===2 && AF.type==='deposit') n=1;
  document.querySelectorAll('.astep').forEach(function(s){ s.classList.remove('on'); });
  $('st'+n).classList.add('on');
  $('slbl').textContent = 'Step '+n+' of 3';
  $('sdots').innerHTML = [1,2,3].map(function(s){
    return '<div class="sdot" style="width:'+(s<=n?20:7)+'px;height:4px;border-radius:4px;background:'+(s<=n?'#fff':'#2a2a2a')+'"></div>';
  }).join('');
  if (n===2) rChips();
}

function ns(n) {
  if (n===2 && (!$('ft').value.trim() || !$('fa').value)) { toast('Fill name & amount','err'); return; }
  if (n===2) { gs(3); return; } // Skip Split step as requested
  if (n===3 && (!AF.paidBy || !AF.split.length)) { toast('Select payer & members','err'); return; }
  gs(n);
}

function handlePic(inp) {
  var f = inp.files[0]; if (!f) return;
  var r = new FileReader();
  r.onload = function(ev){
    PIC = ev.target.result;
    $('pprev').src = PIC; $('pprev').style.display='block';
    $('pbtn').textContent = '✓ Photo attached';
  };
  r.readAsDataURL(f);
}

async function saveExp() {
  var title = $('ft').value.trim(), amount = parseFloat($('fa').value);
  if (!title || !amount) { toast('Fill name & amount','err'); return; }
  if (AF.type==='expense' && (!AF.paidBy || !AF.split.length)) { toast('Select payer & split','err'); return; }
  if (AF.type==='deposit') { AF.split=[]; AF.paidBy=ME.name; AF.cat={icon:'💰',label:'Deposit'}; }
  var sb = $('svbtn'); sb.textContent='Saving...'; sb.disabled=true;
  try {
    var r = await api('POST', '/expenses', {
      title:title, amount:amount,
      catIcon:AF.cat.icon, catLabel:AF.cat.label,
      paidBy:AF.paidBy, splitAmong:AF.split,
      date:$('fd').value, note:$('fn').value, screenshot:PIC||'', type:AF.type, type:AF.type
    });
    if (r.ok) { S.expenses=r.data; render(); toast('✓ Saved!'); go('home'); }
    else toast(r.error||'Failed','err');
  } catch(e) { toast('Network error','err'); }
  sb.textContent='Save & Sync ✓'; sb.disabled=false;
}

async function delExp(id) {
  try { var r=await api('DELETE','/expenses/'+id); if(r.ok){S.expenses=r.data;rHistory();rHome();toast('Removed');} } catch(e){}
}

// ─── AI ──────────────────────────────────────────────────────────────────────
async function askAI(prompt) {
  $('aiload').classList.remove('hidden'); $('aires').classList.add('hidden');
  var ctx = S.members.length+' college students sharing a flat in India. Members:'+S.members.map(function(m){return m.name;}).join(',')
    +'. Expenses:'+S.expenses.slice(0,12).map(function(e){ return e.title+' Rs'+e.amount+'('+( e.cat_label||e.catLabel||'')+',paid by '+(e.paid_by||e.paidBy)+','+e.date+')'; }).join(';')
    +'. Total:Rs'+S.expenses.reduce(function(a,e){ return a+e.amount; },0)
    +'. Recent messages:'+S.messages.slice(-5).map(function(m){ return m.sender+': '+m.text; }).join(';');
  try {
    var r = await api('POST', '/ai', {
      prompt: 'You are a strict but caring financial parent for college students in India. '+ctx+'\\n\\n'+prompt+'\\n\\nUse bullet points with bullet symbol. Rate necessity 1-10. Use Rs for currency. Be concise.'
    });
    if (r.ok) {
      $('aitxt').textContent = r.data || 'No response.';
    } else {
      $('aitxt').textContent = r.error || 'AI unavailable.';
    }
    $('aires').classList.remove('hidden');
  } catch(e) { $('aitxt').textContent='AI unavailable. Check connection.'; $('aires').classList.remove('hidden'); }
  $('aiload').classList.add('hidden');
}

// ─── NAVIGATION ──────────────────────────────────────────────────────────────
async function saveLimit(name) {
    var val = parseFloat($('lim-'+name).value) || 0;
    try {
      var r = await api('PUT', '/members/'+encodeURIComponent(name), {spend_limit: val});
      if (r.ok) { S.members = r.data; toast('Limit saved'); render(); }
    } catch(e) { toast('Error', 'err'); }
  }
  function rAdmin() {
    $('admin-mlist').innerHTML = S.members.map(function(m) {
      return '<div class="card">'
        + '<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">'
        + av(m.name, 32)
        + '<div style="flex:1;font-size:14px;font-weight:700">'+m.name+'</div>'
        + '<button onclick="remMem(&#39;'+m.name+'&#39;)" style="background:none;border:none;color:#f55;font-size:11px;cursor:pointer">Remove</button>'
        + '</div>'
        + '<div style="display:flex;gap:8px">'
        + '<input class="inp" type="number" id="lim-'+m.name+'" value="'+(m.spend_limit||0)+'" style="flex:1;padding:8px" placeholder="Limit">'
        + '<button class="btn" style="width:auto;padding:8px 12px" onclick="saveLimit(&#39;'+m.name+'&#39;)">Set Limit</button>'
        + '</div>'
        + '</div>';
    }).join('');
  }
function go(id) {
  document.querySelectorAll('.page').forEach(function(p){ p.classList.remove('active'); });
  document.querySelectorAll('.nb').forEach(function(b){ b.classList.remove('on'); });
  var pg = $('pg-'+id); if (pg) pg.classList.add('active');
  var nb = $('nb-'+id); if (nb) nb.classList.add('on');
  if (id === 'calendar') rCal();
  if (id === 'admin') rAdmin();
  if (id === 'chat') { rChat(); $('ualert').style.display = 'none'; }
  if (id === 'superadmin') rSuperAdmin();
  if (id === 'home') loadAll(true);
  window.scrollTo(0,0);
}

async function loginFlat() {
  var id = $('f-id').value.trim();
  var pass = $('f-pass').value.trim();
  if(!id || !pass) return;
  spinning(true);
  try {
    var r = await api('POST', '/flats/login', { id:id, password:pass });
    if(r.ok) {
      localStorage.setItem('fm_flat_id', id);
      $('flatlogin').classList.add('hidden');
      if (id === 'fm_admin') {
        $('app').classList.remove('hidden');
        document.querySelector('nav').innerHTML = '<button class="nb on" style="width:100%" onclick="go(\'superadmin\')"><span style="font-size:18px">⚙️</span>System Dashboard</button>';
        go('superadmin');
        return;
      }
      $('login').classList.remove('hidden');
      await loadUsers();
    } else {
      $('f-err').textContent = r.error || 'Invalid credentials';
    }
  } catch(e) {
    $('f-err').textContent = 'Login failed';
  } finally {
    spinning(false);
  }
}

async function rSuperAdmin() {
  spinning(true);
  try {
    var r = await api('GET', '/flats');
    if (r.ok) {
      $('flatlist').innerHTML = r.data.map(function(f) {
        var isSusp = f.status === 'suspended';
        return '<div class="card" style="display:flex;justify-content:space-between;align-items:center">'
          +'<div><div style="font-weight:800;font-family:var(--font-display)">'+f.id+'</div>'
          +'<div style="font-size:11px;color:var(--text-muted)">Plan: '+f.plan.toUpperCase()+' · '+f.created_at+'</div></div>'
          +'<button onclick="toggleFlat(&#39;'+f.id+'&#39;,&#39;'+(isSusp?'active':'suspended')+'&#39;)" class="btn" style="width:auto;padding:8px 14px;background:'+(isSusp?'var(--accent-green)':'var(--accent-red)')+'">'
          +(isSusp?'Approve':'Suspend')+'</button></div>';
      }).join('');
    }
  } catch(e) {}
  spinning(false);
}

async function toggleFlat(id, status) {
  if (!confirm('Change status of '+id+' to '+status+'?')) return;
  try {
    var r = await api('POST', '/flats/status', { id:id, status:status });
    if (r.ok) { toast('Updated'); rSuperAdmin(); }
  } catch(e) {}
}

async function createFlat() {
  var fid = $('new-flat-id').value.trim();
  var fpass = $('new-flat-pass').value.trim();
  if(!fid || !fpass) return toast('Fill all fields', 'err');
  spinning(true);
  try {
    var r = await api('POST', '/flats', { id:fid, password:fpass });
    if(r.ok) { 
      toast('Flat Created'); 
      $('new-flat-id').value=''; 
      $('new-flat-pass').value='';
      rSuperAdmin(); 
    } else {
      toast(r.error || 'Failed', 'err');
    }
  } catch(e) { toast('Error', 'err'); }
  spinning(false);
}

function exitFlat() {
  if(!confirm('Logout from this flat?')) return;
  localStorage.removeItem('fm_flat_id');
  localStorage.removeItem('fm_me');
  location.reload();
}
(async function() {
  var fid = localStorage.getItem('fm_flat_id');
  if(!fid) {
    $('flatlogin').classList.remove('hidden');
    $('login').classList.add('hidden');
    return;
  }
  
  $('flatlogin').classList.add('hidden');
  $('login').classList.remove('hidden');

  if (fid === 'fm_admin') {
    $('login').classList.add('hidden');
    $('app').classList.remove('hidden');
    document.querySelector('nav').innerHTML = '<button class="nb on" style="width:100%" onclick="go(\'superadmin\')"><span style="font-size:18px">⚙️</span>System Dashboard</button>';
    go('superadmin');
    return;
  }

  // Try auto-login from saved session
  try {
    var saved = localStorage.getItem('fm_me');
    if (saved) {
      var u = JSON.parse(saved);
      var vr = await api('GET', '/users');
      if (vr.ok && Array.isArray(vr.data)) {
        S.users = vr.data;
        if (u.id === "admin") { ME = u; doLogin(); return; }
        var found = S.users.find(function(x){ return x.id === u.id; });
        if (found) { ME = found; doLogin(); return; }
      }
    }
  } catch(e) {}

  // Show login
  await loadUsers();
})();
