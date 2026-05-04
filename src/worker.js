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
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@600;700;800&family=JetBrains+Mono:wght@700&display=swap" rel="stylesheet">
<style>
:root {
  --bg-primary: #0A0A0F;
  --bg-card: #12121A;
  --bg-card-hover: #1A1A25;
  --bg-input: #0D0D14;
  --bg-elevated: #1E1E2A;
  --border-subtle: #1E1E2A;
  --border-default: #2A2A3A;
  --border-focus: #4A4A6A;
  --text-primary: #F0F0F5;
  --text-secondary: #8888AA;
  --text-muted: #555566;
  --accent-gold: #D4AF37;
  --accent-gold-glow: rgba(212,175,55,0.15);
  --accent-blue: #5B8CFF;
  --accent-green: #34D399;
  --accent-red: #FF5566;
  --accent-purple: #A78BFA;
  --font-display: 'Outfit', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
}
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
body{background:var(--bg-primary);color:var(--text-primary);font-family:var(--font-body);min-height:100vh;overflow-x:hidden}
button,input,select{font-family:inherit}
input[type=date]::-webkit-calendar-picker-indicator{filter:invert(1)}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes popIn{0%{transform:scale(0.9);opacity:0}100%{transform:scale(1);opacity:1}}
.hidden{display:none!important}
/* LOGIN */
#login{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center}
.ugrid{display:grid;grid-template-columns:1fr 1fr;gap:12px;width:100%;max-width:320px;margin-top:24px}
.ucard{background:var(--bg-card);border:1px solid var(--border-default);border-radius:var(--radius-lg);padding:20px 12px;cursor:pointer;text-align:center;transition:all var(--duration-fast) var(--ease-smooth)}
.ucard:active{transform:scale(0.96);border-color:var(--border-focus)}
.ucard .uav{width:52px;height:52px;border-radius:var(--radius-full);margin:0 auto 10px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:800}
.ucard .uname{font-size:14px;font-weight:700;font-family:var(--font-display)}
.ucard .uhint{font-size:11px;color:var(--text-muted);margin-top:3px}
.ucard-add{background:transparent;border:1.5px dashed var(--border-default)}
/* PIN */
#pinscreen{position:fixed;inset:0;background:var(--bg-primary);z-index:100;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px}
.pin-dots{display:flex;gap:14px;margin:20px 0 6px}
.pin-dot{width:14px;height:14px;border-radius:var(--radius-full);border:2px solid var(--border-default);background:transparent;transition:all .15s}
.pin-dot.filled{background:var(--text-primary);border-color:var(--text-primary);box-shadow:0 0 10px var(--text-primary)}
.pin-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;max-width:220px;margin-top:16px}
.pkey{background:var(--bg-card);border:1px solid var(--border-default);border-radius:var(--radius-md);padding:15px;font-size:18px;font-weight:700;cursor:pointer;color:var(--text-primary);transition:all 0.1s}
.pkey:active{background:var(--bg-card-hover);transform:scale(0.95)}
/* ADD USER */
#adduser{position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:flex;align-items:center;justify-content:center;padding:24px}
.aubox{background:var(--bg-elevated);border:1px solid var(--border-default);border-radius:var(--radius-lg);padding:24px;width:100%;max-width:340px;box-shadow:0 20px 40px rgba(0,0,0,0.4)}
/* APP */
#app{max-width:430px;margin:0 auto;display:none;background:var(--bg-primary)}
.page{display:none;min-height:100vh;padding-bottom:100px}
.page.active{display:block}
/* NAV */
nav{position:fixed;bottom:0;left:0;right:0;max-width:430px;margin:0 auto;background:rgba(10,10,15,0.8);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-top:1px solid var(--border-subtle);display:flex;padding-bottom:env(safe-area-inset-bottom)}
.nb{flex:1;padding:12px 0 10px;border:none;background:none;color:var(--text-muted);font-size:9px;font-weight:700;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:4px;letter-spacing:.5px;text-transform:uppercase;position:relative;transition:all 0.2s}
.nb.on{color:var(--accent-gold)}
.nb-bar{position:absolute;bottom:4px;left:35%;right:35%;height:2px;background:var(--accent-gold);border-radius:2px;display:none;box-shadow:0 0 10px var(--accent-gold)}
.nb.on .nb-bar{display:block}
/* CARDS */
.card{background:var(--bg-card);border:1px solid var(--border-default);border-radius:var(--radius-lg);padding:16px;margin-bottom:12px;box-shadow:var(--glow-card);animation:slideUp 0.4s var(--ease-smooth) forwards}
.inp{background:var(--bg-input);border:1px solid var(--border-default);border-radius:var(--radius-md);padding:12px 14px;color:var(--text-primary);font-size:14px;width:100%;outline:none;transition:all 0.2s}
.inp:focus{border-color:var(--accent-gold);box-shadow:0 0 0 2px var(--accent-gold-glow)}
.lbl{font-size:10px;color:var(--text-secondary);font-weight:700;letter-spacing:1px;text-transform:uppercase;display:block;margin-bottom:6px;margin-top:16px}
.btn{background:var(--text-primary);color:var(--bg-primary);border:none;border-radius:var(--radius-md);padding:14px;font-weight:700;font-size:14px;cursor:pointer;width:100%;transition:all 0.2s;font-family:var(--font-display)}
.btn:active{transform:scale(0.98);opacity:0.9}
.btn2{background:transparent;color:var(--text-secondary);border:1px solid var(--border-default);border-radius:var(--radius-md);padding:12px;font-weight:600;font-size:13px;cursor:pointer;width:100%;transition:all 0.2s}
.btn2:active{background:var(--bg-card-hover)}
.sec{font-size:11px;color:var(--text-muted);font-weight:800;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:12px;font-family:var(--font-display)}
.line{height:1px;background:var(--border-subtle);margin:16px 0}
.chip{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:20px;border:1px solid var(--border-default);background:var(--bg-input);cursor:pointer;color:var(--text-secondary);font-weight:600;font-size:12px;margin:4px;transition:all 0.2s}
.chip.on{border-color:var(--accent-gold);background:var(--accent-gold-glow);color:var(--accent-gold)}
.cats{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin-top:4px}
.cat{background:var(--bg-input);border:1px solid var(--border-default);border-radius:var(--radius-md);padding:8px 4px;cursor:pointer;text-align:center;transition:all 0.2s}
.cat.on{border-color:var(--accent-gold);background:var(--accent-gold-glow)}
.cat .ci{font-size:17px}
.cat .cl{font-size:8px;color:var(--text-muted);margin-top:2px;font-weight:600}
.cat.on .cl{color:var(--accent-gold)}
.erow{background:var(--bg-card);border:1px solid var(--border-default);border-radius:var(--radius-md);padding:12px 14px;margin-bottom:8px;display:flex;gap:12px;align-items:center;transition:all 0.2s;animation:fadeIn 0.3s ease forwards}
.erow:active{background:var(--bg-card-hover)}
.eicon{width:40px;height:40px;border-radius:var(--radius-sm);background:var(--bg-input);display:flex;align-items:center;justify-content:center;font-size:19px;flex-shrink:0}
.srow{background:var(--bg-input);border-radius:var(--radius-md);padding:11px 13px;margin-bottom:7px;display:flex;align-items:center;gap:10px;animation:slideUp 0.3s ease forwards}
.nrow{background:var(--bg-card);border:1px solid var(--border-default);border-radius:var(--radius-md);padding:12px 14px;margin-bottom:8px;display:flex;align-items:center;gap:12px;animation:slideUp 0.3s ease forwards}
.nrow.urg{border-color:rgba(255,85,85,0.3);background:rgba(255,85,85,0.03)}
.nchk{width:22px;height:22px;border-radius:var(--radius-full);border:2px solid var(--border-default);background:transparent;cursor:pointer;flex-shrink:0}
.nrow.urg .nchk{border-color:var(--accent-red)}
.mrow{background:var(--bg-card);border:1px solid var(--border-default);border-radius:var(--radius-md);padding:14px 16px;margin-bottom:10px;display:flex;align-items:center;gap:12px}
/* CHAT */
.chat-list{display:flex;flex-direction:column;gap:12px;margin-bottom:20px}
.msg{display:flex;flex-direction:column;max-width:85%}
.msg.me{align-self:flex-end;align-items:flex-end}
.msg-bubble{background:var(--bg-card);border:1px solid var(--border-default);border-radius:var(--radius-md);padding:10px 14px;font-size:13px;line-height:1.5;position:relative}
.msg.me .msg-bubble{background:var(--bg-input);border-color:var(--border-default)}
.msg-info{font-size:9px;color:var(--text-muted);margin-bottom:4px;font-weight:700;display:flex;gap:6px}
.msg.me .msg-info{flex-direction:row-reverse}
.msg-rem{background:var(--bg-input);border:1px solid var(--border-default);border-radius:var(--radius-md);padding:8px 12px;font-size:11px;color:var(--text-secondary);text-align:center;margin:4px 0}
.chat-input{position:fixed;bottom:64px;left:0;right:0;max-width:430px;margin:0 auto;background:var(--bg-primary);padding:10px 16px;display:flex;gap:8px;border-top:1px solid var(--border-subtle);z-index:50}
.astep{display:none}
.astep.on{display:block}
.stat-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:14px}
.stat-box{background:var(--bg-card);border:1px solid var(--border-default);border-radius:var(--radius-md);padding:12px 8px;text-align:center}
.stat-v{font-size:17px;font-weight:800;font-family:var(--font-mono);color:var(--text-primary)}
.stat-l{font-size:9px;color:var(--text-muted);margin-top:3px;font-weight:700;letter-spacing:.5px}
.ualert{background:rgba(91,140,255,0.08);border:1px solid rgba(91,140,255,0.2);border-radius:var(--radius-md);padding:11px 14px;margin-bottom:12px;cursor:pointer;display:flex;align-items:center;gap:10px}
.av{border-radius:var(--radius-full);display:inline-flex;align-items:center;justify-content:center;font-weight:800;flex-shrink:0;font-family:var(--font-display)}
#toast{position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:999;border-radius:var(--radius-md);padding:12px 24px;font-size:13px;font-weight:600;white-space:nowrap;background:var(--bg-elevated);border:1px solid var(--border-default);box-shadow:0 12px 32px rgba(0,0,0,0.5);display:none}
.hdr{padding:18px 20px 0;display:flex;align-items:center;gap:12px;margin-bottom:6px}
.htitle{font-size:18px;font-weight:800;font-family:var(--font-display)}
.back{background:none;border:none;color:var(--text-muted);font-size:22px;cursor:pointer;padding:0 4px;transition:all 0.2s}
.back:active{color:var(--text-primary)}
.pershare{background:var(--bg-input);border:1px solid var(--border-default);border-radius:var(--radius-md);padding:16px;margin-top:14px;text-align:center}
.sdot{height:4px;border-radius:4px}
</style>
</head>
<body>

