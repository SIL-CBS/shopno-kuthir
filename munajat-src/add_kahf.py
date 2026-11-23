"""Add Surah Al-Kahf (18) to munajat/data.js as day id 'kahf'.
Source text: quran-json@3.1.2 (Uthmani text from quranenc.com, Bangla translation and English
transliteration from Tanzil). Cards = the 12 rukus, lines = ayat. Times are a proportional
estimate (approx=true); the app rescales them to the real audio length until the audio is aligned."""
import json, re, sys
ROOT = sys.argv[1]
q = json.load(open(ROOT + '/munajat-src/quran_18_bn.json', encoding='utf8'))
V = q['verses']; assert len(V) == 110
BD = str.maketrans('0123456789', '০১২৩৪৫৬৭৮৯'); b = lambda n: str(n).translate(BD)
RUKU = [(1, 12), (13, 17), (18, 22), (23, 31), (32, 44), (45, 49), (50, 53), (54, 59), (60, 70), (71, 82), (83, 101), (102, 110)]
DIAC = re.compile('[ؐ-ًؚ-ٰٟۖ-ۭ࣓-ࣿ]')
NORM = lambda t: t.replace('\u06e1', '\u0652').replace('\u06de', '').replace('  ', ' ').strip()
w = lambda t: len(DIAC.sub('', t).replace(' ', '')) + 14   # letters + a pause after each ayat
BIS0 = 'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ'
BIS = NORM(BIS0)
units = [('বিসমিল্লাহ', [dict(ar=BIS, bn='Bismillahi alrrahmani alrraheemi', mn='পরম করুণাময়, অসীম দয়ালু আল্লাহর নামে।', w=w(BIS))], None)]
WAQF = set('ۖۗۘۙۚۛۜ')
LET = lambda t: len(DIAC.sub('', t).replace(' ', ''))
def pieces(words):
    """Split an ayat (list of words) into lines: at waqf marks first, then long runs into ~8-word chunks."""
    if LET(' '.join(words)) <= 75: return [words]
    segs, cur = [], []
    for wd in words:
        cur.append(wd)
        if any(c in WAQF for c in wd) and LET(' '.join(cur)) >= 25: segs.append(cur); cur = []
    if cur:
        if segs and LET(' '.join(cur)) < 20: segs[-1] += cur
        else: segs.append(cur)
    out = []
    for sg in segs:
        n = LET(' '.join(sg))
        if n <= 85: out.append(sg); continue
        k = -(-n // 70); size = -(-len(sg) // k)
        out += [sg[i:i + size] for i in range(0, len(sg), size)]
    if len(out) > 1 and LET(' '.join(out[-1])) < 15: out[-2] += out.pop()
    return out
for v in V:
    ar = NORM(v['text']); aw = ar.split(' '); tw = v['transliteration'].split(' ')
    ps = pieces(aw); lines = []; ti = 0
    for k, pc in enumerate(ps):
        if len(aw) == len(tw): tn = len(pc)
        else: tn = round(len(tw) * len(pc) / len(aw)) if k < len(ps) - 1 else len(tw) - ti
        tr = ' '.join(tw[ti:ti + tn]) if k < len(ps) - 1 else ' '.join(tw[ti:]); ti += tn
        lines.append(dict(ar=' '.join(pc), bn=tr, mn=v['translation'] if k == len(ps) - 1 else '', w=w(' '.join(pc))))
    n = b(v['id'])
    units.append((n, lines, dict(t='q', txt='সূরা আল-কাহফ ১৮:' + n, url='https://quran.com/18/%d' % v['id'], short='কাহফ ১৮:' + n)))
DUR = 2700.0
tot = sum(L['w'] for _, ls, _ in units for L in ls); t = 2.0; scale = (DUR - 4) / tot
duas = []
for no, ls, ref in units:
    s0 = t; out = []
    for L in ls:
        e = round(t + L['w'] * scale, 2); out.append(dict(ar=L['ar'], bn=L['bn'], mn=L['mn'], s=round(t, 2), e=e)); t = e
    d = dict(no=no, s=round(s0, 2), e=round(t, 2), lines=out)
    if ref: d['ref'] = ref
    duas.append(d)
day = dict(id='kahf', title='সূরা আল-কাহফ', range='আয়াত ১–১১০', mnSrc='', unit='আয়াত', approx=True, duas=duas, dur=DUR)
p = ROOT + '/munajat/data.js'; s = open(p, encoding='utf8').read()
pre = 'window.MUNAJAT = '; assert s.startswith(pre)
D = json.loads(s[len(pre):].rstrip().rstrip(';'))
D['days'] = [x for x in D['days'] if x['id'] != 'kahf'] + [day]
open(p, 'w', encoding='utf8').write(pre + json.dumps(D, ensure_ascii=False) + ';\n')
print('ok', len(duas), 'cards', sum(len(d['lines']) for d in duas), 'lines')
