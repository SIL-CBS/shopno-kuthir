/* মুনাজাতে মাকবূল — মুখস্থের প্লেয়ার. সব কিছু এই ডিভাইসে: মিডিয়া IndexedDB-তে, সেটিং localStorage-এ. */
(() => {
  const DATA = window.MUNAJAT, $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const BN = '০১২৩৪৫৬৭৮৯', bn = (v) => String(v).replace(/\d/g, (d) => BN[d]);
  const APPVER = 56, APPDATE = '২৩ নভেম্বর ২০২৬';
  const CHANGES = [
    [56, '২৩ নভে ২০২৬', ['নতুন অংশ "সূরা": সূরা আল-কাহফ — ১২ রুকু, প্রতিটা আয়াত এক লাইন; দোয়ার মতোই বাছাই, রিপিট, অর্থ, শেয়ার', 'সূরার অডিও "ফাইল দিন" দিয়ে দিন; আয়াতের সময় আপাতত আনুমানিক']],
    [55, '২৩ নভে ২০২৬', ['লাইন বাছাই থাকলে ▶ চাপলে প্রথম বাছাই করা লাইন থেকে শুরু হয়; বাছাই না থাকলে দোয়ার শুরু থেকে']],
    [54, '২৩ নভে ২০২৬', ['খোলা দোয়ার প্রতিটা লাইনে ☐ বাছাই', 'কয়েকটা লাইন বেছে নিচের 🔁 চাপলে সেই দল একসাথে ১/২/৩/৫/৭/১০ বার রিপিট হয়, তারপর পরের লাইনে যায়', '"বাছাই মুছুন" দিয়ে দল তুলে দেওয়া যায়; অন্য দোয়ায় গেলে নিজে মুছে যায়']],
    [53, '২৩ নভে ২০২৬', ['রিপিট চলার সময় অন্য লাইনে চাপলে সরাসরি সেই লাইনে যায়, রিপিট আবার ১ হয়ে যায়', 'রিপিট শুধু চলতি লাইনের জন্য — একসাথে একটা লাইনেই থাকে, অন্য দোয়ায় গেলে মুছে যায়']],
    [52, '২৩ নভে ২০২৬', ['নিচের 🔁 বোতাম এখন রিপিট: যে লাইন চলছে সেটা ১ → ২ → ৩ → ৫ → ৭ → ১০ বার, তারপর আবার ১', 'রিপিট শেষ হলে পরের লাইনে যায় — "পুরো দোয়া" মোডেও কাজ করে']],
    [51, '২৩ নভে ২০২৬', ['বড় প্লেয়ার সরিয়ে নিচে ছোট প্লেয়ার বার — আগে, চালান, পরে, বন্ধ, দোয়া শেষে কী হবে, সেটিং', 'উপরের অংশ ছোট হলো, দোয়া পড়ার জায়গা বড়']],
    [50, '২১ নভে ২০২৬', ['"অর্থ" পাতায় 🔊 বোতাম — শুধু বাংলা অর্থ পড়ে শোনায়', '"এখান থেকে সব" / "সব অর্থ ক্রমে শুনুন" — একটার পর একটা দোয়ার অর্থ শোনায়, পাতাও সাথে সাথে বদলায়']],
    [49, '২০ নভে ২০২৬', ['"অর্থ" পাতায় সেদিনের সব দোয়ার অর্থের তালিকা — যেকোনোটায় চাপলে একটা করে দেখা', 'একটা করে দেখায় আগের / পরের বোতাম', 'শেয়ার: WhatsApp, Telegram, Messenger / অন্য অ্যাপ, আর কপি']],
    [48, '১৮ নভে ২০২৬', ['অ্যাপে অডিও চালু করলে বন্ধ হয়ে যাওয়া ঠিক করার চেষ্টা — নোটিফিকেশন প্লেয়ার আপাতত সেটিং থেকে চালু করতে হবে (পরীক্ষামূলক)', 'অ্যাপ হঠাৎ বন্ধ হলে কারণ ⓘ-এর লগে আসে']],
    [47, '১৭ নভে ২০২৬', ['নতুন APK (বিল্ড ৪): নিজস্ব আইকন আর শুরুর পর্দা', 'ফোনের নিজস্ব অডিও সার্ভিস — লক স্ক্রিনে বা অ্যাপ পেছনে থাকলেও চলে, নোটিফিকেশনে প্লেয়ার (চালান/থামান/আগে/পরে)']],
    [46, '১৭ নভে ২০২৬', ['প্রতিটা দোয়ায় "অর্থ" বোতাম — পুরো বাংলা অর্থ একসাথে, উৎসসহ', 'শেয়ার: আরবি, উচ্চারণ, অর্থ আর উৎস একসাথে (WhatsApp ইত্যাদি)', 'অ্যাপ খুললে আজকের দিন নিজে খোলে (সেটিং থেকে বন্ধ করা যায়)', 'যেখানে থেমেছিলেন সেখান থেকে চালানোর বোতাম', 'আরবি ফন্ট বাছাই (আমিরি / উসমানি / নাস্খ) আর রঙ (দিন / রাত / আরামদায়ক রাত)']],
    [45, '১৭ নভে ২০২৬', ['বাংলা অর্থ শোনানো ঠিক করা হলো — অ্যাপে (APK ৩) ফোনের নিজস্ব বাংলা কণ্ঠ ব্যবহার হয়', 'কণ্ঠ না পেলে কারণ দেখায় আর পরের লাইনে চলে যায়']],
    [44, '১৭ নভে ২০২৬', ['মোবাইল অ্যাপ (APK) এখন নিজে থেকে update হয় — লেখা ও ফিচার ওয়েবসাইট থেকে আসে', 'APK-র নিজের অংশ পুরোনো হলে উপরে "নতুন APK" বোতাম দেখায়']],
    [43, '১৭ নভে ২০২৬', ['বাংলা অর্থ এখন শুরু থেকেই দেখায় (আগে "অর্থ" চিপ চাপতে হতো)']],
    [42, '১৬ নভে ২০২৬', ['পরীক্ষামূলক: বাংলা অর্থ পড়ে শোনানো (ফোনের বাংলা কণ্ঠ) — শুধু শনিবার দোয়া ১ ও ২', 'সেটিংসে: বন্ধ / প্রতি লাইনের পরে / পুরো দোয়ার পরে / শুধু অর্থ, আর কণ্ঠের গতি']],
    [41, '১৬ নভে ২০২৬', ['সেটিংস ও "অ্যাপ সম্পর্কে" পাতার শিরোনাম নীল রঙে']],
    [40, '১৬ নভে ২০২৬', ['ⓘ পাতায় উৎসের হিসাব — কয়টা পাওয়া গেছে, কয়টা যায়নি, আর বাকি দোয়ার নম্বর']],
    [39, '১৬ নভে ২০২৬', ['রবি, সোম, মঙ্গলবারের দোয়ার উৎস (হাদিসের কিতাব ও রাবি)', 'বুধ ও শুক্রবারের কিছু দোয়ার উৎস; বাকিগুলো যাচাই চলছে']],
    [38, '১৬ নভে ২০২৬', ['দোয়ার উৎস এখন দোয়া নম্বরের লাইনেই (আলাদা লাইন নয়)']],
    [37, '১৬ নভে ২০২৬', ['নতুন সংস্করণ এলে অ্যাপ নিজে থেকে খুঁজে নেয় ও চালু করে (বাজানো চললে উপরে বোতাম দেখায়)']],
    [36, '১৬ নভে ২০২৬', ['সেটিংস ও "অ্যাপ সম্পর্কে" পাতার শিরোনাম ও ✕ বোতাম এখন উপরে আটকে থাকে', 'শনিবারের ৫৪টি দোয়ার উৎস — কুরআনের সূরা:আয়াত, হাদিসের কিতাব ও নম্বর', 'সেটিংসে "উৎসের লিংক খুলবে" (শুরুতে বন্ধ; নেট না থাকলে নিজে বন্ধ)']],
    [35, '১৬ নভে ২০২৬', ['বাজানো চলার সময় লাইনের ×বার বদলালেও সাথে সাথে কাজ করে']],
    [34, '১৬ নভে ২০২৬', ['প্রতিটি লাইনের পাশে ×৩ বোতাম — চাপলে ওই লাইন কতবার বাজবে বদলায় (১,২,৩,৪,৫,৭,১০; আবার চাপলে সেটিংসের মান)', '"লাইন ধরে" মোডে কাজ করে']],
    [33, '১৬ নভে ২০২৬', ['২–৩ সেকেন্ড পর আওয়াজ থেমে আবার চলা ঠিক করা (চুপ করে শুরুর কৌশল বাদ)']],
    [32, '১৬ নভে ২০২৬', ['শনিবার: ২২টি দোয়ার শুরু ক্বারী সাহেবের শ্বাস নেওয়ার বিরতিতে সরানো (দোয়া ২-সহ) — আগের দোয়ার শেষ অংশ আর আসবে না']],
    [31, '১৬ নভে ২০২৬', ['"অডিওর সময় মেলান" এখন প্রতি চাপে ৫০০ মি.সে. (আগে/পরে দুই দিকেই)']],
    [30, '১৬ নভে ২০২৬', ['ফাইলে ভিডিও থাকলে লাল সতর্কতা — লক স্ক্রিনে চালাতে শুধু অডিও (.m4a) লাগে']],
    [29, '১৬ নভে ২০২৬', ['ⓘ পাতায় এই দিনের ফাইলের নাম/ধরন/দৈর্ঘ্য', 'সমস্যা খোঁজার লগ — কপি করে পাঠানো যায়']],
    [28, '১৬ নভে ২০২৬', ['ⓘ "অ্যাপ সম্পর্কে" পাতা — সংস্করণ, কী নতুন, কোন দিনে কোন দোয়া']],
    [27, '১৬ নভে ২০২৬', ['দোয়া শুরুর সময় আগের অডিওর টুকরো আর শোনা যায় না (চুপ থেকে শুরু, ঠিক মুহূর্তে আওয়াজ)', 'পর্দা বন্ধ থাকলে মাঝে না থেমে পরের অংশে চলে যায় — লক স্ক্রিনে বন্ধ হয় না']],
    [26, '১৬ নভে ২০২৬', ['ভিডিও প্লেয়ারের বদলে অডিও প্লেয়ার — লক স্ক্রিন / পেছনে চলে', 'লক স্ক্রিনে দোয়ার নম্বর ও দিন দেখায়', 'সেটিংসে "অডিওর সময় মেলান" (প্রতিদিন আলাদা)', 'শনিবারের দোয়ার শুরু আরও নিখুঁত']],
    [25, '১৬ নভে ২০২৬', ['৭ দিন জুড়ে খোঁজা — অর্থ, উচ্চারণ, আরবি বা দোয়া নং', '★ প্রিয় দোয়া ও প্রিয় তালিকা চালানো', 'মুখস্থ মোড — এক লাইন শুনে থামে, তারপর আপনি বলুন']],
    [24, '১৬ নভে ২০২৬', ['শনি, রবি, বুধবারের কয়েকটা লাইনের সময় ঠিক করা']],
    [23, '১৬ নভে ২০২৬', ['বৃহস্পতিবার যোগ — ৭ দিনই সম্পূর্ণ']],
    [22, '১৬ নভে ২০২৬', ['মঙ্গলবার যোগ']],
    [21, '১৫ নভে ২০২৬', ['সোমবার যোগ']],
    [20, '১৫ নভে ২০২৬', ['শনিবার যোগ']],
    [19, '১৫ নভে ২০২৬', ['রবিবার যোগ, YouTube লিংক ও কপি বোতাম, ফাইল বদলান বোতাম']],
  ];
  const KEY = 'mm_v1', VER = 4, DEF = {v: VER, dua: 0, mode: 'dua', reps: 3, gap: 2, whole: 1, after: 'next', tts: 'off', ttsRate: 1, listLoop: true, speed: 1, showBn: true, showMeaning: true, hideAr: false, video: false, font: 30, arf: 'ami', theme: 'auto', autoDay: true, nms: false, nudge: {}, sel: []};
  let S; try { S = Object.assign({}, DEF, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { S = Object.assign({}, DEF); }
  if (S.v !== VER) { S.nudge = {}; S.v = VER; if (S.perDay) Object.values(S.perDay).forEach((p) => { p.nudge = {}; }); } // সময় নতুন করে মেলানো হয়েছে — পুরোনো সরানো বাদ
  if (!S.mnOn1) { S.showMeaning = true; S.mnOn1 = 1; } /* একবার: বাংলা অর্থ চালু করে দাও */ if (!Array.isArray(S.sel)) S.sel = []; if (!S.fav || typeof S.fav !== 'object') S.fav = {};
  /* ---------- দিন: ৭ দিনের তালিকা; যে দিনের লেখা এখনো নেই, সেটা পুরো ফাইল এক টানা বাজে ---------- */
  const DAYS = [['saturday', 'শনিবার', '১ম মনজিল'], ['sunday', 'রবিবার', '২য় মনজিল'], ['monday', 'সোমবার', '৩য় মনজিল'], ['tuesday', 'মঙ্গলবার', '৪র্থ মনজিল'], ['wednesday', 'বুধবার', '৫ম মনজিল'], ['thursday', 'বৃহস্পতিবার', '৬ষ্ঠ মনজিল'], ['friday', 'জুমাবার', '৭ম মনজিল'], ['kahf', 'সূরা আল-কাহফ', '১৮ নং সূরা']];
  let DAYID = 'friday'; try { DAYID = localStorage.getItem('mm_day') || 'friday'; } catch (e) {}
  let FRESH = false; try { FRESH = !sessionStorage.getItem('mm_s'); sessionStorage.setItem('mm_s', '1'); } catch (e) {}
  if (FRESH && S.autoDay !== false) { try { if (!sessionStorage.getItem('mm_go')) { DAYID = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][new Date().getDay()]; localStorage.setItem('mm_day', DAYID); } } catch (e) {} }
  const applyLook = () => { const r = document.documentElement; if (S.theme && S.theme !== 'auto') r.dataset.theme = S.theme; else delete r.dataset.theme; if (S.arf && S.arf !== 'ami') r.dataset.arf = S.arf; else delete r.dataset.arf; };
  applyLook();
  if (!DAYS.some((d) => d[0] === DAYID)) DAYID = 'friday';
  const DMETA = DAYS.find((d) => d[0] === DAYID);
  const day = DATA.days.find((d) => d.id === DAYID) || {id: DAYID, title: DMETA[1] + ' · ' + DMETA[2], range: 'লেখা এখনো যোগ হয়নি — শুধু অডিও', placeholder: true,
    duas: [{no: '—', s: 0, e: 1e6, lines: [{ar: '', bn: 'এই দিনের আরবি লেখা, উচ্চারণ আর অর্থ এখনো যোগ হয়নি। অডিও পুরোটা বাজবে।', s: 0, e: 1e6}]}]};
  const duas = day.duas, DAYKEY = DAYID, UNIT = day.unit || 'দোয়া';
  // প্রতিটি দিনের বাছাই, কোন দোয়ায় ছিলেন আর সময়-ঠিক আলাদা থাকে
  S.perDay = S.perDay || {}; if (!S.perDay.friday && !S.dayInit) S.perDay.friday = {dua: S.dua, sel: S.sel, nudge: S.nudge}; S.dayInit = 1;
  { const pd = S.perDay[DAYID] || {}; S.dua = Math.min(pd.dua || 0, duas.length - 1); S.sel = (pd.sel || []).filter((i) => i < duas.length); S.nudge = pd.nudge || {}; S.lrep = pd.lrep || {}; }
  const save = () => { S.perDay[DAYID] = {dua: S.dua, sel: S.sel, nudge: S.nudge, lrep: S.lrep}; try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
  /* ---------- IndexedDB: মিডিয়া ফাইল ---------- */
  const idb = () => new Promise((ok, bad) => { const r = indexedDB.open('munajat', 1); r.onupgradeneeded = () => r.result.createObjectStore('media'); r.onsuccess = () => ok(r.result); r.onerror = () => bad(r.error); });
  const putMedia = async (k, blob) => { const db = await idb(); return new Promise((ok, bad) => { const t = db.transaction('media', 'readwrite'); t.objectStore('media').put(blob, k); t.oncomplete = ok; t.onerror = () => bad(t.error); }); };
  const mediaKeys = async () => { try { const db = await idb(); return await new Promise((ok) => { const r = db.transaction('media').objectStore('media').getAllKeys(); r.onsuccess = () => ok(r.result || []); r.onerror = () => ok([]); }); } catch (e) { return []; } };
  const getMedia = async (k) => { const db = await idb(); return new Promise((ok) => { const r = db.transaction('media').objectStore('media').get(k); r.onsuccess = () => ok(r.result || null); r.onerror = () => ok(null); }); };
  /* ---------- সময় ---------- */
  const LEAD = 0.06; // লাইনের শুরু যেন কেটে না যায় (দোয়ার শুরুতে প্রায় শূন্য)
  const OFF = () => (S.off && +S.off[DAYID]) || 0; // এই দিনের ফাইলের সময়-সরানো (ফোন/ফাইল ভেদে)
  let endT = 0;
  const nd = (i) => S.nudge[i] || [0, 0];
  const duaSpan = (i) => { const d = duas[i], n = nd(i); return [d.s + n[0], d.e + n[1]]; };
  const lineSpan = (i, j) => { const d = duas[i], L = d.lines[j], n = nd(i); return [j === 0 ? L.s + n[0] : L.s, j === d.lines.length - 1 ? L.e + n[1] : L.e]; };
  /* ---------- শোনার তালিকা (বাছাই) ---------- */
  const queue = () => (S.sel.length ? [...S.sel].sort((a, b) => a - b) : duas.map((_, i) => i));
  const isSel = (i) => S.sel.includes(i);
  const favs = (id = DAYID) => S.fav[id] || [], isFav = (i) => favs().includes(i);
  /* ---------- প্লেয়ার ইঞ্জিন ---------- */
  const media = $('#media');
  /* সমস্যা খোঁজার লগ — শুধু এই ডিভাইসে, About পাতা থেকে কপি করা যায় */
  const LOGK = 'mm_log', LOG = (() => { try { return JSON.parse(localStorage.getItem(LOGK) || '[]'); } catch (e) { return []; } })();
  const lg = (...a) => { const d = new Date(); LOG.push([d.toTimeString().slice(0, 8) + '.' + String(d.getMilliseconds()).padStart(3, '0'), document.hidden ? 'H' : 'V', (media.currentTime || 0).toFixed(2), media.paused ? 'P' : '>', media.muted ? 'M' : '', a.join(' ')].join(' ')); if (LOG.length > 300) LOG.splice(0, LOG.length - 300); try { localStorage.setItem(LOGK, JSON.stringify(LOG)); } catch (e) {} };
  ['play', 'playing', 'pause', 'seeking', 'seeked', 'ended', 'waiting', 'stalled', 'suspend', 'emptied', 'error'].forEach((ev) => media.addEventListener(ev, () => lg(ev, ev === 'error' && media.error ? 'code' + media.error.code : '')));
  document.addEventListener('visibilitychange', () => lg('visibility', document.visibilityState));
  addEventListener('pagehide', () => lg('pagehide')); addEventListener('freeze', () => lg('freeze')); addEventListener('resume', () => lg('resume')); let plan = null, timer = null, wantPlay = false;
  /* প্রতি লাইন কতবার (লাইন ধরে মোডে) — না দিলে সেটিংসের "কতবার" */
  const LSTEPS = [0, 1, 2, 3, 4, 5, 7, 10];
  let LS = [], GR = 1; // বাছাই করা লাইন (চলতি দোয়ার) আর সেই দলের রিপিট
  let TR = {}; // নিচের 🔁 বোতামের সাময়িক রিপিট — অন্য লাইনে চাপলে মুছে যায়
  const lreps = (i, j) => { const t = TR[i + ':' + j]; if (t) return t; const v = S.lrep && S.lrep[i + ':' + j]; return v ? v : S.reps; };
  const lrepBtn = (i, j) => { const v = S.lrep && S.lrep[i + ':' + j]; return '<button type="button" class="lrep' + (v ? ' set' : '') + '" data-lrep="' + i + ':' + j + '" aria-label="এই লাইন কতবার">×' + bn(v || S.reps) + '</button>'; };
  /* বাজানো চলার মাঝে কোনো লাইনের "কতবার" বদলালে বাকি পরিকল্পনা নতুন করে — এখনকার লাইন থেকেই চলবে */
  const replan = (i) => { if (!plan || !plan.items.length || plan.items[0].i !== i) return; const cur = plan.items[plan.k]; const items = buildPlan(i); let k = cur ? items.findIndex((x) => x.j === cur.j && x.whole === cur.whole && x.rep === Math.min(cur.rep, x.of)) : -1; if (k < 0 && cur) k = items.findIndex((x) => x.j === cur.j); plan = {items, k: Math.max(0, k)}; status(); };
  /* দোয়ার উৎস — লিংক শুধু সেটিং চালু থাকলে আর নেট থাকলে */
  const refHtml = (d) => { const r = d.ref; if (!r) return ''; const live = S.refLinks && navigator.onLine; const parts = r.more && r.more.length ? r.more : [[r.url, r.txt]];
    const note = r.more && r.txt.indexOf(' — ') > 0 ? '<span>' + esc(r.txt.split(' — ')[0]) + ':</span>' : '';
    return '<div class="ref"><span class="rt">' + (r.t === 'q' ? '📖 কুরআন' : '📜 হাদিস') + '</span>' + note + parts.map((p) => live ? '<a href="' + esc(p[0]) + '" target="_blank" rel="noopener">' + esc(p[1]) + ' ↗</a>' : '<span class="rl">' + esc(p[1]) + '</span>').join('') + (S.refLinks && !navigator.onLine ? '<span class="off">(অফলাইন — লিংক বন্ধ)</span>' : '') + '</div>'; };
  const refChip = (d) => { const r = d.ref; if (!r) return ''; const live = S.refLinks && navigator.onLine, lab = (r.t === 'q' ? '📖 ' : '📜 ') + (r.short || r.txt), tip = esc(r.txt);
    return live ? '<a class="rh" href="' + esc(r.url) + '" target="_blank" rel="noopener" title="' + tip + '">' + esc(lab) + ' ↗</a>' : '<span class="rh" title="' + tip + '">' + esc(lab) + '</span>'; };
  addEventListener('online', () => render()); addEventListener('offline', () => render());
  /* ---------- বাংলা অর্থ পড়ে শোনানো (ফোনের বাংলা কণ্ঠ) — পরীক্ষামূলক: শুধু শনিবার দোয়া ১–২ ---------- */
  const TTS_TEST = (i) => DAYID === 'saturday' && i <= 1;
  let ntts;
  const NTTS = () => { if (ntts !== undefined) return ntts; ntts = null; try { const C = window.Capacitor; if (!C || !(C.isNativePlatform && C.isNativePlatform())) return null; if (C.Plugins && C.Plugins.TextToSpeech && C.Plugins.TextToSpeech.speak) ntts = C.Plugins.TextToSpeech; else if (C.nativePromise && (!C.isPluginAvailable || C.isPluginAvailable('TextToSpeech'))) { const call = (m) => (o) => C.nativePromise('TextToSpeech', m, o || {}); ntts = { speak: call('speak'), stop: call('stop'), isLanguageSupported: call('isLanguageSupported') }; } } catch (e) { ntts = null; } lg('tts', 'native-plugin', ntts ? 'yes' : 'no'); return ntts; };
  const ttsOn = (i) => S.tts && S.tts !== 'off' && TTS_TEST(i) && (!!NTTS() || 'speechSynthesis' in window);
  let ttsBusy = false, bnVoice = null, ttsTok = 0;
  const pickVoice = () => { try { const vs = speechSynthesis.getVoices(); bnVoice = vs.find((v) => /^bn[-_]BD/i.test(v.lang)) || vs.find((v) => /^bn/i.test(v.lang)) || null; } catch (e) {} return bnVoice; };
  if ('speechSynthesis' in window) { pickVoice(); try { speechSynthesis.addEventListener('voiceschanged', pickVoice); } catch (e) {} }
  const ttsCancel = () => { ttsTok++; const n = NTTS(); if (n) { try { n.stop().catch(() => {}); } catch (e) {} } try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch (e) {} };
  const ttsNext = () => { ttsBusy = false; if (!plan) return; plan.k++; const n = plan.items[plan.k]; if (!n) return finishDua(); later(startItem, document.hidden ? 0 : 400); };
  const ttsSkip = (msg, why) => { status(msg); lg('tts', why); later(ttsNext, 1500); };
  const speakItem = (it) => { media.pause(); wantPlay = true; highlight(null, it); renderBar(); ttsCancel(); const tok = ttsTok, mine = () => tok === ttsTok && ttsBusy && plan && plan.items[plan.k] === it;
    const rate = +S.ttsRate || 1, n = NTTS();
    lg('tts', 'dua', duas[it.i].no, 'line', it.j == null ? '-' : it.j + 1, n ? 'native' : 'web');
    status('অর্থ শোনানো হচ্ছে'); ttsBusy = true;
    if (n) {
      const go = (lang) => n.speak({ text: it.tts, lang, rate, pitch: 1, volume: 1, category: 'playback' }).then(() => { if (mine()) ttsNext(); }).catch((e) => { lg('tts-error', 'native', (e && e.message) || e); if (mine()) { ttsBusy = false; ttsSkip('বাংলা কণ্ঠে সমস্যা — ফোনের Settings → Text-to-speech-এ Google ইঞ্জিন ও বাংলা ভাষা বসান', 'native-fail'); } });
      return n.isLanguageSupported({ lang: 'bn-BD' }).then((r) => { if (r && r.supported) return go('bn-BD'); return n.isLanguageSupported({ lang: 'bn' }).then((r2) => { if (r2 && r2.supported) return go('bn'); lg('tts', 'native-no-bn'); return go('bn-BD'); }); }).catch(() => go('bn-BD'));
    }
    if (!('speechSynthesis' in window)) { ttsBusy = false; return ttsSkip('এই ব্রাউজারে কণ্ঠে পড়ার সুবিধা নেই', 'no-speechSynthesis'); }
    const v = pickVoice(); if (!v) lg('tts', 'no-bn-voice-listed, trying lang bn-BD');
    const u = new SpeechSynthesisUtterance(it.tts); u.lang = (v && v.lang) || 'bn-BD'; if (v) u.voice = v; u.rate = rate;
    let started = false; u.onstart = () => { started = true; };
    u.onend = () => { if (mine()) ttsNext(); }; u.onerror = (e) => { lg('tts-error', e.error || ''); if (mine()) { ttsBusy = false; ttsSkip('বাংলা কণ্ঠ পাওয়া যায়নি — Chrome/ফোনে Google বাংলা কণ্ঠ বসান', 'web-error'); } };
    setTimeout(() => { if (!started && mine() && !speechSynthesis.speaking) { lg('tts', 'web-no-start'); ttsBusy = false; ttsCancel(); ttsSkip('বাংলা কণ্ঠ চালু হলো না — ফোনের Settings → Text-to-speech-এ বাংলা বসান', 'web-no-start'); } }, 4000);
    setTimeout(() => { try { speechSynthesis.speak(u); } catch (e) { lg('tts-error', String(e)); } }, 60); };
  const withTts = (i, base) => { if (!ttsOn(i) || S.mode === 'hifz') return base; const d = duas[i], mn = (j) => d.lines[j].mn || '';
    const lineAudio = (j, rep, of) => { const [s, e] = lineSpan(i, j); return {i, j, s, e, rep, of}; };
    if (S.tts === 'only') { const o = []; d.lines.forEach((_, j) => o.push({i, j, tts: mn(j), rep: 1, of: 1})); return o; }
    if (S.tts === 'dua') { const o = base.slice(); o.push({i, j: null, tts: d.lines.map((_, j) => mn(j)).join(' '), rep: 1, of: 1}); return o; }
    const o = []; base.forEach((it, k) => { if (it.j == null) { d.lines.forEach((_, j) => { o.push(lineAudio(j, it.rep, it.of)); o.push({i, j, tts: mn(j), rep: it.rep, of: it.of}); }); }
      else { o.push(it); const nx = base[k + 1]; if (!nx || nx.j !== it.j) o.push({i, j: it.j, tts: mn(it.j), rep: 1, of: 1}); } }); return o; };
  const buildPlan = (i) => withTts(i, buildPlan0(i));
  window.__mmPlan = () => plan && plan.items.map((x) => (x.j == null ? 'W' : x.j + 1) + (x.grp ? 'g' : '') + x.rep + '/' + x.of).join(' ') + ' @' + plan.k;
  const grpOn = (i) => i === S.dua && LS.length > 0 && S.mode !== 'hifz';
  const withGroup = (i, perLine) => { const out = [], d = duas[i], G = LS.slice().sort((a, b) => a - b); d.lines.forEach((_, j) => { if (G.includes(j)) { if (j !== G[0]) return; for (let q = 1; q <= GR; q++) G.forEach((g) => { const [s, e] = lineSpan(i, g); out.push({i, j: g, s, e, rep: q, of: GR, grp: true}); }); } else perLine(j, out); }); return out; };
  const buildPlan0 = (i) => { if (grpOn(i)) { const g = []; const R = S.mode === 'line' ? 1 : S.reps; for (let r = 1; r <= R; r++) withGroup(i, (j, out) => { const [s, e] = lineSpan(i, j), n = S.mode === 'line' ? lreps(i, j) : (TR[i + ':' + j] || 1); for (let q = 1; q <= n; q++) out.push({i, j, s, e, rep: q, of: n, dr: r}); }).forEach((x) => g.push(Object.assign(x, {dr: x.dr || r}))); if (S.mode === 'line') { const [s, e] = duaSpan(i); for (let r = 1; r <= S.whole; r++) g.push({i, j: null, s, e, rep: r, of: S.whole, whole: true}); } return g; }
    const out = [], d = duas[i];
    if (S.mode === 'line') { d.lines.forEach((_, j) => { const [s, e] = lineSpan(i, j), n = lreps(i, j); for (let r = 1; r <= n; r++) out.push({i, j, s, e, rep: r, of: n}); });
      const [s, e] = duaSpan(i); for (let r = 1; r <= S.whole; r++) out.push({i, j: null, s, e, rep: r, of: S.whole, whole: true}); }
    else if (S.mode === 'hifz') { d.lines.forEach((_, j) => { const [s, e] = lineSpan(i, j); out.push({i, j, s, e, rep: 1, of: 1, wait: true}); }); }
    else if (d.lines.some((_, j) => (TR[i + ':' + j] || 1) > 1)) { for (let r = 1; r <= S.reps; r++) d.lines.forEach((_, j) => { const [s, e] = lineSpan(i, j), n = TR[i + ':' + j] || 1; for (let q = 1; q <= n; q++) out.push({i, j, s, e, rep: q, of: n, dr: r}); }); }
    else { const [s, e] = duaSpan(i); for (let r = 1; r <= S.reps; r++) out.push({i, j: null, s, e, rep: r, of: S.reps}); }
    return out; };
  const playDua = (i, fromLine) => { if (i !== S.dua) { TR = {}; LS = []; GR = 1; } S.dua = i; save(); plan = {items: buildPlan(i), k: 0}; if (fromLine == null && grpOn(i)) { const g0 = Math.min(...LS), k = plan.items.findIndex((x) => x.j === g0); if (k >= 0) plan.k = k; } if (fromLine != null && S.mode !== 'dua') { const k = plan.items.findIndex((x) => x.j === fromLine); if (k >= 0) plan.k = k; } startItem(); render(); };
  const startItem = () => { clearTimeout(timer); pend = null; const it = plan && plan.items[plan.k]; if (!it) return finishDua(); if (it.tts != null) return speakItem(it); wantPlay = true; media.playbackRate = S.speed; const x = Math.max(0, it.s + OFF() - (it.j ? LEAD : 0.02)); status(); meta(it);
    /* পর্দা খোলা: চুপ করে একটু আগে থেকে চালু, ঠিক শুরুতে আওয়াজ — যাতে আগের অংশের কোনো টুকরো (ফোনের বাফার) না বাজে।
       পর্দা বন্ধ/পেছনে: থামানো ছাড়াই সরাসরি লাফ, যাতে লক স্ক্রিনে প্লেয়ার বন্ধ না হয়। */
    if (document.hidden && !media.paused) { lg('jump(bg)', 'dua', duas[it.i].no, 'target', x.toFixed(2)); unmuteAt = 0; media.muted = false; media.currentTime = x; return; }
    lg('start', 'dua', duas[it.i].no, 'line', it.j == null ? '-' : it.j + 1, 'target', x.toFixed(2), 'end', (it.e + OFF()).toFixed(2)); unmuteAt = 0; media.muted = false; media.currentTime = x; /* চুপ-করে-শুরু বাদ: Android-এ এতে ২–৩ সে. পর আওয়াজ থেমে আবার চলত */
    const go = () => { const p = media.play(); if (p && p.catch) p.catch(() => {}); };
    if (media.seeking) media.addEventListener('seeked', go, {once: true}); else go(); };
  let hifzWait = false; const hifzShow = (on) => { hifzWait = on; $('#hifz').hidden = !on; };
  const finishItem = () => { const cur = plan.items[plan.k]; lg('itemEnd', cur ? 'e=' + (cur.e + OFF()).toFixed(2) : ''); if (!(document.hidden && !(cur && cur.wait))) media.pause(); if (cur && cur.wait) { wantPlay = false; hifzShow(true); const d = duas[cur.i]; $('#hifzMsg').textContent = 'এবার আপনি বলুন — লাইন ' + bn(cur.j + 1) + '/' + bn(d.lines.length); status('আপনার পালা'); renderBar(); return; } plan.k++; const it = plan.items[plan.k]; if (!it) return finishDua(); if (document.hidden) return startItem(); status('বিরতি'); later(startItem, S.gap * 1000); };
  const nextInQueue = (i, dir) => { const q = queue(); let k = q.indexOf(i);
    if (k < 0) { const after = q.filter((x) => (dir > 0 ? x > i : x < i)); return after.length ? (dir > 0 ? after[0] : after[after.length - 1]) : null; }
    k += dir; if (k >= q.length) return S.listLoop ? q[0] : null; if (k < 0) return S.listLoop ? q[q.length - 1] : q[0]; return q[k]; };
  const finishDua = () => { const H = document.hidden, i = S.dua; const n = S.after === 'next' ? nextInQueue(i, 1) : S.after === 'loop' ? i : null; if (!(H && n != null)) { wantPlay = false; media.pause(); }
    if (n != null) { if (S.after === 'next') status(n <= i ? 'তালিকা আবার শুরু' : 'পরের দোয়া'); if (H) return playDua(n); later(() => playDua(n), S.gap * 1000); return; }
    plan = null; status('শেষ'); render(); };
  let unmuteAt = 0, pend = null;
  const later = (f, ms) => { clearTimeout(timer); pend = f; timer = setTimeout(() => { pend = null; f(); }, ms); };
  const unmute = () => { if (unmuteAt && media.muted && media.currentTime >= unmuteAt - 0.01) { media.muted = false; lg('unmute', 'at', unmuteAt.toFixed(2)); unmuteAt = 0; } else if (unmuteAt && media.muted && !media.paused) setTimeout(unmute, 10); };
  const check = () => { unmute(); const it = plan && plan.items[plan.k]; if (it && wantPlay && !media.paused && media.currentTime >= it.e + OFF()) { finishItem(); return true; } return false; };
  /* পর্দা বন্ধ / অ্যাপ পেছনে থাকলে requestAnimationFrame চলে না — তাই টাইমার + timeupdate দিয়েও দোয়ার শেষ ধরা হয় */
  const sched = () => { clearTimeout(endT); const it = plan && plan.items[plan.k]; if (!it || media.paused || !wantPlay) return; const ms = (it.e + OFF() - media.currentTime) / (media.playbackRate || 1) * 1000; endT = setTimeout(() => { if (!check()) sched(); }, Math.max(15, Math.min(ms - 10, 5000))); };
  let nms; const NMS = () => { if (!S.nms) return null; if (nms !== undefined) return nms; nms = null; try { const C = window.Capacitor; if (!C || !(C.isNativePlatform && C.isNativePlatform())) return null; const P = C.Plugins && C.Plugins.MediaSession; if (P && P.setPlaybackState) nms = P; else if (C.nativePromise && (!C.isPluginAvailable || C.isPluginAvailable('MediaSession'))) { const call = (m) => (o) => C.nativePromise('MediaSession', m, o || {}); nms = { setMetadata: call('setMetadata'), setPlaybackState: call('setPlaybackState'), setActionHandler: (o, cb) => C.nativeCallback('MediaSession', 'setActionHandler', o, cb) }; } } catch (e) { nms = null; } lg('nms', nms ? 'yes' : 'no'); return nms; };
  let nmsState = '', nmsTitle = '';
  const nmsSync = (it) => { const n = NMS(); if (!n) return; const st = plan && wantPlay ? 'playing' : (plan ? 'paused' : 'none'); try { if (it) { const t = UNIT + ' ' + duas[it.i].no + (it.j != null ? ' · লাইন ' + bn(it.j + 1) : ''); if (t !== nmsTitle) { nmsTitle = t; n.setMetadata({ title: t, artist: DMETA ? DMETA[1] + ' · ' + DMETA[2] : '', album: 'মুনাজাতে মাকবূল' }).catch(() => {}); } } if (st !== nmsState) { nmsState = st; n.setPlaybackState({ playbackState: st }).catch(() => {}); } } catch (e) { lg('nms-error', String(e)); } };
  const meta = (it) => { nmsSync(it); if (!('mediaSession' in navigator) || !it) return; try { navigator.mediaSession.metadata = new MediaMetadata({title: UNIT + ' ' + duas[it.i].no + (it.j != null ? ' · লাইন ' + bn(it.j + 1) : ''), artist: DMETA ? DMETA[1] + ' · ' + DMETA[2] : '', album: 'মুনাজাতে মাকবূল', artwork: [{src: 'icon.svg', sizes: '512x512', type: 'image/svg+xml'}]}); } catch (e) {} };
  const tick = () => { const t = media.currentTime, it = plan && plan.items[plan.k]; if (check()) return; highlight(it && it.j != null ? null : t - OFF(), it); if (!media.paused && !document.hidden) requestAnimationFrame(tick); };
  media.addEventListener('play', () => requestAnimationFrame(tick)); media.addEventListener('seeked', () => { tick(); sched(); }); media.addEventListener('playing', () => { sched(); unmute(); }); media.addEventListener('timeupdate', () => { if (!check() && document.hidden) highlight(null, plan && plan.items[plan.k]); }); media.addEventListener('ratechange', sched);
  document.addEventListener('visibilitychange', () => { if (!document.hidden && !media.paused) requestAnimationFrame(tick);
    /* বিরতির মাঝে পর্দা বন্ধ হলে অপেক্ষা না করে এখনই পরেরটা চালু — পেছনে থেকে নতুন করে শুরু করতে ফোন বাধা দিতে পারে */
    if (document.hidden && pend) { clearTimeout(timer); const f = pend; pend = null; f(); } });
  const hifzGo = (again) => { if (!plan) return; hifzShow(false); if (!again) plan.k++; startItem(); };
  const stop = () => { ttsBusy = false; ttsCancel(); hifzShow(false); clearTimeout(timer); pend = null; unmuteAt = 0; media.muted = false; wantPlay = false; media.pause(); plan = null; status(); render(); };
  const startList = () => { const q = queue(); playDua(q.includes(S.dua) ? S.dua : q[0]); };
  const toggle = () => { if (!media.src) return; if (hifzWait) return hifzGo(false); if (ttsBusy) { ttsBusy = false; ttsCancel(); wantPlay = false; status('থামানো'); renderBar(); return; } if (pend) { clearTimeout(timer); pend = null; wantPlay = false; status('থামানো'); renderBar(); return; } if (plan && wantPlay && !media.paused) { clearTimeout(timer); media.pause(); media.muted = false; wantPlay = false; status('থামানো'); } else if (plan) { const it = plan.items[plan.k], t = media.currentTime - OFF(); if (!it || it.tts != null || t < it.s - 0.2 || t >= it.e - 0.05) { startItem(); } else { wantPlay = true; media.muted = false; const p = media.play(); if (p && p.catch) p.catch(() => {}); status(); } } else startList(); renderBar(); };
  /* ---------- দেখানো ---------- */
  const status = (msg) => { const it = plan && plan.items[plan.k], el = $('#status'); if (!el) return;
    if (!it) { el.textContent = msg || 'থামানো'; renderBar(); return; }
    const d = duas[it.i], q = queue(), qk = q.indexOf(it.i);
    el.textContent = (S.sel.length && qk >= 0 ? 'তালিকা ' + bn(qk + 1) + '/' + bn(q.length) + ' · ' : '') + UNIT + ' ' + d.no + (it.j != null ? ' · লাইন ' + bn(it.j + 1) + '/' + bn(d.lines.length) : it.whole ? ' · পুরোটা' : '') + ' · ' + bn(it.rep) + '/' + bn(it.of) + ' বার' + (msg ? ' · ' + msg : ''); renderBar(); };
  let lastHL = '';
  const highlight = (t, it) => { let hi = -1, hj = -1; if (t == null && it) { hi = it.i; hj = it.j; } else if (t != null) { const tt = t + 0.05; duas.forEach((d, i) => d.lines.forEach((L, j) => { const [s, e] = lineSpan(i, j); if (tt >= s && tt < e) { hi = i; hj = j; } })); }
    const k = hi + ':' + hj; if (k === lastHL) return; lastHL = k; $$('.ln.on').forEach((e) => e.classList.remove('on'));
    const el = $('#l-' + hi + '-' + hj); if (el) { el.classList.add('on'); if (wantPlay) el.scrollIntoView({block: 'center', behavior: 'smooth'}); } };
  const renderBar = () => { try { drawRpt(); } catch (e) {} nmsSync(plan && plan.items[plan.k]); const b = $('#play'); if (b) { const on = plan && wantPlay && !media.paused; b.setAttribute('aria-label', on ? 'থামান' : 'চালান'); b.innerHTML = on ? '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>' : '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>'; } };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'})[c]);
  const renderPick = () => { const n = S.sel.length;
    $('#pickInfo').textContent = n ? bn(n) + 'টি দোয়া বাছাই — শুধু এগুলোই বাজবে' : 'কিছু বাছাই নেই — সব দোয়া ক্রমে বাজবে';
    $('#pickAll').setAttribute('aria-pressed', String(n === duas.length)); $('#pickNone').disabled = !n; };
  try { if (!localStorage.getItem('mm_vid_off1')) { S.video = false; localStorage.setItem('mm_vid_off1', '1'); } if (!localStorage.getItem('mm_ar_on1')) { S.hideAr = false; localStorage.setItem('mm_ar_on1', '1'); } } catch (e) {}
  const RSTEPS = [1, 2, 3, 5, 7, 10];
  const drawRpt = () => { const b = $('#rptBtn'); if (!b) return; if (LS.length) { b.querySelector('small').textContent = GR > 1 ? bn(GR) : ''; b.style.opacity = GR > 1 ? '1' : '.65'; b.classList.add('grp'); return; } b.classList.remove('grp'); const it = plan && plan.items[plan.k]; let n = 1;
    if (it && S.mode !== 'hifz') { let j = it.j; if (j == null) { const t = media.currentTime - OFF(); j = duas[it.i].lines.findIndex((L, x) => t < lineSpan(it.i, x)[1]); } if (j >= 0) n = S.mode === 'line' ? lreps(it.i, j) : (TR[it.i + ':' + j] || 1); }
    b.querySelector('small').textContent = n > 1 ? bn(n) : ''; b.style.opacity = n > 1 ? '1' : '.65'; };
  const drawAfter = () => { const b = $('#afterBtn'); if (!b) return; const a = S.after || 'next';
    b.innerHTML = (a === 'stop' ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h11M13 8l4 4-4 4M20 5v14"/></svg>' : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v4h4"/></svg>') + (a === 'loop' ? '<small>১</small>' : '');
    b.setAttribute('aria-label', a === 'next' ? 'দোয়া শেষে: পরেরটা' : a === 'loop' ? 'দোয়া শেষে: এটাই আবার' : 'দোয়া শেষে: থামবে'); b.style.opacity = a === 'next' ? '.65' : '1'; };
  const render = () => { applyLook(); drawAfter(); drawRpt(); document.body.classList.toggle('m-line', S.mode === 'line');
    document.documentElement.style.setProperty('--ar', S.font + 'px');
    document.body.classList.toggle('no-bn', !S.showBn); document.body.classList.toggle('show-mn', S.showMeaning); document.body.classList.toggle('hide-ar', S.hideAr); document.body.classList.toggle('no-video', !S.video);
    $$('[data-tg]').forEach((b) => b.setAttribute('aria-pressed', String(!!S[b.dataset.tg])));
    $$('[data-set]').forEach((b) => { const [k, v] = b.dataset.set.split(':'); b.setAttribute('aria-pressed', String(String(S[k]) === v)); });
    $('#reps').textContent = bn(S.reps) + '×'; $('#gap').textContent = bn(S.gap) + ' সে.'; $('#whole').textContent = bn(S.whole) + '×'; $('#wholeRow').hidden = S.mode !== 'line';
    renderPick();
    $('#list').innerHTML = duas.map((d, i) => { const open = i === S.dua, n = nd(i), sel = isSel(i);
      return '<article class="dua' + (open ? ' open' : '') + (sel ? ' sel' : '') + '" id="d-' + i + '"><div class="dhw"><button class="pick" data-pick="' + i + '" role="checkbox" aria-checked="' + sel + '" aria-label="দোয়া ' + esc(d.no) + ' তালিকায় রাখুন"><span class="box">' + (sel ? '✓' : '') + '</span></button><button class="dh" data-dua="' + i + '"><span class="no">' + esc(d.no) + '</span><span class="first" lang="ar" dir="rtl">' + esc(d.lines[0].ar) + '</span><span class="dur">' + bn(Math.round(d.e - d.s)) + ' সে.</span></button>' + (d.lines.some((L) => L.mn) ? '<button class="mb" data-mean="' + i + '" aria-label="পুরো বাংলা অর্থ" title="পুরো বাংলা অর্থ">অর্থ</button>' : '') + refChip(d) + '<button class="star' + (isFav(i) ? ' on' : '') + '" data-fav="' + i + '" aria-label="প্রিয়" aria-pressed="' + isFav(i) + '">' + (isFav(i) ? '★' : '☆') + '</button></div>' +
        (open ? '<div class="lines">' + d.lines.map((L, j) => '<div class="ln' + (LS.includes(j) ? ' lsel' : '') + '" id="l-' + i + '-' + j + '" data-line="' + j + '"><button type="button" class="lpick" data-lsel="' + j + '" role="checkbox" aria-checked="' + LS.includes(j) + '" aria-label="লাইন ' + bn(j + 1) + ' বাছাই"><span class="box">' + (LS.includes(j) ? '✓' : '') + '</span></button>' + lrepBtn(i, j) + '<div class="ar" lang="ar" dir="rtl">' + esc(L.ar) + '</div><div class="bn">' + esc(L.bn) + '</div><div class="mn">' + esc(L.mn || 'অর্থ এখনো যোগ হয়নি') + '</div></div>').join('') +
          (LS.length ? '<div class="lgrp"><span>বাছাই ' + bn(LS.length) + 'টি লাইন · একসাথে ' + (GR > 1 ? bn(GR) + ' বার' : 'রিপিট নেই — নিচের 🔁 চাপুন') + '</span><button type="button" data-lsel="x">বাছাই মুছুন</button></div>' : (d.lines.length > 1 ? '<div class="lgrp hint"><span>লাইনের বাঁ পাশের ☐ দিয়ে কয়েকটা লাইন বেছে 🔁 চাপলে সেগুলো একসাথে রিপিট হবে</span></div>' : '')) +
          '<div class="nudge"><span>সময় ঠিক করুন</span><button data-nudge="' + i + ':0:-0.25">শুরু −</button><button data-nudge="' + i + ':0:0.25">শুরু +</button><button data-nudge="' + i + ':1:-0.25">শেষ −</button><button data-nudge="' + i + ':1:0.25">শেষ +</button><small>' + (n[0] || n[1] ? 'শুরু ' + n[0] + ' / শেষ ' + n[1] + ' সে.' : '') + '</small></div></div>' : '') + '</article>'; }).join('');
    lastHL = ''; const ci = plan && plan.items[plan.k]; highlight(ci && ci.j != null ? null : (media.currentTime || 0), ci); status(); };
  /* ---------- ইভেন্ট ---------- */
  document.addEventListener('click', (ev) => { const b = ev.target.closest('button'); if (!b) return; const ds = b.dataset;
    if (ds.lsel != null) { if (ds.lsel === 'x') { LS = []; GR = 1; } else { const j = +ds.lsel; LS = LS.includes(j) ? LS.filter((x) => x !== j) : [...LS, j]; if (!LS.length) GR = 1; } TR = {};
      const it = plan && plan.items[plan.k]; if (it && it.i === S.dua) { const j = it.j != null ? it.j : Math.max(0, duas[it.i].lines.findIndex((L, x) => (media.currentTime - OFF()) < lineSpan(it.i, x)[1])); const items = buildPlan(it.i); let k = items.findIndex((x) => x.j === j); if (k < 0) k = items.findIndex((x) => x.j == null); plan = {items, k: Math.max(0, k)}; try { sched(); } catch (e) {} }
      render(); drawRpt(); return; }
    if (ds.pick != null) { const i = +ds.pick; S.sel = isSel(i) ? S.sel.filter((x) => x !== i) : [...S.sel, i]; save(); render(); return; }
    if (ds.fav != null) { const i = +ds.fav, f = favs(); S.fav[DAYID] = f.includes(i) ? f.filter((x) => x !== i) : [...f, i].sort((x, y) => x - y); save(); render(); if ($('#favBtn').getAttribute('aria-pressed') === 'true') showFavs(); return; }
    if (b.id === 'pickFav') { if (!favs().length) { $('#pickInfo').textContent = 'এই দিনে কোনো প্রিয় দোয়া নেই — দোয়ার পাশে ☆ চাপুন'; return; } S.sel = [...favs()]; save(); render(); return; }
    if (b.id === 'favBtn') { const on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', String(on)); $('#q').value = ''; if (on) showFavs(); else $('#qres').innerHTML = ''; return; }
    if (ds.go) { const [id, i] = ds.go.split(':'); goTo(id, +i); return; }
    if (b.id === 'hifzNext') return hifzGo(false);
    if (b.id === 'hifzAgain') return hifzGo(true);
    if (b.id === 'pickAll') { S.sel = duas.map((_, i) => i); save(); render(); return; }
    if (b.id === 'pickNone') { S.sel = []; save(); render(); return; }
    if (b.id === 'pickPlay') { if (!media.src) return; stop(); startList(); return; }
    if (ds.dua != null) { const i = +ds.dua; if (i !== S.dua) { LS = []; GR = 1; TR = {}; stop(); S.dua = i; save(); render(); $('#d-' + i).scrollIntoView({block: 'start', behavior: 'smooth'}); } if (media.src) playDua(i); return; }
    if (ds.tg) { S[ds.tg] = !S[ds.tg]; save(); render(); return; }
    if (ds.off != null) { if (!S.off) S.off = {}; const v = +ds.off; S.off[DAYID] = v === 0 ? 0 : Math.round(((+S.off[DAYID] || 0) + v) * 100) / 100; save(); offInfo(); if (plan) playDua(S.dua); return; }
    if (ds.set) { const [k, v] = ds.set.split(':'); S[k] = isNaN(+v) ? v : +v; save(); if (plan && (k === 'mode' || k === 'speed' || k === 'tts')) playDua(S.dua); else render(); return; }
    if (ds.step) { const [k, dv] = ds.step.split(':'), lim = {reps: [1, 33], gap: [0, 30], whole: [0, 11]}[k]; S[k] = Math.min(lim[1], Math.max(lim[0], S[k] + +dv)); save(); render(); return; }
    if (ds.nudge) { const [i, w, dv] = ds.nudge.split(':'), n = (S.nudge[i] = S.nudge[i] || [0, 0]); n[+w] = Math.round((n[+w] + +dv) * 100) / 100; save(); render(); const [s, e] = duaSpan(+i); if (media.src) media.currentTime = +w === 0 ? s : Math.max(s, e - 3); return; }
    if (b.id === 'play') return toggle();
    if (b.id === 'prev') { const n = nextInQueue(S.dua, -1); return playDua(n == null ? S.dua : n); }
    if (b.id === 'next') { const n = nextInQueue(S.dua, 1); return n == null ? stop() : playDua(n); }
    if (ds.lrep) { if (!S.lrep) S.lrep = {}; const k = ds.lrep, cur = S.lrep[k] || 0, n = LSTEPS[(LSTEPS.indexOf(cur) + 1) % LSTEPS.length]; if (n) S.lrep[k] = n; else delete S.lrep[k]; save(); b.outerHTML = lrepBtn(+k.split(':')[0], +k.split(':')[1]); replan(+k.split(':')[0]); if (S.mode !== 'line') status('প্রতি লাইনের "কতবার" কাজ করে "লাইন ধরে" মোডে'); return; }
    if (b.id === 'logCopy') { const t = logText(); (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => { b.textContent = 'কপি হয়েছে ✓'; }).catch(() => { const r = document.createRange(); r.selectNodeContents($('#logBox')); const s = getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent = 'বাছাই করা হলো — কপি করুন'; }); return; }
    if (b.id === 'logClear') { LOG.length = 0; try { localStorage.removeItem(LOGK); } catch (e) {} $('#logBox').textContent = ''; return; }
    if (ds.mean != null) { drawMean(+ds.mean, 'one'); $('#mean').hidden = false; return; } if (b.id === 'meanClose') { mStop(); $('#mean').hidden = true; return; }
    if (ds.resume != null) { const r = $('#resume'); if (r) r.remove(); if (ds.resume !== 'x') playDua(+ds.resume); return; }
    if (ds.share != null) { shareDua(+ds.share, b); return; }
    if (ds.mspk) { mSay(ds.mspk); return; }
    if (ds.sh) { shareTo(ds.sh, meanIdx, b); return; } if (ds.mmode) { mStop(); drawMean(null, ds.mmode); return; } if (ds.mpick != null) { mStop(); drawMean(+ds.mpick, 'one'); $('#meanBody').parentNode.scrollTop = 0; return; }
    if (ds.mnav) { mStop(); const M = MEANS(), k = M.indexOf(meanIdx) + +ds.mnav; if (M[k] != null) { drawMean(M[k], 'one'); $('#meanBody').parentNode.scrollTop = 0; } return; }
    if (b.id === 'aboutBtn') { drawAbout(); $('#about').hidden = false; return; } if (b.id === 'aboutClose') { $('#about').hidden = true; return; }
    if (b.id === 'stopBtn') { mStop(); stop(); return; }
    if (b.id === 'rptBtn' && LS.length && S.mode !== 'hifz') { const ci = RSTEPS.indexOf(GR); GR = RSTEPS[(ci + 1) % RSTEPS.length] || 1; TR = {}; lg('rpt', 'group', LS.join(','), GR);
      const it = plan && plan.items[plan.k]; if (it && it.i === S.dua) { const j = it.j != null ? it.j : Math.max(0, duas[it.i].lines.findIndex((L, x) => (media.currentTime - OFF()) < lineSpan(it.i, x)[1])); const items = buildPlan(it.i); let k = items.findIndex((x) => x.j === j && (!x.grp || x.rep === 1)); plan = {items, k: Math.max(0, k)}; try { sched(); } catch (e) {} }
      status('বাছাই করা ' + bn(LS.length) + 'টি লাইন একসাথে: ' + (GR > 1 ? bn(GR) + ' বার' : 'একবার (রিপিট নেই)')); drawRpt(); render(); return; }
    if (b.id === 'rptBtn') { const it = plan && plan.items[plan.k]; if (!it || S.mode === 'hifz') { status('দোয়া চলার সময় চাপুন — যে লাইন চলছে সেটা কতবার হবে ঠিক করে'); return; }
      const i = it.i; let j = it.j; if (j == null) { const t = media.currentTime - OFF(); j = duas[i].lines.findIndex((L, x) => t < lineSpan(i, x)[1]); if (j < 0) j = duas[i].lines.length - 1; }
      if (!S.lrep) S.lrep = {}; const key = i + ':' + j, LM = S.mode === 'line', cur = LM ? lreps(i, j) : (TR[key] || 1), ci = RSTEPS.indexOf(cur), n = ci < 0 ? (RSTEPS.find((x) => x > cur) || 1) : RSTEPS[(ci + 1) % RSTEPS.length]; TR = {}; if (n > 1 || LM) TR[key] = n;
      const dr = it.dr || it.rep || 1, items = buildPlan(i); let k = items.findIndex((x) => x.j === j && (x.dr || 1) === (S.mode === 'line' ? 1 : Math.min(dr, S.reps)) && x.rep === (it.j === j ? Math.min(it.rep, x.of) : 1));
      if (k < 0) k = items.findIndex((x) => x.j === j); if (k < 0) k = items.findIndex((x) => x.j == null); plan = {items, k: Math.max(0, k)}; try { sched(); } catch (e) {}
      lg('rpt', duas[i].no, 'line', j + 1, n); status(UNIT + ' ' + duas[i].no + ' · লাইন ' + bn(j + 1) + ': ' + (n > 1 ? bn(n) + ' বার' : 'একবার (রিপিট নেই)')); drawRpt(); render(); return; }
    if (b.id === 'sheetBtn2') { $('#sheet').hidden = false; return; }
    if (b.id === 'sheetBtn') { $('#sheet').hidden = false; return; } if (b.id === 'sheetClose') { $('#sheet').hidden = true; return; }
    if (b.id === 'addFile' || b.id === 'addFile2') { $('#file').value = ''; $('#file').click(); return; } });
  const duaText = (i) => { const d = duas[i], r = d.ref; return UNIT + ' ' + d.no + ' — ' + day.title + '\n\n' + d.lines.map((L) => L.ar + (L.bn ? '\n' + L.bn : '') + (L.mn ? '\n' + L.mn : '')).join('\n\n') + (r ? '\n\nউৎস: ' + r.txt : '') + '\n\n— মুনাজাতে মাকবূল'; };
  const SITE = 'https://sil-cbs.github.io/shopno-kuthir/munajat/';
  const nShare = () => { try { const C = window.Capacitor; if (C && C.isNativePlatform && C.isNativePlatform() && C.nativePromise && (!C.isPluginAvailable || C.isPluginAvailable('Share'))) return (o) => C.nativePromise('Share', 'share', o); } catch (e) {} return null; };
  const openOut = (u) => { const a = document.createElement('a'); a.href = u; a.target = '_blank'; a.rel = 'noopener'; document.body.appendChild(a); a.click(); a.remove(); };
  const copyText = (t, b) => { const ok = () => { if (b) { const o = b.textContent; b.textContent = 'কপি হয়েছে ✓'; setTimeout(() => { b.textContent = o; }, 1800); } }; (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(ok).catch(() => { const x = document.createElement('textarea'); x.value = t; document.body.appendChild(x); x.select(); try { document.execCommand('copy'); ok(); } catch (e) {} x.remove(); }); };
  const shareSheet = (t, title, b) => { const n = nShare(); if (n) return n({ title, text: t, dialogTitle: 'শেয়ার করুন' }).catch((e) => { lg('share-error', (e && e.message) || e); copyText(t, b); }); if (navigator.share) return navigator.share({ title, text: t }).catch(() => {}); copyText(t, b); status('এই ব্রাউজারে শেয়ার নেই — লেখা কপি হয়েছে'); };
  const shareTo = (how, i, b) => { const t = duaText(i), title = UNIT + ' ' + duas[i].no; lg('share', how, duas[i].no);
    if (how === 'wa') return openOut('https://wa.me/?text=' + encodeURIComponent(t));
    if (how === 'tg') return openOut('https://t.me/share/url?url=' + encodeURIComponent(SITE) + '&text=' + encodeURIComponent(t));
    if (how === 'copy') return copyText(t, b);
    return shareSheet(t, title, b); };
  const shareDua = (i, b) => shareTo('all', i, b);
  const MEANS = () => duas.map((d, i) => i).filter((i) => duas[i].lines.some((L) => L.mn));
  let meanIdx = 0, meanMode = 'one';
  const mText = (d) => d.lines.map((L) => L.mn || '').filter(Boolean).join(' ');
  /* অর্থ পাতা: শুধু বাংলা অর্থ পড়ে শোনানো (একটা, অথবা ক্রমে সব) */
  let mSpk = '', mTok = 0;
  const speakText = (text) => new Promise((res, rej) => { const rate = +S.ttsRate || 1, n = NTTS();
    if (n) { const go = (lang) => n.speak({ text, lang, rate, pitch: 1, volume: 1, category: 'playback' }).then(res, rej); return n.isLanguageSupported({ lang: 'bn-BD' }).then((r) => { if (!(r && r.supported)) lg('tts', 'native-no-bn'); go('bn-BD'); }).catch(() => go('bn-BD')); }
    if (!('speechSynthesis' in window)) return rej(new Error('no-speech'));
    const v = pickVoice(), u = new SpeechSynthesisUtterance(text); u.lang = (v && v.lang) || 'bn-BD'; if (v) u.voice = v; u.rate = rate; let started = false;
    u.onstart = () => { started = true; }; u.onend = () => res(); u.onerror = (e) => rej(new Error(e.error || 'speech-error'));
    try { speechSynthesis.cancel(); } catch (e) {} setTimeout(() => { try { speechSynthesis.speak(u); } catch (e) { rej(e); } }, 60);
    setTimeout(() => { if (!started && !speechSynthesis.speaking) rej(new Error('no-start')); }, 5000); });
  const mStop = () => { if (!mSpk) return; mSpk = ''; mTok++; ttsCancel(); };
  const mSay = (mode) => { if (mSpk) { const was = mSpk; mStop(); drawMean(); if (was === mode) return; } if (wantPlay) toggle(); mSpk = mode; const tok = ++mTok;
    const run = () => { if (tok !== mTok) return; drawMean(meanIdx, 'one'); const d = duas[meanIdx]; lg('tts', 'mean', d.no, mode);
      speakText(mText(d)).then(() => { if (tok !== mTok) return; if (mode === 'all') { const M = MEANS(), k = M.indexOf(meanIdx); if (M[k + 1] != null) { meanIdx = M[k + 1]; return setTimeout(run, 700); } } mSpk = ''; drawMean(); })
        .catch((e) => { if (tok !== mTok) return; lg('tts-error', 'mean', (e && e.message) || e); mSpk = ''; drawMean(); const m = $('#mspkMsg'); if (m) m.textContent = 'বাংলা কণ্ঠ পাওয়া যায়নি — ফোনের Settings → Text-to-speech-এ "Speech Services by Google" আর ভাষা বাংলা দিন'; }); };
    run(); };
  function drawMean(i, mode) { if (i != null) meanIdx = i; if (mode) meanMode = mode; const M = MEANS(), k = M.indexOf(meanIdx), d = duas[meanIdx];
    const tabs = '<div class="mtabs"><button type="button" data-mmode="one" aria-pressed="' + (meanMode === 'one') + '">একটা করে</button><button type="button" data-mmode="list" aria-pressed="' + (meanMode === 'list') + '">' + esc(DMETA ? DMETA[1] : '') + '-এর সব অর্থ (' + bn(M.length) + ')</button></div>';
    if (meanMode === 'list') { $('#meanTitle').textContent = (DMETA ? DMETA[1] + ' · ' + DMETA[2] : '') + ' — সব অর্থ';
      $('#meanBody').innerHTML = tabs + '<button type="button" class="mspk" data-mspk="all">🔊 সব অর্থ ক্রমে শুনুন</button><div class="mlist">' + M.map((j) => '<button type="button" class="mli' + (j === meanIdx ? ' cur' : '') + '" data-mpick="' + j + '"><span class="mno">' + esc(duas[j].no) + '</span><span class="mtx">' + esc(mText(duas[j])) + '</span></button>').join('') + '</div>';
      const c = $('#meanBody .mli.cur'); if (c) setTimeout(() => c.scrollIntoView({ block: 'center' }), 30); return; }
    $('#meanTitle').textContent = UNIT + ' ' + d.no + ' — পুরো অর্থ';
    const nav = '<div class="mnav"><button type="button" data-mnav="-1"' + (k <= 0 ? ' disabled' : '') + '>◀ আগের</button><span>' + bn(k + 1) + ' / ' + bn(M.length) + '</span><button type="button" data-mnav="1"' + (k >= M.length - 1 ? ' disabled' : '') + '>পরের ▶</button></div>';
    const spk = '<div class="mspkrow"><button type="button" class="mspk' + (mSpk === 'one' ? ' on' : '') + '" data-mspk="one">' + (mSpk === 'one' ? '⏹ থামান' : '🔊 অর্থ শুনুন') + '</button><button type="button" class="mspk' + (mSpk === 'all' ? ' on' : '') + '" data-mspk="all">' + (mSpk === 'all' ? '⏹ থামান' : '🔊 এখান থেকে সব') + '</button></div><div id="mspkMsg" class="mspkmsg"></div>';
    $('#meanBody').innerHTML = tabs + nav + spk + '<p class="mfull' + (mSpk ? ' speaking' : '') + '">' + esc(mText(d)) + '</p>' + (d.ref ? refHtml(d) : '')
      + '<div class="mshare"><span>শেয়ার (আরবি + উচ্চারণ + অর্থ):</span><div><button type="button" data-sh="wa" class="wa">WhatsApp</button><button type="button" data-sh="tg" class="tg">Telegram</button><button type="button" data-sh="all" class="ms">Messenger / অন্য অ্যাপ</button><button type="button" data-sh="copy">📋 কপি</button></div></div>' + nav; }
  $('#mean').addEventListener('click', (ev) => { if (ev.target.id === 'mean') { mStop(); $('#mean').hidden = true; } });
  $('#about').addEventListener('click', (ev) => { if (ev.target.id === 'about') $('#about').hidden = true; });
  function drawAbout() { const rows = DATA.days.map((d) => { const dm = DAYS.find((x) => x[0] === d.id) || [d.id, d.id, '']; const q = d.duas.filter((x) => x.ref && x.ref.t === 'q').length, h = d.duas.filter((x) => x.ref && x.ref.t === 'h').length; const tot = d.duas.filter((x) => /^[০-৯]/.test(x.no)).length; return '<tr><td>' + esc(dm[1]) + '</td><td>' + esc(dm[2] || '') + ' · ' + esc(d.range || '') + ' · ' + bn(d.duas.length) + 'টি অংশ<br><span class="mu">উৎস: ' + (q + h ? '📖 ' + bn(q) + ' · 📜 ' + bn(h) + (tot - q - h > 0 ? ' · বাকি ' + bn(tot - q - h) : ' · সব ✓') : 'এখনো যোগ হয়নি') + '</span></td></tr>'; }).join('');
    $('#aboutBody').innerHTML = '<div class="vb"><div><div class="mu">অ্যাপ সংস্করণ</div><b>' + bn(APPVER) + '</b></div><div class="mu">হালনাগাদ: ' + APPDATE + (apkBuild ? ' · APK বিল্ড ' + bn(apkBuild) : '') + '<br>মুনাজাতে মাকবূল · ৭ দিনের দোয়া</div></div>'
      + '<h3>কী নতুন</h3>' + CHANGES.map((c, k) => '<details' + (k === 0 ? ' open' : '') + '><summary>সংস্করণ ' + bn(c[0]) + ' <span class="mu">· ' + c[1] + '</span></summary><ul>' + c[2].map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul></details>').join('')
      + (() => { let got = 0, all = 0; const miss = []; DATA.days.forEach((d) => { const dm = DAYS.find((x) => x[0] === d.id) || [d.id, d.id]; const m = []; d.duas.forEach((x) => { if (!/^[০-৯]/.test(x.no)) return; all++; if (x.ref) got++; else m.push(x.no); }); if (m.length) miss.push('<tr><td>' + esc(dm[1]) + ' (' + bn(m.length) + ')</td><td>' + m.map(esc).join(', ') + '</td></tr>'); });
          return '<h3>দোয়ার উৎস — হিসাব</h3><div class="vb"><div><div class="mu">পাওয়া গেছে</div><b>' + bn(got) + '</b></div><div><div class="mu">পাওয়া যায়নি</div><b style="color:#b3261e">' + bn(all - got) + '</b></div><div class="mu">মোট ' + bn(all) + 'টি দোয়া</div></div>'
            + (miss.length ? '<p class="mu" style="margin:8px 0 4px">যেসব দোয়ার উৎস এখনো নেই (নম্বর বলে দিলে খুঁজে বসানো যাবে):</p><table>' + miss.join('') + '</table>' : '<p>সব দোয়ার উৎস যোগ হয়েছে ✓</p>'); })()
      + '<h3>কোন দিনে কোন দোয়া</h3><table>' + rows + '</table>'
      + '<h3>তথ্যসূত্র</h3><p>আরবি পাঠ: মাওলানা আশরাফ আলী থানভী (রহ.)-এর মুনাজাতে মাকবূল — YouTube ভিডিওর বইয়ের পাতা থেকে পড়া। বাংলা উচ্চারণ ও অর্থ নিজস্ব; বইয়ের সাথে মিলিয়ে নিন।</p>'
      + '<h3>গোপনীয়তা</h3><p>অডিও ফাইল, প্রিয় তালিকা ও সেটিং শুধু এই ফোন/কম্পিউটারেই থাকে — কোথাও পাঠানো হয় না।</p>'
      + '<h3>এই দিনের ফাইল</h3><p id="abFile" class="mu">…</p>'
      + '<h3>সমস্যা খোঁজার লগ</h3><p class="mu">সমস্যা হলে: দোয়া চালান, যা হয় হতে দিন, তারপর এখানে এসে "লগ কপি" চেপে চ্যাটে পেস্ট করুন। এতে কোনো ব্যক্তিগত তথ্য নেই।</p><div class="pk"><button type="button" id="logCopy">লগ কপি</button><button type="button" id="logClear">লগ মুছুন</button></div><pre id="logBox" style="max-height:30vh;overflow:auto;font-size:11px;background:var(--bg);border:1px solid var(--line);border-radius:10px;padding:8px;white-space:pre-wrap"></pre>'
      + '<p class="mu">নতুন সংস্করণ না দেখালে অ্যাপ বন্ধ করে আবার খুলুন।</p>';
    $('#logBox').textContent = logText();
    getMedia(DAYKEY).then((b) => { const el = $('#abFile'); if (el) el.textContent = b ? (b.name || '(নাম নেই)') + ' · ' + (b.type || 'ধরন অজানা') + ' · ' + bn((b.size / 1048576).toFixed(1)) + ' MB · ' + (hasVideo ? 'ভিডিও আছে ⚠' : 'শুধু অডিও ✓') + ' · দৈর্ঘ্য ' + bn((media.duration || 0).toFixed(1)) + ' সে. (হওয়ার কথা ' + bn(day.dur) + ')' : 'ফাইল দেওয়া হয়নি'; }).catch(() => {}); }
  function logText() { return 'v' + APPVER + ' · ' + DAYID + ' · ' + navigator.userAgent + '\n' + LOG.join('\n'); }
  $('#sheet').addEventListener('click', (ev) => { if (ev.target.id === 'sheet') $('#sheet').hidden = true; });
  document.addEventListener('click', (ev) => { const l = ev.target.closest('.ln'); if (!l || ev.target.closest('button')) return; const j = +l.dataset.line; if (!media.src) return; const had = Object.keys(TR).length; TR = {}; if (had) lg('rpt', 'reset-by-line-tap'); if (S.mode !== 'dua') return playDua(S.dua, j); if (had || grpOn(S.dua) || (plan && plan.items.some((x) => x.j != null))) { if (grpOn(S.dua)) { plan = {items: buildPlan(S.dua), k: 0}; const k = plan.items.findIndex((x) => x.j === j); plan.k = Math.max(0, k); startItem(); render(); return; } plan = {items: buildPlan(S.dua), k: 0}; wantPlay = true; media.currentTime = Math.max(0, lineSpan(S.dua, j)[0] + OFF() - LEAD); const pp = media.play(); if (pp && pp.catch) pp.catch(() => {}); try { sched(); } catch (e) {} status(); render(); return; } const [s] = lineSpan(S.dua, j); if (!plan) playDua(S.dua); media.currentTime = Math.max(0, s - LEAD); });
  $('#file').addEventListener('change', async (ev) => { const f = ev.target.files[0]; if (!f) return; $('#fileMsg').textContent = 'রাখা হচ্ছে…'; try { await putMedia(DAYKEY, f); if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); await loadMedia(); } catch (e) { $('#fileMsg').textContent = 'রাখা যায়নি: ' + e.message; } });
  /* ফাইলে ভিডিও থাকলে Android-এর Chrome পর্দা বন্ধ হলেই থামিয়ে দেয় — তাই ধরা পড়লে লাল সতর্কতা */
  let hasVideo = false;
  const probeVideo = (url) => { try { const v = document.createElement('video'); v.muted = true; v.preload = 'metadata'; v.src = url;
    v.addEventListener('loadedmetadata', () => { hasVideo = v.videoWidth > 0; lg('probe', hasVideo ? 'VIDEO ' + v.videoWidth + 'x' + v.videoHeight : 'audio-only'); const old = $('#vidWarn'); if (old) old.remove();
      if (hasVideo) { const p = document.createElement('p'); p.id = 'vidWarn'; p.style.cssText = 'margin:6px 14px;padding:10px 12px;border-radius:10px;background:#b3261e;color:#fff;font-size:14px;line-height:1.5'; p.textContent = '⚠ এই দিনের ফাইলে ভিডিও আছে (' + v.videoWidth + '×' + v.videoHeight + ')। ফোন লক হলে বা অ্যাপ পেছনে গেলে Chrome ভিডিও-ফাইল থামিয়ে দেয়। লক স্ক্রিনে শুনতে শুধু অডিও ফাইল (.m4a) দিন — সেটিংস → "ফাইল বদলান"।'; const fm = $('#fileMsg'); if (fm && fm.parentNode) fm.parentNode.insertBefore(p, fm.nextSibling); }
      v.removeAttribute('src'); v.load(); }, {once: true}); } catch (e) {} };
  const loadMedia = async () => { let blob = null; try { blob = await getMedia(DAYKEY); } catch (e) {} if (!blob) { document.body.classList.add('nofile'); $('#fileMsg').textContent = DMETA[1] + '-এর অডিও এখনো দেওয়া হয়নি — নিচে "ফাইল বেছে নিন" চাপুন'; return; } document.body.classList.remove('nofile'); document.body.classList.toggle('audio-only', /^audio\//.test(blob.type) || /\.(m4a|mp3|aac|ogg|wav)$/i.test(blob.name || '')); media.src = URL.createObjectURL(blob); media.load(); probeVideo(media.src); media.addEventListener('loadedmetadata', () => { const want = day.dur, got = media.duration; const w = $('#durWarn'); if (w) w.remove(); if (want && got && Math.abs(got - want) > 3) { const p = document.createElement('p'); p.id = 'durWarn'; p.style.cssText = 'margin:6px 14px;padding:8px 12px;border-radius:10px;background:#b3261e;color:#fff;font-size:14px'; p.textContent = '⚠ এই ফাইলটা সম্ভবত ' + DMETA[1] + '-এর নয় (দৈর্ঘ্য ' + bn(Math.round(got)) + ' সে., হওয়ার কথা ' + bn(Math.round(want)) + ' সে.)। সেটিংস → "ফাইল বদলান" দিয়ে ' + DMETA[1] + '-এর অডিও দিন।'; $('#fileMsg').after(p); } }, {once: true}); if (day.placeholder) media.addEventListener('loadedmetadata', () => { const e = Math.max(1, media.duration - 0.1); duas[0].e = e; duas[0].lines[0].e = e; }, {once: true}); drawDays(); $('#fileMsg').textContent = DMETA[1] + '-এর ফাইল এই ডিভাইসে আছে · ' + bn((blob.size / 1048576).toFixed(1)) + ' MB · অ্যাপ সংস্করণ ' + bn(APPVER); };
  { const n = NMS(); if (n) { try { const h = (a, f) => { const r = n.setActionHandler({ action: a }, () => f()); if (r && r.catch) r.catch(() => {}); }; h('play', () => { if (!wantPlay) toggle(); }); h('pause', () => { if (wantPlay) toggle(); }); h('nexttrack', () => $('#next').click()); h('previoustrack', () => $('#prev').click()); h('stop', () => stop()); } catch (e) { lg('nms-error', String(e)); } } }
  if ('mediaSession' in navigator) { try { navigator.mediaSession.setActionHandler('play', () => { if (media.paused) toggle(); }); navigator.mediaSession.setActionHandler('pause', () => { if (!media.paused) toggle(); }); navigator.mediaSession.setActionHandler('nexttrack', () => $('#next').click()); navigator.mediaSession.setActionHandler('previoustrack', () => $('#prev').click()); } catch (e) {} }
  /* নতুন সংস্করণ: খুললেই খোঁজে, অ্যাপে ফিরলেও খোঁজে; পেলে বাজানো না চললে নিজে নতুন করে খোলে, চললে উপরে বোতাম দেখায় */
  if ('serviceWorker' in navigator && location.protocol === 'https:') { const hadCtl = !!navigator.serviceWorker.controller; let done = false;
    navigator.serviceWorker.register('sw.js', {updateViaCache: 'none'}).then((r) => { r.update().catch(() => {}); document.addEventListener('visibilitychange', () => { if (!document.hidden) r.update().catch(() => {}); }); setInterval(() => r.update().catch(() => {}), 30 * 60 * 1000); }).catch(() => {});
    navigator.serviceWorker.addEventListener('controllerchange', () => { if (!hadCtl || done) return; done = true;
      if (media.paused) { location.reload(); return; }
      const p = document.createElement('button'); p.type = 'button'; p.textContent = '🔄 নতুন সংস্করণ এসেছে — চাপলে চালু হবে'; p.style.cssText = 'position:fixed;left:12px;right:12px;top:10px;z-index:40;min-height:46px;border:0;border-radius:14px;background:#e0b84c;color:#1b2a22;font:inherit;font-weight:700;box-shadow:0 4px 16px rgba(0,0,0,.25)'; p.onclick = () => location.reload(); document.body.appendChild(p); }); }
  $('#dayTitle').textContent = day.title; $('#dayRange').textContent = day.range; const src = $('#mnSrc'); if (src && day.mnSrc) src.href = day.mnSrc;
  /* ---------- দিনের তালিকা ---------- */
  async function drawDays() { const box = $('#days'); if (!box) return; const keys = await mediaKeys(); const sz = {}; for (const k of keys) { try { const b = await getMedia(k); if (b) sz[k] = bn((b.size / 1048576).toFixed(1)) + ' MB'; } catch (e) {} }
    box.innerHTML = DAYS.map(([id, nm, mz]) => { const has = keys.includes(id), txt = DATA.days.some((d) => d.id === id);
      return (id === 'kahf' ? '<span class="dsep">সূরা</span>' : '') + `<button type="button" class="dy${id === DAYID ? ' cur' : ''}" data-day="${id}"><b>${nm}</b><small>${mz}</small><i class="${has ? 'ok' : 'no'}">${has ? '✓ ফাইল আছে · ' + (sz[id] || '') : '+ ফাইল দিন'}</i>${txt ? '' : '<i class="tx">শুধু অডিও</i>'}</button>`; }).join('');
    box.querySelectorAll('[data-day]').forEach((b) => b.onclick = async () => { const id = b.dataset.day, has = (await mediaKeys()).includes(id);
      if (id === DAYID) { if (!has) { $('#file').value = ''; $('#file').click(); } return; }
      save(); try { localStorage.setItem('mm_day', id); } catch (e) {} if (!has) { try { sessionStorage.setItem('mm_pick', '1'); } catch (e) {} } location.reload(); }); }
  /* ---------- YouTube লিংক ---------- */
  const YT = {saturday: ['eXRpUSNg4kU', '৬:৫৩'], sunday: ['r9dl5B4s8Mw', '৭:৫৩'], monday: ['igljQbIt2l8', '৬:০৫'], tuesday: ['mwO0Kr2cxZM', '৭:১১'], wednesday: ['M-TQxQZMpRw', '৬:৪৪'], thursday: ['QNBfWBxag_Q', '৭:১১'], friday: ['xzTJfBrknNc', '৬:১০']};
  (() => { const box = $('#ytList'); if (!box) return;
    DAYS.forEach(([id, nm, mz]) => { if (!YT[id]) return; const [vid, len] = YT[id], url = 'https://youtu.be/' + vid, dd = DATA.days.find((d) => d.id === id);
      const nums = dd ? dd.duas.map((x) => x.no).filter((n) => /^[০-৯]+$/.test(n)) : [];
      const parts = dd ? dd.duas.filter((x) => x.no !== 'বিসমিল্লাহ').length : 0, info = dd ? (dd.range + ' · অ্যাপে ' + bn(parts) + 'টি দোয়া/অংশ') : 'দোয়ার নম্বর: লেখা যোগ হলে জানা যাবে';
      const r = document.createElement('div'); r.className = 'ytr';
      const t = document.createElement('div'); const b = document.createElement('b'); b.textContent = nm + ' · ' + mz; const s1 = document.createElement('small'); s1.textContent = 'দৈর্ঘ্য ' + len + ' · ' + info; const s2 = document.createElement('small'); s2.textContent = url; t.append(b, s1, s2);
      const a = document.createElement('a'); a.href = url; a.target = '_blank'; a.rel = 'noopener'; a.textContent = 'খুলুন';
      const c = document.createElement('button'); c.type = 'button'; c.textContent = 'লিংক কপি';
      c.onclick = async (e) => { e.stopPropagation(); try { await navigator.clipboard.writeText(url); c.textContent = '✓ কপি হয়েছে'; } catch (x) { const ta = document.createElement('textarea'); ta.value = url; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); c.textContent = '✓ কপি হয়েছে'; } catch (y) { c.textContent = 'কপি হয়নি'; } ta.remove(); } setTimeout(() => { c.textContent = 'লিংক কপি'; }, 2000); };
      r.append(t, a, c); box.appendChild(r); }); })();
  /* ---------- খোঁজা ও প্রিয় (৭ দিন জুড়ে) ---------- */
  const DN = Object.fromEntries(DAYS.map((d) => [d[0], d[1]]));
  const nb = (s) => String(s || '').toLowerCase().replace(/[০-৯]/g, (c) => BN.indexOf(c)).replace(/[\-‘’'ʼ,،.।:;!?()…]/g, '').replace(/\s+/g, ' ').trim();
  const na = (s) => String(s || '').replace(/[ً-ٰٟۖ-ۭـ]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي');
  const IDX = []; DATA.days.forEach((dd) => dd.duas.forEach((d, i) => { IDX.push({id: dd.id, i, no: d.no, noN: nb(d.no), bn: d.lines.map((L) => L.bn).join(' '), mn: d.lines.map((L) => L.mn || '').join(' '), ar: na(d.lines.map((L) => L.ar).join(' ')), first: d.lines[0].ar}); }));
  const snip = (txt, q) => { const t = String(txt), w = q.split(' ')[0]; let k = t.toLowerCase().indexOf(w); if (k < 0) k = 0; const a = k > 30 ? t.lastIndexOf(' ', k - 25) + 1 : 0; let z = t.indexOf(' ', a + 110); if (z < 0) z = t.length; const part = t.slice(a, z); const re = new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'); return (a ? '…' : '') + esc(part).replace(re, (m) => '<mark>' + m + '</mark>') + (z < t.length ? '…' : ''); };
  const rowHtml = (r, body) => '<button type="button" class="qr" data-go="' + r.id + ':' + r.i + '"><b>' + esc(DN[r.id]) + ' · দোয়া ' + esc(r.no) + '</b>' + (r.id === DAYID ? '<small>এই দিন</small>' : '') + '<span>' + body + '</span></button>';
  const doSearch = () => { const raw = $('#q').value, q = nb(raw), qa = na(raw.trim()), box = $('#qres'); $('#favBtn').setAttribute('aria-pressed', 'false');
    if (q.length < 2 && !/^\d+$/.test(q)) { box.innerHTML = q ? '<div class="qn">অন্তত দুই অক্ষর লিখুন</div>' : ''; return; }
    const hits = [];
    for (const r of IDX) { let body = null;
      if (/^\d+$/.test(q)) { if (r.noN === q) body = '<span lang="ar" dir="rtl">' + esc(r.first) + '</span>'; }
      else if (/[؀-ۿ]/.test(qa)) { if (r.ar.includes(qa)) body = '<span lang="ar" dir="rtl">' + esc(r.first) + '</span>'; }
      else if (nb(r.mn).includes(q)) body = snip(r.mn, q); else if (nb(r.bn).includes(q)) body = snip(r.bn, q);
      if (body) hits.push(rowHtml(r, body)); if (hits.length >= 40) break; }
    box.innerHTML = hits.length ? '<div class="qn">' + bn(hits.length) + (hits.length >= 40 ? '+' : '') + 'টি দোয়া পাওয়া গেছে — চাপলে খুলবে</div>' + hits.join('') : '<div class="qn">কিছু পাওয়া যায়নি</div>'; };
  let qt = 0; $('#q').addEventListener('input', () => { clearTimeout(qt); qt = setTimeout(doSearch, 200); });
  function showFavs() { const rows = []; DAYS.forEach(([id]) => (S.fav[id] || []).forEach((i) => { const r = IDX.find((x) => x.id === id && x.i === i); if (r) rows.push(rowHtml(r, '<span lang="ar" dir="rtl">' + esc(r.first) + '</span>')); }));
    $('#qres').innerHTML = rows.length ? '<div class="qn">আপনার প্রিয় দোয়া — ' + bn(rows.length) + 'টি</div>' + rows.join('') : '<div class="qn">এখনো কোনো প্রিয় দোয়া নেই — দোয়ার পাশে ☆ চাপুন</div>'; }
  function goTo(id, i) { if (id === DAYID) { stop(); S.dua = i; save(); render(); const el = $('#d-' + i); if (el) el.scrollIntoView({block: 'start', behavior: 'smooth'}); return; }
    save(); S.perDay[id] = Object.assign({}, S.perDay[id] || {}, {dua: i}); try { localStorage.setItem(KEY, JSON.stringify(S)); localStorage.setItem('mm_day', id); sessionStorage.setItem('mm_go', '1'); } catch (e) {} location.reload(); }
  function offInfo() { const v = OFF(), el = $('#offInfo'); if (el) el.textContent = (v ? 'এখন: ' + (v > 0 ? 'পরে ' : 'আগে ') + bn(Math.round(Math.abs(v) * 1000)) + ' মি.সে. · ' : '') + 'দোয়ার শুরুতে আগের দোয়ার শেষটুকু শোনা গেলে "পরে" চাপুন; শুরু কেটে গেলে "আগে"।'; }
  offInfo();
  /* APK: ভেতরের লেখা ওয়েবসাইট থেকে আসে (নিজে update)। APK-র নিজের অংশ পুরোনো হলে নতুন APK নেওয়ার বোতাম */
  const APK_LATEST = 6, APK_URL = 'https://github.com/SIL-CBS/shopno-kuthir/releases/download/munajat-v2-latest/munajat-v2-debug.apk';
  const apkBuild = (() => { const m = navigator.userAgent.match(/MunajatApk\/(\d+)/); return m ? +m[1] : 0; })();
  if (apkBuild && apkBuild < APK_LATEST) { const p = document.createElement('a'); p.href = APK_URL; p.target = '_blank'; p.rel = 'noopener'; p.textContent = '📲 অ্যাপের নতুন সংস্করণ (APK) এসেছে — চাপলে নামবে, তারপর Install'; p.style.cssText = 'display:block;margin:8px 12px;padding:12px 14px;border-radius:14px;background:#e0b84c;color:#1b2a22;font-weight:700;text-decoration:none;text-align:center'; document.body.insertBefore(p, document.body.firstChild); }
  if (day.approx) { media.addEventListener('loadedmetadata', () => { const D = media.duration; if (!(D > 60) || day._sc) return; const f = D / day.dur; day._sc = f; duas.forEach((d) => { d.s *= f; d.e *= f; d.lines.forEach((L) => { L.s *= f; L.e *= f; }); }); lg('approx-scale', f.toFixed(3)); render(); });
    const n = document.createElement('div'); n.className = 'resume'; n.innerHTML = '<span>এই সূরার আয়াতের সময় এখন <b>আনুমানিক</b> — অডিওর দৈর্ঘ্য দেখে ভাগ করা। অডিও ফাইলটা চ্যাটে পাঠালে ঠিকঠাক মিলিয়ে দেওয়া হবে।</span>'; const L = $('#list'); L.parentNode.insertBefore(n, L); }
  render(); loadMedia(); drawDays();
  setTimeout(() => { try { if (window.__nc) { lg('native-crash', String(window.__nc).slice(0, 1500)); window.__nc = null; } } catch (e) {} }, 5000);
  if (FRESH && !day.placeholder && S.dua > 0 && duas[S.dua]) { const r = document.createElement('div'); r.className = 'resume'; r.id = 'resume'; r.innerHTML = '<span>শেষবার দোয়া ' + esc(duas[S.dua].no) + '-এ ছিলেন — সেখান থেকে চালাবেন?</span><button type="button" data-resume="' + S.dua + '">▶ চালান</button><button type="button" data-resume="x" aria-label="বন্ধ">✕</button>'; const L = $('#list'); L.parentNode.insertBefore(r, L); }
  try { if (sessionStorage.getItem('mm_go')) { sessionStorage.removeItem('mm_go'); const el = $('#d-' + S.dua); if (el) setTimeout(() => el.scrollIntoView({block: 'start'}), 50); } } catch (e) {}
  try { if (sessionStorage.getItem('mm_pick')) { sessionStorage.removeItem('mm_pick'); $('#fileMsg').textContent = DMETA[1] + '-এর অডিও দিন — নিচের "ফাইল বেছে নিন" চাপুন'; } } catch (e) {}
})();
