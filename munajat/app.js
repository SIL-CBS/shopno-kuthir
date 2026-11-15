/* মুনাজাতে মাকবূল — মুখস্থের প্লেয়ার. সব কিছু এই ডিভাইসে: মিডিয়া IndexedDB-তে, সেটিং localStorage-এ. */
(() => {
  const DATA = window.MUNAJAT, $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const BN = '০১২৩৪৫৬৭৮৯', bn = (v) => String(v).replace(/\d/g, (d) => BN[d]);
  const KEY = 'mm_v1', VER = 4, DEF = {v: VER, dua: 0, mode: 'dua', reps: 3, gap: 2, whole: 1, after: 'next', listLoop: true, speed: 1, showBn: true, showMeaning: false, hideAr: false, video: false, font: 30, nudge: {}, sel: []};
  let S; try { S = Object.assign({}, DEF, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { S = Object.assign({}, DEF); }
  if (S.v !== VER) { S.nudge = {}; S.v = VER; if (S.perDay) Object.values(S.perDay).forEach((p) => { p.nudge = {}; }); } // সময় নতুন করে মেলানো হয়েছে — পুরোনো সরানো বাদ
  if (!Array.isArray(S.sel)) S.sel = [];
  /* ---------- দিন: ৭ দিনের তালিকা; যে দিনের লেখা এখনো নেই, সেটা পুরো ফাইল এক টানা বাজে ---------- */
  const DAYS = [['saturday', 'শনিবার', '১ম মনজিল'], ['sunday', 'রবিবার', '২য় মনজিল'], ['monday', 'সোমবার', '৩য় মনজিল'], ['tuesday', 'মঙ্গলবার', '৪র্থ মনজিল'], ['wednesday', 'বুধবার', '৫ম মনজিল'], ['thursday', 'বৃহস্পতিবার', '৬ষ্ঠ মনজিল'], ['friday', 'জুমাবার', '৭ম মনজিল']];
  let DAYID = 'friday'; try { DAYID = localStorage.getItem('mm_day') || 'friday'; } catch (e) {}
  if (!DAYS.some((d) => d[0] === DAYID)) DAYID = 'friday';
  const DMETA = DAYS.find((d) => d[0] === DAYID);
  const day = DATA.days.find((d) => d.id === DAYID) || {id: DAYID, title: DMETA[1] + ' · ' + DMETA[2], range: 'লেখা এখনো যোগ হয়নি — শুধু অডিও', placeholder: true,
    duas: [{no: '—', s: 0, e: 1e6, lines: [{ar: '', bn: 'এই দিনের আরবি লেখা, উচ্চারণ আর অর্থ এখনো যোগ হয়নি। অডিও পুরোটা বাজবে।', s: 0, e: 1e6}]}]};
  const duas = day.duas, DAYKEY = DAYID;
  // প্রতিটি দিনের বাছাই, কোন দোয়ায় ছিলেন আর সময়-ঠিক আলাদা থাকে
  S.perDay = S.perDay || {}; if (!S.perDay.friday && !S.dayInit) S.perDay.friday = {dua: S.dua, sel: S.sel, nudge: S.nudge}; S.dayInit = 1;
  { const pd = S.perDay[DAYID] || {}; S.dua = Math.min(pd.dua || 0, duas.length - 1); S.sel = (pd.sel || []).filter((i) => i < duas.length); S.nudge = pd.nudge || {}; }
  const save = () => { S.perDay[DAYID] = {dua: S.dua, sel: S.sel, nudge: S.nudge}; try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
  /* ---------- IndexedDB: মিডিয়া ফাইল ---------- */
  const idb = () => new Promise((ok, bad) => { const r = indexedDB.open('munajat', 1); r.onupgradeneeded = () => r.result.createObjectStore('media'); r.onsuccess = () => ok(r.result); r.onerror = () => bad(r.error); });
  const putMedia = async (k, blob) => { const db = await idb(); return new Promise((ok, bad) => { const t = db.transaction('media', 'readwrite'); t.objectStore('media').put(blob, k); t.oncomplete = ok; t.onerror = () => bad(t.error); }); };
  const mediaKeys = async () => { try { const db = await idb(); return await new Promise((ok) => { const r = db.transaction('media').objectStore('media').getAllKeys(); r.onsuccess = () => ok(r.result || []); r.onerror = () => ok([]); }); } catch (e) { return []; } };
  const getMedia = async (k) => { const db = await idb(); return new Promise((ok) => { const r = db.transaction('media').objectStore('media').get(k); r.onsuccess = () => ok(r.result || null); r.onerror = () => ok(null); }); };
  /* ---------- সময় ---------- */
  const LEAD = 0.12; // লাইনের শুরু যেন কেটে না যায়
  const nd = (i) => S.nudge[i] || [0, 0];
  const duaSpan = (i) => { const d = duas[i], n = nd(i); return [d.s + n[0], d.e + n[1]]; };
  const lineSpan = (i, j) => { const d = duas[i], L = d.lines[j], n = nd(i); return [j === 0 ? L.s + n[0] : L.s, j === d.lines.length - 1 ? L.e + n[1] : L.e]; };
  /* ---------- শোনার তালিকা (বাছাই) ---------- */
  const queue = () => (S.sel.length ? [...S.sel].sort((a, b) => a - b) : duas.map((_, i) => i));
  const isSel = (i) => S.sel.includes(i);
  /* ---------- প্লেয়ার ইঞ্জিন ---------- */
  const media = $('#media'); let plan = null, timer = null, wantPlay = false;
  const buildPlan = (i) => { const out = [], d = duas[i];
    if (S.mode === 'line') { d.lines.forEach((_, j) => { const [s, e] = lineSpan(i, j); for (let r = 1; r <= S.reps; r++) out.push({i, j, s, e, rep: r, of: S.reps}); });
      const [s, e] = duaSpan(i); for (let r = 1; r <= S.whole; r++) out.push({i, j: null, s, e, rep: r, of: S.whole, whole: true}); }
    else { const [s, e] = duaSpan(i); for (let r = 1; r <= S.reps; r++) out.push({i, j: null, s, e, rep: r, of: S.reps}); }
    return out; };
  const playDua = (i, fromLine) => { S.dua = i; save(); plan = {items: buildPlan(i), k: 0}; if (fromLine != null && S.mode === 'line') { const k = plan.items.findIndex((x) => x.j === fromLine); if (k >= 0) plan.k = k; } startItem(); render(); };
  const startItem = () => { clearTimeout(timer); const it = plan && plan.items[plan.k]; if (!it) return finishDua(); wantPlay = true; media.playbackRate = S.speed; media.currentTime = Math.max(0, it.s - LEAD); const p = media.play(); if (p && p.catch) p.catch(() => {}); status(); };
  const finishItem = () => { media.pause(); plan.k++; const it = plan.items[plan.k]; if (!it) return finishDua(); status('বিরতি'); timer = setTimeout(startItem, S.gap * 1000); };
  const nextInQueue = (i, dir) => { const q = queue(); let k = q.indexOf(i);
    if (k < 0) { const after = q.filter((x) => (dir > 0 ? x > i : x < i)); return after.length ? (dir > 0 ? after[0] : after[after.length - 1]) : null; }
    k += dir; if (k >= q.length) return S.listLoop ? q[0] : null; if (k < 0) return S.listLoop ? q[q.length - 1] : q[0]; return q[k]; };
  const finishDua = () => { wantPlay = false; media.pause(); const i = S.dua;
    if (S.after === 'next') { const n = nextInQueue(i, 1); if (n != null) { status(n <= i ? 'তালিকা আবার শুরু' : 'পরের দোয়া'); timer = setTimeout(() => playDua(n), S.gap * 1000); return; } }
    else if (S.after === 'loop') { timer = setTimeout(() => playDua(i), S.gap * 1000); return; }
    plan = null; status('শেষ'); render(); };
  const tick = () => { const t = media.currentTime, it = plan && plan.items[plan.k]; if (it && wantPlay && !media.paused && t >= it.e) finishItem(); highlight(it && it.j != null ? null : t, it); if (!media.paused) requestAnimationFrame(tick); };
  media.addEventListener('play', () => requestAnimationFrame(tick)); media.addEventListener('seeked', () => tick());
  const stop = () => { clearTimeout(timer); wantPlay = false; media.pause(); plan = null; status(); render(); };
  const startList = () => { const q = queue(); playDua(q.includes(S.dua) ? S.dua : q[0]); };
  const toggle = () => { if (!media.src) return; if (plan && wantPlay && !media.paused) { clearTimeout(timer); media.pause(); wantPlay = false; status('থামানো'); } else if (plan) { wantPlay = true; const p = media.play(); if (p && p.catch) p.catch(() => {}); status(); } else startList(); renderBar(); };
  /* ---------- দেখানো ---------- */
  const status = (msg) => { const it = plan && plan.items[plan.k], el = $('#status'); if (!el) return;
    if (!it) { el.textContent = msg || 'থামানো'; renderBar(); return; }
    const d = duas[it.i], q = queue(), qk = q.indexOf(it.i);
    el.textContent = (S.sel.length && qk >= 0 ? 'তালিকা ' + bn(qk + 1) + '/' + bn(q.length) + ' · ' : '') + 'দোয়া ' + d.no + (it.j != null ? ' · লাইন ' + bn(it.j + 1) + '/' + bn(d.lines.length) : it.whole ? ' · পুরোটা' : '') + ' · ' + bn(it.rep) + '/' + bn(it.of) + ' বার' + (msg ? ' · ' + msg : ''); renderBar(); };
  let lastHL = '';
  const highlight = (t, it) => { let hi = -1, hj = -1; if (t == null && it) { hi = it.i; hj = it.j; } else if (t != null) { const tt = t + 0.05; duas.forEach((d, i) => d.lines.forEach((L, j) => { const [s, e] = lineSpan(i, j); if (tt >= s && tt < e) { hi = i; hj = j; } })); }
    const k = hi + ':' + hj; if (k === lastHL) return; lastHL = k; $$('.ln.on').forEach((e) => e.classList.remove('on'));
    const el = $('#l-' + hi + '-' + hj); if (el) { el.classList.add('on'); if (wantPlay) el.scrollIntoView({block: 'center', behavior: 'smooth'}); } };
  const renderBar = () => { const b = $('#play'); if (b) { const on = plan && wantPlay && !media.paused; b.setAttribute('aria-label', on ? 'থামান' : 'চালান'); b.innerHTML = on ? '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>' : '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>'; } };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'})[c]);
  const renderPick = () => { const n = S.sel.length;
    $('#pickInfo').textContent = n ? bn(n) + 'টি দোয়া বাছাই — শুধু এগুলোই বাজবে' : 'কিছু বাছাই নেই — সব দোয়া ক্রমে বাজবে';
    $('#pickAll').setAttribute('aria-pressed', String(n === duas.length)); $('#pickNone').disabled = !n; };
  try { if (!localStorage.getItem('mm_vid_off1')) { S.video = false; localStorage.setItem('mm_vid_off1', '1'); } if (!localStorage.getItem('mm_ar_on1')) { S.hideAr = false; localStorage.setItem('mm_ar_on1', '1'); } } catch (e) {}
  const render = () => {
    document.documentElement.style.setProperty('--ar', S.font + 'px');
    document.body.classList.toggle('no-bn', !S.showBn); document.body.classList.toggle('show-mn', S.showMeaning); document.body.classList.toggle('hide-ar', S.hideAr); document.body.classList.toggle('no-video', !S.video);
    $$('[data-tg]').forEach((b) => b.setAttribute('aria-pressed', String(!!S[b.dataset.tg])));
    $$('[data-set]').forEach((b) => { const [k, v] = b.dataset.set.split(':'); b.setAttribute('aria-pressed', String(String(S[k]) === v)); });
    $('#reps').textContent = bn(S.reps) + '×'; $('#gap').textContent = bn(S.gap) + ' সে.'; $('#whole').textContent = bn(S.whole) + '×'; $('#wholeRow').hidden = S.mode !== 'line';
    renderPick();
    $('#list').innerHTML = duas.map((d, i) => { const open = i === S.dua, n = nd(i), sel = isSel(i);
      return '<article class="dua' + (open ? ' open' : '') + (sel ? ' sel' : '') + '" id="d-' + i + '"><div class="dhw"><button class="pick" data-pick="' + i + '" role="checkbox" aria-checked="' + sel + '" aria-label="দোয়া ' + esc(d.no) + ' তালিকায় রাখুন"><span class="box">' + (sel ? '✓' : '') + '</span></button><button class="dh" data-dua="' + i + '"><span class="no">' + esc(d.no) + '</span><span class="first" lang="ar" dir="rtl">' + esc(d.lines[0].ar) + '</span><span class="dur">' + bn(Math.round(d.e - d.s)) + ' সে.</span></button></div>' +
        (open ? '<div class="lines">' + d.lines.map((L, j) => '<div class="ln" id="l-' + i + '-' + j + '" data-line="' + j + '"><div class="ar" lang="ar" dir="rtl">' + esc(L.ar) + '</div><div class="bn">' + esc(L.bn) + '</div><div class="mn">' + esc(L.mn || 'অর্থ এখনো যোগ হয়নি') + '</div></div>').join('') +
          '<div class="nudge"><span>সময় ঠিক করুন</span><button data-nudge="' + i + ':0:-0.25">শুরু −</button><button data-nudge="' + i + ':0:0.25">শুরু +</button><button data-nudge="' + i + ':1:-0.25">শেষ −</button><button data-nudge="' + i + ':1:0.25">শেষ +</button><small>' + (n[0] || n[1] ? 'শুরু ' + n[0] + ' / শেষ ' + n[1] + ' সে.' : '') + '</small></div></div>' : '') + '</article>'; }).join('');
    lastHL = ''; const ci = plan && plan.items[plan.k]; highlight(ci && ci.j != null ? null : (media.currentTime || 0), ci); status(); };
  /* ---------- ইভেন্ট ---------- */
  document.addEventListener('click', (ev) => { const b = ev.target.closest('button'); if (!b) return; const ds = b.dataset;
    if (ds.pick != null) { const i = +ds.pick; S.sel = isSel(i) ? S.sel.filter((x) => x !== i) : [...S.sel, i]; save(); render(); return; }
    if (b.id === 'pickAll') { S.sel = duas.map((_, i) => i); save(); render(); return; }
    if (b.id === 'pickNone') { S.sel = []; save(); render(); return; }
    if (b.id === 'pickPlay') { if (!media.src) return; stop(); startList(); return; }
    if (ds.dua != null) { const i = +ds.dua; if (i !== S.dua) { stop(); S.dua = i; save(); render(); $('#d-' + i).scrollIntoView({block: 'start', behavior: 'smooth'}); } if (media.src) playDua(i); return; }
    if (ds.tg) { S[ds.tg] = !S[ds.tg]; save(); render(); return; }
    if (ds.set) { const [k, v] = ds.set.split(':'); S[k] = isNaN(+v) ? v : +v; save(); if (plan && (k === 'mode' || k === 'speed')) playDua(S.dua); else render(); return; }
    if (ds.step) { const [k, dv] = ds.step.split(':'), lim = {reps: [1, 33], gap: [0, 30], whole: [0, 11]}[k]; S[k] = Math.min(lim[1], Math.max(lim[0], S[k] + +dv)); save(); render(); return; }
    if (ds.nudge) { const [i, w, dv] = ds.nudge.split(':'), n = (S.nudge[i] = S.nudge[i] || [0, 0]); n[+w] = Math.round((n[+w] + +dv) * 100) / 100; save(); render(); const [s, e] = duaSpan(+i); if (media.src) media.currentTime = +w === 0 ? s : Math.max(s, e - 3); return; }
    if (b.id === 'play') return toggle();
    if (b.id === 'prev') { const n = nextInQueue(S.dua, -1); return playDua(n == null ? S.dua : n); }
    if (b.id === 'next') { const n = nextInQueue(S.dua, 1); return n == null ? stop() : playDua(n); }
    if (b.id === 'sheetBtn') { $('#sheet').hidden = false; return; } if (b.id === 'sheetClose') { $('#sheet').hidden = true; return; }
    if (b.id === 'addFile' || b.id === 'addFile2') { $('#file').value = ''; $('#file').click(); return; } });
  $('#sheet').addEventListener('click', (ev) => { if (ev.target.id === 'sheet') $('#sheet').hidden = true; });
  document.addEventListener('click', (ev) => { const l = ev.target.closest('.ln'); if (!l || ev.target.closest('button')) return; const j = +l.dataset.line; if (!media.src) return; if (S.mode === 'line') playDua(S.dua, j); else { const [s] = lineSpan(S.dua, j); if (!plan) playDua(S.dua); media.currentTime = Math.max(0, s - LEAD); } });
  $('#file').addEventListener('change', async (ev) => { const f = ev.target.files[0]; if (!f) return; $('#fileMsg').textContent = 'রাখা হচ্ছে…'; try { await putMedia(DAYKEY, f); if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); await loadMedia(); } catch (e) { $('#fileMsg').textContent = 'রাখা যায়নি: ' + e.message; } });
  const loadMedia = async () => { let blob = null; try { blob = await getMedia(DAYKEY); } catch (e) {} if (!blob) { document.body.classList.add('nofile'); $('#fileMsg').textContent = DMETA[1] + '-এর অডিও এখনো দেওয়া হয়নি — নিচে "ফাইল বেছে নিন" চাপুন'; return; } document.body.classList.remove('nofile'); document.body.classList.toggle('audio-only', /^audio\//.test(blob.type) || /\.(m4a|mp3|aac|ogg|wav)$/i.test(blob.name || '')); media.src = URL.createObjectURL(blob); media.load(); media.addEventListener('loadedmetadata', () => { const want = day.dur, got = media.duration; const w = $('#durWarn'); if (w) w.remove(); if (want && got && Math.abs(got - want) > 3) { const p = document.createElement('p'); p.id = 'durWarn'; p.style.cssText = 'margin:6px 14px;padding:8px 12px;border-radius:10px;background:#b3261e;color:#fff;font-size:14px'; p.textContent = '⚠ এই ফাইলটা সম্ভবত ' + DMETA[1] + '-এর নয় (দৈর্ঘ্য ' + bn(Math.round(got)) + ' সে., হওয়ার কথা ' + bn(Math.round(want)) + ' সে.)। সেটিংস → "ফাইল বদলান" দিয়ে ' + DMETA[1] + '-এর অডিও দিন।'; $('#fileMsg').after(p); } }, {once: true}); if (day.placeholder) media.addEventListener('loadedmetadata', () => { const e = Math.max(1, media.duration - 0.1); duas[0].e = e; duas[0].lines[0].e = e; }, {once: true}); drawDays(); $('#fileMsg').textContent = DMETA[1] + '-এর ফাইল এই ডিভাইসে আছে · ' + bn((blob.size / 1048576).toFixed(1)) + ' MB · অ্যাপ সংস্করণ ২৩'; };
  if ('mediaSession' in navigator) { try { navigator.mediaSession.setActionHandler('play', toggle); navigator.mediaSession.setActionHandler('pause', toggle); navigator.mediaSession.setActionHandler('nexttrack', () => $('#next').click()); navigator.mediaSession.setActionHandler('previoustrack', () => $('#prev').click()); } catch (e) {} }
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js');
  $('#dayTitle').textContent = day.title; $('#dayRange').textContent = day.range; const src = $('#mnSrc'); if (src && day.mnSrc) src.href = day.mnSrc;
  /* ---------- দিনের তালিকা ---------- */
  async function drawDays() { const box = $('#days'); if (!box) return; const keys = await mediaKeys(); const sz = {}; for (const k of keys) { try { const b = await getMedia(k); if (b) sz[k] = bn((b.size / 1048576).toFixed(1)) + ' MB'; } catch (e) {} }
    box.innerHTML = DAYS.map(([id, nm, mz]) => { const has = keys.includes(id), txt = DATA.days.some((d) => d.id === id);
      return `<button type="button" class="dy${id === DAYID ? ' cur' : ''}" data-day="${id}"><b>${nm}</b><small>${mz}</small><i class="${has ? 'ok' : 'no'}">${has ? '✓ ফাইল আছে · ' + (sz[id] || '') : '+ ফাইল দিন'}</i>${txt ? '' : '<i class="tx">শুধু অডিও</i>'}</button>`; }).join('');
    box.querySelectorAll('[data-day]').forEach((b) => b.onclick = async () => { const id = b.dataset.day, has = (await mediaKeys()).includes(id);
      if (id === DAYID) { if (!has) { $('#file').value = ''; $('#file').click(); } return; }
      save(); try { localStorage.setItem('mm_day', id); } catch (e) {} if (!has) { try { sessionStorage.setItem('mm_pick', '1'); } catch (e) {} } location.reload(); }); }
  /* ---------- YouTube লিংক ---------- */
  const YT = {saturday: ['eXRpUSNg4kU', '৬:৫৩'], sunday: ['r9dl5B4s8Mw', '৭:৫৩'], monday: ['igljQbIt2l8', '৬:০৫'], tuesday: ['mwO0Kr2cxZM', '৭:১১'], wednesday: ['M-TQxQZMpRw', '৬:৪৪'], thursday: ['QNBfWBxag_Q', '৭:১১'], friday: ['xzTJfBrknNc', '৬:১০']};
  (() => { const box = $('#ytList'); if (!box) return;
    DAYS.forEach(([id, nm, mz]) => { const [vid, len] = YT[id], url = 'https://youtu.be/' + vid, dd = DATA.days.find((d) => d.id === id);
      const nums = dd ? dd.duas.map((x) => x.no).filter((n) => /^[০-৯]+$/.test(n)) : [];
      const parts = dd ? dd.duas.filter((x) => x.no !== 'বিসমিল্লাহ').length : 0, info = dd ? (dd.range + ' · অ্যাপে ' + bn(parts) + 'টি দোয়া/অংশ') : 'দোয়ার নম্বর: লেখা যোগ হলে জানা যাবে';
      const r = document.createElement('div'); r.className = 'ytr';
      const t = document.createElement('div'); const b = document.createElement('b'); b.textContent = nm + ' · ' + mz; const s1 = document.createElement('small'); s1.textContent = 'দৈর্ঘ্য ' + len + ' · ' + info; const s2 = document.createElement('small'); s2.textContent = url; t.append(b, s1, s2);
      const a = document.createElement('a'); a.href = url; a.target = '_blank'; a.rel = 'noopener'; a.textContent = 'খুলুন';
      const c = document.createElement('button'); c.type = 'button'; c.textContent = 'লিংক কপি';
      c.onclick = async (e) => { e.stopPropagation(); try { await navigator.clipboard.writeText(url); c.textContent = '✓ কপি হয়েছে'; } catch (x) { const ta = document.createElement('textarea'); ta.value = url; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); c.textContent = '✓ কপি হয়েছে'; } catch (y) { c.textContent = 'কপি হয়নি'; } ta.remove(); } setTimeout(() => { c.textContent = 'লিংক কপি'; }, 2000); };
      r.append(t, a, c); box.appendChild(r); }); })();
  render(); loadMedia(); drawDays();
  try { if (sessionStorage.getItem('mm_pick')) { sessionStorage.removeItem('mm_pick'); $('#fileMsg').textContent = DMETA[1] + '-এর অডিও দিন — নিচের "ফাইল বেছে নিন" চাপুন'; } } catch (e) {}
})();
