const GROQ_API_KEY = "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";

/* CAMERA */
const video = document.getElementById("camera");
const canvas = document.getElementById("capture-canvas");
const ctx = canvas.getContext("2d");
const fitPreview = document.getElementById("fit-preview");
const fitStatus = document.getElementById("fit-status");
const cameraBtn = document.getElementById("camera-btn");

let fitContext = "No fit scanned yet.";

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => video.srcObject = stream)
  .catch(() => fitStatus.innerText = "Camera access denied.");

  /* =========================
   CHAOS UTILITIES
========================= */
function chaosFlash() {
  gsap.fromTo(
    document.body,
    { backgroundColor: "#0a0a0a" },
    {
      backgroundColor: "#150000",
      duration: 0.08,
      yoyo: true,
      repeat: 1
    }
  );
}

function chaosShake(el, duration = 300) {
  el.classList.add("chaos-shake");
  setTimeout(() => el.classList.remove("chaos-shake"), duration);
}


/* FIT SCAN */
function scanFit() {
  if (!video.videoWidth) return;

  gsap.fromTo(video, { scale: 1 }, { scale: 1.03, yoyo: true, repeat: 1, duration: 0.15 });

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0);

  fitPreview.src = canvas.toDataURL("image/png");
  fitPreview.style.display = "block";

  gsap.from(fitPreview, { opacity: 0, scale: 0.96, duration: 0.4 });

  fitContext = "Captured outfit context available.";
  fitStatus.innerText = "Fit captured.";
}
cameraBtn.addEventListener("click", scanFit);

/* CHATBOT */
const conversation = [
  {
    role: "system",
    content: `
You are DIESEL AI.
Answer any question.
Never repeat yourself.
Be bold, rebellious, confident.
`
  }
];

async function sendMessage() {
  const input = document.getElementById("user-input");
  const chatLog = document.getElementById("chat-log");
  const text = input.value.trim();
  if (!text) return;

  const userMsg = document.createElement("div");
  userMsg.className = "message user";
  userMsg.innerText = `YOU: ${text}`;
  chatLog.appendChild(userMsg);
  gsap.from(userMsg, { x: 40, opacity: 0, duration: 0.4 });

  input.value = "";

  let finalMessage = fitContext !== "No fit scanned yet"
    ? `Fit context: ${fitContext}\nQuestion: ${text}`
    : text;

  conversation.push({ role: "user", content: finalMessage });



  const aiDiv = document.createElement("div");
  aiDiv.className = "message ai typing";
  aiDiv.innerText = "DIESEL AI:";
  chatLog.appendChild(aiDiv);

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      temperature: 1.2,
      messages: conversation
    })
  });

  const data = await response.json();
  const reply = data.choices[0].message.content;

  conversation.push({ role: "assistant", content: reply });

  aiDiv.classList.remove("typing");
  aiDiv.innerText = "DIESEL AI: ";
  typeText(aiDiv, reply);
  gsap.from(aiDiv, { x: -40, opacity: 0, duration: 0.4 });
}

function typeText(el, text) {
  let i = 0;
  const t = setInterval(() => {
    el.innerText += text[i++];
    if (i >= text.length) clearInterval(t);
  }, 16);
}

/* ANIMATIONS */
gsap.from(".glitch", { y: 80, opacity: 0, duration: 1.2 });
gsap.from(".tagline", { y: 20, opacity: 0, delay: 0.6 });

gsap.utils.toArray(".fit-section, .chat-section").forEach(section => {
  gsap.from(section, {
    scrollTrigger: { trigger: section, start: "top 80%" },
    y: 60,
    opacity: 0,
    duration: 1
  });
  const chaosThoughts = [
    "DIESEL AI: trends are lies.",
    "DIESEL AI: comfort is a trap.",
    "DIESEL AI: denim remembers everything.",
    "DIESEL AI: you're thinking too safe.",
    "DIESEL AI: luxury hates you back."
  ];
  
  function randomChaosMessage() {
    if (Math.random() < 0.25) { // 25% chance
      const chatLog = document.getElementById("chat-log");
      const msg = document.createElement("div");
      msg.className = "message ai glitch-text";
      msg.innerText =
        chaosThoughts[Math.floor(Math.random() * chaosThoughts.length)];
  
      chatLog.appendChild(msg);
      gsap.from(msg, { opacity: 0, y: 10, duration: 0.4 });
      chatLog.scrollTop = chatLog.scrollHeight;
    }
  }
  
});










