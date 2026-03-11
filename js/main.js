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
const faceEarLeftUp = document.getElementById("faceEarLeftUp");
const faceEarLeftDown = document.getElementById("faceEarLeftDown");
const faceEarRightUp = document.getElementById("faceEarRightUp");
const faceEarRightDown = document.getElementById("faceEarRightDown");
const hayWrap = document.getElementById("hayWrap");
const haySingleGroup = document.getElementById("haySingleGroup");
const bookshelfWrap = document.getElementById("bookshelfWrap");
const consoleBoxWrap = document.getElementById("consoleBoxWrap");
const endBallWrap = document.getElementById("endBallWrap");
const ballGroup = document.getElementById("ballGroup");

const poseStand = document.getElementById("pose-stand");
const poseLay = document.getElementById("pose-lay");
const standEyeDark = document.getElementById("standEyeDark");
const standEyeHi = document.getElementById("standEyeHi");
const eyelidBlink = document.getElementById("eyelidBlink");

const storyHeadGroup = document.querySelector("#bunnyStory #headGroup");
const storyBunnyGroup = document.querySelector("#bunnyStory #bunnyGroup");
const nearEarKick = document.getElementById("nearEarKick");
const farEarKick = document.getElementById("farEarKick");
const legBack = document.getElementById("legBack");
const legFrontFarGroup = document.getElementById("legFrontFarGroup");
const legFrontNearGroup = document.getElementById("legFrontNearGroup");
const backPawKick = document.getElementById("backPawKick");
const nose = document.getElementById("nose");

const namingCallouts = document.getElementById("namingCallouts");
const calloutEnergy = document.getElementById("calloutEnergy");
const calloutHunger = document.getElementById("calloutHunger");
const calloutMood = document.getElementById("calloutMood");
const calloutSafe = document.getElementById("calloutSafe");
const switchCallouts = document.getElementById("switchCallouts");
const switchButtons = Array.from(document.querySelectorAll(".switchButton"));

