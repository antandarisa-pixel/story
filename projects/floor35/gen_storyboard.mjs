// node gen_storyboard.mjs -> STORYBOARD.md and storyboard.html (same data, estimated timings)
import { writeFileSync } from 'node:fs';
import { SCENES, TITLE, estimate } from './storyboard_data.mjs';

const WHO = { N: 'นนท์', K: 'ก้อง', O: 'พี่อ้อย', NOTE: 'โน้ต (V.O.)', '': '—' };
const FB = { K: 'ความทรงจำก้อง', O: 'ความทรงจำพี่อ้อย', M: 'กระดานความคิด' };
const fmt = s => `${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, '0')}`;

let t = 0, n = 0;
for (const sc of SCENES) {
  sc.t0 = t;
  for (const r of sc.rows) {
    r.n = ++n;
    r.d = r.who ? estimate(r.text) : r.dur;
    r.t0 = t; t += r.d; r.t1 = t;
  }
  sc.t1 = t;
}
const TOTAL = t;
const spoken = SCENES.flatMap(s => s.rows).filter(r => r.who).length;
const silent = n - spoken;

// ---------- Markdown ----------
const md = [];
md.push(`# STORYBOARD: "${TITLE}" (หนังสั้นแอนิเมชันวาดมือ 4 ฉาก)`, '');
md.push(`**Logline.** เสียงเคาะ กลิ่นกาแฟ และประตูไม้ไม่มีเลขห้องเหนือชั้นสาม ทำให้คนในออฟฟิศเชื่อว่าตึกมี "ชั้นสี่" นนท์ช่างซ่อมช่างสังเกตไล่หาคำตอบทีละข้อจนพบว่าทั้งหมดคือลม กิ่งไม้ แผ่นไม้อัด กับสมองที่เหนื่อยล้า แล้วเพื่อนๆ ก็เปลี่ยนเรื่องลึกลับให้เป็นมุมพักใจของออฟฟิศ`, '');
md.push(`ความยาวประมาณ ${fmt(TOTAL)} (${n} บีต: ${spoken} ประโยคพูด, ${silent} บีตเงียบ) เวลาทั้งหมดเป็นค่าประมาณจากความยาวประโยคภาษาไทย จะจับเวลาจริงหลังได้ไฟล์เสียงพากย์`, '');
md.push('**ตัวเอก:** นนท์ เพราะเรื่องคือการสืบของเขา เขาได้ช็อตใกล้ ลิปซิงก์ และท่าทางมากที่สุด ก้องกับพี่อ้อยเป็นคนเล่าเรื่องและตอบสนองทุกการกระทำ', '');
md.push('**ผู้แสดงฝั่งตรงข้าม:** แผ่นไม้อัด ปุ่มตาไม้สองจุดกับรอยขีดดูเหมือน "หน้า" ในเงา (สมองปะติดปะต่อภาพ) และค่อยๆ หมดความเป็นหน้าเมื่อแสงส่องเต็ม', '');
for (const sc of SCENES) {
  md.push(`## ฉากที่ ${sc.id}: ${sc.name} ${sc.clock} · ${fmt(sc.t0)}–${fmt(sc.t1)}`, '', `*${sc.place}* · พาเลต: ${sc.paletteNote}`, '');
  md.push('| # | t | ใคร | ประโยค | ช็อต | การแสดง |', '|---|---|---|---|---|---|');
  for (const r of sc.rows)
    md.push(`| ${r.n} | ${r.t0.toFixed(1)}–${r.t1.toFixed(1)} | ${WHO[r.who]} | ${r.who ? r.text : '(เงียบ)'} | ${r.shot} | ${r.act} |`);
  md.push('');
}
writeFileSync(new URL('./STORYBOARD.md', import.meta.url), md.join('\n'));

// ---------- HTML ----------
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const rowHtml = r => `
      <li class="beat${r.who ? '' : ' silent'}${r.fb ? ' fb fb-' + r.fb : ''}">
        <div class="tc"><span class="num">${r.n}</span><span>${r.t0.toFixed(1)}</span><span class="dur">${r.d.toFixed(1)} วิ</span></div>
        <div class="line">
          <span class="who who-${r.who || 'none'}">${WHO[r.who]}</span>${r.fb ? `<span class="tag">${FB[r.fb]}</span>` : ''}
          <p>${r.who ? esc(r.text) : '<em>บีตเงียบ ไม่มีบทพูด</em>'}</p>
        </div>
        <div class="shot"><span class="lab">ช็อต</span>${esc(r.shot)}</div>
        <div class="act"><span class="lab">การแสดง</span>${esc(r.act)}</div>
      </li>`;

