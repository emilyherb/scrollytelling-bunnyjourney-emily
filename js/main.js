// script.js
gsap.registerPlugin(ScrollTrigger);

const wrap = document.getElementById("bunnyWrap");
const titleH1 = document.getElementById("titleH1");
const titleSub = document.getElementById("titleSub");

const captionArea = document.getElementById("captionArea");
const captionKicker = document.getElementById("captionKicker");
const captionText = document.getElementById("captionText");
const captionSmall = document.getElementById("captionSmall");

const codeLayer = document.getElementById("codeLayer");
const codeBlock = document.getElementById("codeBlock");

const introStep = document.querySelector(".step--intro");
const steps = Array.from(document.querySelectorAll(".step[data-step]"));
const step2 = document.querySelector('.step[data-step="1"]'); // section 2

/* ─── Story Content (7 sections total: 0 intro, 1..6 story) ───────────── */
const STORY = [
  { kicker: "section 1", text: "", small: "" },

  {
    kicker: "section 2",
    text:
      "I was placed somewhere new. I didn't move at first. I waited to see what the world would do. Everything smelled different. I listened.",
    small: ""
  },
  { kicker: "section 3", text: "Then something shifted. A sound. A soft step. A pause that meant I was being noticed.", small: "" },
  { kicker: "section 4", text: "I learned the edges of the room. The safe corners. The places where light warmed the floor.", small: "" },
  { kicker: "section 5", text: "When I finally moved, it was quiet. Like a secret I was telling myself.", small: "" },
  { kicker: "section 6", text: "Some days were still. Some days were brave. Either way, I stayed.", small: "" },
  { kicker: "section 7", text: "Eventually, the newness faded. And what was left… felt like mine.", small: "" }
];

/* ─── Code content for the “JavaScript river” ─────────────────────────── */
function makeCodeLines() {
  const snippets = [
    `// section 2: learning the world by reading it`,
    `const bunny = { name: "Mochi", brave: false, curiosity: 0 };`,
    ``,
    `function sniff(place) {`,
    `  return place.scents.map(s => s?.note ?? "unknown");`,
    `}`,
    ``,
    `function listen(world) {`,
    `  const sounds = world.events.filter(e => e.type !== "danger");`,
    `  return sounds.length;`,
    `}`,
    ``,
    `// tiny steps: observe -> store -> try`,
    `let step = 0;`,
    `while (step < 7) {`,
    `  bunny.curiosity += 1;`,
    `  if (bunny.curiosity > 2) bunny.brave = true;`,
    `  step++;`,
    `}`,
    ``,
    `// the DOM: a room of elements`,
    `const room = document.querySelector(".world");`,
    `room?.classList.add("safe");`,
    ``,
    `// events feel like footsteps`,
    `window.addEventListener("scroll", () => {`,
    `  // not every movement means danger`,
    `  bunny.brave = bunny.curiosity > 3;`,
    `});`,
    ``,
    `// a promise: things can be slow and still be real`,
    `const trust = new Promise(resolve => setTimeout(resolve, 700));`,
    `await trust;`,
    ``,
    `// gentle branching`,
    `if (bunny.brave) {`,
    `  room?.setAttribute("data-mode", "explore");`,
    `} else {`,
    `  room?.setAttribute("data-mode", "wait");`,
    `}`,
    ``,
    `// a little GSAP magic, because movement tells stories`,
    `gsap.to("#bunnyWrap", {`,
    `  scale: 1,`,
    `  duration: 1.2,`,
    `  ease: "power2.inOut"`,
    `});`
  ];

  const lines = [];
  for (let i = 0; i < 18; i++) {
    lines.push(...snippets, "", `// --- ${String(i + 1).padStart(2, "0")} ---`, "");
  }
  return lines.join("\n");
}

function initCodeLayer() {
  if (!codeBlock || !codeLayer) return;
  codeBlock.textContent = makeCodeLines();

  // Start lower so it has room to scroll through the masked window
  gsap.set(codeBlock, { y: 420, x: 0 });
  gsap.set(codeLayer, { opacity: 0, y: 10 });
}

/* ─── Intro zoom math (works with your viewBox) ─────────────────────────
   ViewBox: 400x420
   Adjust EAR_TOP_VB / EAR_BOTTOM_VB for tighter/looser intro framing.
*/
const SVG_W = 400;
const SVG_H = 420;

const EAR_TOP_VB = 20;
const EAR_BOTTOM_VB = 120;
const EAR_SLICE_VB = EAR_BOTTOM_VB - EAR_TOP_VB;

