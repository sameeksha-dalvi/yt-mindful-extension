console.log("🚀 Mindful Extension Running");

let promptShown = false;
let currentVideo = null;
let lastPromptedURL = null;

function isValidVideoPage() {
  return location.pathname.startsWith("/watch");
}

const showPrompt = () => {
  if (document.getElementById("yt-prompt")) return;

  const prompt = document.createElement("div");
  prompt.id = "yt-prompt";
  prompt.innerHTML = `
    <div id="yt-prompt-content">
      <p class="yt-title">Before you dive in...</p>
      <p class="yt-sub">Will this video bring you closer to achieving your goal?</p>
      <input type="text" id="yt-input" placeholder="Set your intention..." />
      <div class="yt-buttons">
        <button id="yt-submit">Submit</button>
        <button id="yt-close">Close</button>
      </div>
    </div>
  `;

  const styles = `
    #yt-prompt {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      backdrop-filter: blur(6px);
      background-color: rgba(0, 0, 0, 0.4);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      animation: fadeIn 0.4s ease;
    }
    #yt-prompt-content {
      background: rgba(255, 255, 255, 0.9);
      padding: 30px;
      border-radius: 16px;
      width: 320px;
      text-align: center;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
      animation: slideIn 0.4s ease;
      font-family: 'Segoe UI', sans-serif;
    }
    .yt-title {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 6px;
      color: #333;
    }
    .yt-sub {
      font-size: 20px;
      color: #555;
      margin-bottom: 16px;
    }
    #yt-input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-size: 14px;
    }
    .yt-buttons {
      margin-top: 20px;
    }
    #yt-submit, #yt-close {
      padding: 10px 18px;
      margin: 0 6px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s ease;
    }
    #yt-submit {
      background-color: #7FB77E;
      color: white;
    }
    #yt-submit:hover {
      background-color: #6BA66C;
    }
    #yt-close {
      background-color: #D3756B;
      color: white;
    }
    #yt-close:hover {
      background-color: #BC5A57;
    }
    @keyframes slideIn {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `;

  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
  document.body.appendChild(prompt);

  const input = document.getElementById("yt-input");
  input.focus();

  function cleanupPrompt() {
    const p = document.getElementById("yt-prompt");
    if (p) p.remove();
  }

  function handleSubmit() {
    const response = input.value;
    console.log("📝 User response:", response);
    sessionStorage.setItem(location.href, response);
    cleanupPrompt();
    if (currentVideo) currentVideo.play();
  }

  document.getElementById("yt-submit").onclick = handleSubmit;
  document.getElementById("yt-close").onclick = () => {
    console.log("❌ Prompt closed.");
    cleanupPrompt();
    if (currentVideo) currentVideo.play();
  };

  document.addEventListener("keydown", function handleKeys(e) {
    if (!document.getElementById("yt-prompt")) return;

    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "Escape") {
      cleanupPrompt();
      if (currentVideo) currentVideo.play();
    }
  });
};

function waitForVideoAndPause() {
  if (!isValidVideoPage()) return;

  const video = document.querySelector("video");
  if (video && !promptShown && lastPromptedURL !== location.href) {
    console.log("🎥 Pausing video for prompt...");
    video.pause();
    currentVideo = video;
    promptShown = true;
    lastPromptedURL = location.href;
    showPrompt();
  } else {
    setTimeout(waitForVideoAndPause, 500);
  }
}

// Watch for SPA URL changes
let lastURL = location.href;
setInterval(() => {
  if (location.href !== lastURL) {
    lastURL = location.href;
    promptShown = false;
    setTimeout(waitForVideoAndPause, 800); // wait a little for DOM to load
  }
}, 1000);

// Initial call
waitForVideoAndPause();
