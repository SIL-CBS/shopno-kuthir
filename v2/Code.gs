/**
 * স্বপ্ন কুঠির — এন্ট্রি API (Google Sheet ডেটাবেস)
 * Sheet-এ "Entries" ট্যাব থাকতে হবে। setup() একবার চালালে ৩টা কী তৈরি হয়।
 * ভূমিকা: admin (সব পারে), manager (এন্ট্রি দেয়, অনুমোদন লাগে), viewer (শুধু দেখে)।
 */
var COLS = ['id','t','date','month','amt','desc','head','sl','page','member','src','chq','by','at','status','img','warn'];
var INCOLS = ['id','name','fileId','at','by','status','note'];
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
    if (b.action === 'upload') {
      var inf = folder_('Inbox'); if (!inf) return out_({ok: false, error: 'run_setup2'});
      if (!b.data || String(b.data).length > 9000000) return out_({ok: false, error: 'too_big'});
      var id = Utilities.getUuid().slice(0, 8), nm = String(b.name || 'photo.jpg').replace(/[^\w.\-]/g, '_');
      var file = inf.createFile(Utilities.newBlob(Utilities.base64Decode(b.data), b.mime || 'image/jpeg', id + '__' + nm));
      inSheet_().appendRow([id, nm, file.getId(), new Date().toISOString(), r, 'waiting', '']);
      return out_({ok: true, id: id});
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
  if (!sh) { sh = ss.insertSheet('Inbox'); sh.appendRow(INCOLS); sh.getRange('A:G').setNumberFormat('@'); }
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
