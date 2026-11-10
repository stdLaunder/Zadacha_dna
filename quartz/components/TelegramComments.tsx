import type { QuartzComponent, QuartzComponentProps } from "./types"
import { joinSegments } from "../util/path"

/**
 * Native Telegram Discussion Widget.
 * A page can specify e.g. "telegramDiscussion: zadacha_dna/769" in frontmatter
 * to attach to an existing post. Otherwise Telegram looks for a channel
 * message containing a link to the canonical page URL.
 */
const TelegramComments: QuartzComponent = ({ fileData, cfg }: QuartzComponentProps) => {
  const slug = fileData.slug
  if (!slug || slug === "index" || slug === "404" || slug.endsWith("/index")) {
    return null
  }

  const frontmatter = (fileData.frontmatter ?? {}) as Record<string, unknown>
  const explicit = frontmatter.telegramDiscussion
  const post =
    typeof explicit === "string" && /^zadacha_dna\/\d+$/.test(explicit.trim())
      ? explicit.trim()
      : null

  const pageUrl = joinSegments(`https://${cfg.baseUrl ?? "example.com"}`, slug)
  const discussion = post ?? "zadacha_dna"
  const destination = `https://t.me/${discussion}`

  return (
    <section class="telegram-comments" aria-label="Комментарии к статье">
      <h2>Обсуждение</h2>
      <p class="telegram-comments__intro">
        Комментарии связаны с Telegram-каналом{" "}
        <a href="https://t.me/zadacha_dna" target="_blank" rel="noopener noreferrer">
          «Задача дня»
        </a>
        .
      </p>
      <div
        class="telegram-comments__widget"
        data-telegram-discussion={discussion}
        data-page-url={pageUrl}
      />
      {!post && (
        <p class="telegram-comments__hint">
          Обсуждение появится здесь, если в канале опубликована ссылка на эту страницу.
          Для старых заметок можно привязать исходный пост по его номеру.
        </p>
      )}
      <a class="telegram-comments__link" href={destination} target="_blank" rel="noopener noreferrer">
        {post ? "Открыть обсуждение в Telegram ↗" : "Перейти в Telegram-канал ↗"}
      </a>
    </section>
  )
}

export default TelegramComments
