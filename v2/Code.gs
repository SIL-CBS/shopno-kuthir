/**
 * স্বপ্ন কুঠির — এন্ট্রি API (Google Sheet ডেটাবেস)
 * Sheet-এ "Entries" ট্যাব থাকতে হবে। setup() একবার চালালে ৩টা কী তৈরি হয়।
 * ভূমিকা: admin (সব পারে), manager (এন্ট্রি দেয়, অনুমোদন লাগে), viewer (শুধু দেখে)।
 */
var COLS = ['id','t','date','month','amt','desc','head','sl','page','member','src','chq','by','at','status'];
var SHEET = 'Entries';

function setup() {
  var p = PropertiesService.getScriptProperties();
  function k() { return Utilities.getUuid().replace(/-/g, '').slice(0, 16); }
  p.setProperties({ADMIN_KEY: k(), MANAGER_KEY: k(), VIEWER_KEY: k()}, true);
  var sh = SpreadsheetApp.getActive().getSheetByName(SHEET) || SpreadsheetApp.getActive().insertSheet(SHEET);
  sh.getRange('A:O').setNumberFormat('@');
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
  return out_({ok: true, role: r, rows: list});
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
    var hit = rows_().filter(function (x) { return String(x.id) === String(b.id); })[0];
    if (!hit) return out_({ok: false, error: 'not_found'});
    var st = COLS.indexOf('status') + 1;
    if (b.action === 'approve') { sheet_().getRange(hit._row, st).setValue('approved'); return out_({ok: true}); }
    if (b.action === 'delete') { sheet_().getRange(hit._row, st).setValue('deleted'); return out_({ok: true}); }
    return out_({ok: false, error: 'bad_action'});
  } finally { lock.releaseLock(); }
}
