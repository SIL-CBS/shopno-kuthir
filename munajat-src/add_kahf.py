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
for a, z in RUKU:
    lines = [dict(ar=NORM(v['text']), bn=v['transliteration'], mn=v['translation'] + ' (' + b(v['id']) + ')', w=w(v['text'])) for v in V[a - 1:z]]
    rng = b(a) + '–' + b(z)
    units.append((rng, lines, dict(t='q', txt='সূরা আল-কাহফ ১৮:' + rng, url='https://quran.com/18/%d-%d' % (a, z), short='কাহফ ' + rng)))
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
day = dict(id='kahf', title='সূরা আল-কাহফ', range='১১০ আয়াত · ১২ রুকু', mnSrc='', unit='আয়াত', approx=True, duas=duas, dur=DUR)
p = ROOT + '/munajat/data.js'; s = open(p, encoding='utf8').read()
pre = 'window.MUNAJAT = '; assert s.startswith(pre)
D = json.loads(s[len(pre):].rstrip().rstrip(';'))
D['days'] = [x for x in D['days'] if x['id'] != 'kahf'] + [day]
open(p, 'w', encoding='utf8').write(pre + json.dumps(D, ensure_ascii=False) + ';\n')
print('ok', len(duas), 'cards', sum(len(d['lines']) for d in duas), 'lines')
