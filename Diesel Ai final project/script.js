

/* =====================
   CAMERA SETUP
===================== */
const video = document.getElementById("camera");
const canvas = document.getElementById("capture-canvas");
const ctx = canvas.getContext("2d");
const fitPreview = document.getElementById("fit-preview");
const fitStatus = document.getElementById("fit-status");
const cameraBtn = document.getElementById("camera-btn");

let capturedImageBase64 = null;

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => (video.srcObject = stream))
  .catch(() => (fitStatus.innerText = "Camera access denied"));

/* =====================
   FIT SCAN
===================== */
function scanFit() {
  if (!video.videoWidth) return;

  const max = 512;
  const scale = Math.min(max / video.videoWidth, max / video.videoHeight);

  canvas.width = Math.floor(video.videoWidth * scale);
  canvas.height = Math.floor(video.videoHeight * scale);

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const dataURL = canvas.toDataURL("image/jpeg", 0.7);
  capturedImageBase64 = dataURL.replace(/^data:image\/jpeg;base64,/, "");

  fitPreview.src = dataURL;
  fitPreview.style.display = "block";

  fitStatus.innerText = "Fit captured. DIESEL AI ready.";
console.log("SCAN FIT → chaosFlash()");
chaosFlash();

}

cameraBtn.addEventListener("click", scanFit);

/* =====================
   CHAT
===================== */
async function sendMessage() {
  const input = document.getElementById("user-input");
  const chatLog = document.getElementById("chat-log");
  const text = input.value.trim();
  if (!text) return;
  input.value = "";

  const userMsg = document.createElement("div");
  userMsg.className = "message user";
  userMsg.innerText = `YOU: ${text}`;
  chatLog.appendChild(userMsg);

  const aiMsg = document.createElement("div");
  aiMsg.className = "message ai";
  chatLog.appendChild(aiMsg);

  if (!capturedImageBase64) {
    aiMsg.innerText =
      "DIESEL AI:\nScan your fit first.\nJudgement requires visuals.";
    return;
  }

  aiMsg.innerText = "DIESEL AI: analysing…";

  /* ========= GEMINI ========= */
try {
  const res = await fetch("/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      imageBase64: capturedImageBase64,
      prompt:
`You are a fashion stylist.

Analyse the outfit in the image.
Comment on silhouette, colour, confidence.

Return:
CONFIDENCE: <number>/100
VERDICT:
<critique>

MAKE IT LOUDER:
• <suggestion>
• <suggestion>`
    })
  });

  const data = await res.json();

  const parts = data?.candidates?.[0]?.content?.parts || [];
  const reply = parts.map(p => p.text).filter(Boolean).join("\n");

  if (!reply) throw new Error("Empty AI reply");

  aiMsg.innerText = "DIESEL AI:\n" + reply;
  return;

} catch (e) {
  console.warn("AI request failed, using fallback");
}


  /* ========= FALLBACK  ========= */
  const fallbackResponses = [
`CONFIDENCE: 64/100
VERDICT:
The silhouette is present but hesitant. Pieces don’t fight each other enough.

MAKE IT LOUDER:
• Break the proportions
• Add contrast or tension`,

`CONFIDENCE: 72/100
VERDICT:
There’s intention here, but it stops short of commitment.

MAKE IT LOUDER:
• Push texture harder
• Sharpen the colour story`,

`CONFIDENCE: 58/100
VERDICT:
Safe choices. Comfortable. Predictable.

MAKE IT LOUDER:
• Distort the silhouette
• Introduce aggression`
  ];

  aiMsg.innerText =
    "DIESEL AI:\n" +
    fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
}

/* =====================
   CHAOS FUNCTIONS


/**
 * Flash the background briefly.
 * Used when a fit is successfully scanned.
 */
function chaosFlash() {
  if (typeof gsap === "undefined") {
    console.warn("GSAP not loaded — chaosFlash skipped");
    return;
  }

  gsap.fromTo(
    document.body,
    { backgroundColor: "#0a0a0a" },
    {
      backgroundColor: "#ff1a1a",
      duration: 0.18,   // 👈 longer, visible
      yoyo: true,
      repeat: 1,
      ease: "power1.inOut"
    }
  );
}


/**
 * Shake an element aggressively.
 * Used when AI gives a low confidence score.
 *
 * @param {HTMLElement} el - element to shake (e.g. document.body)
 * @param {number} duration - how long the shake lasts (ms)
 */
function chaosShake(el, duration = 600) {
  if (!el) return;

  el.classList.add("chaos-shake");

  setTimeout(() => {
    el.classList.remove("chaos-shake");
  }, duration);
}