const introStep = document.querySelector(".step--intro");
const steps = Array.from(document.querySelectorAll(".step[data-step]"));
const step2 = document.querySelector('.step[data-step="1"]');
const firstContactStep = document.querySelector('.step[data-step="2"]');
const namingThingsStep = document.querySelector('.step[data-step="3"]');
const endStep = document.querySelector('.step[data-step="6"]');
let namingEarState = "first";
let activeSwitchAction = null;
let switchResetTimer = null;
let bunnyStoryHeadroomLocks = 0;

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
    text: "Some feelings stay. Some feeling change.",
    small: "Naming them helped to tell them apart."
  },
  {
    kicker: "THE SWITCH",
    text: "Not everything makes me run, but some things do.",
    small: ""
  },
  {
    kicker: "THE MEMORY",
    text: "I don't relearn the world every day.",
    small: "I remember what happens next before it even happens."
  },
  {
    kicker: "THE END",
    text:
      "The world still surprises me. I still make mistakes. I still have to listen. But now, when something new arrives, I don't freeze the way I used to. I watch. I test. I learn.",
    small: ""
  }
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
  for (let i = 0; i < 50; i++) {
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

function resetFaceEars() {
  const faceEars = [faceEarLeftUp, faceEarLeftDown, faceEarRightUp, faceEarRightDown].filter(Boolean);
  gsap.killTweensOf(faceEars);
  if (faceEarLeftUp) gsap.set(faceEarLeftUp, { opacity: 1 });
  if (faceEarLeftDown) gsap.set(faceEarLeftDown, { opacity: 0 });
  if (faceEarRightUp) gsap.set(faceEarRightUp, { opacity: 1 });
  if (faceEarRightDown) gsap.set(faceEarRightDown, { opacity: 0 });

  namingEarState = "first";
}

function setNamingEarPose(phase) {
  if (!faceEarLeftUp || !faceEarLeftDown || !faceEarRightUp || !faceEarRightDown) return;
  if (namingEarState === phase) return;

  namingEarState = phase;

  if (phase === "second") {
    gsap.to(faceEarLeftUp, { opacity: 0, duration: 0.24, ease: "power2.out", overwrite: true });
    gsap.to(faceEarLeftDown, { opacity: 1, duration: 0.24, ease: "power2.out", overwrite: true });
    gsap.to(faceEarRightUp, { opacity: 0, duration: 0.24, ease: "power2.out", overwrite: true });
    gsap.to(faceEarRightDown, { opacity: 1, duration: 0.24, ease: "power2.out", overwrite: true });

    return;
  }

  gsap.to(faceEarLeftUp, { opacity: 1, duration: 0.24, ease: "power2.out", overwrite: true });
  gsap.to(faceEarLeftDown, { opacity: 0, duration: 0.24, ease: "power2.out", overwrite: true });
  gsap.to(faceEarRightUp, { opacity: 0, duration: 0.24, ease: "power2.out", overwrite: true });
  gsap.to(faceEarRightDown, { opacity: 1, duration: 0.24, ease: "power2.out", overwrite: true });
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

/* ─── First Contact console helpers ─────────────────────────────────── */
let consoleBoxVisible = false;

function hideConsoleBox(force = false) {
  if (!consoleBoxWrap) return;
  if (!force && !consoleBoxVisible) return;

  consoleBoxVisible = false;
  gsap.killTweensOf(consoleBoxWrap);
  gsap.to(consoleBoxWrap, {
    xPercent: -50,
    opacity: 0,
    y: 12,
    duration: 0.22,
    ease: "power2.out",
    overwrite: true,
    onStart: () => gsap.set(consoleBoxWrap, { visibility: "visible" }),
    onComplete: () => gsap.set(consoleBoxWrap, { visibility: "hidden" })
  });
}

function showConsoleBox() {
  if (!consoleBoxWrap) return;
  if (consoleBoxVisible) return;

  consoleBoxVisible = true;
  gsap.killTweensOf(consoleBoxWrap);
  gsap.set(consoleBoxWrap, { visibility: "visible", xPercent: -50 });
  gsap.fromTo(
    consoleBoxWrap,
    { xPercent: -50, opacity: 0, y: 12 },
    { xPercent: -50, opacity: 1, y: 0, duration: 0.35, ease: "power2.out", overwrite: true }
  );
}

function lockBunnyStoryHeadroom() {
  if (!bunnyStory) return;
  bunnyStoryHeadroomLocks += 1;
  bunnyStory.style.overflow = "visible";
}

function unlockBunnyStoryHeadroom() {
  if (!bunnyStory) return;
  bunnyStoryHeadroomLocks = Math.max(0, bunnyStoryHeadroomLocks - 1);
  bunnyStory.style.overflow = bunnyStoryHeadroomLocks > 0 ? "visible" : "";
}

function enableFirstContactHeadroom() {
  lockBunnyStoryHeadroom();
}

function disableFirstContactHeadroom() {
  unlockBunnyStoryHeadroom();
}

function enableSwitchHeadroom() {
  lockBunnyStoryHeadroom();
}

function disableSwitchHeadroom() {
  unlockBunnyStoryHeadroom();
}

/* ─── Bookshelf helpers ──────────────────────────────────────────────── */
function hideBookshelf() {
  if (!bookshelfWrap) return;
  gsap.killTweensOf(bookshelfWrap);
  gsap.to(bookshelfWrap, {
    xPercent: -50,
    yPercent: -56,
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
  gsap.set(bookshelfWrap, { visibility: "visible", xPercent: -50, yPercent: -56 });
  gsap.fromTo(
    bookshelfWrap,
    { xPercent: -50, yPercent: -56, opacity: 0, y: 14, scale: 0.94 },
    { xPercent: -50, yPercent: -56, opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "power2.out", overwrite: true }
  );
}

/* ─── First Contact scrub animation ─────────────────────────────────── */
let firstContactTL = null;

function resetFirstContactAnimation({ preserveHeadroom = false } = {}) {
  if (firstContactTL) {
    firstContactTL.kill();
    firstContactTL = null;
  }

  if (storyHeadGroup) {
    gsap.set(storyHeadGroup, {
      x: 0,
      y: 0,
      rotation: 0,
      transformOrigin: "50% 80%"
    });
  }

  if (nearEarKick) {
    gsap.set(nearEarKick, {
      rotation: 0,
      transformOrigin: "50% 100%"
    });
  }

  if (farEarKick) {
    gsap.set(farEarKick, {
      rotation: 0,
      transformOrigin: "50% 100%"
    });
  }

  if (haySingleGroup) {
    gsap.set(haySingleGroup, {
      x: 0,
      rotation: 0,
      transformOrigin: "0% 50%"
    });
  }

  hideConsoleBox(true);
  if (!preserveHeadroom) {
    disableFirstContactHeadroom();
  }
}

function initFirstContactAnimation() {
  if (!firstContactStep || !storyHeadGroup || !haySingleGroup) return;

  resetFirstContactAnimation();

  firstContactTL = gsap.timeline({ paused: true });

  firstContactTL
    .to(storyHeadGroup, {
      duration: 0.38,
      x: -16,
      y: 60,
      rotation: -30,
      transformOrigin: "50% 80%",
      ease: "power2.in"
    })

    .to(storyHeadGroup, {
      duration: 0.07,
      x: -22,
      y: 65,
      ease: "none"
    })

    .to(nearEarKick, {
      duration: 0.14,
      rotation: 14,
      transformOrigin: "50% 100%",
      ease: "power3.out"
    }, "<")

    .to(farEarKick, {
      duration: 0.14,
      rotation: -10,
      transformOrigin: "50% 100%",
      ease: "power3.out"
    }, "<")

    .to(haySingleGroup, {
      duration: 0.20,
      x: -32,
      ease: "power3.out"
    }, "<+0.04")

    .to(haySingleGroup, {
      duration: 0.16,
      rotation: 2.5,
      transformOrigin: "0% 50%",
      ease: "power2.out"
    }, "<")

    .to(storyHeadGroup, {
      duration: 0.45,
      x: 0,
      y: 0,
      rotation: 0,
      ease: "power2.out"
    }, "+=0.06")

    .to([nearEarKick, farEarKick].filter(Boolean), {
      duration: 0.35,
      rotation: 0,
      ease: "elastic.out(1, 0.5)"
    }, "<")

    .to(haySingleGroup, {
      duration: 0.5,
      rotation: 0,
      ease: "elastic.out(1, 0.4)"
    }, "<+0.1");

  const HAY_MOVED_THRESHOLD = 0.48;

  ScrollTrigger.create({
    trigger: firstContactStep,
    start: "top bottom",
    end: "bottom top",
    scrub: 1.2,
    onEnter: () => enableFirstContactHeadroom(),
    onEnterBack: () => enableFirstContactHeadroom(),
    onUpdate: (self) => {
      firstContactTL.progress(self.progress);

      const SHOW_AT = 0.48;
      const HIDE_AT = 0.75;

      if (self.progress >= SHOW_AT && self.progress < HIDE_AT) {
        showConsoleBox();
      } else {
        hideConsoleBox();
      }
    },
    onLeave: () => {
      firstContactTL.progress(1);
      hideConsoleBox(true);
      disableFirstContactHeadroom();
    },
    onLeaveBack: () => {
      resetFirstContactAnimation({ preserveHeadroom: true });
    }
  });
}

/* ─── End pose helpers ──────────────────────────────────────────────── */
let endBallTL = null;

function resetEndAnimation() {
  if (endBallTL) {
    endBallTL.kill();
    endBallTL = null;
  }

  if (!endBallWrap || !ballGroup || !bunnyStory) return;

  gsap.killTweensOf([
    endBallWrap,
    ballGroup,
    "#bunnyStory #bunnyGroup",
    "#bunnyStory #headGroup",
    bunnyStory,
    poseStand,
    poseLay,
    standEyeDark,
    standEyeHi,
    eyelidBlink
  ]);

  gsap.set(endBallWrap, {
    visibility: "hidden",
    opacity: 0,
    x: 0,
    y: 0
  });

  gsap.set(ballGroup, {
    rotation: 0
  });

  gsap.set("#bunnyStory #bunnyGroup", {
    rotation: 0
  });

  gsap.set("#bunnyStory #headGroup", {
    rotation: 0,
    transformBox: "fill-box",
    transformOrigin: "60% 85%"
  });

  gsap.set(poseStand, {
    opacity: 1,
    visibility: "visible"
  });

  gsap.set(poseLay, {
    opacity: 0,
    visibility: "hidden"
  });

  if (standEyeDark) gsap.set(standEyeDark, { opacity: 1, visibility: "visible" });
  if (standEyeHi) gsap.set(standEyeHi, { opacity: 1, visibility: "visible" });
  if (eyelidBlink) gsap.set(eyelidBlink, { opacity: 0, visibility: "hidden" });

  gsap.set(bunnyStory, {
    y: 0,
    scaleX: 1,
    scaleY: 1,
    transformOrigin: "50% 50%"
  });
}

function showEndBall() {
  if (!endBallWrap) return;
  gsap.set(endBallWrap, {
    visibility: "visible",
    opacity: 1
  });
}

function hideEndBall() {
  if (!endBallWrap) return;
  gsap.set(endBallWrap, {
    visibility: "hidden",
    opacity: 0
  });
}

function initEndScrollAnimation() {
  if (!endStep || !endBallWrap || !ballGroup || !bunnyStory || !poseStand || !poseLay) return;

  gsap.set("#bunnyStory #bunnyGroup", {
    transformBox: "fill-box",
    transformOrigin: "50% 80%"
  });

  gsap.set("#bunnyStory #headGroup", {
    transformBox: "fill-box",
    transformOrigin: "60% 85%"
  });

  gsap.set(endBallWrap, {
    x: 0,
    y: 0,
    opacity: 0,
    visibility: "hidden"
  });

  gsap.set(ballGroup, {
    rotation: 0
  });

  gsap.set(poseStand, {
    opacity: 1,
    visibility: "visible"
  });

  gsap.set(poseLay, {
    opacity: 0,
    visibility: "hidden"
  });

  if (standEyeDark) gsap.set(standEyeDark, { opacity: 1, visibility: "visible" });
  if (standEyeHi) gsap.set(standEyeHi, { opacity: 1, visibility: "visible" });
  if (eyelidBlink) gsap.set(eyelidBlink, { opacity: 0, visibility: "hidden" });

  gsap.set(bunnyStory, {
    y: 0,
    scaleX: 1,
    scaleY: 1,
    transformOrigin: "50% 50%"
  });

  endBallTL = gsap.timeline({
    scrollTrigger: {
      trigger: endStep,
      start: "top center",
      end: "bottom center",
      scrub: 1,
      onEnter: () => {
        showStorySideBunny();
        showEndBall();
      },
      onEnterBack: () => {
        showStorySideBunny();
        showEndBall();
      },
      onLeave: () => {
        hideEndBall();
      },
      onLeaveBack: () => {
        hideEndBall();
      }
    }
  });

  endBallTL
    .to(endBallWrap, {
      opacity: 1,
      visibility: "visible",
      duration: 0.04
    }, 0)

    .to("#bunnyStory #bunnyGroup", {
      rotation: -2,
      duration: 0.10,
      ease: "none"
    }, 0.10)

    .to("#bunnyStory #headGroup", {
      rotation: -10,
      duration: 0.12,
      ease: "none"
    }, 0.10)

    .to("#bunnyStory #headGroup", {
      rotation: 18,
      duration: 0.08,
      ease: "none"
    }, 0.24)

    .to(endBallWrap, {
      x: -18,
      duration: 0.03,
      ease: "none"
    }, 0.32)

    .to(ballGroup, {
      rotation: -25,
      duration: 0.03,
      ease: "none"
    }, 0.32)

    .to(endBallWrap, {
      x: -2250,
      duration: 0.28,
      ease: "none"
    }, 0.35)

    .to(ballGroup, {
      rotation: -1000,
      duration: 0.28,
      ease: "none"
    }, 0.35)

    .to(endBallWrap, {
      y: -18,
      duration: 0.06,
      ease: "none"
    }, 0.41)

    .to(endBallWrap, {
      y: 0,
      duration: 0.08,
      ease: "none"
    }, 0.47)

    .to("#bunnyStory #headGroup", {
      rotation: 0,
      duration: 0.12,
      ease: "none"
    }, 0.40)

    .to("#bunnyStory #bunnyGroup", {
      rotation: 0,
      duration: 0.12,
      ease: "none"
    }, 0.45)

    .to(endBallWrap, {
      opacity: 0,
      duration: 0.04,
      ease: "none"
    }, 0.58)

    .to([standEyeDark, standEyeHi].filter(Boolean), {
      opacity: 0,
      duration: 0.04,
      ease: "none"
    }, 0.60)

    .to(eyelidBlink, {
      opacity: 1,
      visibility: "visible",
      duration: 0.05,
      ease: "none"
    }, 0.60)

    .to(poseStand, {
      opacity: 0,
      duration: 0.10,
      ease: "none"
    }, 0.68)

    .to(poseLay, {
      opacity: 1,
      visibility: "visible",
      duration: 0.12,
      ease: "none"
    }, 0.70)

    .to(bunnyStory, {
      y: 6,
      scaleY: 0.985,
      duration: 0.08,
      ease: "none"
    }, 0.76)

    .to(bunnyStory, {
      y: 4,
      scaleY: 1,
      duration: 0.08,
      ease: "none"
    }, 0.84)

    .to(bunnyStory, {
      scaleY: 1.012,
      duration: 0.06,
      ease: "none"
    }, 0.90)

    .to(bunnyStory, {
      scaleY: 1,
      duration: 0.06,
      ease: "none"
    }, 0.96);
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

  setNamingEarPose("first");
}

function updateNamingCallouts(progress) {
  if (!calloutEnergy || !calloutHunger || !calloutMood || !calloutSafe) return;

  if (progress < 0.5) {
    setNamingEarPose("first");
    calloutEnergy.textContent = "38";
    calloutHunger.textContent = "58";
    calloutMood.textContent = `"curious"`;
    calloutSafe.textContent = "false";
  } else if (progress < 0.75) {
    setNamingEarPose("second");
    calloutEnergy.textContent = "61";
    calloutHunger.textContent = "36";
    calloutMood.textContent = `"calm"`;
    calloutSafe.textContent = "true";
  } else {
    setNamingEarPose("second");
  }
}

function setActiveSwitchButton(action) {
  switchButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.action === action);
  });
}

function clearActiveSwitchButton() {
  switchButtons.forEach((button) => button.classList.remove("is-active"));
}

function resetSwitchBunnyState() {
  clearTimeout(switchResetTimer);
  switchResetTimer = null;
  activeSwitchAction = null;

  clearActiveSwitchButton();

  gsap.killTweensOf([
    storyBunnyGroup,
    legBack,
    legFrontFarGroup,
    legFrontNearGroup,
    backPawKick,
    nearEarKick,
    farEarKick,
    nose
  ].filter(Boolean));

  if (storyBunnyGroup) {
    gsap.set(storyBunnyGroup, {
      opacity: 1,
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
      transformBox: "fill-box",
      transformOrigin: "50% 80%"
    });
  }

  if (legBack) gsap.set(legBack, { rotation: 0, svgOrigin: "270 285" });
  if (legFrontFarGroup) gsap.set(legFrontFarGroup, { rotation: 0, y: 0, svgOrigin: "165 305" });
  if (legFrontNearGroup) gsap.set(legFrontNearGroup, { rotation: 0, y: 0, svgOrigin: "190 310" });
  if (backPawKick) gsap.set(backPawKick, { attr: { transform: "" } });
  if (nearEarKick) gsap.set(nearEarKick, { attr: { transform: "" }, rotation: 0, svgOrigin: "135 215" });
  if (farEarKick) gsap.set(farEarKick, { attr: { transform: "" }, rotation: 0, svgOrigin: "115 200" });
  if (nose) gsap.set(nose, { scaleX: 1, scaleY: 1, transformOrigin: "center center" });
}

function queueSwitchReset(delay = 0.2) {
  clearTimeout(switchResetTimer);
  switchResetTimer = setTimeout(resetSwitchBunnyState, delay * 1000);
}

function triggerSwitchHop() {
  if (!storyBunnyGroup) return;

  resetSwitchBunnyState();
  activeSwitchAction = "hop";
  setActiveSwitchButton("hop");

  gsap.set(storyBunnyGroup, {
    transformOrigin: "50% 100%",
    transformBox: "fill-box"
  });

  gsap.timeline({
    onComplete: () => queueSwitchReset(0.25)
  })
    .to(storyBunnyGroup, {
      duration: 0.12,
      y: 6,
      scaleY: 0.92,
      scaleX: 1.06,
      ease: "power2.in"
    })
    .to(storyBunnyGroup, {
      duration: 0.22,
      y: -28,
      scaleY: 1.08,
      scaleX: 0.96,
      ease: "power2.out"
    }, "<")
    .to(storyBunnyGroup, {
      duration: 0.25,
      y: 0,
      scaleY: 0.94,
      scaleX: 1.05,
      ease: "bounce.out"
    })
    .to(storyBunnyGroup, {
      duration: 0.1,
      scaleX: 1,
      scaleY: 1
    });
}

function triggerSwitchHide() {
  if (!storyBunnyGroup) return;

  resetSwitchBunnyState();
  activeSwitchAction = "hide";
  setActiveSwitchButton("hide");

  const step = 0.12;
  const travel = 0.9;

  gsap.set(legBack, { svgOrigin: "270 285" });
  gsap.set(legFrontFarGroup, { svgOrigin: "165 305" });
  gsap.set(legFrontNearGroup, { svgOrigin: "190 310" });
  gsap.set(storyBunnyGroup, { transformBox: "fill-box", transformOrigin: "50% 80%" });

  const tl = gsap.timeline({
    onComplete: () => queueSwitchReset(0.25)
  });

  tl.to(nearEarKick, {
    attr: { transform: "rotate(28 135 205) translate(3 2)" },
    duration: 0.18,
    ease: "power2.out"
  }, 0)
    .to(farEarKick, {
      attr: { transform: "rotate(28 125 165) translate(3 2)" },
      duration: 0.18,
      ease: "power2.out"
    }, 0)
    .to(legBack, { rotation: -24, duration: step, ease: "sine.inOut" }, 0)
    .to(legFrontFarGroup, { rotation: 10, y: -2, duration: step, ease: "sine.inOut" }, 0)
    .to(legFrontNearGroup, { rotation: -16, y: -1, duration: step, ease: "sine.inOut" }, 0)
    .to(backPawKick, { attr: { transform: "rotate(-10 285 332) translate(0 -2)" }, duration: step, ease: "sine.inOut" }, 0)
    .to(storyBunnyGroup, { x: -260, duration: travel, ease: "power1.in" }, 0.05)
    .to(storyBunnyGroup, { y: -4, duration: step, ease: "sine.inOut" }, 0)
    .to(storyBunnyGroup, { y: 0, duration: step, ease: "sine.inOut" }, step)
    .to(legBack, { rotation: 24, duration: step, ease: "sine.inOut" }, step)
    .to(legFrontFarGroup, { rotation: -10, y: 0, duration: step, ease: "sine.inOut" }, step)
    .to(legFrontNearGroup, { rotation: 16, y: 0, duration: step, ease: "sine.inOut" }, step)
    .to(backPawKick, { attr: { transform: "rotate(10 285 332) translate(0 0)" }, duration: step, ease: "sine.inOut" }, step)
    .to(legBack, { rotation: -24, duration: step, ease: "sine.inOut" }, step * 2)
    .to(legFrontFarGroup, { rotation: 10, y: -2, duration: step, ease: "sine.inOut" }, step * 2)
    .to(legFrontNearGroup, { rotation: -16, y: -1, duration: step, ease: "sine.inOut" }, step * 2)
    .to(backPawKick, { attr: { transform: "rotate(-10 285 332) translate(0 -2)" }, duration: step, ease: "sine.inOut" }, step * 2)
    .to(legBack, { rotation: 24, duration: step, ease: "sine.inOut" }, step * 3)
    .to(legFrontFarGroup, { rotation: -10, y: 0, duration: step, ease: "sine.inOut" }, step * 3)
    .to(legFrontNearGroup, { rotation: 16, y: 0, duration: step, ease: "sine.inOut" }, step * 3)
    .to(backPawKick, { attr: { transform: "rotate(10 285 332) translate(0 0)" }, duration: step, ease: "sine.inOut" }, step * 3)
    .to(storyBunnyGroup, { x: -320, opacity: 0, duration: 0.12, ease: "power1.in" }, 0.78)
    .set(storyBunnyGroup, { x: 420, y: 0, opacity: 0 })
    .to(storyBunnyGroup, { opacity: 1, x: 0, duration: 0.32, ease: "power2.out" })
    .to(nearEarKick, {
      attr: { transform: "" },
      duration: 0.22,
      ease: "power2.out"
    }, "<")
    .to(farEarKick, {
      attr: { transform: "" },
      duration: 0.22,
      ease: "power2.out"
    }, "<");
}

function triggerSwitchStay() {
  resetSwitchBunnyState();
  activeSwitchAction = "stay";
  setActiveSwitchButton("stay");

  gsap.timeline({
    onComplete: () => queueSwitchReset(0.35)
  })
    .to(nearEarKick, {
      rotation: -28,
      svgOrigin: "135 215",
      duration: 0.18,
      ease: "power3.out"
    }, 0)
    .to(farEarKick, {
      rotation: 22,
      svgOrigin: "115 200",
      duration: 0.18,
      ease: "power3.out"
    }, 0.05)
    .to(nearEarKick, {
      rotation: -18,
      svgOrigin: "135 215",
      duration: 0.12,
      ease: "power2.inOut"
    }, 0.28)
    .to(farEarKick, {
      rotation: 14,
      svgOrigin: "115 200",
      duration: 0.12,
      ease: "power2.inOut"
    }, 0.32)
    .to(nearEarKick, {
      rotation: 0,
      svgOrigin: "135 215",
      duration: 0.7,
      ease: "elastic.out(1.2, 0.45)"
    }, 0.48)
    .to(farEarKick, {
      rotation: 0,
      svgOrigin: "115 200",
      duration: 0.7,
      ease: "elastic.out(1.2, 0.45)"
    }, 0.52)
    .to(nose, {
      scaleY: 1.2,
      transformOrigin: "center center",
      duration: 0.1,
      yoyo: true,
      repeat: 3,
      ease: "sine.inOut"
    }, 0.1);
}

function bindSwitchButtons() {
  switchButtons.forEach((button) => {
    if (button.dataset.bound === "true") return;

    button.dataset.bound = "true";
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      if (!action) return;

      if (action === "hop") {
        triggerSwitchHop();
      } else if (action === "hide") {
        triggerSwitchHide();
      } else if (action === "stay") {
        triggerSwitchStay();
      }
    });
  });
}