<!-- FLAT LOGIN -->
<div id="flatlogin" style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px;text-align:center;background:radial-gradient(circle at top right, var(--bg-elevated), var(--bg-primary))">
  <div style="font-size:64px;margin-bottom:12px;filter:drop-shadow(0 0 20px var(--accent-gold-glow))">🏠</div>
  <div style="font-size:32px;font-weight:800;font-family:var(--font-display);letter-spacing:-1px">FlatMates Pro</div>
  <div style="font-size:13px;color:var(--text-muted);margin-top:8px;margin-bottom:32px;max-width:240px">Premium group expense management simplified.</div>
  
  <div style="width:100%;max-width:320px;display:flex;flex-direction:column;gap:14px">
    <div style="text-align:left">
      <label class="lbl" style="margin-top:0">Flat Identity</label>
      <input class="inp" id="f-id" placeholder="e.g. flat_101">
    </div>
    <div style="text-align:left">
      <label class="lbl" style="margin-top:0">Access Key</label>
      <input class="inp" id="f-pass" type="password" placeholder="••••••••">
    </div>
    <button class="btn" onclick="loginFlat()" style="margin-top:10px;background:var(--accent-gold);color:#000">Enter Your Flat →</button>
    <div id="f-err" style="font-size:12px;color:var(--accent-red);margin-top:8px;font-weight:600"></div>
  </div>
