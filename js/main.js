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

const bunnyIntro = document.getElementById("bunnyIntro");
const bunnyStory = document.getElementById("bunnyStory");
const bunnyFace = document.getElementById("bunnyFace");
const hayWrap = document.getElementById("hayWrap");
const bookshelfWrap = document.getElementById("bookshelfWrap");

const namingCallouts = document.getElementById("namingCallouts");
const calloutEnergy = document.getElementById("calloutEnergy");
const calloutHunger = document.getElementById("calloutHunger");
const calloutMood = document.getElementById("calloutMood");
const calloutSafe = document.getElementById("calloutSafe");

const introStep = document.querySelector(".step--intro");
const steps = Array.from(document.querySelectorAll(".step[data-step]"));
const step2 = document.querySelector('.step[data-step="1"]'); // The Arrival
const namingThingsStep = document.querySelector('.step[data-step="3"]');

/* ─── Story Content ──────────────────────────────────────────────────── */
const STORY = [
  { kicker: "section 1", text: "", small: "" },

  {
    kicker: "THE ARRIVAL",
    text:
      "I was placed somewhere new. I didn't move at first. I waited to see what the world would do.",
    small: "Everything smelled different. I listened."
  },
  {
    kicker: "FIRST CONTACT",
    text: "I pushed something small. A piece of hay. It moved. The world answered me.",
    small: ""
  },
  {
    kicker: "NAMING THINGS",
    text: "I learned the edges of the room. The safe corners. The places where light warmed the floor.",
    small: ""
  },
  {
    kicker: "THE SWITCH",
    text: "When I finally moved, it was quiet. Like a secret I was telling myself.",
    small: ""
  },
  {
    kicker: "THE MEMORY",
    text: "Some days were still. Some days were brave. Either way, I stayed.",
    small: ""
  },
  { kicker: "THE END", text: "", small: "" }
];

/* ─── Code content ───────────────────────────────────────────────────── */
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
  gsap.set(codeBlock, { y: 420, x: 0 });
  gsap.set(codeLayer, { opacity: 0, y: 10 });
}

/* ─── Intro zoom math ────────────────────────────────────────────────── */
const SVG_W = 400;
const SVG_H = 420;

const EAR_TOP_VB = 20;
const EAR_BOTTOM_VB = 120;
const EAR_SLICE_VB = EAR_BOTTOM_VB - EAR_TOP_VB;

function getScales() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const fitScale = Math.min(vw / SVG_W, vh / SVG_H) * 0.65;

  const startScaleV = vh / EAR_SLICE_VB;
  const startScaleH = vw / SVG_W;
  const startScale = Math.min(startScaleV, startScaleH);

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

/* ─── Bunny state helpers ────────────────────────────────────────────── */
function showIntroBunny() {
  if (!bunnyIntro || !bunnyStory || !bunnyFace) return;

  gsap.killTweensOf([bunnyIntro, bunnyStory, bunnyFace]);

  gsap.set(bunnyIntro, { visibility: "visible" });
  gsap.to(bunnyIntro, {
    opacity: 1,
    duration: 0.35,
    ease: "power2.out",
    overwrite: true
  });

  gsap.to([bunnyStory, bunnyFace], {
    opacity: 0,
    duration: 0.35,
    ease: "power2.out",
    overwrite: true,
    onComplete: () => {
      gsap.set(bunnyStory, { visibility: "hidden" });
      gsap.set(bunnyFace, { visibility: "hidden" });
    }
  });
}

function showStorySideBunny() {
  if (!bunnyIntro || !bunnyStory || !bunnyFace) return;

  gsap.killTweensOf([bunnyIntro, bunnyStory, bunnyFace]);

  gsap.set(bunnyStory, { visibility: "visible" });
  gsap.to(bunnyStory, {
    opacity: 1,
    duration: 0.4,
    ease: "power2.out",
    overwrite: true
  });

  gsap.to([bunnyIntro, bunnyFace], {
    opacity: 0,
    duration: 0.35,
    ease: "power2.out",
    overwrite: true,
    onComplete: () => {
      gsap.set(bunnyIntro, { visibility: "hidden" });
      gsap.set(bunnyFace, { visibility: "hidden" });
    }
  });
}

function showFaceBunny() {
  if (!bunnyIntro || !bunnyStory || !bunnyFace) return;

  gsap.killTweensOf([bunnyIntro, bunnyStory, bunnyFace]);

  gsap.set(bunnyFace, { visibility: "visible" });
  gsap.to(bunnyFace, {
    opacity: 1,
    duration: 0.45,
    ease: "power2.out",
    overwrite: true
  });

  gsap.to([bunnyIntro, bunnyStory], {
    opacity: 0,
    duration: 0.35,
    ease: "power2.out",
    overwrite: true,
    onComplete: () => {
      gsap.set(bunnyIntro, { visibility: "hidden" });
      gsap.set(bunnyStory, { visibility: "hidden" });
    }
  });
}

