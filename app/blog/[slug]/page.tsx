import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getPostBySlug, getAllPosts } from "@/lib/blog"
import { formatBlogMarkdown } from "@/lib/format-blog-markdown"
import { AiAugmentationArticleBody } from "@/components/blog/ai-augmentation-article-body"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BlogCodeBlockWrapper } from "@/components/blog-code-block-wrapper"
import { CnnDnaAnimation } from "@/components/blog/cnn-dna-animation"
import TrackToggle from "@/components/TrackToggle"
import TERTPromoterAnimation from "@/components/TERTPromoterAnimation"
import ModelComparisonTable from "@/components/ModelComparisonTable"
import SuitabilityChecklist from "@/components/SuitabilityChecklist"
import ReferenceList from "@/components/ReferenceList"
import type { ReactNode } from "react"
import { Calendar, Clock, ArrowLeft, Tag, Headphones } from "lucide-react"
import { format } from "date-fns"

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: `${post.title} | Blog | Parul Kudtarkar`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      ...(post.image && {
        images: [
          {
            url: post.image,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
      }),
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const CNN_DNA_ANIM_MARKER = "__CNN_DNA_ANIM__"
  const TERT_PROMOTER_ANIM_MARKER = "__TERT_PROMOTER_ANIMATION__"
  const MODEL_COMPARISON_TABLE_MARKER = "__MODEL_COMPARISON_TABLE__"
  const SUITABILITY_CHECKLIST_MARKER = "__SUITABILITY_CHECKLIST__"
  const EMBED_REGEX = /__CNN_DNA_ANIM__|__TERT_PROMOTER_ANIMATION__|__MODEL_COMPARISON_TABLE__|__SUITABILITY_CHECKLIST__|__TRACK_TOGGLE__\(\s*([^,\n]+)\s*,\s*([^)]+)\)/g

  const stripWrappingQuotes = (value: string): string => {
    const trimmed = value.trim()
    if (
      (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'"))
    ) {
      return trimmed.slice(1, -1)
    }
    return trimmed
  }

  let articleBody: ReactNode
  if (post.slug === "ai-task-augmentation") {
    articleBody = <AiAugmentationArticleBody content={post.content} />
  } else if (EMBED_REGEX.test(post.content)) {
    EMBED_REGEX.lastIndex = 0

    const nodes: ReactNode[] = []
    let scanPos = 0
    let idx = 0
    let match: RegExpExecArray | null

    while ((match = EMBED_REGEX.exec(post.content)) !== null) {
      const matchedText = match[0]
      const start = match.index
      const before = post.content.slice(scanPos, start)

      if (before.trim().length > 0) {
        const htmlBefore = await formatBlogMarkdown(before)
        nodes.push(<BlogCodeBlockWrapper key={`md-${idx}`} html={htmlBefore} />)
        idx++
      }

      if (matchedText === CNN_DNA_ANIM_MARKER) {
        nodes.push(<CnnDnaAnimation key={`cnn-${idx}`} />)
      } else if (matchedText === TERT_PROMOTER_ANIM_MARKER) {
        nodes.push(<TERTPromoterAnimation key={`tert-promoter-${idx}`} />)
      } else if (matchedText === MODEL_COMPARISON_TABLE_MARKER) {
        nodes.push(<ModelComparisonTable key={`model-comparison-${idx}`} />)
      } else if (matchedText === SUITABILITY_CHECKLIST_MARKER) {
        nodes.push(<SuitabilityChecklist key={`suitability-checklist-${idx}`} />)
      } else {
        const referenceImage = stripWrappingQuotes(match[1] ?? "")
        const mutantImage = stripWrappingQuotes(match[2] ?? "")
        nodes.push(
          <TrackToggle
            key={`toggle-${idx}`}
            referenceImage={referenceImage}
            mutantImage={mutantImage}
          />
        )
      }

      idx++
      scanPos = start + matchedText.length
    }

    const tail = post.content.slice(scanPos)
    if (tail.trim().length > 0) {
      const htmlTail = await formatBlogMarkdown(tail)
      nodes.push(<BlogCodeBlockWrapper key={`md-tail-${idx}`} html={htmlTail} />)
    }

    articleBody = <>{nodes}</>
  } else {
    articleBody = (
      <BlogCodeBlockWrapper html={await formatBlogMarkdown(post.content)} />
    )
  }

  return (
    <main className="min-h-screen bg-transparent">
      <Header />
      <article className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Back Button */}
        <Link href="/blog">
          <Button variant="ghost" className="mb-8 -ml-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </Link>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {post.category && (
              <Badge variant="secondary">
                {post.category}
              </Badge>
            )}
            {post.featured && (
              <Badge variant="default">
                Featured
              </Badge>
            )}
          </div>
          <h1 className="typography-page-title">{post.title}</h1>
          
          {/* Meta Information */}
          <div className="typography-meta flex flex-wrap items-center gap-6 mb-6 pb-6 border-b border-border">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(post.date), "MMMM d, yyyy")}</span>
            </div>
            {post.readingTime && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readingTime} min read</span>
              </div>
            )}
            <div>
              <span>By {post.author}</span>
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-8">
              <Tag className="w-4 h-4 text-muted-foreground" />
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </header>

        {post.description ? (
          <p className="typography-body mb-8 -mt-2">{post.description}</p>
        ) : null}

        {/* Featured Image (skipped when hideHeroImage: figure lives in article body only) */}
        {post.image && !post.hideHeroImage && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Audio Player, listen to the article */}
        {post.audioUrl && (
          <div className="mb-8 p-5 bg-muted/80 rounded-xl border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Headphones className="h-5 w-5" />
              </div>
              <div>
                <p className="typography-content-title" role="heading" aria-level={3}>
                  Listen to this article
                </p>
                <p className="typography-body">
                  Play the audio version while you read or on the go.
                </p>
              </div>
            </div>
            <audio
              controls
              className="w-full h-12 audio-player"
              preload="metadata"
              aria-label="Audio version of this article"
            >
              <source src={post.audioUrl} type="audio/mpeg" />
              <source src={post.audioUrl} type="audio/mp3" />
              <source src={post.audioUrl} type="audio/wav" />
              <source src={post.audioUrl} type="audio/ogg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {/* Article Content */}
        <div
          className={
            post.slug === "ai-task-augmentation"
              ? "max-w-none"
              : "prose prose-lg dark:prose-invert max-w-none"
          }
        >
          {articleBody}
          {post.slug === "tert-promoter-alphagenome" && <ReferenceList />}
        </div>

        {/* Footer Navigation */}
        <div className="mt-12 pt-8 border-t border-border">
          <Link href="/blog">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              View All Posts
            </Button>
          </Link>
        </div>
      </article>
      <Footer />
    </main>
  )
}

