/**
 * স্বপ্ন কুঠির — এন্ট্রি API (Google Sheet ডেটাবেস)
 * Sheet-এ "Entries" ট্যাব থাকতে হবে। setup() একবার চালালে ৩টা কী তৈরি হয়।
 * ভূমিকা: admin (সব পারে), manager (এন্ট্রি দেয়, অনুমোদন লাগে), viewer (শুধু দেখে)।
 */
var COLS = ['id','t','date','month','amt','desc','head','sl','page','member','src','chq','by','at','status','img','warn'];
var INCOLS = ['id','name','fileId','at','by','status','note','label','view'];
var EDIT = ['t','date','month','amt','desc','head','sl','page','member','src','chq'];
var SHEET = 'Entries';

function setup() {
  var p = PropertiesService.getScriptProperties();
  function k() { return Utilities.getUuid().replace(/-/g, '').slice(0, 16); }
  p.setProperties({ADMIN_KEY: k(), MANAGER_KEY: k(), VIEWER_KEY: k()}, true);
  var sh = SpreadsheetApp.getActive().getSheetByName(SHEET) || SpreadsheetApp.getActive().insertSheet(SHEET);
  sh.getRange('A:Q').setNumberFormat('@');
  if (sh.getLastRow() === 0) sh.appendRow(COLS);
  var ks = SpreadsheetApp.getActive().getSheetByName('Keys') || SpreadsheetApp.getActive().insertSheet('Keys');
  ks.clear(); ks.getRange(1, 1, 4, 2).setValues([['ভূমিকা / Role', 'কী / Key (গোপন রাখুন)'], ['admin', p.getProperty('ADMIN_KEY')], ['manager', p.getProperty('MANAGER_KEY')], ['viewer', p.getProperty('VIEWER_KEY')]]);
}

function role_(key) {
  if (!key) return null;
  var p = PropertiesService.getScriptProperties();
  if (key === p.getProperty('ADMIN_KEY')) return 'admin';
  if (key === p.getProperty('MANAGER_KEY')) return 'manager';
  if (key === p.getProperty('VIEWER_KEY')) return 'viewer';
  return null;
}
function out_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function sheet_() { return SpreadsheetApp.getActive().getSheetByName(SHEET); }
function rows_() {
  var v = sheet_().getDataRange().getValues(), res = [];
  for (var i = 1; i < v.length; i++) { var o = {}; COLS.forEach(function (c, j) { var x = v[i][j]; o[c] = x instanceof Date ? Utilities.formatDate(x, 'Asia/Dhaka', c === 'month' ? 'yyyy-MM' : 'yyyy-MM-dd') : x; }); o._row = i + 1; res.push(o); }
  return res;
}

function doGet(e) {
  var r = role_(e.parameter.key);
  if (!r) return out_({ok: false, error: 'bad_key'});
  var list = rows_().filter(function (o) { return o.status !== 'deleted'; });
  if (r !== 'admin') list = list.filter(function (o) { return o.status === 'approved' || (r === 'manager' && o.status === 'pending'); });
  list.forEach(function (o) { delete o._row; });
  var res = {ok: true, role: r, rows: list};
  if (r === 'admin') { try { res.inbox = inRows_().filter(function (o) { return o.status !== 'removed'; }).map(function (o) { delete o._row; return o; }); } catch (x) { res.inbox = []; } }
  return out_(res);
}

