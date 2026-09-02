document.addEventListener("DOMContentLoaded", () => {
  const chatToggle = document.getElementById("chat-toggle");
  const chatContainer = document.getElementById("chat-container");
  const closeChat = document.getElementById("close-chat");
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const chatMessages = document.getElementById("chat-messages");
  const typingIndicator = document.getElementById("typing-indicator");

  // API Endpoint Bridge (Auto-detects environment or defaults to relative/local port)
  const API_ENDPOINT = window.location.port === "8000" || window.location.hostname === "localhost"
    ? "/api/chat"
    : "/api/chat";

  // Session Memory in sessionStorage
  let sessionId = sessionStorage.getItem("antigravity_session_id");
  if (!sessionId) {
    sessionId = "session_" + Math.random().toString(36).substring(2, 9);
    sessionStorage.setItem("antigravity_session_id", sessionId);
  }

  // Toggle Widget Visibility
  chatToggle.addEventListener("click", () => {
    chatContainer.classList.toggle("hidden");
    if (!chatContainer.classList.contains("hidden")) {
      chatInput.focus();
      if (chatMessages.children.length === 0) {
        addMessage("agent", "Hello! Welcome to TOTAG Group. How may I assist you today?");
      }
    }
  });

  closeChat.addEventListener("click", () => {
    chatContainer.classList.add("hidden");
  });

  // Append Message Bubble
  function addMessage(sender, text, toolsUsed = []) {
    const msgDiv = document.createElement("div");
    msgDiv.className = `msg-bubble ${sender}`;
    
    let html = `<p>${escapeHtml(text)}</p>`;
    if (toolsUsed && toolsUsed.length > 0) {
      html += `<span class="tools-badge">🛠️ MCP Tool: ${toolsUsed.join(", ")}</span>`;
    }
    msgDiv.innerHTML = html;
    
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // Handle Form Submission
  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    // Render User Message
    addMessage("user", userMessage);
    chatInput.value = "";
    typingIndicator.classList.remove("hidden");

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          message: userMessage
        })
      });

      const data = await response.json();
      typingIndicator.classList.add("hidden");

      if (response.ok && data.response) {
        addMessage("agent", data.response, data.tools_used || []);
      } else {
        addMessage("agent", "Thank you for contacting TOTAG Group. How may I assist you further?");
      }
    } catch (err) {
      typingIndicator.classList.add("hidden");
      addMessage("agent", "Hello! How may I assist you today?");
    }
  });
});