function getScales() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // End: bunny at 65% of smaller viewport dimension
  const fitScale = Math.min(vw / SVG_W, vh / SVG_H) * 0.65;

  // Start: scale so the ear slice fills the viewport height
  const startScaleV = vh / EAR_SLICE_VB;
  const startScaleH = vw / SVG_W;
  const startScale = Math.min(startScaleV, startScaleH);

  // Place ear tops at ~35% from top, leaving whitespace above
  const earTopScreenY = vh * 0.35;
  const aboveCenter = (SVG_H / 2 - EAR_TOP_VB) * startScale;
  const startTranslateY = earTopScreenY - vh / 2 + aboveCenter;

  return { fitScale, startScale, startTranslateY };
}

function setCaption(index, { animate = true } = {}) {
  const data = STORY[index];
  if (!data) return;

  captionKicker.textContent = data.kicker || "";
  captionText.textContent = data.text || "";
  captionSmall.textContent = data.small || "";

  if (!animate) return;

  gsap.fromTo(
    [captionKicker, captionText, captionSmall],
    { y: 6, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.35, ease: "power2.out", stagger: 0.03 }
  );
}

function setup() {
  ScrollTrigger.getAll().forEach((st) => st.kill());

  initCodeLayer();

  // Start states
  gsap.set([titleH1, titleSub], { opacity: 0 });
  gsap.set(captionArea, { opacity: 0, y: 6 });

  // Preload story section 2 text (but keep hidden until intro ends)
  setCaption(1, { animate: false });

  // ─── Intro zoom timeline (driven only by intro step) ──────────────────
  const { fitScale, startScale, startTranslateY } = getScales();

  gsap.set(wrap, {
    transformOrigin: "50% 50%",
    scale: startScale / fitScale,
    y: startTranslateY
  });

  const introTL = gsap.timeline({
    scrollTrigger: {
      trigger: introStep,
      start: "top top",
      end: "bottom top",
      scrub: 1.2
    }
  });

  // Title fade in
  introTL.to([titleH1, titleSub], {
    opacity: 1,
    duration: 0.25,
    stagger: 0.08,
    ease: "power2.out"
  }, 0);

  // Title fade out
  introTL.to([titleH1, titleSub], {
    opacity: 0,
    duration: 0.18,
    ease: "power2.in"
  }, 0.28);

  // Bunny zoom out to “natural”
  introTL.to(wrap, {
    scale: 1,
    y: 0,
    ease: "power2.inOut",
    duration: 0.6
  }, 0.3);

  // Fade captions in AFTER zoom-out (story begins here)
  introTL.to(captionArea, {
    opacity: 1,
    y: 0,
    duration: 0.25,
    ease: "power2.out"
  }, 0.92);

  // ─── Step triggers (sections 2–7) ─────────────────────────────────────
  steps.forEach((stepEl) => {
    const idx = Number(stepEl.dataset.step);

    ScrollTrigger.create({
      trigger: stepEl,
      start: "top center",
      end: "bottom center",
      onEnter: () => {
        if (idx === 0) {
          gsap.to(captionArea, { opacity: 0, y: 6, duration: 0.2, overwrite: true });
          return;
        }
        gsap.to(captionArea, { opacity: 1, y: 0, duration: 0.2, overwrite: true });
        setCaption(idx, { animate: true });
      },
      onEnterBack: () => {
        if (idx === 0) {
          gsap.to(captionArea, { opacity: 0, y: 6, duration: 0.2, overwrite: true });
          return;
        }
        gsap.to(captionArea, { opacity: 1, y: 0, duration: 0.2, overwrite: true });
        setCaption(idx, { animate: true });
      }
    });
  });

  // ─── Code layer animation (only in section 2 / data-step="1") ──────────
  if (step2 && codeLayer && codeBlock) {
    // Fade in/out when entering section 2
    ScrollTrigger.create({
      trigger: step2,
      start: "top 65%",
      end: "bottom 35%",
      onEnter: () => gsap.to(codeLayer, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }),
      onEnterBack: () => gsap.to(codeLayer, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }),
      onLeave: () => gsap.to(codeLayer, { opacity: 0, y: 10, duration: 0.25, ease: "power2.in" }),
      onLeaveBack: () => gsap.to(codeLayer, { opacity: 0, y: 10, duration: 0.25, ease: "power2.in" })
    });

    // Scroll the code behind the bunny while section 2 is active
    gsap.to(codeBlock, {
      y: -1100,     // long travel so it feels like a real file
      ease: "none",
      scrollTrigger: {
        trigger: step2,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });

    // Optional gentle sideways drift (small, so it stays centered-feeling)
    gsap.to(codeBlock, {
      x: 8,
      ease: "none",
      scrollTrigger: {
        trigger: step2,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  }

  // Ambient light drift tied to scroll progress
  ScrollTrigger.create({
    trigger: document.getElementById("track"),
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: (self) => {
      const x = gsap.utils.mapRange(0, 1, -40, 50, self.progress);
      document.documentElement.style.setProperty("--light-x", `${x}px`);
    }
  });

  ScrollTrigger.refresh();
}

setup();

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(setup, 180);
});