/* ─── Hay helpers ────────────────────────────────────────────────────── */
function hideHay() {
  if (!hayWrap) return;
  gsap.killTweensOf(hayWrap);
  gsap.to(hayWrap, {
    opacity: 0,
    y: 12,
    rotation: -4,
    duration: 0.25,
    ease: "power2.out",
    overwrite: true,
    onStart: () => gsap.set(hayWrap, { visibility: "visible" }),
    onComplete: () => gsap.set(hayWrap, { visibility: "hidden" })
  });
}

function showHay() {
  if (!hayWrap) return;
  gsap.killTweensOf(hayWrap);
  gsap.set(hayWrap, { visibility: "visible" });
  gsap.fromTo(
    hayWrap,
    { opacity: 0, y: 12, rotation: -6 },
    { opacity: 1, y: 0, rotation: -4, duration: 0.4, ease: "power2.out", overwrite: true }
  );
}

/* ─── Bookshelf helpers ──────────────────────────────────────────────── */
function hideBookshelf() {
  if (!bookshelfWrap) return;
  gsap.killTweensOf(bookshelfWrap);
  gsap.to(bookshelfWrap, {
    opacity: 0,
    y: 10,
    scale: 0.96,
    duration: 0.25,
    ease: "power2.out",
    overwrite: true,
    onStart: () => gsap.set(bookshelfWrap, { visibility: "visible" }),
    onComplete: () => gsap.set(bookshelfWrap, { visibility: "hidden" })
  });
}

function showBookshelf() {
  if (!bookshelfWrap) return;
  gsap.killTweensOf(bookshelfWrap);
  gsap.set(bookshelfWrap, { visibility: "visible" });
  gsap.fromTo(
    bookshelfWrap,
    { opacity: 0, y: 14, scale: 0.94 },
    { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "power2.out", overwrite: true }
  );
}

/* ─── Naming Things callouts ────────────────────────────────────────── */
function hideNamingCallouts() {
  if (!namingCallouts) return;

  const items = namingCallouts.querySelectorAll(".callout");
  gsap.killTweensOf([namingCallouts, ...items]);

  gsap.to(items, {
    opacity: 0,
    y: 8,
    scale: 0.98,
    duration: 0.2,
    stagger: 0.03,
    ease: "power2.out",
    overwrite: true
  });

  gsap.to(namingCallouts, {
    opacity: 0,
    duration: 0.2,
    ease: "power2.out",
    overwrite: true,
    onComplete: () => gsap.set(namingCallouts, { visibility: "hidden" })
  });
}

function showNamingCallouts() {
  if (!namingCallouts) return;

  const items = namingCallouts.querySelectorAll(".callout");
  gsap.killTweensOf([namingCallouts, ...items]);

  gsap.set(namingCallouts, { visibility: "visible" });
  gsap.set(items, { opacity: 0, y: 8, scale: 0.98 });

  gsap.to(namingCallouts, {
    opacity: 1,
    duration: 0.2,
    ease: "power2.out",
    overwrite: true
  });

  gsap.to(items, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.3,
    stagger: 0.05,
    ease: "power2.out",
    overwrite: true
  });
}

function updateNamingCallouts(progress) {
  if (!calloutEnergy || !calloutHunger || !calloutMood || !calloutSafe) return;

  if (progress < 0.25) {
    calloutEnergy.textContent = "20";
    calloutHunger.textContent = "75";
    calloutMood.textContent = `"unsure"`;
    calloutSafe.textContent = "false";
  } else if (progress < 0.5) {
    calloutEnergy.textContent = "38";
    calloutHunger.textContent = "58";
    calloutMood.textContent = `"curious"`;
    calloutSafe.textContent = "false";
  } else if (progress < 0.75) {
    calloutEnergy.textContent = "61";
    calloutHunger.textContent = "36";
    calloutMood.textContent = `"calm"`;
    calloutSafe.textContent = "true";
  } else {
    calloutEnergy.textContent = "84";
    calloutHunger.textContent = "18";
    calloutMood.textContent = `"content"`;
    calloutSafe.textContent = "true";
  }
}