function hideSwitchCallouts() {
  if (!switchCallouts) return;

  const items = switchCallouts.querySelectorAll(".switchCallout");
  gsap.killTweensOf([switchCallouts, ...items]);

  gsap.to(items, {
    opacity: 0,
    y: 8,
    scale: 0.98,
    duration: 0.2,
    stagger: 0.03,
    ease: "power2.out",
    overwrite: true
  });

  gsap.to(switchCallouts, {
    opacity: 0,
    duration: 0.2,
    ease: "power2.out",
    overwrite: true,
    onComplete: () => {
      gsap.set(switchCallouts, { visibility: "hidden" });
      resetSwitchBunnyState();
      disableSwitchHeadroom();
    }
  });
}

function showSwitchCallouts() {
  if (!switchCallouts) return;
  enableSwitchHeadroom();

  const items = switchCallouts.querySelectorAll(".switchCallout");
  gsap.killTweensOf([switchCallouts, ...items]);

  gsap.set(switchCallouts, { visibility: "visible" });
  gsap.set(items, { opacity: 0, y: 8, scale: 0.98 });

  gsap.to(switchCallouts, {
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
    stagger: 0.06,
    ease: "power2.out",
    overwrite: true
  });
}

function setup() {
  ScrollTrigger.getAll().forEach((st) => st.kill());
  resetEndAnimation();
  resetFirstContactAnimation();
  resetSwitchBunnyState();
  bunnyStoryHeadroomLocks = 0;
  disableSwitchHeadroom();
  bindSwitchButtons();

  initCodeLayer();

  gsap.set([titleH1, titleSub], { opacity: 0 });
  gsap.set(captionArea, { opacity: 0, y: 6 });

  gsap.set(bunnyIntro, { opacity: 1, visibility: "visible" });
  gsap.set(bunnyStory, { opacity: 0, visibility: "hidden" });
  if (bunnyFace) gsap.set(bunnyFace, { opacity: 0, visibility: "hidden" });
  resetFaceEars();
  if (hayWrap) gsap.set(hayWrap, { opacity: 0, visibility: "hidden", y: 12, rotation: -4 });
  if (haySingleGroup) gsap.set(haySingleGroup, { x: 0, rotation: 0, transformOrigin: "0% 50%" });
  if (bookshelfWrap) {
    gsap.set(bookshelfWrap, {
      xPercent: -50,
      yPercent: -56,
      opacity: 0,
      visibility: "hidden",
      y: 10,
      scale: 0.96
    });
  }

  if (consoleBoxWrap) {
    gsap.set(consoleBoxWrap, {
      xPercent: -50,
      opacity: 0,
      visibility: "hidden",
      y: 12
    });
  }
  disableFirstContactHeadroom();

  if (endBallWrap) {
    gsap.set(endBallWrap, {
      opacity: 0,
      visibility: "hidden",
      x: 0,
      y: 0
    });
  }

  if (ballGroup) {
    gsap.set(ballGroup, { rotation: 0 });
  }

  if (poseStand) gsap.set(poseStand, { opacity: 1, visibility: "visible" });
  if (poseLay) gsap.set(poseLay, { opacity: 0, visibility: "hidden" });
  if (standEyeDark) gsap.set(standEyeDark, { opacity: 1, visibility: "visible" });
  if (standEyeHi) gsap.set(standEyeHi, { opacity: 1, visibility: "visible" });
  if (eyelidBlink) gsap.set(eyelidBlink, { opacity: 0, visibility: "hidden" });
  if (bunnyStory) gsap.set(bunnyStory, { y: 0, scaleX: 1, scaleY: 1, transformOrigin: "50% 50%" });
  if (storyHeadGroup) gsap.set(storyHeadGroup, { x: 0, y: 0, rotation: 0, transformOrigin: "50% 80%" });
  if (nearEarKick) gsap.set(nearEarKick, { rotation: 0, transformOrigin: "50% 100%" });
  if (farEarKick) gsap.set(farEarKick, { rotation: 0, transformOrigin: "50% 100%" });

  if (namingCallouts) {
    gsap.set(namingCallouts, { opacity: 0, visibility: "hidden" });
    gsap.set(namingCallouts.querySelectorAll(".callout"), {
      opacity: 0,
      y: 8,
      scale: 0.98
    });
  }

  if (switchCallouts) {
    gsap.set(switchCallouts, { opacity: 0, visibility: "hidden" });
    gsap.set(switchCallouts.querySelectorAll(".switchCallout"), {
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
          hideConsoleBox(true);
          hideNamingCallouts();
          hideSwitchCallouts();
          hideBookshelf();
          hideEndBall();
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
          enableFirstContactHeadroom();
        } else {
          hideHay();
          disableFirstContactHeadroom();
        }

        if (idx !== 2) {
          hideConsoleBox(true);
        }

        if (idx === 3) {
          showNamingCallouts();
        } else {
          hideNamingCallouts();
        }

        if (idx === 4) {
          showSwitchCallouts();
        } else {
          hideSwitchCallouts();
        }

        if (idx === 4) {
          showBookshelf();
        } else {
          hideBookshelf();
        }

        if (idx === 6) {
          showStorySideBunny();
        } else {
          hideEndBall();
        }
      },
      onEnterBack: () => {
        if (idx === 0) {
          gsap.to(captionArea, { opacity: 0, y: 6, duration: 0.2, overwrite: true });
          showIntroBunny();
          hideHay();
          hideConsoleBox(true);
          hideNamingCallouts();
          hideSwitchCallouts();
          hideBookshelf();
          hideEndBall();
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
          enableFirstContactHeadroom();
        } else {
          hideHay();
          disableFirstContactHeadroom();
        }

        if (idx !== 2) {
          hideConsoleBox(true);
        }

        if (idx === 3) {
          showNamingCallouts();
        } else {
          hideNamingCallouts();
        }

        if (idx === 4) {
          showSwitchCallouts();
        } else {
          hideSwitchCallouts();
        }

        if (idx === 4) {
          showBookshelf();
        } else {
          hideBookshelf();
        }

        if (idx === 6) {
          showStorySideBunny();
        } else {
          hideEndBall();
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
      y: -1800,
      ease: "none",
      scrollTrigger: {
        trigger: step2,
        start: "top 60%",
        end: "bottom top",
        scrub: true
      }
    });
  }

  /* ─── First Contact scrub animation ───────────────────────────────── */
  initFirstContactAnimation();

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

  /* ─── End section scrub animation ─────────────────────────────────── */
  initEndScrollAnimation();

  /* ─── Ambient light drift ────────────────────────────────────────── */
  ScrollTrigger.create({
    trigger: document.getElementById("track"),
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: () => {
      document.documentElement.style.setProperty("--light-x", "0px");
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