</div>

<!-- LOGIN -->
<div id="login" class="hidden" style="background:var(--bg-primary)">
  <div style="padding:40px 24px;text-align:center">
    <div style="font-size:10px;color:var(--accent-gold);letter-spacing:3px;font-weight:800;text-transform:uppercase;margin-bottom:8px">Welcome Back</div>
    <div style="font-size:28px;font-weight:800;font-family:var(--font-display)">Who's active?</div>
    <div id="ugrid" class="ugrid" style="margin-left:auto;margin-right:auto"></div>
    <div id="lerr" style="font-size:12px;color:var(--accent-red);margin-top:20px;font-weight:600"></div>
  </div>
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
    <div style="padding:24px 20px 16px;background:var(--bg-card);border-bottom:1px solid var(--border-subtle)">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <div style="font-size:10px;color:var(--text-muted);letter-spacing:2px;font-weight:800;text-transform:uppercase">Dashboard</div>
          <div style="font-size:24px;font-weight:800;margin-top:4px;font-family:var(--font-display)">Hey, <span id="gname" style="color:var(--accent-gold)"></span> 👋</div>
        </div>
        <div style="display:flex;align-items:center;gap:12px">
          <div id="spin" style="width:18px;height:18px;border:2px solid var(--border-default);border-top:2px solid var(--accent-gold);border-radius:50%;animation:spin 1s linear infinite;display:none"></div>
          <button onclick="logout()" style="background:var(--bg-input);border:1px solid var(--border-default);border-radius:10px;padding:8px 14px;color:var(--text-secondary);font-size:11px;cursor:pointer;font-weight:700">Exit</button>
        </div>
      </div>
    </div>
    <div style="padding:16px 16px 0">
      <div class="stat-grid" id="stats"></div>
      
      <div id="ualert" class="ualert" style="display:none" onclick="go('chat')">
        <div style="width:8px;height:8px;border-radius:50%;background:var(--accent-blue);flex-shrink:0;animation:pulse 1.5s ease infinite;box-shadow:0 0 10px var(--accent-blue)"></div>
        <div id="utext" style="flex:1;font-size:13px;font-weight:700;color:var(--accent-blue)">New messages in group chat</div>
        <span style="color:var(--text-muted)">→</span>
      </div>

      <div class="card" id="balcard" style="border-left:4px solid var(--accent-gold)"></div>
      
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;margin-top:20px">
        <div class="sec" style="margin-bottom:0">Activity History</div>
        <button onclick="go('history')" style="background:none;border:none;color:var(--accent-gold);font-size:11px;font-weight:700;cursor:pointer">See all →</button>
      </div>
      <div id="reclist"></div>
    </div>
    
    <!-- Floating Add Button -->
    <button class="btn" onclick="goAdd()" style="position:fixed;bottom:85px;right:20px;width:60px;height:60px;border-radius:30px;background:var(--accent-gold);color:#000;box-shadow:0 8px 24px rgba(212,175,55,0.3);display:flex;align-items:center;justify-content:center;font-size:28px;z-index:100;border:none">
      +
    </button>
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
        <div style="display:flex;gap:10px;margin:8px 0 16px;">
          <button id="type-exp" onclick="setTxType('expense')" style="flex:1;padding:10px;border-radius:12px;border:1px solid #fff;background:rgba(255,255,255,.1);color:#fff;font-weight:700">Expense</button>
          <button id="type-dep" onclick="setTxType('deposit')" style="flex:1;padding:10px;border-radius:12px;border:1px solid #333;background:transparent;color:#555;font-weight:700">Add Funds</button>
        </div>
        <div style="font-size:20px;font-weight:800;margin:8px 0 4px" id="st1-t">What was bought?</div>
        <div style="font-size:12px;color:#555;margin-bottom:18px" id="st1-s">Name and total amount paid</div>
        <label class="lbl" id="lbl-n">Expense Name</label>
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

  <!-- ADMIN -->
  <div class="page" id="pg-admin">
    <div class="hdr">
      <button class="back" onclick="go('home')">←</button>
      <div class="htitle">Admin Settings</div>
    </div>
    <div style="padding:14px 16px 0">
      <div class="sec">Pool Management</div>
      <div class="card">
        <label class="lbl">Adjust Total Pool (₹)</label>
        <div style="display:flex;gap:8px">
          <input class="inp" id="adm-pool" type="number" placeholder="Amount">
          <button class="btn" style="width:auto;padding:0 20px" onclick="adjPool()">Add</button>
        </div>
        <div style="font-size:10px;color:#555;margin-top:6px">This adds a special "Adjustment" deposit to the bank.</div>
      </div>
      <div class="sec">Manage Members & Limits</div>
      <div id="admin-mlist"></div>
      
      <div class="line"></div>
      <div class="sec">Platform Actions</div>
      <button class="btn2" style="border-color:var(--accent-red);color:var(--accent-red)" onclick="exitFlat()">🚪 Switch Flat / Logout</button>
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

  <!-- CHAT -->
  <div class="page" id="pg-chat">
    <div class="hdr">
      <button class="back" onclick="go('home')">←</button>
      <div class="htitle">Group Chat</div>
    </div>
    <div style="padding:14px 16px 80px">
      <div class="sec">Quick Reminders</div>
      <div id="reminders" style="display:flex;gap:8px;overflow-x:auto;padding-bottom:12px;margin-bottom:12px"></div>
      <div id="chatlist" class="chat-list"></div>
      <div id="typing" class="hidden" style="font-size:11px;color:var(--text-muted);margin-bottom:12px">AI is thinking...</div>
    </div>
    <div class="chat-input">
      <input type="file" id="chat-file" accept="image/*" style="display:none" onchange="handleReceipt(this)">
      <button class="btn2" onclick="document.getElementById('chat-file').click()" style="width:auto;padding:10px 14px;border:none;background:#1e1e1e;color:#fff;font-size:18px">📷</button>
      <input class="inp" id="msg-inp" placeholder="Type a message..." onkeydown="if(event.key==='Enter')sendMsg()">
      <button class="btn" onclick="sendMsg()" style="width:auto;padding:0 18px">Send</button>
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
      
      <!-- HINGLISH TUTORIAL -->
      <div class="card" style="margin-top:16px;background:#1a1a1a;border-left:3px solid #C9A84C">
        <div class="sec" style="margin-bottom:8px;font-size:14px">💡 App Kaise Use Karein? (Guide)</div>
        <div style="font-size:12px;color:#888;line-height:1.6">
          <ul style="padding-left:16px;margin:0">
            <li style="margin-bottom:6px"><b>Prepaid Wallet:</b> Har roommate ko pehle system me paise 'Deposit' karne honge (Admin Pool ke through). Aapka kharcha us balance me se katega.</li>
            <li style="margin-bottom:6px"><b>AI Chat:</b> Chat me type karein jaise <i>"Add 500 for milk"</i>. AI automatically samajh kar aapke khate se paise kaat lega!</li>
            <li style="margin-bottom:6px"><b>Smart Receipts:</b> Chat me 📷 icon par click karke bill ki photo bhejein. AI khud bill padhega aur expense add kar dega.</li>
            <li style="margin-bottom:0"><b>Admin Control:</b> Admin 'Members' tab me ja kar logon ki daily limit set kar sakta hai aur manually balance adjust kar sakta hai.</li>
          </ul>
        </div>
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
    <button class="nb" id="nb-chat" onclick="go('chat')"><span style="font-size:18px">💬</span>Chat<div class="nb-bar"></div></button>
    <button class="nb" id="nb-advisor" onclick="go('advisor')"><span style="font-size:18px">◉</span>Advisor<div class="nb-bar"></div></button>
    <button class="nb" id="nb-members" onclick="go('members')"><span style="font-size:18px">◎</span>Members<div class="nb-bar"></div></button>
    <button class="nb" id="nb-superadmin" style="display:none"><span style="font-size:18px">⚙️</span>System<div class="nb-bar"></div></button>
  </nav>

  <!-- SUPER ADMIN -->
  <div class="page" id="pg-superadmin">
    <div class="hdr">
      <button class="back" onclick="go('home')">←</button>
      <div class="htitle">System Control</div>
    </div>
    <div style="padding:14px 16px 0">
      <div class="sec">Active Tenants</div>
      <div id="flatlist"></div>
    </div>
  </div>
