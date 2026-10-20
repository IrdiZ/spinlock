---
title: "two clip paths walk into a group and never leave"
subtitle: "how my ai broke an animation editor at 2am, and then helped me find out why"
date: 2026-10-20
excerpt: "two clipPaths in one svg group froze the svgator editor until chrome ran out of memory. i narrowed it down, caught the layers panel stuck in an endless redraw loop, and found a simple workaround."
tags: ["bugs", "svgator", "building in public", "svg", "debugging"]
painting: wheatstacks
draft: false
---

<figure class="tcp-fig tcp-box">
<div class="tcp-scroll">
<svg viewBox="0 0 640 260" role="img" aria-labelledby="tcp-hero-t">
<title id="tcp-hero-t">clip a and clip b endlessly swapping the top spot inside one group</title>
<rect x="16" y="16" width="400" height="228" style="fill:none;stroke:var(--line);stroke-width:2;stroke-dasharray:6 6"/>
<text x="32" y="44" style="fill:var(--cmt);font-size:13px">group</text>
<g class="tcp-swap-a">
<rect x="40" y="60" width="352" height="52" style="fill:rgba(255,166,87,.12);stroke:var(--var);stroke-width:2"/>
<text x="60" y="92" style="fill:var(--var);font-size:15px">clipPath a · rounded frame</text>
</g>
<g class="tcp-swap-b">
<rect x="40" y="126" width="352" height="52" style="fill:rgba(121,192,255,.12);stroke:var(--num);stroke-width:2"/>
<text x="60" y="158" style="fill:var(--num);font-size:15px">clipPath b · reveal</text>
</g>
<rect x="40" y="192" width="352" height="36" style="fill:var(--term-bar);stroke:var(--line)"/>
<text x="60" y="215" style="fill:var(--cmt);font-size:13px">bg rect (just vibing)</text>
<text x="436" y="96" style="fill:var(--white);font-size:14px">"after you"</text>
<text x="436" y="162" style="fill:var(--white);font-size:14px">"no, after you"</text>
<text x="436" y="214" style="fill:var(--kw);font-size:12px">chrome: out of memory</text>
</svg>
</div>
<figcaption>moves so far: <span class="tcp-count" id="tcp-moves">0</span> · in the real editor this happens about 900 times a second</figcaption>
</figure>

so it's monday night and i'm in a challenge i signed up for like four hours ago. svgator x contra, animated templates, ten grand on the table, deadline tomorrow. and i'm not even drawing in the editor like a normal person. i've got an ai plugged straight into svgator through their mcp, so i talk and it builds, keyframes appearing out of nowhere like some radio station in the desert only i can hear at 2am. it's beautiful. it's the future. and then the tab dies.

not a crash with a nice little error. the fan spins up, the page goes grey, chrome says out of memory and goes quiet. i reload. same thing. ok.

## taste everything

here's the thing about bugs, they're like a kitchen at 11pm, everybody's tired and something's burning and nobody can tell you what. you have to taste everything. so that's what we did. made a folder called "zz test projects (safe to delete)" and started cutting the template in half, and in half again, like taking ingredients out of a sauce until it stops tasting wrong.

<figure class="tcp-fig">
<div class="tcp-steps">
<div class="tcp-step"><div class="tcp-chips"><span class="tcp-chip">images</span><span class="tcp-chip">text</span><span class="tcp-chip">buttons</span><span class="tcp-chip">labels</span><span class="tcp-chip tcp-a">clip a</span><span class="tcp-chip tcp-b">clip b</span><span class="tcp-chip">bg</span></div><span class="tcp-pill tcp-dead">dead</span></div>
<div class="tcp-step"><div class="tcp-chips"><span class="tcp-chip">images</span><span class="tcp-chip">text</span><span class="tcp-chip">buttons</span><span class="tcp-chip">labels</span><span class="tcp-chip tcp-gone">clip a</span><span class="tcp-chip tcp-gone">clip b</span><span class="tcp-chip">bg</span></div><span class="tcp-pill tcp-alive">alive</span></div>
<div class="tcp-step"><div class="tcp-chips"><span class="tcp-chip tcp-gone">images</span><span class="tcp-chip tcp-gone">text</span><span class="tcp-chip tcp-gone">buttons</span><span class="tcp-chip tcp-gone">labels</span><span class="tcp-chip tcp-a">clip a</span><span class="tcp-chip tcp-b">clip b</span><span class="tcp-chip">bg</span></div><span class="tcp-pill tcp-dead">dead</span></div>
<div class="tcp-step"><div class="tcp-chips"><span class="tcp-chip tcp-gone">images</span><span class="tcp-chip tcp-gone">text</span><span class="tcp-chip tcp-gone">buttons</span><span class="tcp-chip tcp-gone">labels</span><span class="tcp-chip tcp-gone">clip a</span><span class="tcp-chip tcp-b">clip b</span><span class="tcp-chip">bg</span></div><span class="tcp-pill tcp-alive">alive</span></div>
</div>
<figcaption>the sauce, reduced. everything else can stay or go, doesn't matter. two clips in the same group = dead tab.</figcaption>
</figure>

