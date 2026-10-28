import type { QuartzComponent, QuartzComponentProps } from "./types"
import { resolveRelative, slugTag } from "../util/path"
import type { FullSlug } from "../util/path"

/**
 * All-site tags: a scrollable index in the desktop sidebar and
 * a native keyboard-accessible collapsible menu on small screens.
 */
const TagIndex: QuartzComponent = ({ allFiles, fileData }: QuartzComponentProps) => {
  const counts = new Map<string, number>()

  for (const file of allFiles) {
    const tags = file.frontmatter?.tags
    if (!tags) continue

    for (const tag of new Set(tags)) {
      if (typeof tag !== "string" || tag.trim() === "") continue
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }

  const sortedTags = [...counts.entries()].sort(([a], [b]) => a.localeCompare(b, "ru"))
  const currentSlug = fileData.slug ?? "index"
  const allTagsUrl = resolveRelative(currentSlug, "tags/index" as FullSlug)
  const tagHref = (tag: string) =>
    resolveRelative(currentSlug, `tags/${slugTag(tag)}` as FullSlug)

  return (
    <>
      <nav class="site-tag-index" aria-label="Индекс математических тем">
        <a class="internal site-tag-index__heading" href={allTagsUrl}>
          Темы и теги
        </a>
        <ul class="site-tag-index__list">
          {sortedTags.map(([tag, count]) => (
            <li key={tag}>
              <a class="internal site-tag-index__tag" href={tagHref(tag)}>
                <span class="site-tag-index__hash" aria-hidden="true">#</span>
                <span class="site-tag-index__name">{tag.replaceAll("-", " ")}</span>
                <span class="site-tag-index__count" aria-label={`Статей: ${count}`}>{count}</span>
              </a>
            </li>
          ))}
        </ul>
        <a class="internal site-tag-index__all" href={allTagsUrl}>
          Все теги →
        </a>
      </nav>

      <details class="site-tag-index-mobile">
        <summary>
          <span>Темы и теги</span>
          <span class="site-tag-index-mobile__total">{sortedTags.length}</span>
        </summary>
        <nav aria-label="Математические темы">
          <ul class="site-tag-index__list">
            {sortedTags.map(([tag, count]) => (
              <li key={tag}>
                <a class="internal site-tag-index__tag" href={tagHref(tag)}>
                  <span class="site-tag-index__hash" aria-hidden="true">#</span>
                  <span class="site-tag-index__name">{tag.replaceAll("-", " ")}</span>
                  <span class="site-tag-index__count" aria-label={`Статей: ${count}`}>{count}</span>
                </a>
              </li>
            ))}
          </ul>
          <a class="internal site-tag-index__all" href={allTagsUrl}>Все теги →</a>
        </nav>
      </details>
    </>
  )
}

export default TagIndex