function setup() {
  ScrollTrigger.getAll().forEach((st) => st.kill());

  initCodeLayer();

  gsap.set([titleH1, titleSub], { opacity: 0 });
  gsap.set(captionArea, { opacity: 0, y: 6 });

  gsap.set(bunnyIntro, { opacity: 1, visibility: "visible" });
  gsap.set(bunnyStory, { opacity: 0, visibility: "hidden" });
  if (bunnyFace) gsap.set(bunnyFace, { opacity: 0, visibility: "hidden" });
  if (hayWrap) gsap.set(hayWrap, { opacity: 0, visibility: "hidden", y: 12, rotation: -4 });
  if (bookshelfWrap) gsap.set(bookshelfWrap, { opacity: 0, visibility: "hidden", y: 10, scale: 0.96 });

  if (namingCallouts) {
    gsap.set(namingCallouts, { opacity: 0, visibility: "hidden" });
    gsap.set(namingCallouts.querySelectorAll(".callout"), {
      opacity: 0,
      y: 8,
      scale: 0.98
    });
  }

  updateNamingCallouts(0);
  setCaption(1, { animate: false });

  const { fitScale, startScale, startTranslateY } = getScales();

  gsap.set(wrap, {
    transformOrigin: "50% 50%",
    scale: startScale / fitScale,
    y: startTranslateY
  });

  /* ─── Intro timeline ──────────────────────────────────────────────── */
  const introTL = gsap.timeline({
    scrollTrigger: {
      trigger: introStep,
      start: "top top",
      end: "bottom top",
      scrub: 1.2
    }
  });

  introTL.to([titleH1, titleSub], {
    opacity: 1,
    duration: 0.25,
    stagger: 0.08,
    ease: "power2.out"
  }, 0);

  introTL.to([titleH1, titleSub], {
    opacity: 0,
    duration: 0.18,
    ease: "power2.in"
  }, 0.28);

  introTL.to(wrap, {
    scale: 1,
    y: 0,
    ease: "power2.inOut",
    duration: 0.6
  }, 0.3);

  introTL.to(captionArea, {
    opacity: 1,
    y: 0,
    duration: 0.25,
    ease: "power2.out"
  }, 0.92);

  /* ─── Step triggers ──────────────────────────────────────────────── */
  steps.forEach((stepEl) => {
    const idx = Number(stepEl.dataset.step);

    ScrollTrigger.create({
      trigger: stepEl,
      start: "top center",
      end: "bottom center",
      onEnter: () => {
        if (idx === 0) {
          gsap.to(captionArea, { opacity: 0, y: 6, duration: 0.2, overwrite: true });
          showIntroBunny();
          hideHay();
          hideNamingCallouts();
          hideBookshelf();
          return;
        }

        gsap.to(captionArea, { opacity: 1, y: 0, duration: 0.2, overwrite: true });
        setCaption(idx, { animate: true });

        if (idx === 3) {
          showFaceBunny();
        } else if (idx >= 2) {
          showStorySideBunny();
        } else {
          showIntroBunny();
        }

        if (idx === 2) {
          showHay();
        } else {
          hideHay();
        }

        if (idx === 3) {
          showNamingCallouts();
        } else {
          hideNamingCallouts();
        }

        if (idx === 4) {
          showBookshelf();
        } else {
          hideBookshelf();
        }
      },
      onEnterBack: () => {
        if (idx === 0) {
          gsap.to(captionArea, { opacity: 0, y: 6, duration: 0.2, overwrite: true });
          showIntroBunny();
          hideHay();
          hideNamingCallouts();
          hideBookshelf();
          return;
        }

        gsap.to(captionArea, { opacity: 1, y: 0, duration: 0.2, overwrite: true });
        setCaption(idx, { animate: true });

        if (idx === 3) {
          showFaceBunny();
        } else if (idx >= 2) {
          showStorySideBunny();
        } else {
          showIntroBunny();
        }

        if (idx === 2) {
          showHay();
        } else {
          hideHay();
        }

        if (idx === 3) {
          showNamingCallouts();
        } else {
          hideNamingCallouts();
        }

        if (idx === 4) {
          showBookshelf();
        } else {
          hideBookshelf();
        }
      }
    });
  });

  /* ─── Code layer only on The Arrival ─────────────────────────────── */
  if (step2 && codeLayer && codeBlock) {
    ScrollTrigger.create({
      trigger: step2,
      start: "top 65%",
      end: "bottom 35%",
      onEnter: () => gsap.to(codeLayer, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }),
      onEnterBack: () => gsap.to(codeLayer, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }),
      onLeave: () => gsap.to(codeLayer, { opacity: 0, y: 10, duration: 0.25, ease: "power2.in" }),
      onLeaveBack: () => gsap.to(codeLayer, { opacity: 0, y: 10, duration: 0.25, ease: "power2.in" })
    });

    gsap.to(codeBlock, {
      y: -1100,
      ease: "none",
      scrollTrigger: {
        trigger: step2,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });

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

  /* ─── Naming Things progression ───────────────────────────────────── */
  if (namingThingsStep) {
    ScrollTrigger.create({
      trigger: namingThingsStep,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        updateNamingCallouts(self.progress);
      }
    });
  }

  /* ─── Ambient light drift ────────────────────────────────────────── */
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