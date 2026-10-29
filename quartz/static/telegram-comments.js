/**
 * Telegram's script builds an iframe next to its <script> element.
 * Create it afresh for each Quartz SPA navigation and on theme changes.
 */
const widgetSource = "https://telegram.org/js/telegram-widget.js?22"

function loadTelegramComments(force = false) {
  const target = document.querySelector(".telegram-comments__widget")
  if (!target) return

  if (!force && target.dataset.loaded === "true") return
  target.replaceChildren()
  target.dataset.loaded = "true"

  const script = document.createElement("script")
  script.async = true
  script.src = widgetSource
  script.setAttribute("data-telegram-discussion", target.dataset.telegramDiscussion)
  script.setAttribute("data-comments-limit", "15")
  script.setAttribute("data-width", "100%")

  // In channel-only mode, Telegram matches a channel post linking to this page.
  if (target.dataset.telegramDiscussion === "zadacha_dna" && target.dataset.pageUrl) {
    script.setAttribute("data-page-url", target.dataset.pageUrl)
  }

  const dark = document.documentElement.getAttribute("saved-theme") === "dark"
  script.setAttribute("data-dark", dark ? "1" : "0")
  const accent = getComputedStyle(document.documentElement)
    .getPropertyValue("--secondary")
    .trim()
    .replace(/^#/, "")
  if (/^[0-9a-f]{6}$/i.test(accent)) {
    script.setAttribute("data-color", accent)
  }

  script.addEventListener("error", () => {
    target.dataset.loaded = "false"
    target.textContent = "Не удалось загрузить Telegram-комментарии. Откройте обсуждение по ссылке ниже."
  })
  target.appendChild(script)
}

document.addEventListener("nav", () => loadTelegramComments())
document.addEventListener("themechange", () => loadTelegramComments(true))
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => loadTelegramComments(), { once: true })
} else {
  loadTelegramComments()
}
