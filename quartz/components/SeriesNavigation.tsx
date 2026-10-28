import type { QuartzComponent, QuartzComponentProps } from "./types"
import { resolveRelative } from "../util/path"
import type { FullSlug } from "../util/path"

type Chapter = {
  slug: FullSlug
  number: number
  title: string
}

function metadata(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {}
}

function chapterNumber(value: unknown): number | null {
  const n = typeof value === "number" || typeof value === "string" ? Number(value) : NaN
  return Number.isInteger(n) && n > 0 ? n : null
}

/**
 * Automatic navigation for multi-part mathematical notes.
 *
 * On a chapter add frontmatter like:
 *   series: "my-cycle"
 *   seriesTitle: "Мой цикл статей"
 *   seriesPart: 1
 *   seriesIndex: "series/my-cycle/index"
 *
 * Chapters with the same "series" value are sorted by seriesPart.
 * This component is invisible on ordinary articles and the series overview.
 */
const SeriesNavigation: QuartzComponent = ({ fileData, allFiles }: QuartzComponentProps) => {
  const data = metadata(fileData.frontmatter)
  const series = data.series

  if (typeof series !== "string" || series.trim() === "") return null
  const ownNumber = chapterNumber(data.seriesPart)
  if (ownNumber === null) return null

  const chapters: Chapter[] = []
  for (const file of allFiles) {
    const fm = metadata(file.frontmatter)
    if (fm.series !== series || !file.slug) continue

    const number = chapterNumber(fm.seriesPart)
    if (number === null) continue
    chapters.push({
      slug: file.slug,
      number,
      title: typeof fm.title === "string" ? fm.title : `Часть ${number}`,
    })
  }

  chapters.sort((a, b) => a.number - b.number || a.slug.localeCompare(b.slug))
  const index = chapters.findIndex((item) => item.slug === fileData.slug)
  if (index < 0) return null

  const prev = chapters[index - 1]
  const next = chapters[index + 1]
  const seriesTitle =
    typeof data.seriesTitle === "string" && data.seriesTitle.trim() !== ""
      ? data.seriesTitle
      : "Цикл математических заметок"
  const root = (fileData.slug ?? "index") as FullSlug
  const indexSlug =
    typeof data.seriesIndex === "string" && data.seriesIndex.trim() !== ""
      ? data.seriesIndex
      : `series/${series}/index`
  const href = (slug: string) => resolveRelative(root, slug as FullSlug)

  return (
    <nav class="math-series-nav" aria-label="Навигация по частям цикла">
      <div class="math-series-nav__header">
        <a class="internal math-series-nav__title" href={href(indexSlug)}>
          {seriesTitle}
        </a>
        <span class="math-series-nav__counter">
          Часть {chapters[index].number} из {chapters.length}
        </span>
      </div>

      <ol class="math-series-nav__steps">
        {chapters.map((chapter) => (
          <li key={chapter.slug}>
            <a
              class="internal math-series-nav__step"
              href={href(chapter.slug)}
              aria-current={chapter.slug === fileData.slug ? "page" : undefined}
              title={chapter.title}
            >
              {chapter.number}
            </a>
          </li>
        ))}
      </ol>

      <div class="math-series-nav__links">
        {prev ? (
          <a class="internal" href={href(prev.slug)} rel="prev">
            ← Предыдущая часть
          </a>
        ) : (
          <span />
        )}
        <a class="internal math-series-nav__overview" href={href(indexSlug)}>
          Все части
        </a>
        {next ? (
          <a class="internal" href={href(next.slug)} rel="next">
            Следующая часть →
          </a>
        ) : (
          <span />
        )}
      </div>
    </nav>
  )
}

export default SeriesNavigation
