const H = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS", "Access-Control-Allow-Headers": "Content-Type" };
const J = { ...H, "Content-Type": "application/json" };
const ok = d => new Response(JSON.stringify({ ok: true, data: d }), { headers: J });
const er = (m, s) => new Response(JSON.stringify({ ok: false, error: m }), { status: s || 400, headers: J });

const HTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
<title>FlatMates Pro</title>
<style>
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
body{background:#111;color:#fff;font-family:-apple-system,BlinkMacSystemFont,sans-serif;min-height:100vh}
button,input,select{font-family:inherit}
input[type=date]::-webkit-calendar-picker-indicator{filter:invert(1)}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
.hidden{display:none!important}
/* LOGIN */
#login{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center}
.ugrid{display:grid;grid-template-columns:1fr 1fr;gap:12px;width:100%;max-width:320px;margin-top:24px}
.ucard{background:#1e1e1e;border:1px solid #2a2a2a;border-radius:16px;padding:20px 12px;cursor:pointer;text-align:center;transition:border-color .2s}
.ucard:active{border-color:#666}
.ucard .uav{width:52px;height:52px;border-radius:50%;margin:0 auto 10px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:800}
.ucard .uname{font-size:14px;font-weight:700}
.ucard .uhint{font-size:11px;color:#555;margin-top:3px}
.ucard-add{background:transparent;border:1.5px dashed #333}
/* PIN */
#pinscreen{position:fixed;inset:0;background:#111;z-index:100;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px}
.pin-dots{display:flex;gap:14px;margin:20px 0 6px}
.pin-dot{width:14px;height:14px;border-radius:50%;border:2px solid #444;background:transparent;transition:all .15s}
.pin-dot.filled{background:#fff;border-color:#fff}
.pin-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;max-width:220px;margin-top:16px}
.pkey{background:#1e1e1e;border:1px solid #2a2a2a;border-radius:12px;padding:15px;font-size:18px;font-weight:700;cursor:pointer;color:#fff}
.pkey:active{background:#2a2a2a}
/* ADD USER */
#adduser{position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:flex;align-items:center;justify-content:center;padding:24px}
.aubox{background:#1a1a1a;border:1px solid #2a2a2a;border-radius:20px;padding:24px;width:100%;max-width:340px}
/* APP */
#app{max-width:430px;margin:0 auto;display:none}
.page{display:none;min-height:100vh;padding-bottom:80px}
.page.active{display:block}
/* NAV */
nav{position:fixed;bottom:0;left:0;right:0;max-width:430px;margin:0 auto;background:rgba(17,17,17,.97);border-top:1px solid #222;display:flex}
.nb{flex:1;padding:10px 0 8px;border:none;background:none;color:#444;font-size:9px;font-weight:700;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:3px;letter-spacing:.5px;text-transform:uppercase;position:relative}
.nb.on{color:#fff}
.nb-bar{position:absolute;bottom:0;left:20%;right:20%;height:2px;background:#fff;border-radius:2px;display:none}
.nb.on .nb-bar{display:block}
/* CARDS */
.card{background:#1e1e1e;border:1px solid #2a2a2a;border-radius:16px;padding:16px;margin-bottom:12px}
.inp{background:#161616;border:1px solid #2a2a2a;border-radius:10px;padding:12px 14px;color:#fff;font-size:14px;width:100%;outline:none}
.inp:focus{border-color:#555}
.lbl{font-size:10px;color:#555;font-weight:700;letter-spacing:1px;text-transform:uppercase;display:block;margin-bottom:4px;margin-top:12px}
.btn{background:#fff;color:#000;border:none;border-radius:12px;padding:13px;font-weight:700;font-size:14px;cursor:pointer;width:100%}
.btn:active{opacity:.85}
.btn2{background:transparent;color:#888;border:1px solid #2a2a2a;border-radius:12px;padding:11px;font-weight:600;font-size:13px;cursor:pointer;width:100%}
.sec{font-size:10px;color:#555;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:10px}
.line{height:1px;background:#222;margin:14px 0}
.chip{display:inline-flex;align-items:center;gap:6px;padding:8px 12px;border-radius:20px;border:1.5px solid #2a2a2a;background:#161616;cursor:pointer;color:#555;font-weight:600;font-size:12px;margin:3px}
.chip.on{border-color:#fff;background:rgba(255,255,255,.08);color:#fff}
.cats{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin-top:4px}
.cat{background:#161616;border:1.5px solid #2a2a2a;border-radius:10px;padding:8px 4px;cursor:pointer;text-align:center}
.cat.on{border-color:#fff;background:rgba(255,255,255,.07)}
.cat .ci{font-size:17px}
.cat .cl{font-size:8px;color:#555;margin-top:2px;font-weight:600}
.cat.on .cl{color:#ccc}
.erow{background:#1e1e1e;border:1px solid #2a2a2a;border-radius:14px;padding:12px 14px;margin-bottom:8px;display:flex;gap:12px;align-items:center}
.eicon{width:40px;height:40px;border-radius:11px;background:#252525;display:flex;align-items:center;justify-content:center;font-size:19px;flex-shrink:0}
.srow{background:#252525;border-radius:12px;padding:11px 13px;margin-bottom:7px;display:flex;align-items:center;gap:10px}
.nrow{background:#1e1e1e;border:1px solid #2a2a2a;border-radius:14px;padding:12px 14px;margin-bottom:8px;display:flex;align-items:center;gap:12px}
.nrow.urg{border-color:rgba(255,85,85,.4)}
.nchk{width:22px;height:22px;border-radius:50%;border:2px solid #444;background:transparent;cursor:pointer;flex-shrink:0}
.nrow.urg .nchk{border-color:#f55}
.mrow{background:#1e1e1e;border:1px solid #2a2a2a;border-radius:16px;padding:14px 16px;margin-bottom:10px;display:flex;align-items:center;gap:12px}
.astep{display:none}
.astep.on{display:block}
.stat-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:14px}
.stat-box{background:#1e1e1e;border:1px solid #2a2a2a;border-radius:14px;padding:12px 8px;text-align:center}
.stat-v{font-size:17px;font-weight:800;font-family:monospace}
.stat-l{font-size:9px;color:#555;margin-top:3px;font-weight:700;letter-spacing:.5px}
.ualert{background:rgba(255,85,85,.08);border:1px solid rgba(255,85,85,.3);border-radius:14px;padding:11px 14px;margin-bottom:12px;cursor:pointer;display:flex;align-items:center;gap:10px}
.av{border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-weight:800;flex-shrink:0}
#toast{position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:999;border-radius:12px;padding:10px 20px;font-size:13px;font-weight:600;white-space:nowrap;background:#1e1e1e;border:1px solid #444;box-shadow:0 8px 24px rgba(0,0,0,.8);display:none}
.hdr{padding:18px 20px 0;display:flex;align-items:center;gap:10px;margin-bottom:4px}
.htitle{font-size:17px;font-weight:700}
.back{background:none;border:none;color:#666;font-size:22px;cursor:pointer;padding:0 4px}
.pershare{background:rgba(255,255,255,.05);border:1px solid #2a2a2a;border-radius:12px;padding:14px;margin-top:14px;text-align:center}
.sdot{height:4px;border-radius:4px}
</style>
</head>
<body>

<!-- LOGIN -->
<div id="login">
  <div style="font-size:52px;margin-bottom:16px">🏠</div>
  <div style="font-size:26px;font-weight:800">FlatMates Pro</div>
  <div style="font-size:13px;color:#555;margin-top:6px">Who are you?</div>
  <div id="ugrid" class="ugrid"></div>
  <div id="lerr" style="font-size:12px;color:#f55;margin-top:16px"></div>
</div>

<!-- PIN SCREEN -->
<div id="pinscreen" class="hidden">
  <div id="pav" class="av" style="width:64px;height:64px;font-size:26px;margin-bottom:14px"></div>
  <div id="pname" style="font-size:22px;font-weight:800"></div>
  <div style="font-size:12px;color:#555;margin-top:4px">Enter your 4-digit PIN</div>
  <div class="pin-dots">
    <div class="pin-dot" id="d0"></div>
    <div class="pin-dot" id="d1"></div>
    <div class="pin-dot" id="d2"></div>
    <div class="pin-dot" id="d3"></div>
  </div>
  <div id="perr" style="font-size:12px;color:#f55;height:18px;margin-bottom:4px;text-align:center"></div>
  <div class="pin-grid">
    <button class="pkey" onclick="pk('1')">1</button>
    <button class="pkey" onclick="pk('2')">2</button>
    <button class="pkey" onclick="pk('3')">3</button>
    <button class="pkey" onclick="pk('4')">4</button>
    <button class="pkey" onclick="pk('5')">5</button>
    <button class="pkey" onclick="pk('6')">6</button>
    <button class="pkey" onclick="pk('7')">7</button>
    <button class="pkey" onclick="pk('8')">8</button>
    <button class="pkey" onclick="pk('9')">9</button>
    <button class="pkey" onclick="pb()" style="color:#666">⌫</button>
    <button class="pkey" onclick="pk('0')">0</button>
    <button class="pkey" onclick="cancelPin()" style="color:#f55;font-size:12px">Cancel</button>
  </div>
</div>

<!-- ADD USER -->
<div id="adduser" class="hidden">
  <div class="aubox">
    <div style="font-size:18px;font-weight:800;margin-bottom:4px">Add Flatmate</div>
    <div style="font-size:12px;color:#555;margin-bottom:4px">Set a name and PIN for them</div>
    <label class="lbl">Name</label>
    <input class="inp" id="aun" placeholder="e.g. Dev, Neha...">
    <label class="lbl">4-digit PIN</label>
    <input class="inp" id="aup" type="tel" inputmode="numeric" placeholder="1234" maxlength="4">
    <div style="display:flex;gap:8px;margin-top:20px">
      <button class="btn2" onclick="closeAU()" style="flex:1">Cancel</button>
      <button class="btn" onclick="createUser()" style="flex:2">Add</button>
    </div>
  </div>
</div>

<!-- APP -->
<div id="app">

  <!-- HOME -->
  <div class="page active" id="pg-home">
    <div style="padding:20px 20px 14px;border-bottom:1px solid #1e1e1e">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <div style="font-size:10px;color:#444;letter-spacing:2px;font-weight:700;text-transform:uppercase">FlatMates Pro</div>
          <div style="font-size:22px;font-weight:800;margin-top:2px">Hey, <span id="gname" style="color:#fff"></span> 👋</div>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <div id="spin" style="width:16px;height:16px;border:2px solid #333;border-top:2px solid #fff;border-radius:50%;animation:spin 1s linear infinite;display:none"></div>
          <button onclick="logout()" style="background:#1e1e1e;border:1px solid #2a2a2a;border-radius:8px;padding:6px 12px;color:#666;font-size:11px;cursor:pointer;font-weight:600">Sign out</button>
        </div>
      </div>
    </div>
    <div style="padding:14px 16px 0">
      <div class="stat-grid" id="stats"></div>
      <button class="btn" onclick="goAdd()" style="display:flex;align-items:center;justify-content:center;gap:8px;font-size:15px;padding:15px;margin-bottom:12px">
        <span style="font-size:22px;line-height:1">+</span> Add Expense
      </button>
      <div id="ualert" class="ualert" style="display:none" onclick="go('needs')">
        <div style="width:8px;height:8px;border-radius:50%;background:#f55;flex-shrink:0;animation:pulse 1.5s ease infinite"></div>
        <div id="utext" style="flex:1;font-size:13px;font-weight:600;color:#f88"></div>
        <span style="color:#555">→</span>
      </div>
      <div class="card" id="balcard"></div>
      <div class="sec">Recent</div>
      <div id="reclist"></div>
      <button class="btn2" id="moreBtn" style="display:none;margin-bottom:10px" onclick="go('history')"></button>
    </div>
  </div>

  <!-- ADD -->
  <div class="page" id="pg-add">
    <div class="hdr">
      <button class="back" onclick="go('home')">←</button>
      <div style="flex:1">
        <div class="htitle">Add Expense</div>
        <div style="font-size:10px;color:#555" id="slbl">Step 1 of 3</div>
      </div>
      <div style="display:flex;gap:4px" id="sdots"></div>
    </div>
    <div style="padding:14px 16px 0">
      <!-- STEP 1 -->
      <div class="astep on" id="st1">
        <div style="font-size:20px;font-weight:800;margin:8px 0 4px">What was bought?</div>
        <div style="font-size:12px;color:#555;margin-bottom:18px">Name and total amount paid</div>
        <label class="lbl">Expense Name</label>
        <input class="inp" id="ft" placeholder="e.g. Monthly Groceries...">
        <label class="lbl">Amount (₹)</label>
        <input class="inp" id="fa" type="number" inputmode="decimal" placeholder="0"
          style="font-size:30px;font-family:monospace;font-weight:800;text-align:center;padding:15px"
          oninput="updShare()">
        <label class="lbl">Category</label>
        <div class="cats" id="catg"></div>
        <button class="btn" style="margin-top:20px" onclick="ns(2)">Next →</button>
      </div>
      <!-- STEP 2 -->
      <div class="astep" id="st2">
        <div style="font-size:20px;font-weight:800;margin:8px 0 4px">Who paid?</div>
        <div style="font-size:12px;color:#555;margin-bottom:18px">Select payer and split</div>
        <label class="lbl">Paid By</label>
        <div id="pbchips" style="display:flex;flex-wrap:wrap;gap:0"></div>
        <label class="lbl">Split Among</label>
        <div id="spchips" style="display:flex;flex-wrap:wrap;gap:0"></div>
        <div class="pershare" id="psbox" style="display:none">
          <div style="font-size:10px;color:#555;margin-bottom:3px;font-weight:700;letter-spacing:1px">EACH PERSON PAYS</div>
          <div id="psamt" style="font-size:30px;font-weight:800;font-family:monospace"></div>
        </div>
        <div style="display:flex;gap:8px;margin-top:20px">
          <button class="btn2" style="flex:1" onclick="gs(1)">← Back</button>
          <button class="btn" style="flex:2" onclick="ns(3)">Next →</button>
        </div>
      </div>
      <!-- STEP 3 -->
      <div class="astep" id="st3">
        <div style="font-size:20px;font-weight:800;margin:8px 0 4px">Final Details</div>
        <div style="font-size:12px;color:#555;margin-bottom:18px">Date, note & receipt</div>
        <label class="lbl">Date</label>
        <input class="inp" id="fd" type="date">
        <label class="lbl">Note (optional)</label>
        <input class="inp" id="fn" placeholder="Any details...">
        <label class="lbl">Receipt (optional)</label>
        <input type="file" id="ff" accept="image/*" style="display:none" onchange="handlePic(this)">
        <button id="pbtn" onclick="document.getElementById('ff').click()"
          style="background:#161616;border:1.5px dashed #333;border-radius:12px;padding:15px;color:#555;cursor:pointer;width:100%;font-size:13px;margin-top:4px">
          📷 Upload Bill / Receipt
        </button>
        <img id="pprev" style="width:100%;border-radius:12px;margin-top:8px;max-height:140px;object-fit:cover;display:none">
        <div style="display:flex;gap:8px;margin-top:20px">
          <button class="btn2" style="flex:1" onclick="gs(2)">← Back</button>
          <button class="btn" id="svbtn" style="flex:2" onclick="saveExp()">Save & Sync ✓</button>
        </div>
      </div>
    </div>
  </div>

  <!-- HISTORY -->
  <div class="page" id="pg-history">
    <div class="hdr">
      <button class="back" onclick="go('home')">←</button>
      <div class="htitle" id="htitle">All Expenses</div>
    </div>
    <div style="padding:14px 16px 0" id="hlist"></div>
  </div>

  <!-- CALENDAR -->
  <div class="page" id="pg-calendar">
    <div class="hdr">
      <button class="back" onclick="go('home')">←</button>
      <div class="htitle">Calendar</div>
    </div>
    <div style="padding:14px 16px 0">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
        <button onclick="cm(-1)" style="background:#1e1e1e;border:1px solid #2a2a2a;border-radius:8px;width:34px;height:34px;cursor:pointer;color:#fff;font-size:18px">‹</button>
        <div id="ctitle" style="font-weight:700;font-size:15px"></div>
        <button onclick="cm(1)" style="background:#1e1e1e;border:1px solid #2a2a2a;border-radius:8px;width:34px;height:34px;cursor:pointer;color:#fff;font-size:18px">›</button>
      </div>
      <div class="card" id="cgrid"></div>
      <div class="card" id="csum"></div>
      <div id="cday" class="card hidden" style="border-color:#555"></div>
    </div>
  </div>

  <!-- NEEDS -->
  <div class="page" id="pg-needs">
    <div class="hdr">
      <button class="back" onclick="go('home')">←</button>
      <div class="htitle">Household Needs</div>
    </div>
    <div style="padding:14px 16px 0">
      <div class="card">
        <label class="lbl">New Item</label>
        <input class="inp" id="ni" placeholder="e.g. Dish soap, Rice...">
        <label class="lbl">Added By</label>
        <select class="inp" id="nby"><option value="">Select</option></select>
        <div style="display:flex;align-items:center;gap:10px;margin-top:12px">
          <button id="urgbtn" onclick="toggleUrg()"
            style="padding:7px 14px;border-radius:20px;border:1.5px solid #2a2a2a;background:transparent;color:#555;font-size:12px;font-weight:700;cursor:pointer">
            🔴 Urgent
          </button>
          <div style="flex:1"></div>
          <button class="btn" onclick="addNeed()" style="width:auto;padding:9px 22px">Add</button>
        </div>
      </div>
      <div id="npend"></div>
      <div id="ndone"></div>
    </div>
  </div>

  <!-- ADVISOR -->
  <div class="page" id="pg-advisor">
    <div class="hdr">
      <button class="back" onclick="go('home')">←</button>
      <div class="htitle">AI Advisor</div>
    </div>
    <div style="padding:14px 16px 0">
      <div class="card" style="text-align:center;padding:20px">
        <div style="font-size:40px;margin-bottom:10px">🧑‍👧</div>
        <div style="font-size:15px;font-weight:700">Your Financial Guardian</div>
        <div style="font-size:12px;color:#555;margin-top:6px;line-height:1.7">Reviews your real spending like a strict parent who wants you to save money.</div>
      </div>
      <div id="aibtns"></div>
      <div id="aiload" class="card hidden">
        <div style="text-align:center;padding:16px">
          <div style="font-size:28px;animation:pulse 1.5s ease infinite;display:inline-block">🧑‍👧</div>
          <div style="font-size:13px;color:#555;margin-top:10px">Reviewing your expenses...</div>
        </div>
      </div>
      <div id="aires" class="card hidden">
        <div style="font-size:10px;font-weight:700;color:#888;letter-spacing:.5px;margin-bottom:12px;text-transform:uppercase">Advisor's Verdict</div>
        <div id="aitxt" style="font-size:13px;line-height:1.85;white-space:pre-wrap"></div>
      </div>
    </div>
  </div>

  <!-- MEMBERS -->
  <div class="page" id="pg-members">
    <div class="hdr">
      <button class="back" onclick="go('home')">←</button>
      <div class="htitle">Members</div>
    </div>
    <div style="padding:14px 16px 0" id="mlist"></div>
  </div>

  <nav>
    <button class="nb on" id="nb-home" onclick="go('home')"><span style="font-size:18px">⌂</span>Home<div class="nb-bar"></div></button>
    <button class="nb" id="nb-history" onclick="go('history')"><span style="font-size:18px">≡</span>History<div class="nb-bar"></div></button>
    <button class="nb" id="nb-calendar" onclick="go('calendar')"><span style="font-size:18px">◫</span>Calendar<div class="nb-bar"></div></button>
    <button class="nb" id="nb-needs" onclick="go('needs')"><span style="font-size:18px">✓</span>Needs<div class="nb-bar"></div></button>
    <button class="nb" id="nb-advisor" onclick="go('advisor')"><span style="font-size:18px">◉</span>Advisor<div class="nb-bar"></div></button>
    <button class="nb" id="nb-members" onclick="go('members')"><span style="font-size:18px">◎</span>Members<div class="nb-bar"></div></button>
  </nav>
</div>

<div id="toast"></div>

<script>
// ─── STATE ───────────────────────────────────────────────────────────────────
var S = { users:[], members:[], expenses:[], needs:[] };
var ME = null;
var PIN_TARGET = null, PIN_VAL = '';
var AF = { cat:{icon:'🛒',label:'Groceries'}, paidBy:'', split:[] };
var PIC = null, URG_NEW = false;
var CAL_M = new Date().toISOString().slice(0,7);

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
function mC(name) { var i = S.members.indexOf(name); return CLRS[i < 0 ? 0 : i % CLRS.length]; }
function av(name, sz) {
  sz = sz || 32;
  var c = mC(name);
  return '<div class="av" style="width:'+sz+'px;height:'+sz+'px;background:'+c+'20;border:1.5px solid '+c+'44;font-size:'+(sz*.4)+'px;color:'+c+';">'+name[0]+'</div>';
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

function spinning(on) { $('spin').style.display = on ? 'block' : 'none'; }

// ─── API ─────────────────────────────────────────────────────────────────────
async function api(method, path, body) {
  var opts = { method: method, headers: {'Content-Type':'application/json'} };
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
    $('lerr').textContent = 'Could not connect. Check your internet and refresh.';
  } else {
    $('lerr').textContent = '';
    S.users.forEach(function(u) {
      var c = u.color || '#C9A84C';
      var d = document.createElement('div');
      d.className = 'ucard';
      d.innerHTML = '<div class="uav" style="background:'+c+'20;color:'+c+';">'+u.name[0]+'</div>'
        + '<div class="uname">'+u.name+'</div>'
        + '<div class="uhint">Tap to sign in</div>';
      d.onclick = function(){ startPin(u); };
      g.appendChild(d);
    });
  }

  var add = document.createElement('div');
  add.className = 'ucard ucard-add';
  add.innerHTML = '<div style="font-size:28px;margin-bottom:8px;color:#444">+</div>'
    + '<div class="uname" style="color:#555">Add Flatmate</div>';
  add.onclick = function(){ $('adduser').classList.remove('hidden'); };
  g.appendChild(add);
}

function startPin(u) {
  PIN_TARGET = u; PIN_VAL = '';
  var c = u.color || '#C9A84C';
  $('pav').style.background = c + '20';
  $('pav').style.color = c;
  $('pav').style.border = '2px solid ' + c + '44';
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
      if (!S.members.includes(name)) S.members.push(name);
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
      api('GET', '/needs')
    ]);
    if (res[0].ok) S.members = res[0].data;
    if (res[1].ok) S.expenses = res[1].data;
    if (res[2].ok) S.needs = res[2].data;
    render();
  } catch(e) {
    if (!quiet) toast('Connection error', 'err');
  }
  spinning(false);
}

// ─── BALANCES ────────────────────────────────────────────────────────────────
function getBals() {
  var b = {};
  S.members.forEach(function(m){ b[m] = 0; });
  S.expenses.forEach(function(e) {
    var sp = Array.isArray(e.splitAmong) ? e.splitAmong : JSON.parse(e.split_among || '[]');
    if (!sp.length) return;
    var share = e.amount / sp.length;
    sp.forEach(function(m){ if (m in b) b[m] -= share; });
    var py = e.paid_by || e.paidBy;
    if (py in b) b[py] += e.amount;
  });
  return b;
}

function getSettlements(bal) {
  var d = S.members.filter(function(m){ return bal[m] < -0.5; }).map(function(m){ return {n:m, a:-bal[m]}; }).sort(function(a,b){ return b.a-a.a; });
  var c = S.members.filter(function(m){ return bal[m] > 0.5; }).map(function(m){ return {n:m, a:bal[m]}; }).sort(function(a,b){ return b.a-a.a; });
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
function render() { rHome(); rHistory(); rNeeds(); rMembers(); rAI(); rChips(); }

function rHome() {
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

function sbox(v,l) { return '<div class="stat-box"><div class="stat-v">'+v+'</div><div class="stat-l">'+l.toUpperCase()+'</div></div>'; }

function eRow(e) {
  var ic = e.cat_icon || e.catIcon || '📦';
  var py = e.paid_by || e.paidBy;
  return '<div class="erow">'
    +'<div class="eicon">'+ic+'</div>'
    +'<div style="flex:1;min-width:0"><div style="font-size:14px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+e.title+'</div>'
    +'<div style="font-size:11px;color:#555;margin-top:2px">'+py+' paid · '+e.date+'</div></div>'
    +'<div style="font-family:monospace;font-weight:800;font-size:15px;flex-shrink:0">'+fmt(e.amount)+'</div></div>';
}

function rHistory() {
  $('htitle').textContent = 'All Expenses (' + S.expenses.length + ')';
  if (!S.expenses.length) {
    $('hlist').innerHTML = '<div style="color:#444;text-align:center;padding:60px 0">No expenses yet</div>';
    return;
  }
  $('hlist').innerHTML = S.expenses.map(function(e) {
    var sp = Array.isArray(e.splitAmong) ? e.splitAmong : JSON.parse(e.split_among || '[]');
    var py = e.paid_by || e.paidBy;
    var ic = e.cat_icon || e.catIcon || '📦';
    return '<div class="card" style="padding:14px">'
      +'<div style="display:flex;gap:11px;align-items:flex-start">'
      +'<div style="width:42px;height:42px;border-radius:11px;background:#252525;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">'+ic+'</div>'
      +'<div style="flex:1;min-width:0">'
      +'<div style="font-size:14px;font-weight:700">'+e.title+'</div>'
      +'<div style="font-size:11px;color:#555;margin-top:2px">'+(e.cat_label||e.catLabel||'')+' · '+e.date+'</div>'
      +'<div style="font-size:11px;color:#555;margin-top:2px">Paid by <b style="color:#ccc">'+py+'</b> · ÷'+sp.length+' = '+fmt(e.amount/(sp.length||1))+' each</div>'
      +'<div style="font-size:11px;color:#555">Split: '+sp.join(', ')+'</div>'
      +(e.note?'<div style="font-size:11px;color:#555;margin-top:3px">📝 '+e.note+'</div>':'')
      +'</div>'
      +'<div style="text-align:right;flex-shrink:0">'
      +'<div style="font-family:monospace;font-weight:800;font-size:16px">'+fmt(e.amount)+'</div>'
      +'<button onclick="delExp('+e.id+')" style="background:none;border:none;color:#444;font-size:11px;cursor:pointer;margin-top:6px">✕ remove</button>'
      +'</div></div>'
      +(e.screenshot&&e.screenshot.length>10?'<img src="'+e.screenshot+'" style="width:100%;border-radius:10px;margin-top:10px;max-height:130px;object-fit:cover">':'')
      +'</div>';
  }).join('');
}

function rCal() {
  var ym = CAL_M.split('-').map(Number), y=ym[0], mo=ym[1];
  $('ctitle').textContent = new Date(y,mo-1,1).toLocaleString('en-IN',{month:'long',year:'numeric'});
  var fd = new Date(y,mo-1,1).getDay(), dim = new Date(y,mo,0).getDate();
  var h = '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:3px;margin-bottom:6px">';
  ['Su','Mo','Tu','We','Th','Fr','Sa'].forEach(function(d){ h += '<div style="text-align:center;font-size:9px;color:#444;font-weight:700">'+d+'</div>'; });
  h += '</div><div style="display:grid;grid-template-columns:repeat(7,1fr);gap:3px">';
  for (var i=0;i<fd;i++) h += '<div></div>';
  for (var d=1;d<=dim;d++) {
    var ds = CAL_M+'-'+String(d).padStart(2,'0');
    var de = S.expenses.filter(function(e){ return e.date===ds; });
    var dt = de.reduce(function(a,e){ return a+e.amount; }, 0);
    h += '<button onclick="showDay(&#39;'+ds+'&#39;)" style="background:'+(dt>0?'rgba(255,255,255,.07)':'transparent')+';border:1px solid '+(dt>0?'rgba(255,255,255,.15)':'transparent')+';border-radius:7px;padding:5px 2px;cursor:'+(de.length?'pointer':'default')+';text-align:center">'
      +'<div style="font-size:12px;font-weight:'+(de.length?700:400)+';color:'+(de.length?'#fff':'#444')+'">'+d+'</div>'
      +(dt>0?'<div style="font-size:7px;color:#666;font-family:monospace">₹'+(dt>=1000?Math.round(dt/1000)+'k':dt)+'</div>':'')
      +'</button>';
  }
  h += '</div>';
  $('cgrid').innerHTML = h;
  var mt = S.expenses.filter(function(e){ return e.date&&e.date.startsWith(CAL_M); }).reduce(function(a,e){ return a+e.amount; }, 0);
  var mc = S.expenses.filter(function(e){ return e.date&&e.date.startsWith(CAL_M); }).length;
  $('csum').innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center">'
    +'<div style="font-size:13px;font-weight:700">Month Total</div>'
    +'<div style="font-family:monospace;font-weight:800;font-size:22px">'+fmt(mt)+'</div></div>'
    +'<div style="font-size:11px;color:#555;margin-top:3px">'+mc+' expense'+(mc!==1?'s':'')+' this month</div>';
  $('cday').classList.add('hidden');
}

function showDay(ds) {
  var de = S.expenses.filter(function(e){ return e.date===ds; });
  if (!de.length) return;
  var dt = de.reduce(function(a,e){ return a+e.amount; }, 0);
  var el = $('cday'); el.classList.remove('hidden');
  el.innerHTML = '<div style="display:flex;justify-content:space-between;margin-bottom:12px">'
    +'<div style="font-size:13px;font-weight:700">'+ds+'</div>'
    +'<button onclick="document.getElementById(&#39;cday&#39;).classList.add(&#39;hidden&#39;)" style="background:none;border:none;color:#555;cursor:pointer;font-size:16px">✕</button>'
    +'</div>'
    + de.map(function(e){ return '<div style="display:flex;gap:10px;align-items:center;margin-bottom:8px"><span style="font-size:18px">'+(e.cat_icon||e.catIcon||'📦')+'</span><div style="flex:1;font-size:13px;font-weight:600">'+e.title+'</div><div style="font-family:monospace;font-weight:700">'+fmt(e.amount)+'</div></div>'; }).join('')
    +'<div style="border-top:1px solid #2a2a2a;padding-top:8px;margin-top:4px;text-align:right;font-size:13px;font-weight:700">Total: '+fmt(dt)+'</div>';
}

function cm(d) {
  var ym = CAL_M.split('-').map(Number), nd = new Date(ym[0],ym[1]-1+d,1);
  CAL_M = nd.getFullYear()+'-'+String(nd.getMonth()+1).padStart(2,'0');
  rCal();
}

function rNeeds() {
  var sel = $('nby');
  if (sel) { sel.innerHTML='<option value="">Select</option>'; S.members.forEach(function(m){ var o=document.createElement('option');o.value=o.textContent=m;sel.appendChild(o); }); }
  var pend = S.needs.filter(function(n){ return !n.done; }).sort(function(a,b){ return b.urgent-a.urgent; });
  var done = S.needs.filter(function(n){ return n.done; });
  $('npend').innerHTML = (pend.length?'<div class="sec">Pending ('+pend.length+')</div>':'')
    + pend.map(function(n){
      return '<div class="nrow'+(n.urgent?' urg':'')+'"><button class="nchk" onclick="togN('+n.id+','+n.done+')"></button>'
        +'<div style="flex:1"><div style="font-size:13px;font-weight:600">'+n.item+'</div>'
        +(n.added_by?'<div style="font-size:10px;color:#555">by '+n.added_by+'</div>':'')+'</div>'
        +(n.urgent?'<div style="font-size:9px;color:#f55;background:rgba(255,85,85,.15);padding:2px 8px;border-radius:20px;font-weight:700">URGENT</div>':'')
        +'<button onclick="delN('+n.id+')" style="background:none;border:none;color:#444;cursor:pointer;font-size:16px">✕</button></div>';
    }).join('');
  $('ndone').innerHTML = (done.length?'<div class="sec" style="margin-top:14px;color:#333">Done ✓</div>':'')
    + done.map(function(n){
      return '<div style="background:#161616;border:1px solid #1e1e1e;border-radius:12px;padding:10px 14px;margin-bottom:6px;display:flex;align-items:center;gap:10px;opacity:.5">'
        +'<div style="width:20px;height:20px;border-radius:50%;background:#55CC88;display:flex;align-items:center;justify-content:center;font-size:11px;color:#000;font-weight:800">✓</div>'
        +'<div style="flex:1;font-size:13px;color:#555;text-decoration:line-through">'+n.item+'</div>'
        +'<button onclick="delN('+n.id+')" style="background:none;border:none;color:#444;cursor:pointer">✕</button></div>';
    }).join('');
}

function rMembers() {
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
      +' style="background:#1e1e1e;border:1px solid #2a2a2a;border-radius:14px;padding:14px 16px;color:#fff;cursor:pointer;text-align:left;font-size:14px;font-weight:600;display:flex;justify-content:space-between;align-items:center;width:100%;margin-bottom:8px;font-family:inherit">'
      +q[0]+'<span style="color:#555">→</span></button>';
  }).join('');
}

// ─── ADD EXPENSE ─────────────────────────────────────────────────────────────
function rChips() {
  var cg = $('catg');
  if (cg) cg.innerHTML = CATS.map(function(c){
    return '<button class="cat'+(AF.cat.label===c.label?' on':'')+'" onclick="selC(&#39;'+c.icon+'&#39;,&#39;'+c.label+'&#39;)">'
      +'<div class="ci">'+c.icon+'</div><div class="cl">'+c.label+'</div></button>';
  }).join('');

  var pb = $('pbchips');
  if (pb) pb.innerHTML = S.members.map(function(m){
    return '<div class="chip'+(AF.paidBy===m?' on':'')+'" onclick="selPB(&#39;'+m+'&#39;)">'
      +av(m,18)+m+'</div>';
  }).join('');

  var sc = $('spchips');
  if (sc) sc.innerHTML = S.members.map(function(m){
    return '<div class="chip'+(AF.split.includes(m)?' on':'')+'" onclick="togSp(&#39;'+m+'&#39;)">'
      +av(m,18)+m+'</div>';
  }).join('');

  updShare();
}

function selC(i,l){ AF.cat={icon:i,label:l}; rChips(); }
function selPB(m){ AF.paidBy=m; rChips(); }
function togSp(m){ AF.split=AF.split.includes(m)?AF.split.filter(function(x){return x!==m;}):[...AF.split,m]; rChips(); }

function updShare() {
  var amt = parseFloat($('fa') && $('fa').value) || 0;
  var box = $('psbox'), el = $('psamt');
  if (!box || !el) return;
  if (AF.split.length && amt) { box.style.display='block'; el.textContent=fmt(amt/AF.split.length); }
  else box.style.display = 'none';
}

function goAdd() {
  if (!ME) { toast('Log in first','err'); return; }
  AF = { cat:CATS[0], paidBy:ME.name, split:[...S.members] };
  PIC = null;
  $('ft').value=''; $('fa').value=''; $('fn').value=''; $('fd').value=today();
  $('pprev').style.display='none'; $('pbtn').textContent='📷 Upload Bill / Receipt';
  rChips(); gs(1); go('add');
}

function gs(n) {
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
  if (!AF.paidBy || !AF.split.length) { toast('Select payer & split','err'); return; }
  var sb = $('svbtn'); sb.textContent='Saving...'; sb.disabled=true;
  try {
    var r = await api('POST', '/expenses', {
      title:title, amount:amount,
      catIcon:AF.cat.icon, catLabel:AF.cat.label,
      paidBy:AF.paidBy, splitAmong:AF.split,
      date:$('fd').value, note:$('fn').value, screenshot:PIC||''
    });
    if (r.ok) { S.expenses=r.data; render(); toast('✓ Saved!'); go('home'); }
    else toast(r.error||'Failed','err');
  } catch(e) { toast('Network error','err'); }
  sb.textContent='Save & Sync ✓'; sb.disabled=false;
}

// ─── NEEDS ───────────────────────────────────────────────────────────────────
function toggleUrg() {
  URG_NEW = !URG_NEW;
  var b = $('urgbtn');
  b.style.borderColor = URG_NEW ? '#f55' : '#2a2a2a';
  b.style.background = URG_NEW ? 'rgba(255,85,85,.15)' : 'transparent';
  b.style.color = URG_NEW ? '#f88' : '#555';
}

async function addNeed() {
  var item = $('ni').value.trim(), by = $('nby').value;
  if (!item) { toast('Enter item name','err'); return; }
  try {
    var r = await api('POST', '/needs', {item:item, urgent:URG_NEW, added_by:by});
    if (r.ok) {
      S.needs=r.data; $('ni').value='';
      URG_NEW=false; toggleUrg(); toggleUrg();
      rNeeds(); rHome(); toast('✓ Added!');
    }
  } catch(e) { toast('Error','err'); }
}

async function togN(id, done) {
  try { var r=await api('PUT','/needs/'+id,{done:!done}); if(r.ok){S.needs=r.data;rNeeds();rHome();} } catch(e){}
}
async function delN(id) {
  try { var r=await api('DELETE','/needs/'+id); if(r.ok){S.needs=r.data;rNeeds();rHome();} } catch(e){}
}
async function delExp(id) {
  try { var r=await api('DELETE','/expenses/'+id); if(r.ok){S.expenses=r.data;rHistory();rHome();toast('Removed');} } catch(e){}
}

// ─── AI ──────────────────────────────────────────────────────────────────────
async function askAI(prompt) {
  $('aiload').classList.remove('hidden'); $('aires').classList.add('hidden');
  var ctx = S.members.length+' college students sharing a flat in India. Members:'+S.members.join(',')
    +'. Expenses:'+S.expenses.slice(0,12).map(function(e){ return e.title+' Rs'+e.amount+'('+( e.cat_label||e.catLabel||'')+',paid by '+(e.paid_by||e.paidBy)+','+e.date+')'; }).join(';')
    +'. Total:Rs'+S.expenses.reduce(function(a,e){ return a+e.amount; },0)
    +'. Pending needs:'+S.needs.filter(function(n){ return !n.done; }).map(function(n){ return n.item; }).join(',');
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
function go(id) {
  document.querySelectorAll('.page').forEach(function(p){ p.classList.remove('active'); });
  document.querySelectorAll('.nb').forEach(function(b){ b.classList.remove('on'); });
  var pg = $('pg-'+id); if (pg) pg.classList.add('active');
  var nb = $('nb-'+id); if (nb) nb.classList.add('on');
  if (id === 'calendar') rCal();
  window.scrollTo(0,0);
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
(async function() {
  // Try auto-login from saved session
  try {
    var saved = localStorage.getItem('fm_me');
    if (saved) {
      var u = JSON.parse(saved);
      var vr = await api('GET', '/users');
      if (vr.ok && Array.isArray(vr.data)) {
        S.users = vr.data;
        var found = S.users.find(function(x){ return x.id === u.id; });
        if (found) { ME = found; doLogin(); return; }
      }
    }
  } catch(e) {}

  // Show login
  await loadUsers();
  $('login').style.display = 'flex';
})();
</script>
</body>
</html>`;

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const p = url.pathname;
    const DB = env.DB;

    if (req.method === "OPTIONS") return new Response(null, { headers: H });

    // Serve the HTML app
    if (p === "/" || p === "/index.html") {
      return new Response(HTML, {
        headers: { "Content-Type": "text/html;charset=UTF-8", "Cache-Control": "no-store, no-cache" }
      });
    }

    try {
      // USERS
      if (p === "/users" && req.method === "GET") {
        const { results } = await DB.prepare("SELECT id,name,color FROM users ORDER BY created_at ASC").all();
        return ok(results);
      }
      if (p === "/users" && req.method === "POST") {
        const { name, pin, color } = await req.json();
        if (!name?.trim() || !pin) return er("Name and PIN required");
        await DB.prepare("INSERT INTO users(name,pin,color)VALUES(?,?,?)").bind(name.trim(), String(pin), color || "#C9A84C").run();
        const { results } = await DB.prepare("SELECT id,name,color FROM users ORDER BY created_at ASC").all();
        return ok(results);
      }
      if (p === "/login" && req.method === "POST") {
        const { userId, pin } = await req.json();
        const { results } = await DB.prepare("SELECT id,name,color FROM users WHERE id=? AND pin=?").bind(userId, String(pin)).all();
        if (!results.length) return er("Wrong PIN", 401);
        return ok(results[0]);
      }

      // MEMBERS
      if (p === "/members" && req.method === "GET") {
        const { results } = await DB.prepare("SELECT name FROM members ORDER BY created_at ASC").all();
        return ok(results.map(r => r.name));
      }
      if (p === "/members" && req.method === "POST") {
        const { name } = await req.json();
        if (!name?.trim()) return er("Name required");
        await DB.prepare("INSERT OR IGNORE INTO members(name)VALUES(?)").bind(name.trim()).run();
        const { results } = await DB.prepare("SELECT name FROM members ORDER BY created_at ASC").all();
        return ok(results.map(r => r.name));
      }
      if (p.startsWith("/members/") && req.method === "DELETE") {
        await DB.prepare("DELETE FROM members WHERE name=?").bind(decodeURIComponent(p.slice(9))).run();
        const { results } = await DB.prepare("SELECT name FROM members ORDER BY created_at ASC").all();
        return ok(results.map(r => r.name));
      }

      // EXPENSES
      if (p === "/expenses" && req.method === "GET") {
        const { results } = await DB.prepare("SELECT * FROM expenses ORDER BY created_at DESC").all();
        return ok(results.map(e => ({ ...e, splitAmong: JSON.parse(e.split_among || "[]") })));
      }
      if (p === "/expenses" && req.method === "POST") {
        const e = await req.json();
        if (!e.title || !e.amount || !e.paidBy) return er("Missing fields");
        const shot = (e.screenshot && e.screenshot.length < 400000) ? e.screenshot : "";
        await DB.prepare("INSERT INTO expenses(title,amount,cat_icon,cat_label,paid_by,split_among,date,note,screenshot)VALUES(?,?,?,?,?,?,?,?,?)")
          .bind(e.title, +e.amount, e.catIcon||"📦", e.catLabel||"Other", e.paidBy, JSON.stringify(e.splitAmong||[]), e.date, e.note||"", shot).run();
        const { results } = await DB.prepare("SELECT * FROM expenses ORDER BY created_at DESC").all();
        return ok(results.map(e => ({ ...e, splitAmong: JSON.parse(e.split_among || "[]") })));
      }
      if (p.startsWith("/expenses/") && req.method === "DELETE") {
        await DB.prepare("DELETE FROM expenses WHERE id=?").bind(p.slice(10)).run();
        const { results } = await DB.prepare("SELECT * FROM expenses ORDER BY created_at DESC").all();
        return ok(results.map(e => ({ ...e, splitAmong: JSON.parse(e.split_among || "[]") })));
      }

      // NEEDS
      if (p === "/needs" && req.method === "GET") {
        const { results } = await DB.prepare("SELECT * FROM needs ORDER BY urgent DESC,created_at DESC").all();
        return ok(results);
      }
      if (p === "/needs" && req.method === "POST") {
        const { item, urgent, added_by } = await req.json();
        if (!item?.trim()) return er("Item required");
        await DB.prepare("INSERT INTO needs(item,urgent,added_by)VALUES(?,?,?)").bind(item.trim(), urgent?1:0, added_by||"").run();
        const { results } = await DB.prepare("SELECT * FROM needs ORDER BY urgent DESC,created_at DESC").all();
        return ok(results);
      }
      if (p.startsWith("/needs/") && req.method === "PUT") {
        const { done } = await req.json();
        await DB.prepare("UPDATE needs SET done=? WHERE id=?").bind(done?1:0, p.slice(7)).run();
        const { results } = await DB.prepare("SELECT * FROM needs ORDER BY urgent DESC,created_at DESC").all();
        return ok(results);
      }
      if (p.startsWith("/needs/") && req.method === "DELETE") {
        await DB.prepare("DELETE FROM needs WHERE id=?").bind(p.slice(7)).run();
        const { results } = await DB.prepare("SELECT * FROM needs ORDER BY urgent DESC,created_at DESC").all();
        return ok(results);
      }

      // AI ADVISOR (Groq)
      if (p === "/ai" && req.method === "POST") {
        const { prompt } = await req.json();
        if (!prompt) return er("Prompt required");
        const apiKey = env.GROQ_API_KEY;
        if (!apiKey) return er("AI not configured — set GROQ_API_KEY secret", 500);
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": "Bearer " + apiKey },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            max_tokens: 900,
            temperature: 0.7,
            messages: [{ role: "user", content: prompt }]
          })
        });
        if (!groqRes.ok) {
          const errBody = await groqRes.text();
          return er("Groq API error: " + groqRes.status, 502);
        }
        const groqData = await groqRes.json();
        const text = groqData.choices?.[0]?.message?.content || "No response from AI.";
        return ok(text);
      }

      return er("Not found", 404);
    } catch (e) {
      return er(e.message || "Server error", 500);
    }
  }
};