</div>

<div id="toast"></div>

<script>
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

function spinning(on) { $('spin').style.display = on ? 'block' : 'none'; }

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
    render();
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
      var sp = Array.isArray(e.splitAmong) ? e.splitAmong : JSON.parse(e.split_among || '[]');
      if (!sp.length) return;
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
    var sp = Array.isArray(e.splitAmong) ? e.splitAmong : JSON.parse(e.split_among || '[]');
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
    $('nb-superadmin').style.display = 'flex';
    $('nb-superadmin').onclick = function(){ go('superadmin'); };
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

    const flat_id = req.headers.get('x-flat-id') || 'flat_0';

    try {
      // SUPER ADMIN (fm_admin context)
      if (p === "/flats" && req.method === "GET") {
        if (flat_id !== "fm_admin") return er("Unauthorized", 403);
        const data = await DB.prepare("SELECT * FROM flats").all();
        return ok(data.results);
      }
      if (p === "/flats/status" && req.method === "POST") {
        if (flat_id !== "fm_admin") return er("Unauthorized", 403);
        const { id, status } = await req.json();
        await DB.prepare("UPDATE flats SET status=? WHERE id=?").bind(status, id).run();
        return ok({ success: true });
      }

      // FLATS
      if (p === "/flats/login" && req.method === "POST") {
        const { id, password } = await req.json();
        const { results } = await DB.prepare("SELECT * FROM flats WHERE id=? AND password=?").bind(id, password).all();
        if (!results.length) return er("Invalid Flat ID or Password", 401);
        if (results[0].status === 'suspended') return er("Your flat access has been suspended by the platform admin.", 403);
        return ok(results[0]);
      }

      // USERS
      if (p === "/users" && req.method === "GET") {
        const { results } = await DB.prepare("SELECT id,name,color FROM users WHERE flat_id=? ORDER BY created_at ASC").bind(flat_id).all();
        return ok(results);
      }
      if (p === "/users" && req.method === "POST") {
        const { name, pin, color } = await req.json();
        if (!name?.trim() || !pin) return er("Name and PIN required");
        await DB.prepare("INSERT INTO users(flat_id,name,pin,color)VALUES(?,?,?,?)").bind(flat_id, name.trim(), String(pin), color || "#C9A84C").run();
        const { results } = await DB.prepare("SELECT id,name,color FROM users WHERE flat_id=? ORDER BY created_at ASC").bind(flat_id).all();
        return ok(results);
      }
      if (p === "/login" && req.method === "POST") {
        const { userId, pin } = await req.json();
        if (userId === "admin" && pin === (env.ADMIN_PIN || "9999")) {
          return ok({ id: "admin", name: "Admin", is_admin: 1, color: "#f55" });
        }
        const { results } = await DB.prepare("SELECT id,name,color,is_admin FROM users WHERE flat_id=? AND id=? AND pin=?").bind(flat_id, userId, String(pin)).all();
        if (!results.length) return er("Wrong PIN", 401);
        return ok(results[0]);
      }

      // MEMBERS
      if (p === "/members" && req.method === "GET") {
        const { results } = await DB.prepare("SELECT name, spend_limit FROM members WHERE flat_id=? ORDER BY created_at ASC").bind(flat_id).all();
        return ok(results);
      }
      if (p === "/members" && req.method === "POST") {
        const { name } = await req.json();
        if (!name?.trim()) return er("Name required");
        await DB.prepare("INSERT OR IGNORE INTO members(flat_id,name)VALUES(?,?)").bind(flat_id, name.trim()).run();
        const { results } = await DB.prepare("SELECT name, spend_limit FROM members WHERE flat_id=? ORDER BY created_at ASC").bind(flat_id).all();
        return ok(results);
      }
      if (p.startsWith("/members/") && req.method === "PUT") {
        const { spend_limit } = await req.json();
        const name = decodeURIComponent(p.slice(9));
        await DB.prepare("UPDATE members SET spend_limit=? WHERE name=? AND flat_id=?").bind(+(spend_limit||0), name, flat_id).run();
        const { results } = await DB.prepare("SELECT name, spend_limit FROM members WHERE flat_id=? ORDER BY created_at ASC").bind(flat_id).all();
        return ok(results);
      }
      if (p.startsWith("/members/") && req.method === "DELETE") {
        const name = decodeURIComponent(p.slice(9));
        await DB.prepare("DELETE FROM members WHERE name=? AND flat_id=?").bind(name, flat_id).run();
        await DB.prepare("DELETE FROM users WHERE name=? AND flat_id=?").bind(name, flat_id).run();
        const { results } = await DB.prepare("SELECT name, spend_limit FROM members WHERE flat_id=? ORDER BY created_at ASC").bind(flat_id).all();
        return ok(results);
      }

      // NEEDS
      if (p === "/needs" && req.method === "GET") {
        const { results } = await DB.prepare("SELECT * FROM needs WHERE flat_id=? AND done=0 ORDER BY urgent DESC, created_at DESC").bind(flat_id).all();
        return ok(results);
      }
      if (p === "/needs" && req.method === "POST") {
        const { item, urgent, added_by } = await req.json();
        await DB.prepare("INSERT INTO needs(flat_id,item,urgent,added_by)VALUES(?,?,?,?)").bind(flat_id, item, urgent?1:0, added_by).run();
        const { results } = await DB.prepare("SELECT * FROM needs WHERE flat_id=? AND done=0 ORDER BY urgent DESC, created_at DESC").bind(flat_id).all();
        return ok(results);
      }
      if (p.startsWith("/needs/") && req.method === "PATCH") {
        const nid = p.split("/")[2];
        await DB.prepare("UPDATE needs SET done=1 WHERE flat_id=? AND id=?").bind(flat_id, nid).run();
        return ok({success:true});
      }

      // EXPENSES
      if (p === "/expenses" && req.method === "GET") {
        const { results } = await DB.prepare("SELECT * FROM expenses WHERE flat_id=? ORDER BY created_at DESC").bind(flat_id).all();
        return ok(results.map(e => ({ ...e, splitAmong: JSON.parse(e.split_among || "[]") })));
      }
      if (p === "/expenses" && req.method === "POST") {
        const e = await req.json();
        if (!e.title || !e.amount || !e.paidBy) return er("Missing fields");
        const shot = (e.screenshot && e.screenshot.length < 400000) ? e.screenshot : "";
        await DB.prepare("INSERT INTO expenses(flat_id,title,amount,cat_icon,cat_label,paid_by,split_among,date,note,screenshot,type)VALUES(?,?,?,?,?,?,?,?,?,?,?)")
          .bind(flat_id, e.title, +e.amount, e.catIcon||"📦", e.catLabel||"Other", e.paidBy, JSON.stringify(e.splitAmong||[]), e.date, e.note||"", shot, e.type||"expense").run();
        const { results } = await DB.prepare("SELECT * FROM expenses WHERE flat_id=? ORDER BY created_at DESC").bind(flat_id).all();
        return ok(results.map(e => ({ ...e, splitAmong: JSON.parse(e.split_among || "[]") })));
      }
      if (p.startsWith("/expenses/") && req.method === "DELETE") {
        await DB.prepare("DELETE FROM expenses WHERE id=? AND flat_id=?").bind(p.slice(10), flat_id).run();
        const { results } = await DB.prepare("SELECT * FROM expenses WHERE flat_id=? ORDER BY created_at DESC").bind(flat_id).all();
        return ok(results.map(e => ({ ...e, splitAmong: JSON.parse(e.split_among || "[]") })));
      }

      // MESSAGES (Agentic Chat)
      if (p === "/messages" && req.method === "GET") {
        const { results } = await DB.prepare("SELECT * FROM messages WHERE flat_id=? ORDER BY created_at ASC LIMIT 100").bind(flat_id).all();
        return ok(results);
      }
      if (p === "/messages" && req.method === "POST") {
        const { sender, text, type } = await req.json();
        if (!text?.trim()) return er("Message required");
        await DB.prepare("INSERT INTO messages(flat_id,sender,text,type)VALUES(?,?,?,?)").bind(flat_id, sender, text.trim(), type||'chat').run();
        
        const apiKey = env.GROQ_API_KEY;
        if (apiKey && (!type || type === 'chat') && sender !== 'System' && sender !== 'AI Agent') {
          const prompt = `You are "FlatBot", a helpful AI assistant in the FlatMates expense app. 
          User '${sender}' said: '${text.trim()}'.
          RULES:
          1. If they want to log an expense (e.g. "add 500 for milk", "spent 200 on snacks"), confirm it in a friendly Hinglish tone and end with [ADD_EXPENSE: amount, "Short Title"].
          2. If they are just chatting (e.g. "hi", "how are you", "who paid?"), reply naturally in Hinglish.
          3. If the message is irrelevant to the app, reply EXACTLY with word IGNORE.
          4. Keep it short and cool.`;
          try {
            const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
              method: "POST",
              headers: { "Content-Type": "application/json", "Authorization": "Bearer " + apiKey },
              body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                temperature: 0.1,
                messages: [{ role: "system", content: prompt }]
              })
            });
            const groqData = await groqRes.json();
            const aiReply = groqData.choices?.[0]?.message?.content?.trim() || "IGNORE";
            
            if (aiReply !== "IGNORE" && !aiReply.startsWith("IGNORE")) {
              const match = aiReply.match(/\[ADD_EXPENSE:\s*(\d+(?:\.\d+)?)\s*,\s*"([^"]+)"\]/);
              let cleanReply = aiReply;
              
              if (match) {
                const amt = parseFloat(match[1]);
                const title = match[2];
                cleanReply = aiReply.replace(match[0], "").trim();
                const d = new Date().toISOString().slice(0,10);
                await DB.prepare("INSERT INTO expenses(flat_id,title,amount,cat_icon,cat_label,paid_by,split_among,date,note,screenshot,type)VALUES(?,?,?,?,?,?,?,?,?,?,?)")
                  .bind(flat_id, title, amt, "🤖", "AI Scan", sender, JSON.stringify([sender]), d, "Added via Chat AI", "", "expense").run();
              }
              if (cleanReply) {
                await DB.prepare("INSERT INTO messages(flat_id,sender,text,type)VALUES(?,?,?,?)").bind(flat_id, "AI Agent", cleanReply, "chat").run();
              }
            }
          } catch(e) {}
        }
        
        const { results } = await DB.prepare("SELECT * FROM messages WHERE flat_id=? ORDER BY created_at ASC LIMIT 100").bind(flat_id).all();
        const exps = await DB.prepare("SELECT * FROM expenses WHERE flat_id=? ORDER BY created_at DESC").bind(flat_id).all();
        return ok({ messages: results, expenses: exps.results.map(e => ({ ...e, splitAmong: JSON.parse(e.split_among || "[]") })) });
      }
      if (p.startsWith("/messages/") && req.method === "DELETE") {
        await DB.prepare("DELETE FROM messages WHERE id=? AND flat_id=?").bind(p.slice(10), flat_id).run();
        const { results } = await DB.prepare("SELECT * FROM messages WHERE flat_id=? ORDER BY created_at ASC LIMIT 100").bind(flat_id).all();
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
        if (!groqRes.ok) return er("Groq API error: " + groqRes.status, 502);
        const groqData = await groqRes.json();
        const text = groqData.choices?.[0]?.message?.content || "No response from AI.";
        return ok(text);
      }

      // AI RECEIPT SCANNER (OCR + Groq Text)
      if (p === "/ai-receipt" && req.method === "POST") {
        const { sender, image } = await req.json();
        if (!image) return er("Image required");
        const apiKey = env.GROQ_API_KEY;
        if (!apiKey) return er("AI not configured", 500);
        
        // Step 1: Free OCR
        const ocrData = new URLSearchParams();
        ocrData.append('base64Image', image);
        ocrData.append('apikey', 'helloworld'); // Free public key
        
        const ocrRes = await fetch('https://api.ocr.space/parse/image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: ocrData
        });
        
        if (!ocrRes.ok) return er("OCR API error", 502);
        const ocrJson = await ocrRes.json();
        const extractedText = ocrJson.ParsedResults?.[0]?.ParsedText || "";
        
        if (!extractedText.trim()) return er("Could not read any text from the image", 400);

        // Step 2: Groq Text Extraction (Agentic)
        const prompt = `User '${sender}' uploaded a receipt. OCR text:
        ${extractedText}
        
        Act as FlatBot. Review the text, find the total amount and a 2-word title. 
        Confirm you've added it in Hinglish.
        End with: [ADD_EXPENSE: amount, "Title"]`;
        
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": "Bearer " + apiKey },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            temperature: 0.1,
            messages: [{ role: "user", content: prompt }]
          })
        });
        
        if (!groqRes.ok) return er("Groq API error: " + groqRes.status, 502);
        const groqData = await groqRes.json();
        const aiReply = groqData.choices?.[0]?.message?.content?.trim() || "";
        
        const match = aiReply.match(/\[ADD_EXPENSE:\s*(\d+(?:\.\d+)?)\s*,\s*"([^"]+)"\]/);
        let cleanReply = aiReply;
        
        if (match) {
          const amt = parseFloat(match[1]);
          const title = match[2];
          cleanReply = aiReply.replace(match[0], "").trim();
          const d = new Date().toISOString().slice(0,10);
          await DB.prepare("INSERT INTO expenses(flat_id,title,amount,cat_icon,cat_label,paid_by,split_among,date,note,screenshot,type)VALUES(?,?,?,?,?,?,?,?,?,?,?)")
            .bind(flat_id, title, amt, "🤖", "AI Scan", sender, JSON.stringify([sender]), d, "Added via AI Receipt", "", "expense").run();
        } else {
          return er("Could not find amount in receipt", 400);
        }

        if (cleanReply) {
          await DB.prepare("INSERT INTO messages(flat_id,sender,text,type)VALUES(?,?,?,?)").bind(flat_id, "AI Agent", cleanReply, "chat").run();
        }
        
        const msgs = await DB.prepare("SELECT * FROM messages WHERE flat_id=? ORDER BY created_at ASC LIMIT 100").bind(flat_id).all();
        const exps = await DB.prepare("SELECT * FROM expenses WHERE flat_id=? ORDER BY created_at DESC").bind(flat_id).all();
        
        return ok({
          messages: msgs.results,
          expenses: exps.results.map(e => ({ ...e, splitAmong: JSON.parse(e.split_among || "[]") }))
        });
      }

      return er("Not found", 404);
    } catch (e) {
      return er(e.message || "Server error", 500);
    }
  }
};