and it gets down to almost nothing. a background rectangle and two clip paths. one rounded frame, one reveal that grows and shrinks. nothing even uses them. that's it, that's the whole project, and it kills the browser. take one clip away and it opens fine. put it back, dead. we even tried two boring static clips with square corners and no animation. dead. two is the magic number and nobody told me.

## the watchdog

so now i'm curious, the bad kind of curious, the kind that keeps you up. the editor is just javascript the site sends to my own browser, so you can read it, it's right there. 1.4 megabytes on one line, minified into alphabet soup. but you can't catch a hang by reading, because a hung page can't tell you anything, it's frozen, it's a guy staring at a wall.

so we built a watchdog. a little heartbeat that ticks every tenth of a second, and anything that runs while the heartbeat is stuck for more than four seconds gets stopped and has to say where it was standing.

<figure class="tcp-fig tcp-box">
<div class="tcp-scroll">
<svg viewBox="0 0 640 150" role="img" aria-labelledby="tcp-ecg-t">
<title id="tcp-ecg-t">a heartbeat line that goes flat when the editor freezes, then the watchdog fires</title>
<polyline points="10,90 40,90 50,90 58,60 66,115 74,90 110,90 120,90 128,60 136,115 144,90 180,90 190,90 198,60 206,115 214,90 250,90 260,90 268,60 276,115 284,90 300,90" style="fill:none;stroke:var(--ok);stroke-width:2.5;stroke-linejoin:round"/>
<line x1="300" y1="90" x2="560" y2="90" style="stroke:var(--kw);stroke-width:2.5"/>
<line x1="560" y1="30" x2="560" y2="130" style="stroke:var(--white);stroke-width:2;stroke-dasharray:4 4"/>
<text x="20" y="30" style="fill:var(--ok);font-size:13px">heartbeat every 100ms</text>
<text x="320" y="70" style="fill:var(--kw);font-size:13px">frozen. 1s… 2s… 3s… 4s…</text>
<text x="452" y="142" style="fill:var(--white);font-size:13px">watchdog: freeze!</text>
</svg>
</div>
<pre class="tcp-stack tcp-scroll">bringToFront               editor.js
<span class="tcp-hl">p  (layers panel render)</span>   editor.js
render                     editor.js
flushJobs                  vue.global.prod.js</pre>
<figcaption>what it confessed. trimmed, but those are the real names.</figcaption>
</figure>

load the broken project into an already-open editor with the watchdog on. the page doesn't die this time. the watchdog grabs it by the collar and it gives up a stack trace. and the stack trace says: the layers panel. the little list on the left with the folder icons. that's the killer.

## after you, no after you

every time the layers panel draws itself, it wants clip paths to sit at the top of their group. fine, tidy, i respect it. so while it's drawing, it reaches into the actual document and moves the clip up. but moving something in the document is a change, and a change means draw again.

<figure class="tcp-fig">
<div class="tcp-duo">
<div class="tcp-box">
<h3>one clip</h3>
<div class="tcp-draw"><span>draw 1</span><span class="tcp-order"><span class="tcp-chip">bg</span><span class="tcp-chip tcp-b">b</span>→ move b up →<span class="tcp-chip tcp-b">b</span><span class="tcp-chip">bg</span></span></div>
<div class="tcp-draw"><span>draw 2</span><span class="tcp-order"><span class="tcp-chip tcp-b">b</span><span class="tcp-chip">bg</span>→ already on top</span></div>
<div class="tcp-verdict tcp-ok">settles. everybody goes home.</div>
</div>
<div class="tcp-box">
<h3>two clips</h3>
<div class="tcp-draw"><span>draw 1</span><span class="tcp-order"><span class="tcp-chip tcp-a">a</span><span class="tcp-chip tcp-b">b</span><span class="tcp-chip">bg</span>→ move b up →<span class="tcp-chip tcp-b">b</span><span class="tcp-chip tcp-a">a</span><span class="tcp-chip">bg</span></span></div>
<div class="tcp-draw"><span>draw 2</span><span class="tcp-order"><span class="tcp-chip tcp-b">b</span><span class="tcp-chip tcp-a">a</span><span class="tcp-chip">bg</span>→ move a up →<span class="tcp-chip tcp-a">a</span><span class="tcp-chip tcp-b">b</span><span class="tcp-chip">bg</span></span></div>
<div class="tcp-draw"><span>draw 3</span><span class="tcp-order">same as draw 1. forever.</span></div>
<div class="tcp-verdict tcp-bad">never settles. tab runs out of air.</div>
</div>
</div>
<figcaption>with two, moving one clip up pushes the other one down, so the next draw moves that one, and so on.</figcaption>
</figure>

two guys in a doorway going "after you" "no after you" until the building runs out of air. we counted how many times things got moved while each test project loaded.