function doPost(e) {
  var b = {}; try { b = JSON.parse(e.postData.contents); } catch (x) { return out_({ok: false, error: 'bad_json'}); }
  if (b.action === 'login' || b.action === 'chpw') return out_(userAuth_(b));
  var r = role_(b.key);
  if (!r || r === 'viewer') return out_({ok: false, error: 'not_allowed'});
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    if (b.action === 'add') {
      var o = b.row || {}; o.id = Utilities.getUuid().slice(0, 8); o.at = new Date().toISOString(); o.by = r;
      o.status = (r === 'admin' && !b.pending) ? 'approved' : 'pending';
      sheet_().appendRow(COLS.map(function (c) { return o[c] === undefined ? '' : o[c]; }));
      return out_({ok: true, row: o});
    }
    if (r !== 'admin') return out_({ok: false, error: 'admin_only'});
    if (/^(users_list|user_save|user_del|users_import|vk_set)$/.test(b.action)) return out_(userAdmin_(b));
    if (b.action === 'upload') {
      var inf = folder_('Inbox'); if (!inf) return out_({ok: false, error: 'run_setup2'});
      if (!b.data || String(b.data).length > 9000000) return out_({ok: false, error: 'too_big'});
      var id = Utilities.getUuid().slice(0, 8), nm = String(b.name || 'photo.jpg').replace(/[^\w.\-]/g, '_');
      var file = inf.createFile(Utilities.newBlob(Utilities.base64Decode(b.data), b.mime || 'image/jpeg', id + '__' + nm));
      inSheet_().appendRow([id, nm, file.getId(), new Date().toISOString(), r, 'waiting', '', String(b.label || '').slice(0, 200)]);
      return out_({ok: true, id: id});
    }
    if (b.action === 'inbox_view') {
      var vh = inRows_().filter(function (x) { return String(x.id) === String(b.id); })[0];
      if (!vh) return out_({ok: false, error: 'not_found'});
      inSheet_().getRange(vh._row, 9).setValue(String(b.view || '').slice(0, 30)); return out_({ok: true});
    }
    if (b.action === 'getimg') {
      var gi = inRows_().filter(function (x) { return String(x.id) === String(b.id); })[0];
      if (!gi) return out_({ok: false, error: 'not_found'});
      try { var gf = DriveApp.getFileById(gi.fileId).getBlob(); return out_({ok: true, mime: gf.getContentType(), data: Utilities.base64Encode(gf.getBytes())}); } catch (x) { return out_({ok: false, error: 'no_file'}); }
    }
    if (b.action === 'inbox_del') {
      var ih = inRows_().filter(function (x) { return String(x.id) === String(b.id); })[0];
      if (!ih) return out_({ok: false, error: 'not_found'});
      inSheet_().getRange(ih._row, 6).setValue('removed'); try { DriveApp.getFileById(ih.fileId).setTrashed(true); } catch (x) {}
      return out_({ok: true});
    }
    var hit = rows_().filter(function (x) { return String(x.id) === String(b.id); })[0];
    if (!hit) return out_({ok: false, error: 'not_found'});
    var st = COLS.indexOf('status') + 1;
    if (b.action === 'approve') { sheet_().getRange(hit._row, st).setValue('approved'); return out_({ok: true}); }
    if (b.action === 'update') {
      var ch = b.row || {}; ensureCols_();
      EDIT.forEach(function (c) { if (ch[c] !== undefined) sheet_().getRange(hit._row, COLS.indexOf(c) + 1).setValue(ch[c]); });
      if (ch.warn !== undefined) sheet_().getRange(hit._row, COLS.indexOf('warn') + 1).setValue(ch.warn);
      return out_({ok: true});
    }
    if (b.action === 'delete') { sheet_().getRange(hit._row, st).setValue('deleted'); return out_({ok: true}); }
    return out_({ok: false, error: 'bad_action'});
  } finally { lock.releaseLock(); }
}


/* ---------- ছবি Inbox (ছবি → Claude পড়ে → Results ফোল্ডারে JSON → ingest → Entries-এ pending) ---------- */
function inSheet_() {
  var ss = SpreadsheetApp.getActive(), sh = ss.getSheetByName('Inbox');
  if (!sh) { sh = ss.insertSheet('Inbox'); sh.appendRow(INCOLS); sh.getRange('A:I').setNumberFormat('@'); }
  if (sh.getRange(1, 8).getValue() !== 'label') { sh.getRange(1, 8).setValue('label'); sh.getRange('H:H').setNumberFormat('@'); }
  if (sh.getRange(1, 9).getValue() !== 'view') { sh.getRange(1, 9).setValue('view'); sh.getRange('I:I').setNumberFormat('@'); }
  return sh;
}
function ensureCols_() {
  var sh = sheet_(), n = sh.getLastColumn();
  if (n < COLS.length) { sh.getRange(1, 1, 1, COLS.length).setValues([COLS]); sh.getRange('A:Q').setNumberFormat('@'); }
}
function folder_(name) {
  var id = PropertiesService.getScriptProperties().getProperty('F_' + name);
  return id ? DriveApp.getFolderById(id) : null;
}
function inRows_() {
  var v = inSheet_().getDataRange().getValues(), res = [];
  for (var i = 1; i < v.length; i++) { var o = {}; INCOLS.forEach(function (c, j) { var x = v[i][j]; o[c] = x instanceof Date ? x.toISOString() : x; }); o._row = i + 1; res.push(o); }
  return res;
}

