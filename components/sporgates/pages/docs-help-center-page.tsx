"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowLeft, BookOpen, Mail, MessageCircle, Phone, Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { HELP_DOC_ARTICLES, HELP_DOC_CATEGORIES, type HelpDocArticle } from "@/lib/help-center-docs"

interface DocsHelpCenterPageProps {
  onBack: () => void
}

export function DocsHelpCenterPage({ onBack }: DocsHelpCenterPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<(typeof HELP_DOC_CATEGORIES)[number]>("All")
  const [selectedId, setSelectedId] = useState<string>(HELP_DOC_ARTICLES[0]?.id ?? "")

  const filteredArticles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return HELP_DOC_ARTICLES.filter((article) => {
      const categoryMatch = activeCategory === "All" || article.category === activeCategory
      if (!categoryMatch) return false
      if (!q) return true
      const searchable = [
        article.title,
        article.summary,
        article.category,
        ...article.tags,
        ...article.sections.flatMap((s) => [s.title, ...s.bullets]),
      ]
        .join(" ")
        .toLowerCase()
      return searchable.includes(q)
    })
  }, [activeCategory, searchQuery])

  useEffect(() => {
    if (filteredArticles.length === 0) return
    if (!filteredArticles.some((a) => a.id === selectedId)) {
      setSelectedId(filteredArticles[0].id)
    }
  }, [filteredArticles, selectedId])

  const selectedArticle: HelpDocArticle | undefined =
    filteredArticles.find((a) => a.id === selectedId) ?? filteredArticles[0]

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Documentation Center</h1>
          <p className="text-sm text-muted-foreground">Learn every core workflow in Sporgates</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[340px,minmax(0,1fr)]">
        <aside className="space-y-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search docs, topics, workflows..."
              className="h-10 w-full rounded-xl border border-border bg-muted pl-10 pr-4 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {HELP_DOC_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-semibold transition-all",
                  activeCategory === category
                    ? "gradient-primary text-white shadow-sm"
                    : "border border-border bg-background text-foreground hover:bg-muted"
                )}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Articles</p>
            {filteredArticles.length === 0 ? (
              <div className="rounded-xl border border-border bg-muted/40 p-4 text-xs text-muted-foreground">
                No matching docs found. Try another keyword or category.
              </div>
            ) : (
              filteredArticles.map((article) => {
                const selected = article.id === selectedArticle?.id
                return (
                  <button
                    key={article.id}
                    type="button"
                    onClick={() => setSelectedId(article.id)}
                    className={cn(
                      "w-full rounded-xl border p-3 text-left transition-colors",
                      selected
                        ? "border-primary bg-primary/5"
                        : "border-border bg-background hover:bg-muted"
                    )}
                  >
                    <p className={cn("text-sm font-semibold", selected ? "text-primary" : "text-foreground")}>{article.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{article.summary}</p>
                    <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span className="rounded-full border border-border px-2 py-0.5">{article.category}</span>
                      <span>{article.readTime}</span>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </aside>

        <section className="space-y-4">
          {!selectedArticle ? (
            <div className="rounded-2xl border border-border bg-card p-10 text-center">
              <BookOpen className="mx-auto mb-3 h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm font-semibold text-foreground">No article selected</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-5 border-b border-border pb-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{selectedArticle.category}</p>
                <h2 className="mt-1 text-xl font-bold text-foreground">{selectedArticle.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{selectedArticle.summary}</p>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  Updated {selectedArticle.updatedAt} • {selectedArticle.readTime}
                </p>
              </div>

              <div className="space-y-5">
                {selectedArticle.sections.map((section) => (
                  <div key={section.title}>
                    <h3 className="text-sm font-bold text-foreground">{section.title}</h3>
                    <ul className="mt-2 space-y-1.5 pl-4 text-sm text-muted-foreground">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="list-disc">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { icon: Mail, label: "Email Support", value: "support@sporgates.com" },
              { icon: Phone, label: "Phone", value: "+1 (800) 555-0199" },
              { icon: MessageCircle, label: "Live Chat", value: "Weekdays 9am–6pm" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                    <item.icon className="h-4 w-4 text-foreground" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

