import type { QuartzComponent, QuartzComponentProps } from "./types"
import { resolveRelative } from "../util/path"

/**
 * Global tag index, shown in the left sidebar.
 * Unlike the TagList plugin, this uses tags from every published note.
 */
const TagIndex: QuartzComponent = ({ allFiles, fileData }: QuartzComponentProps) => {
  const counts = new Map<string, number>()

  for (const file of allFiles) {
    const tags = file.frontmatter?.tags
    if (!tags) continue

    // A tag should only count a particular article once.
    for (const tag of new Set(tags)) {
      if (typeof tag !== "string" || tag.trim() === "") continue
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }

  const sortedTags = [...counts.entries()].sort(([a], [b]) => a.localeCompare(b, "ru"))
  const currentSlug = fileData.slug ?? "index"
  const allTagsUrl = resolveRelative(currentSlug, "tags/index")

  return (
    <nav class="site-tag-index" aria-label="Навигация по темам и тегам">
      <a class="internal site-tag-index__heading" href={allTagsUrl}>
        Темы и теги
      </a>
      <ul class="site-tag-index__list">
        {sortedTags.map(([tag, count]) => (
          <li key={tag}>
            <a class="internal site-tag-index__tag" href={resolveRelative(currentSlug, `tags/${tag}`)}>
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
  )
}

export default TagIndex