const sceneHtml = sc => `
  <section class="scene" id="scene-${sc.id}">
    <header class="scene-head">
      <div>
        <p class="eyebrow">ฉากที่ ${sc.id} · ${fmt(sc.t0)}–${fmt(sc.t1)}</p>
        <h2>${sc.name} <span class="clock">${sc.clock}</span></h2>
        <p class="place">${sc.place}</p>
      </div>
      <div class="pal">
        <div class="sw">${sc.palette.map(c => `<i style="background:${c}" title="${c}"></i>`).join('')}</div>
        <p>${sc.paletteNote}</p>
      </div>
    </header>
    <ol class="beats">${sc.rows.map(rowHtml).join('')}
    </ol>
  </section>`;

const bar = SCENES.map(sc => `<a href="#scene-${sc.id}" style="flex:${(sc.t1 - sc.t0).toFixed(1)}"><b>${sc.id}</b><span>${fmt(sc.t1 - sc.t0)}</span></a>`).join('');

const html = `<title>ชั้นสามครึ่ง</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Mitr:wght@400;500&family=IBM+Plex+Sans+Thai:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
/* Layout: a maintenance notebook on faint graph paper; one long column of beat cards per scene, timecode in the margin. */
:root {
  --paper: #eef1ec; --card: #f9faf6; --ink: #1f2a2e; --muted: #5d6a6a; --rule: #cfd8d2; --grid: #e1e7e1;
  --amber: #b86a1e; --amber-soft: #f3dcc0;
  --who-N: #2f6f68; --who-K: #6d5a9c; --who-O: #a5512f; --who-NOTE: #b0476a; --who-none: #8a9393;
  --fb-K: #e3e9f1; --fb-O: #f1e7d8; --fb-M: #ffffff;
  --display: "Mitr", "IBM Plex Sans Thai", system-ui, sans-serif;
  --body: "IBM Plex Sans Thai", "Noto Sans Thai", system-ui, sans-serif;
  --mono: "IBM Plex Mono", ui-monospace, monospace;
}
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {
  --paper: #141c1d; --card: #1b2526; --ink: #e6ebe6; --muted: #9aa8a6; --rule: #2e3b3c; --grid: #1a2324;
  --amber: #e69a4e; --amber-soft: #3a2a1a;
  --who-N: #6fc2b6; --who-K: #ad9be0; --who-O: #e3906b; --who-NOTE: #ec8fb0; --who-none: #7e8a89;
  --fb-K: #1c2532; --fb-O: #2a2419; --fb-M: #222c2d; color-scheme: dark } }
:root[data-theme="dark"] {
  --paper: #141c1d; --card: #1b2526; --ink: #e6ebe6; --muted: #9aa8a6; --rule: #2e3b3c; --grid: #1a2324;
  --amber: #e69a4e; --amber-soft: #3a2a1a;
  --who-N: #6fc2b6; --who-K: #ad9be0; --who-O: #e3906b; --who-NOTE: #ec8fb0; --who-none: #7e8a89;
  --fb-K: #1c2532; --fb-O: #2a2419; --fb-M: #222c2d; color-scheme: dark }

body { background: var(--paper); color: var(--ink); font-family: var(--body); font-size: 15px; line-height: 1.65;
  background-image: linear-gradient(var(--grid) 1px, transparent 1px), linear-gradient(90deg, var(--grid) 1px, transparent 1px);
  background-size: 24px 24px; }
.wrap { max-width: 1080px; margin: 0 auto; padding-block: 40px 80px;
  padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); }
h1, h2, h3 { font-family: var(--display); font-weight: 500; text-wrap: balance; margin: 0; line-height: 1.25; }
h1 { font-size: clamp(34px, 6vw, 56px); letter-spacing: .01em; }
h1 small { display: block; font-family: var(--body); font-size: 15px; color: var(--muted); font-weight: 400; margin-top: 6px; }
h2 { font-size: 24px; }
h3 { font-size: 17px; }
p { margin: 0; }
.eyebrow { font-family: var(--mono); font-size: 12px; letter-spacing: .08em; text-transform: uppercase; color: var(--amber); }
.mono { font-family: var(--mono); font-variant-numeric: tabular-nums; }

.top { display: grid; gap: 28px; }
.logline { font-size: 18px; max-width: 62ch; }
.stats { display: flex; flex-wrap: wrap; gap: 8px 22px; font-family: var(--mono); font-size: 13px; color: var(--muted); }
.stats b { color: var(--ink); font-weight: 500; }
.timeline { display: flex; gap: 3px; height: 44px; }
.timeline a { display: flex; flex-direction: column; justify-content: center; padding: 0 10px; min-width: 0;
  background: var(--card); border: 1px solid var(--rule); color: var(--ink); text-decoration: none; font-family: var(--mono); font-size: 12px; overflow: hidden; white-space: nowrap; }
.timeline a b { font-weight: 500; color: var(--amber); }
.timeline a:hover, .timeline a:focus-visible { border-color: var(--amber); outline: none; }

.grid2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
.block { display: grid; gap: 10px; align-content: start; min-width: 0; }
.cast { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 12px; }
.person { background: var(--card); border: 1px solid var(--rule); padding: 14px 16px; display: grid; gap: 6px; border-top: 4px solid var(--c); }
.person h3 span { font-family: var(--mono); font-size: 12px; color: var(--muted); font-weight: 400; margin-left: 6px; }
.person p { font-size: 14px; color: var(--muted); }
.person p b { color: var(--ink); font-weight: 500; }
ul.plain { margin: 0; padding-left: 1.1em; display: grid; gap: 4px; }
.qs { background: var(--amber-soft); padding: 16px 18px; display: grid; gap: 8px; }
.qs ol { margin: 0; padding-left: 1.2em; display: grid; gap: 6px; }

.scene { margin-top: 56px; }
.scene-head { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: end; gap: 14px 24px;
  padding-bottom: 14px; border-bottom: 2px solid var(--ink); position: sticky; top: env(safe-area-inset-top, 0px); background: var(--paper); z-index: 2; padding-top: 12px; }
.scene-head .clock { font-family: var(--mono); font-size: 15px; color: var(--muted); margin-left: 6px; }
.scene-head .place { color: var(--muted); font-size: 14px; }
.pal { display: grid; gap: 4px; justify-items: end; max-width: 340px; }
.pal p { font-size: 12px; color: var(--muted); text-align: right; }
.sw { display: flex; }
.sw i { width: 26px; height: 18px; display: block; border: 1px solid var(--rule); margin-left: -1px; }

.beats { list-style: none; margin: 0; padding: 0; display: grid; }
.beat { display: grid; grid-template-columns: 74px minmax(0, 1.25fr) minmax(0, .9fr) minmax(0, 1.5fr); gap: 0 18px;
  padding: 14px 14px 14px 0; border-bottom: 1px solid var(--rule); background: var(--card); }
.beat.silent { background: transparent; }
.beat.fb-K { background: var(--fb-K); } .beat.fb-O { background: var(--fb-O); } .beat.fb-M { background: var(--fb-M); }
.tc { display: grid; align-content: start; justify-items: end; font-family: var(--mono); font-variant-numeric: tabular-nums; font-size: 13px; color: var(--muted); padding-right: 4px; border-right: 1px solid var(--rule); }
.tc .num { font-size: 18px; color: var(--ink); font-weight: 500; line-height: 1.2; }
.tc .dur { font-size: 11px; }
.line p { font-size: 16px; margin-top: 4px; }
.line em { color: var(--muted); font-style: normal; font-size: 14px; }
.who { display: inline-block; font-family: var(--display); font-size: 13px; padding: 0 8px; border-radius: 2px; color: var(--card); background: var(--c); }
.who-N { --c: var(--who-N) } .who-K { --c: var(--who-K) } .who-O { --c: var(--who-O) } .who-NOTE { --c: var(--who-NOTE) }
.who-none { background: transparent; color: var(--who-none); border: 1px solid var(--rule); }
.tag { font-family: var(--mono); font-size: 11px; color: var(--muted); margin-left: 8px; }
.shot, .act { font-size: 14px; min-width: 0; }
.shot { color: var(--muted); }
.lab { display: none; }

@media (max-width: 760px) {
  .beat { grid-template-columns: 56px minmax(0, 1fr); gap: 8px 12px; }
  .shot, .act { grid-column: 2; }
  .lab { display: block; font-family: var(--mono); font-size: 11px; text-transform: uppercase; letter-spacing: .08em; color: var(--amber); }
  .pal { justify-items: start; } .pal p { text-align: left; }
  .scene-head { position: static; }
}
</style>

<div class="wrap">
  <div class="top">
    <div>
      <p class="eyebrow">Storyboard v3 · ยังไม่วาด รออนุมัติ</p>
      <h1>${TITLE}<small>หนังสั้นแอนิเมชันวาดมือแนวสืบสวนเบาๆ · 4 ฉาก · ทีละประโยค</small></h1>
    </div>
    <p class="logline">เสียงเคาะ กลิ่นกาแฟ และประตูไม้ไม่มีเลขห้องเหนือชั้นสาม ทำให้คนในออฟฟิศเชื่อว่าตึกมี "ชั้นสี่" นนท์ช่างซ่อมช่างสังเกตไล่หาคำตอบทีละข้อ จนพบว่าทั้งหมดคือลม กิ่งไม้ แผ่นไม้อัด กับสมองที่เหนื่อยล้า แล้วเพื่อนๆ ก็เปลี่ยนเรื่องลึกลับให้เป็นมุมพักใจของออฟฟิศ</p>
    <div class="stats"><span>ความยาวประมาณ <b>${fmt(TOTAL)}</b></span><span><b>${n}</b> บีต</span><span><b>${spoken}</b> ประโยคพูด</span><span><b>${silent}</b> บีตเงียบ</span><span>เวลาเป็นค่าประมาณ จะจับใหม่จากเสียงพากย์จริง</span></div>
    <nav class="timeline" aria-label="ความยาวแต่ละฉาก">${bar}</nav>

    <div class="block">
      <h2>ตัวละคร</h2>
      <div class="cast">
        <div class="person" style="--c:var(--who-N)"><h3>นนท์<span>29 · ตัวเอก</span></h3>
          <p><b>เงา:</b> สูงโปร่ง เสื้อเชิ้ตช่างสีเขียวหม่นพับแขน ปากกาเหน็บหลังหู</p>
          <p><b>เห็นได้แม้ภาพเล็ก:</b> สมุดโน้ตปกแข็งกับไขควงที่หมุนเล่นตลอด</p>
          <p><b>เล่นแบบ:</b> นิ่ง ใจเย็น คิ้วขมวดนิดเดียว ยิ้มมุมปากตอนเข้าใจ นับนิ้ว กดปากกา</p></div>
        <div class="person" style="--c:var(--who-K)"><h3>ก้อง<span>24 · คนเล่าเรื่อง</span></h3>
          <p><b>เงา:</b> ตัวเล็ก ฮู้ดดี้ตัวโคร่งสีม่วงลาเวนเดอร์ ผมชี้โด่หนึ่งกระจุก</p>
          <p><b>เห็นได้แม้ภาพเล็ก:</b> ขอบตาคล้ำ แก้วกาแฟไม่ห่างมือ</p>
          <p><b>เล่นแบบ:</b> ท่าทางเยอะ วาดมือกลางอากาศ ตาโต ดึงฮู้ดคลุมหัวเวลากลัว</p></div>
        <div class="person" style="--c:var(--who-O)"><h3>พี่อ้อย<span>44 · พยานคนที่สอง</span></h3>
          <p><b>เงา:</b> ผมบ็อบเรียบ คาร์ดิแกนสีอิฐ แว่นอ่านหนังสือห้อยสาย</p>
          <p><b>เห็นได้แม้ภาพเล็ก:</b> แฟ้มเอกสารกอดแนบอก</p>
          <p><b>เล่นแบบ:</b> คล่องแคล่ว เคาะมุมแฟ้มเวลายืนยัน นับขั้นบันไดด้วยนิ้วโดยไม่รู้ตัว</p></div>
        <div class="person" style="--c:var(--amber)"><h3>แผ่นไม้อัด<span>ผู้แสดงฝั่งตรงข้าม</span></h3>
          <p><b>ในเงา:</b> ปุ่มตาไม้สองจุดกับรอยขีด ดูเหมือน "หน้า" ที่มองกลับมา ไม่น่ากลัว แค่แปลก</p>
          <p><b>ในแสงเต็ม:</b> หน้าหายไป เหลือแค่ไม้อัด หัวสกรู และรอยไขควงพลาด</p>
          <p><b>คู่หู:</b> ริบบิ้นกลิ่นสีอำพัน และกิ่งหูกวางที่เคาะตามลม</p></div>
      </div>
    </div>

    <div class="grid2">
      <div class="block">
        <h2>ของประกอบที่เล่าเรื่อง</h2>
        <ul class="plain">
          <li><b>ริบบิ้นกลิ่นอำพัน:</b> ช็อตแรกลอยจากปล่องร้านข้างๆ แล้วจากเครื่องดริปในออฟฟิศ ในแฟลชแบ็กลอดขอบประตู ฉาก 2 ตามเส้นนี้ไปเจอต้นทาง ฉาก 4 ลอยผ่านกระดาษโน้ต</li>
          <li><b>ต้นหูกวาง:</b> ปูไว้ในช็อตเปิด ใบแห้งร่วงลงช่องบันได (ฉาก 1) เฉลยเป็นเสียงเคาะ (ฉาก 2) ปิดเรื่องด้วยการเคาะทักทาย</li>
          <li><b>ไขควง:</b> หมุนเล่นตอนเปิด วางลง "แกร๊ก" ตอนจริงจัง ใช้ด้ามเคาะหาเสียงกลวง แล้วกลับมาหมุนเล่นในเช้าวันจันทร์</li>
          <li><b>สมุดโน้ต:</b> ไอคอนสามอัน (ไม้ ริบบิ้น บันได) วาดในฉาก 1 ติ๊กถูกในฉาก 2 และปากกาด้ามเดียวกันเขียนโน้ตตอนจบ</li>
          <li><b>แปลนอาคาร:</b> โชว์ 3 ชั้นในฉาก 1 แล้วไม้บรรทัดนับขั้นยืนยันในฉาก 3</li>
          <li><b>นิ้วนับของพี่อ้อย:</b> นับเกินในแฟลชแบ็ก นับตรงในฉาก 3</li>
        </ul>
      </div>
      <div class="block">
        <h2>โลกและภาพ</h2>
        <ul class="plain">
          <li>สีน้ำและหมึกแบบ 2D แบน เส้นสั่นนิดๆ (boil) เหมือน "ต้นกับทะเล"</li>
          <li>แสงเล่าเวลา: ครีมยามเช้า → ส้มเย็น → ทองเย็นวันศุกร์ → เช้าวันจันทร์ที่สดใสที่สุด</li>
          <li><b>ไม่มีตัวหนังสือบนจอนอกจากซับ:</b> ไม่มีไตเติลวาด ข้อความบนโน้ตเป็นเส้นหวัดแล้วอ่านผ่านเสียงกับซับ</li>
          <li><b>บอกวันเวลาด้วยภาพอย่างเดียว:</b> นาฬิกาแขวน นาฬิกาข้อมือ ปฏิทินตั้งโต๊ะที่วงและกากบาทช่องวัน (ไม่มีตัวหนังสือ) และสีแสงของแต่ละช่วงเวลา</li>
          <li>แฟลชแบ็กของก้องเป็นโทนเทาฟ้า ของพี่อ้อยเป็นซีเปีย ฉาก 3 สองโทนเลื่อนมาซ้อนกัน</li>
          <li>ทรานซิชัน: แปรงปาดเข้าแฟลชแบ็ก, ใบพัดลมเบลอ (ฉาก 1→2), ไฟฉายดับ (2→3), ละลายภาพ (3→4)</li>
          <li>ตอนจบสัมผัสกับตอนเปิด: ฝุ่นในแสงเช้า หมุนไขควง และเสียงเคาะที่คราวนี้นนท์เคาะตอบ</li>
          <li><b>ซับไตเติล:</b> ภาษาไทยแบบคาราโอเกะ วางข้างหัวคนพูด สีประจำตัวละคร คำเด่นมีเอฟเฟกต์ เช่น "ก๊อก" เด้งสามจังหวะ "กลิ่นกาแฟ" ลอยเป็นไอ "ชั้นสี่" สั่นนิดๆ</li>
        </ul>
      </div>
    </div>

    <div class="qs">
      <h3>ยังรอคำตอบก่อนเริ่มวาด</h3>
      <ol>
        <li><b>เสียงพากย์ไทย:</b> เครื่องนี้ยังไม่มี TTS ภาษาไทยที่ตั้งค่าไว้ จะอัดเสียงเองแล้วอัปโหลด หรือให้ใช้ TTS (ต้องมี API key)</li>
        <li><b>ความยาว:</b> ประมาณ ${fmt(TOTAL)} เครื่องคลาวด์นี้เรนเดอร์ราว 12–35 วิต่อเฟรม เต็มเรื่องจะใช้เวลาหลายสิบชั่วโมง ทำ preview 720p ทีละฉากได้ หรือจะตัดบทให้สั้นลง</li>
      </ol>
    </div>
  </div>
${SCENES.map(sceneHtml).join('')}
</div>
`;
writeFileSync(new URL('./storyboard.html', import.meta.url), html);
console.log(`total ${fmt(TOTAL)}  beats ${n}  spoken ${spoken}  silent ${silent}`);
for (const sc of SCENES) console.log(`scene ${sc.id}: ${fmt(sc.t0)}-${fmt(sc.t1)} (${sc.rows.length} beats)`);