<figure class="tcp-fig tcp-box">
<div class="tcp-bars">
<div class="tcp-bar"><span>one clip</span><span class="tcp-track"><span class="tcp-fill tcp-alive" style="width:0.02%"></span></span><span>1</span></div>
<div class="tcp-bar"><span>one static clip</span><span class="tcp-track"><span class="tcp-fill tcp-alive" style="width:0.02%"></span></span><span>1</span></div>
<div class="tcp-bar"><span>clips in own groups</span><span class="tcp-track"><span class="tcp-fill tcp-alive" style="width:0.04%"></span></span><span>2</span></div>
<div class="tcp-bar"><span>two clips</span><span class="tcp-track"><span class="tcp-fill tcp-dead" style="width:72.5%"></span></span><span>3,757</span></div>
<div class="tcp-bar"><span>two static clips</span><span class="tcp-track"><span class="tcp-fill tcp-dead" style="width:68.7%"></span></span><span>3,561</span></div>
<div class="tcp-bar"><span>two clips, square</span><span class="tcp-track"><span class="tcp-fill tcp-dead" style="width:72.2%"></span></span><span>3,743</span></div>
<div class="tcp-bar"><span>two clips, swapped</span><span class="tcp-track"><span class="tcp-fill tcp-dead" style="width:68.0%"></span></span><span>3,526</span></div>
<div class="tcp-bar"><span>clip + mask</span><span class="tcp-track"><span class="tcp-fill tcp-dead" style="width:100%"></span></span><span>5,185</span></div>
</div>
<figcaption>moves while loading, to scale. the red ones were still going when the watchdog stopped them after about 4 seconds.</figcaption>
</figure>

the framework they use has a safety check for exactly this, "you're updating in a loop, stop", but it only exists in the developer build. in production it just keeps going until chrome pulls the plug.

proof it's really that and nothing else: we told just that one move to quit, everything else untouched, and the crashing projects opened like nothing ever happened.

## don't move the furniture while you're drawing the room

the fix is small and kind of poetic. sort the clips to the top in the list you show, leave the real document alone. if the order has to be real, fix it once when the file loads, not on every frame.

and the workaround if you're building with the mcp right now: one clip per group. each clip lives inside the group it cuts, which is how the editor makes them itself anyway.

<figure class="tcp-fig">
<div class="tcp-duo">
<div class="tcp-box">
<h3>crashes</h3>
<div class="tcp-scroll"><pre class="tcp-tree">canvas
├─ <span class="tcp-a">clipPath a</span>
├─ <span class="tcp-b">clipPath b</span>
└─ <span class="tcp-m">everything else</span></pre></div>
<div class="tcp-verdict tcp-bad">two clips, one container</div>
</div>
<div class="tcp-box">
<h3>works</h3>
<div class="tcp-scroll"><pre class="tcp-tree">canvas
├─ group (clipped by a)
│  ├─ <span class="tcp-a">clipPath a</span>
│  └─ <span class="tcp-m">frame stuff</span>
└─ group (clipped by b)
   ├─ <span class="tcp-b">clipPath b</span>
   └─ <span class="tcp-m">reveal stuff</span></pre></div>
<div class="tcp-verdict tcp-ok">one clip per container</div>
</div>
</div>
</figure>

my templates went back to that and life is good again.

## the bug report got bounced for being too much of a bug report

wrote it all up, the test projects, the whole bisection table, the stack, a tiny script that recreates the swap, the suggested fix, sent it to svgator. first email bounced lol.

<figure class="tcp-fig tcp-box tcp-bounce">
<div class="tcp-bounce-from">mail delivery subsystem · 2:13 am</div>
<div class="tcp-bounce-msg">message blocked. 1 attachment is a file type that isn't allowed (.js).</div>
<figcaption>the simulation script. it just moves letters around in a list. put it inside the doc instead and sent it again.</figcaption>
</figure>

what i keep thinking about is how weird and good this moment is. i signed up to make some animations. the ai was building them. the ai was also the one that broke the editor, because it built something no human clicking buttons ever would. and then the ai and me hunted the bug down together at 2am through a wall of minified code. nobody planned that part. that's the part i'll remember.

anyway. two clip paths walked into a group. still in there, probably. holding the door for each other.

<div class="tcp-sig" aria-label="signed i.z.">
<svg viewBox="0 0 28 28" aria-hidden="true"><rect x="1" y="1" width="26" height="26" style="fill:none;stroke:var(--white);stroke-width:1.5"/><text x="14" y="19" text-anchor="middle" style="fill:var(--white);font-family:var(--font);font-weight:700;font-size:12px;letter-spacing:-0.5px">IZ</text></svg>
<span>irdi zeneli</span>
</div>

<script>
(() => {
  const el = document.getElementById('tcp-moves')
  if (!el) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = '∞'; return }
  let n = 0
  const tick = () => { n += 1; el.textContent = n.toLocaleString('en-US'); setTimeout(tick, 1200) }
  setTimeout(tick, 600)
})()
</script>