/** একবার চালান (Run): Drive ফোল্ডার, Inbox ট্যাব, ১০ মিনিটের ট্রিগার বানায়। */
function setup2() {
  var ss = SpreadsheetApp.getActive(), p = PropertiesService.getScriptProperties();
  var parents = DriveApp.getFileById(ss.getId()).getParents(), parent = parents.hasNext() ? parents.next() : DriveApp.getRootFolder();
  ['Inbox', 'Results', 'Processed'].forEach(function (n) {
    if (folder_(n)) return;
    var it = parent.getFoldersByName(n), f = it.hasNext() ? it.next() : parent.createFolder(n);
    p.setProperty('F_' + n, f.getId());
  });
  inSheet_(); ensureCols_();
  ScriptApp.getProjectTriggers().forEach(function (t) { if (t.getHandlerFunction() === 'ingest') ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('ingest').timeBased().everyMinutes(10).create();
  return 'ok';
}

/** Results ফোল্ডারের res_*.json পড়ে Entries-এ pending সারি বসায় (ট্রিগারে চলে)। */
function ingest() {
  var rf = folder_('Results'), pf = folder_('Processed'); if (!rf || !pf) return;
  var lock = LockService.getScriptLock(); lock.waitLock(30000);
  try {
    ensureCols_();
    var it = rf.getFiles(), n = 0;
    while (it.hasNext() && n < 30) {
      var f = it.next(); n++;
      var j; try { j = JSON.parse(f.getBlob().getDataAsString('UTF-8')); } catch (x) { f.setName('bad_' + f.getName()); pf.addFile(f); rf.removeFile(f); continue; }
      var inId = String(j.inbox || ''), rows = j.rows || [];
      rows.forEach(function (r) {
        var o = {}; EDIT.forEach(function (c) { if (r[c] !== undefined && r[c] !== null) o[c] = r[c]; });
        o.id = Utilities.getUuid().slice(0, 8); o.at = new Date().toISOString(); o.by = 'claude'; o.status = 'pending'; o.img = inId; o.warn = r.warn || '';
        sheet_().appendRow(COLS.map(function (c) { return o[c] === undefined ? '' : o[c]; }));
      });
      var hit = inRows_().filter(function (x) { return String(x.id) === inId; })[0];
      if (hit) { var sh = inSheet_(); sh.getRange(hit._row, 6).setValue(rows.length ? 'read' : 'failed'); sh.getRange(hit._row, 7).setValue(j.note || (rows.length ? rows.length + ' এন্ট্রি' : 'পড়া যায়নি')); }
      pf.addFile(f); rf.removeFile(f);
    }
  } finally { lock.releaseLock(); }
}


/* ---------- ইউজার ও পাসওয়ার্ড (Users ট্যাব) ----------
 * লগইন: User ID (মোবাইলের শেষ ৬ অঙ্ক) + ব্যক্তিগত পাসওয়ার্ড। লগইন ঠিক হলে অ্যাপ খোলার চাবি (vk) ও পেজ-তালিকা ফেরত যায়।
 * পাসওয়ার্ড অ্যাডমিন দেখতে পারেন বলে Users ট্যাবে সরাসরি রাখা হয়: এই শিট কারো সাথে শেয়ার করবেন না।
 */
var UCOLS = ['uid', 'name', 'mobile', 'group', 'pw', 'pages', 'active', 'updated'];
var GROUPS = {admin: {n: 'অ্যাডমিন', r: 'admin', v: 0}, manager: {n: 'ম্যানেজার', r: 'manager', v: 1}, service: {n: 'সার্ভিস চার্জ', r: 'viewer', v: 2}, share: {n: 'শেয়ারহোল্ডার', r: 'viewer', v: 2}};
var VNAMES = ['admin', 'manager', 'viewer'];
function uSheet_() {
  var ss = SpreadsheetApp.getActive(), sh = ss.getSheetByName('Users');
  if (!sh) { sh = ss.insertSheet('Users'); sh.getRange('A:H').setNumberFormat('@'); sh.appendRow(UCOLS); }
  return sh;
}
function uRows_() {
  var v = uSheet_().getDataRange().getValues(), res = [];
  for (var i = 1; i < v.length; i++) { if (v[i][0] === '' && v[i][1] === '') continue; var o = {}; UCOLS.forEach(function (c, j) { o[c] = String(v[i][j] === undefined ? '' : v[i][j]); }); o._row = i + 1; res.push(o); }
  return res;
}
function digits6_(x) { return String(x || '').replace(/\D/g, '').slice(-6); }
function pub_(o) { return {uid: o.uid, name: o.name, mobile: o.mobile, group: o.group, pw: o.pw, pages: o.pages || '*', active: o.active === 'no' ? 'no' : 'yes', updated: o.updated}; }
function userAuth_(b) {
  var rows = uRows_(); if (!rows.length) return {ok: false, error: 'not_ready'};
  var uid = digits6_(b.uid), u = rows.filter(function (o) { return o.uid === uid; })[0];
  if (!u || u.active === 'no' || String(b.pw) !== u.pw || !GROUPS[u.group]) { Utilities.sleep(800); return {ok: false, error: 'bad'}; }
  if (b.action === 'chpw') {
    var np = String(b.npw || ''); if (np.length < 4 || np.length > 40) return {ok: false, error: 'short'};
    var lock = LockService.getScriptLock(); lock.waitLock(20000);
    try { uSheet_().getRange(u._row, 5).setValue(np); uSheet_().getRange(u._row, 8).setValue(new Date().toISOString()); } finally { lock.releaseLock(); }
    return {ok: true};
  }
  var vk = {}; try { vk = JSON.parse(PropertiesService.getScriptProperties().getProperty('VK') || '{}'); } catch (x) {}
  var g = GROUPS[u.group], key = vk[VNAMES[g.v]];
  if (!key) return {ok: false, error: 'not_ready'};
  try { var ls = SpreadsheetApp.getActive(), lg = ls.getSheetByName('Log') || ls.insertSheet('Log'); if (lg.getLastRow() === 0) lg.appendRow(['time', 'uid', 'name', 'group', 'device']); lg.appendRow([Utilities.formatDate(new Date(), 'Asia/Dhaka', 'yyyy-MM-dd HH:mm:ss'), u.uid, u.name, g.n, String(b.dev || '')]); } catch (x) {}
  return {ok: true, user: {uid: u.uid, name: u.name, group: g.n, role: g.r, pages: u.pages || '*'}, v: g.v, vk: key};
}
function userAdmin_(b) {
  var sh = uSheet_(), rows = uRows_(), now = new Date().toISOString();
  function admins_(skip) { return rows.filter(function (o) { return o.group === 'admin' && o.active !== 'no' && o.uid !== skip; }).length; }
  if (b.action === 'users_list') {
    var vk = {}; try { vk = JSON.parse(PropertiesService.getScriptProperties().getProperty('VK') || '{}'); } catch (x) {}
    return {ok: true, users: rows.map(pub_), vkSet: !!(vk.admin && vk.manager && vk.viewer)};
  }
  if (b.action === 'vk_set') {
    var k = b.vk || {}; if (!k.admin || !k.manager || !k.viewer) return {ok: false, error: 'bad_keys'};
    PropertiesService.getScriptProperties().setProperty('VK', JSON.stringify({admin: String(k.admin), manager: String(k.manager), viewer: String(k.viewer)})); return {ok: true};
  }
  if (b.action === 'users_import') {
    if (rows.length && !b.force) return {ok: false, error: 'not_empty'};
    var list = (b.users || []).filter(function (u) { return digits6_(u.uid).length === 6 && GROUPS[u.group]; });
    if (!list.length) return {ok: false, error: 'empty'};
    var vals = list.map(function (u) { return [digits6_(u.uid), String(u.name || ''), String(u.mobile || ''), u.group, String(u.pw || ''), String(u.pages || '*'), u.active === 'no' ? 'no' : 'yes', now]; });
    sh.getRange(2, 1, Math.max(sh.getLastRow(), 1), 8).clearContent();
    sh.getRange(2, 1, vals.length, 8).setNumberFormat('@').setValues(vals);
    return {ok: true, n: vals.length};
  }
  var uid = digits6_(b.uid || (b.user || {}).uid);
  if (b.action === 'user_del') {
    var d = rows.filter(function (o) { return o.uid === uid; })[0]; if (!d) return {ok: false, error: 'not_found'};
    if (d.group === 'admin' && admins_(uid) < 1) return {ok: false, error: 'last_admin'};
    sh.deleteRow(d._row); return {ok: true};
  }
  if (b.action === 'user_save') {
    var u = b.user || {}; if (uid.length !== 6) return {ok: false, error: 'bad_uid'};
    var cur = rows.filter(function (o) { return o.uid === uid; })[0];
    var grp = u.group || (cur && cur.group) || 'share'; if (!GROUPS[grp]) return {ok: false, error: 'bad_group'};
    var act = u.active === 'no' ? 'no' : 'yes';
    if (cur && cur.group === 'admin' && (grp !== 'admin' || act === 'no') && admins_(uid) < 1) return {ok: false, error: 'last_admin'};
    var pw = u.pw !== undefined && u.pw !== '' ? String(u.pw) : (cur ? cur.pw : '');
    if (pw.length < 4) return {ok: false, error: 'short_pw'};
    var row = [uid, String(u.name !== undefined ? u.name : (cur ? cur.name : '')), String(u.mobile !== undefined ? u.mobile : (cur ? cur.mobile : '')), grp, pw, String(u.pages !== undefined ? u.pages : (cur ? cur.pages : '*')) || '*', act, now];
    if (cur) sh.getRange(cur._row, 1, 1, 8).setValues([row]); else { sh.getRange(sh.getLastRow() + 1, 1, 1, 8).setNumberFormat('@'); sh.appendRow(row); }
    return {ok: true};
  }
  return {ok: false, error: 'bad_action'};
}
